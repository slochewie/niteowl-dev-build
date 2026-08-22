-- -----------------------------------------------------------------------------
-- DO NOT RUN THIS SCRIPT AS IT IS.
-- Applying it to a populated database corrupts the rows it touches:
--
-- Cannot add required column "issuer" to populated table "account": the schema declares no default value, so existing rows have no value to backfill. MySQL accepts this statement instead of rejecting it and fills every existing row with an implicit default for the column type, reporting a successful migration over corrupted data. For a text column, every existing row ends up with the same empty string. Add the column as nullable, backfill a correct value for every row, then make it NOT NULL. See https://better-auth.com/docs/guides/1-7-upgrade-guide#account-identity-is-scoped-by-issuer
-- -----------------------------------------------------------------------------
alter table "account" add column "issuer" text not null;

create table "organizationIntegration" ("id" text not null primary key, "organizationId" text not null references "organization" ("id") on delete cascade, "pluginId" text not null, "enabled" boolean not null);

create unique index "account_issuer_accountId_uidx" on "account" ("issuer", "accountId");

create unique index "organizationIntegration_organizationId_pluginId_uidx" on "organizationIntegration" ("organizationId", "pluginId");