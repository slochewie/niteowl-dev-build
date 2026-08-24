import fs from "node:fs"
import net from "node:net"
import path from "node:path"
import pg from "pg"

const pool =
  new pg.Pool()

const outputRoot =
  process.env.GLAUTH_RUNTIME_ROOT ||
  "/glauth-runtimes"

const databaseUrl =
  process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL is required"
  )
}

function checkPort(
  host,
  port,
  timeout = 3000
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

      const finish = (
        result
      ) => {
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

const composeServices = []

for (
  const source
  of result.rows
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

  fs.writeFileSync(
    path.join(
      runtimeDir,
      "config.cfg"
    ),
    config,
    {
      mode: 0o600
    }
  )

  composeServices.push(
`  glauth-${source.slug}:
    image: glauth/glauth-plugins:v2.5.2
    restart: unless-stopped
    volumes:
      - './glauth-runtimes/${source.slug}/config.cfg:/app/config/config.cfg:ro'
    ports:
      - "${runtimePort}:3893"
    networks: [niteowl-dev]
    depends_on:
      postgres:
        condition: service_healthy`
  )

  console.log(
    [
      source.slug,
      `schema=${runtimeSchema}`,
      `port=${runtimePort}`,
      `status=${source.runtimeStatus}`
    ].join(
      " "
    )
  )
}

const compose =
`services:
${composeServices.join("\n\n")}
`

fs.writeFileSync(
  path.join(
    outputRoot,
    "docker-compose.generated.yml"
  ),
  compose
)

console.log(
  "\n===== RUNTIME STATUS ====="
)

for (
  const source
  of result.rows
) {
  const serviceName =
    `glauth-${source.slug}`

  const reachable =
    await checkPort(
      serviceName,
      3893
    )

  const runtimeStatus =
    reachable
      ? "ready"
      : "generated"

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
      source.id,
      runtimeStatus
    ]
  )

  console.log(
    `${source.slug} ${runtimeStatus}`
  )
}

await pool.end()
