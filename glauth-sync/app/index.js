console.log("glauth-sync starting");

import pg from "pg";
import fs from "node:fs/promises";

const { Pool } = pg;

const tenantSlug = process.env.GLAUTH_TENANT_SLUG;

const organizationSlugs = (
  process.env.GLAUTH_ORGANIZATION_SLUGS ?? ""
)
  .split(",")
  .map((slug) => slug.trim())
  .filter(Boolean);

const testEmail =
  process.env.GLAUTH_TEST_EMAIL?.trim().toLowerCase() || null;

if (!tenantSlug) {
  throw new Error("GLAUTH_TENANT_SLUG is required");
}

if (organizationSlugs.length === 0) {
  throw new Error("GLAUTH_ORGANIZATION_SLUGS is required");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const organizationsResult = await pool.query(
  `
    SELECT
      id,
      name,
      slug
    FROM organization
    WHERE slug = ANY($1::text[])
    ORDER BY name
  `,
  [organizationSlugs]
);

if (organizationsResult.rowCount !== organizationSlugs.length) {
  const found = new Set(
    organizationsResult.rows.map((organization) => organization.slug)
  );

  const missing = organizationSlugs.filter(
    (slug) => !found.has(slug)
  );

  throw new Error(
    `Organization(s) not found: ${missing.join(", ")}`
  );
}

console.log(
  `Tenant ${tenantSlug} includes: ${organizationsResult.rows
    .map((organization) => organization.name)
    .join(", ")}`
);

const organizationIds = organizationsResult.rows.map(
  (organization) => organization.id
);

const params = [organizationIds];

let emailFilter = "";

if (testEmail) {
  params.push(testEmail);

  emailFilter = `
    AND LOWER(u.email) = $2
  `;
}

const result = await pool.query(
  `
    SELECT DISTINCT
      u.id,
      u.name,
      u.email
    FROM "user" u
    INNER JOIN member m
      ON m."userId" = u.id
    WHERE m."organizationId" = ANY($1::text[])
      AND u.email IS NOT NULL
      ${emailFilter}
    ORDER BY u.email
  `,
  params
);

if (testEmail && result.rowCount !== 1) {
  throw new Error(
    `Expected exactly one Better Auth user for test email ${testEmail}, found ${result.rowCount}`
  );
}

console.log(
  testEmail
    ? `TEST MODE: exporting ${result.rowCount} user (${testEmail})`
    : `Exporting ${result.rowCount} unique ${tenantSlug} users`
);

function toml(value = "") {
  return String(value)
    .replaceAll("\\", "\\\\")
    .replaceAll('"', '\\"');
}

function splitName(name = "User") {
  const parts = name.trim().split(/\s+/);

  return {
    givenname: parts[0] || "User",
    sn: parts.slice(1).join(" ") || "User",
  };
}

function makeUsername(email) {
  return email
    .split("@")[0]
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "");
}

let config = `
debug = true

[ldap]
  enabled = true
  listen = "0.0.0.0:3893"

[ldaps]
  enabled = false

[backend]
  datastore = "config"
  baseDN = "dc=niteowl,dc=dev"
  nameformat = "cn"
  groupformat = "ou"

[[groups]]
  name = "svc"
  gidnumber = 5500

[[groups]]
  name = "${toml(tenantSlug)}"
  gidnumber = 5501

[[users]]
  name = "unifi"
  uidnumber = 5000
  primarygroup = 5500
  passsha256 = "61e8d864d510f93c2a39841943eecb0c0907ee9201eeba5d3114812ef9c5fefb"
  givenname = "UniFi"
  sn = "Service"
  mail = "unifi@niteowl.dev"

  [[users.capabilities]]
    action = "search"
    object = "*"
`;

let uid = 6000;

for (const user of result.rows) {
  const username = makeUsername(user.email);
  const { givenname, sn } = splitName(user.name);

  config += `

[[users]]
  name = "${toml(username)}"
  uidnumber = ${uid++}
  primarygroup = 5501
  givenname = "${toml(givenname)}"
  sn = "${toml(sn)}"
  mail = "${toml(user.email)}"
`;
}

await fs.writeFile(
  "/glauth/config.cfg",
  config.trim() + "\n"
);

console.log(
  `Generated GLAuth config: tenant=${tenantSlug}, users=${result.rowCount}`
);

await pool.end();
