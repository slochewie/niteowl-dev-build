import crypto from "node:crypto"
import fs from "node:fs"
import http from "node:http"
import net from "node:net"
import path from "node:path"
import pg from "pg"

const pool =
  new pg.Pool()

const outputRoot =
  process.env.GLAUTH_RUNTIME_ROOT ||
  "/glauth-runtimes"

const hostOutputRoot =
  process.env.GLAUTH_RUNTIME_HOST_ROOT

const runtimeNetwork =
  process.env.GLAUTH_RUNTIME_NETWORK ||
  "niteowl-dev"

const runtimeImage =
  process.env.GLAUTH_RUNTIME_IMAGE ||
  "glauth/glauth-plugins:v2.5.2"

const pollMs =
  Number(
    process.env.GLAUTH_RUNTIME_POLL_MS ||
    30000
  )

const hostUid =
  Number(
    process.env.GLAUTH_RUNTIME_HOST_UID ||
    1000
  )

const hostGid =
  Number(
    process.env.GLAUTH_RUNTIME_HOST_GID ||
    1000
  )

const databaseUrl =
  process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL is required"
  )
}

if (!hostOutputRoot) {
  throw new Error(
    "GLAUTH_RUNTIME_HOST_ROOT is required"
  )
}

function sleep(ms) {
  return new Promise(
    (resolve) =>
      setTimeout(
        resolve,
        ms
      )
  )
}

function dockerRequest(
  method,
  requestPath,
  body = null
) {
  return new Promise(
    (
      resolve,
      reject
    ) => {
      const payload =
        body === null
          ? null
          : JSON.stringify(
              body
            )

      const request =
        http.request(
          {
            socketPath:
              "/var/run/docker.sock",
            path:
              requestPath,
            method,
            headers:
              payload === null
                ? {}
                : {
                    "Content-Type":
                      "application/json",
                    "Content-Length":
                      Buffer.byteLength(
                        payload
                      )
                  }
          },
          (response) => {
            let data = ""

            response.setEncoding(
              "utf8"
            )

            response.on(
              "data",
              (chunk) => {
                data += chunk
              }
            )

            response.on(
              "end",
              () => {
                let parsed =
                  null

                if (
                  data.trim() !==
                  ""
                ) {
                  try {
                    parsed =
                      JSON.parse(
                        data
                      )
                  } catch {
                    parsed =
                      data
                  }
                }

                resolve({
                  statusCode:
                    response.statusCode ||
                    0,
                  data:
                    parsed
                })
              }
            )
          }
        )

      request.once(
        "error",
        reject
      )

      if (payload !== null) {
        request.write(
          payload
        )
      }

      request.end()
    }
  )
}

async function inspectContainer(
  containerName
) {
  const response =
    await dockerRequest(
      "GET",
      `/containers/${encodeURIComponent(
        containerName
      )}/json`
    )

  if (
    response.statusCode ===
    404
  ) {
    return null
  }

  if (
    response.statusCode < 200 ||
    response.statusCode >= 300
  ) {
    throw new Error(
      `Unable to inspect ${containerName}`
    )
  }

  return response.data
}

async function removeContainer(
  containerName
) {
  const existing =
    await inspectContainer(
      containerName
    )

  if (!existing) {
    return
  }

  const response =
    await dockerRequest(
      "DELETE",
      `/containers/${encodeURIComponent(
        containerName
      )}?force=true`
    )

  if (
    response.statusCode !==
      204 &&
    response.statusCode !==
      404
  ) {
    throw new Error(
      `Unable to remove ${containerName}`
    )
  }
}

async function createContainer({
  containerName,
  slug,
  runtimePort,
  configHash,
  hostConfigPath
}) {
  const response =
    await dockerRequest(
      "POST",
      `/containers/create?name=${encodeURIComponent(
        containerName
      )}`,
      {
        Image:
          runtimeImage,

        ExposedPorts: {
          "3893/tcp": {}
        },

        Labels: {
          "niteowl.glauth.runtime":
            "true",
          "niteowl.glauth.slug":
            slug,
          "niteowl.glauth.config-hash":
            configHash
        },

        HostConfig: {
          RestartPolicy: {
            Name:
              "unless-stopped"
          },

          Binds: [
            `${hostConfigPath}:/app/config/config.cfg:ro`
          ],

          PortBindings: {
            "3893/tcp": [
              {
                HostPort:
                  String(
                    runtimePort
                  )
              }
            ]
          },

          NetworkMode:
            runtimeNetwork
        }
      }
    )

  if (
    response.statusCode < 200 ||
    response.statusCode >= 300
  ) {
    throw new Error(
      `Unable to create ${containerName}: ${JSON.stringify(
        response.data
      )}`
    )
  }
}

async function startContainer(
  containerName
) {
  const response =
    await dockerRequest(
      "POST",
      `/containers/${encodeURIComponent(
        containerName
      )}/start`
    )

  if (
    response.statusCode !==
      204 &&
    response.statusCode !==
      304
  ) {
    throw new Error(
      `Unable to start ${containerName}: ${JSON.stringify(
        response.data
      )}`
    )
  }
}

function checkPort(
  host,
  port,
  timeout = 2000
) {
  return new Promise(
    (resolve) => {
      const socket =
        net.createConnection({
          host,
          port
        })

      let finished =
        false

      const finish =
        (result) => {
          if (finished) {
            return
          }

          finished =
            true

          socket.destroy()

          resolve(
            result
          )
        }

      socket.setTimeout(
        timeout
      )

      socket.once(
        "connect",
        () =>
          finish(
            true
          )
      )

      socket.once(
        "timeout",
        () =>
          finish(
            false
          )
      )

      socket.once(
        "error",
        () =>
          finish(
            false
          )
      )
    }
  )
}

async function waitForPort(
  host,
  port
) {
  for (
    let attempt = 0;
    attempt < 15;
    attempt++
  ) {
    if (
      await checkPort(
        host,
        port
      )
    ) {
      return true
    }

    await sleep(
      1000
    )
  }

  return false
}

async function setRuntimeStatus(
  sourceId,
  runtimeStatus
) {
  await pool.query(
    `
      UPDATE "glauthSource"
      SET
        "runtimeStatus" =
          $2,
        "updatedAt" =
          NOW()
      WHERE id = $1
    `,
    [
      sourceId,
      runtimeStatus
    ]
  )
}

async function reconcileSource(
  source
) {
  const runtimeSchema =
    source.runtimeSchema

  if (
    !/^[a-z0-9_]+$/.test(
      runtimeSchema
    )
  ) {
    throw new Error(
      `Invalid runtime schema for ${source.slug}`
    )
  }

  if (
    !/^[a-z0-9-]+$/.test(
      source.slug
    )
  ) {
    throw new Error(
      `Invalid GLAuth source slug: ${source.slug}`
    )
  }

  const runtimePort =
    Number(
      source.runtimePort
    )

  if (
    !Number.isInteger(
      runtimePort
    ) ||
    runtimePort < 1 ||
    runtimePort > 65535
  ) {
    throw new Error(
      `Invalid runtime port for ${source.slug}`
    )
  }

  const runtimeDir =
    path.join(
      outputRoot,
      source.slug
    )

  const hostRuntimeDir =
    path.join(
      hostOutputRoot,
      source.slug
    )

  fs.mkdirSync(
    runtimeDir,
    {
      recursive: true
    }
  )

  const separator =
    databaseUrl.includes(
      "?"
    )
      ? "&"
      : "?"

  const runtimeDatabaseUrl =
    databaseUrl +
    separator +
    "sslmode=disable" +
    "&options=-csearch_path%3D" +
    runtimeSchema

  const config =
`debug = true

[ldap]
  enabled = true
  listen = "0.0.0.0:3893"

[ldaps]
  enabled = false

[backend]
  datastore = "plugin"
  plugin = "/app/postgres.so"
  pluginhandler = "NewPostgresHandler"
  baseDN = "dc=niteowl,dc=dev"
  nameformat = "cn"
  groupformat = "ou"
  database = "${runtimeDatabaseUrl}"

[api]
  enabled = false
`

  const configPath =
    path.join(
      runtimeDir,
      "config.cfg"
    )

  const hostConfigPath =
    path.join(
      hostRuntimeDir,
      "config.cfg"
    )

  fs.writeFileSync(
    configPath,
    config,
    {
      mode: 0o600
    }
  )

  try {
    fs.chownSync(
      configPath,
      hostUid,
      hostGid
    )
  } catch {
  }

  const configHash =
    crypto
      .createHash(
        "sha256"
      )
      .update(
        config
      )
      .update(
        String(
          runtimePort
        )
      )
      .digest(
        "hex"
      )

  const containerName =
    `niteowl-glauth-${source.slug}`

  await setRuntimeStatus(
    source.id,
    "generated"
  )

  let existing =
    await inspectContainer(
      containerName
    )

  if (existing) {
    const existingHash =
      existing?.Config
        ?.Labels
        ?.[
          "niteowl.glauth.config-hash"
        ]

    const existingPort =
      existing?.HostConfig
        ?.PortBindings
        ?.[
          "3893/tcp"
        ]
        ?.[0]
        ?.HostPort

    const requiresRecreate =
      existingHash !==
        configHash ||
      String(
        existingPort
      ) !==
        String(
          runtimePort
        )

    if (
      requiresRecreate
    ) {
      console.log(
        `${source.slug}: configuration changed, recreating runtime`
      )

      await removeContainer(
        containerName
      )

      existing =
        null
    }
  }

  if (!existing) {
    console.log(
      `${source.slug}: creating ${containerName}`
    )

    await createContainer({
      containerName,
      slug:
        source.slug,
      runtimePort,
      configHash,
      hostConfigPath
    })

    existing =
      await inspectContainer(
        containerName
      )
  }

  if (
    !existing?.State?.Running
  ) {
    console.log(
      `${source.slug}: starting ${containerName}`
    )

    await startContainer(
      containerName
    )
  }

  const ready =
    await waitForPort(
      containerName,
      3893
    )

  await setRuntimeStatus(
    source.id,
    ready
      ? "ready"
      : "generated"
  )

  console.log(
    `${source.slug}: ${
      ready
        ? "ready"
        : "not ready"
    }`
  )
}

async function removeStaleRuntimes(
  activeSlugs
) {
  const filters =
    encodeURIComponent(
      JSON.stringify({
        label: [
          "niteowl.glauth.runtime=true"
        ]
      })
    )

  const response =
    await dockerRequest(
      "GET",
      `/containers/json?all=true&filters=${filters}`
    )

  if (
    response.statusCode < 200 ||
    response.statusCode >= 300
  ) {
    throw new Error(
      "Unable to list managed GLAuth containers"
    )
  }

  for (
    const container
    of response.data || []
  ) {
    const slug =
      container?.Labels
        ?.[
          "niteowl.glauth.slug"
        ]

    if (
      !slug ||
      activeSlugs.has(
        slug
      )
    ) {
      continue
    }

    const name =
      (
        container.Names?.[0] ||
        ""
      ).replace(
        /^\//,
        ""
      )

    if (!name) {
      continue
    }

    console.log(
      `${slug}: removing stale runtime`
    )

    await removeContainer(
      name
    )
  }

  if (
    fs.existsSync(
      outputRoot
    )
  ) {
    const runtimeEntries =
      fs.readdirSync(
        outputRoot,
        {
          withFileTypes: true
        }
      )

    for (
      const entry
      of runtimeEntries
    ) {
      if (
        !entry.isDirectory() ||
        activeSlugs.has(
          entry.name
        )
      ) {
        continue
      }

      if (
        !/^[a-z0-9-]+$/.test(
          entry.name
        )
      ) {
        continue
      }

      console.log(
        `${entry.name}: removing stale runtime directory`
      )

      fs.rmSync(
        path.join(
          outputRoot,
          entry.name
        ),
        {
          recursive: true,
          force: true
        }
      )
    }
  }
}

async function reconcile() {
  const result =
    await pool.query(`
      SELECT
        id,
        name,
        slug,
        "runtimeSchema",
        "runtimePort",
        "runtimeStatus"
      FROM "glauthSource"
      WHERE
        enabled = true
        AND "runtimeSchema"
          IS NOT NULL
        AND "runtimePort"
          IS NOT NULL
      ORDER BY
        "runtimePort"
    `)

  const activeSlugs =
    new Set(
      result.rows.map(
        (source) =>
          source.slug
      )
    )

  await removeStaleRuntimes(
    activeSlugs
  )

  console.log(
    `\n===== GLAuth reconcile ${new Date().toISOString()} =====`
  )

  for (
    const source
    of result.rows
  ) {
    try {
      await reconcileSource(
        source
      )
    } catch (error) {
      await setRuntimeStatus(
        source.id,
        "error"
      )

      console.error(
        `${source.slug}:`,
        error
      )
    }
  }
}

let stopping =
  false

process.on(
  "SIGTERM",
  () => {
    stopping =
      true
  }
)

process.on(
  "SIGINT",
  () => {
    stopping =
      true
  }
)

while (!stopping) {
  try {
    await reconcile()
  } catch (error) {
    console.error(
      "GLAuth runtime reconciliation failed:",
      error
    )
  }

  if (!stopping) {
    await sleep(
      pollMs
    )
  }
}

await pool.end()
