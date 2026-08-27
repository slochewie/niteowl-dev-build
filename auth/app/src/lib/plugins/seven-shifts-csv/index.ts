import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";
import { randomBytes, randomUUID } from "node:crypto";

import type { BetterAuthPlugin } from "better-auth";
import { createAuthEndpoint, sessionMiddleware } from "better-auth/api";
import type { Pool } from "pg";
import * as z from "zod";

import { upsertUserProfile } from "../user-profile/index.js";

type SevenShiftsCsvOptions = {
	pool: Pool;
	storageRoot: string;
};

type UserRoleRow = {
	role: string | null;
};

type OrganizationRoleRow = {
	role: string;
};

type StoredCsvMetadata = {
	id: string;
	originalName: string;
	storedName: string;
	size: number;
	uploadedAt: string;
};

type CsvRow = {
	[key: string]: string;
};

type TargetLocation = {
	id: string;
	organizationId: string;
	name: string;
};

type TargetRole = {
	id: string;
	locationId: string;
	name: string;
};

type ImportReport = {
	fileId: string;
	fileName: string;

	sourceRows: number;
	applicableRows: number;
	ignoredRows: number;
	skippedWithoutEmail: number;

	employeesSeen: number;
	usersCreated: number;
	usersUpdated: number;

	assignmentsCreated: number;
	assignmentsRemoved: number;

	membershipsCreated: number;
	membershipsRemoved: number;

	usersDisabled: number;
	disabledEmployees: number;

	generatedPasswordFile: string | null;

	completedAt: string;
};

const filesQuerySchema = z.object({
	sourceId: z.string().min(1),
});

const uploadBodySchema = z.object({
	sourceId: z.string().min(1),
	fileName: z.string().min(1),
	content: z.string(),
});

const selectBodySchema = z.object({
	sourceId: z.string().min(1),
	fileId: z.string().min(1),
});

const importBodySchema = z.object({
	sourceId: z.string().min(1),
});

const createCsvSourceBodySchema = z.object({
	name: z.string().trim().min(1).max(100),
});

const renameCsvSourceBodySchema = z.object({
	sourceId: z.string().min(1),
	name: z.string().trim().min(1).max(100),
});

const MAX_FILE_BYTES = 10 * 1024 * 1024;

const SELECTED_FILE_NAME = "selected.json";

async function isGlobalAdmin(
	pool: Pool,
	userId: string,
	allowReadOnly = false,
) {
	const result = await pool.query<UserRoleRow>(
		`
        SELECT role
        FROM "user"
        WHERE id = $1
        LIMIT 1
      `,
		[userId],
	);

	const role = result.rows[0]?.role;

	return role === "admin" || (allowReadOnly && role === "admin-viewer");
}
async function canManageOrganization(
	pool: Pool,
	userId: string,
	organizationId: string,
) {
	if (await isGlobalAdmin(pool, userId)) {
		return true;
	}

	const result = await pool.query<OrganizationRoleRow>(
		`
        SELECT role
        FROM member
        WHERE
          "organizationId" = $1
          AND "userId" = $2
        LIMIT 1
      `,
		[organizationId, userId],
	);

	const role = result.rows[0]?.role;

	return role === "owner" || role === "admin";
}

async function csvSourceExists(pool: Pool, sourceId: string) {
	const result = await pool.query<{
		id: string;
	}>(
		`
        SELECT id
        FROM
          "sevenShiftsCsvSource"
        WHERE
          id = $1
        LIMIT 1
      `,
		[sourceId],
	);

	return result.rowCount === 1;
}

function getCsvSourceDirectory(storageRoot: string, sourceId: string) {
	return join(storageRoot, "sources", sourceId);
}

function validateFileName(fileName: string) {
	const safeName = basename(fileName);

	if (safeName !== fileName || !safeName.toLowerCase().endsWith(".csv")) {
		throw new Error("Only CSV files are allowed");
	}

	return safeName;
}

async function listStoredFiles(directory: string) {
	await mkdir(directory, {
		recursive: true,
	});

	const entries = await readdir(directory, {
		withFileTypes: true,
	});

	const metadataFiles = entries.filter(
		(entry) =>
			entry.isFile() &&
			entry.name.endsWith(".json") &&
			entry.name !== SELECTED_FILE_NAME,
	);

	const files: StoredCsvMetadata[] = [];

	for (const entry of metadataFiles) {
		try {
			const value = await readFile(join(directory, entry.name), "utf8");

			const metadata = JSON.parse(value) as StoredCsvMetadata;

			if (metadata.id && metadata.storedName) {
				files.push(metadata);
			}
		} catch {
			/*
			 * Invalid metadata should not break
			 * the entire uploaded-file list.
			 */
		}
	}

	return files.sort(
		(a, b) =>
			new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
	);
}

async function readSelectedFileId(directory: string) {
	try {
		const value = await readFile(join(directory, SELECTED_FILE_NAME), "utf8");

		const parsed = JSON.parse(value) as {
			selectedFileId?: string;
		};

		return parsed.selectedFileId ?? null;
	} catch {
		return null;
	}
}

async function writeSelectedFileId(directory: string, fileId: string) {
	await writeFile(
		join(directory, SELECTED_FILE_NAME),
		JSON.stringify(
			{
				selectedFileId: fileId,
			},
			null,
			2,
		),
		"utf8",
	);
}

async function findStoredFile(directory: string, fileId: string) {
	try {
		const value = await readFile(join(directory, `${fileId}.json`), "utf8");

		const metadata = JSON.parse(value) as StoredCsvMetadata;

		if (metadata.id !== fileId) {
			return null;
		}

		return metadata;
	} catch {
		return null;
	}
}

function normalizeKey(value: string) {
	return value.trim().toLocaleLowerCase();
}

function canonicalEmail(value: string) {
	const email = value.trim().toLocaleLowerCase();

	const atIndex = email.lastIndexOf("@");

	if (atIndex <= 0) {
		return email;
	}

	let local = email.slice(0, atIndex);

	let domain = email.slice(atIndex + 1);

	if (domain === "gmail.com" || domain === "googlemail.com") {
		domain = "gmail.com";

		local = local.split("+")[0].replaceAll(".", "");
	}

	return `${local}@${domain}`;
}

function normalizeStatus(value: string) {
	return value.trim().toLocaleLowerCase();
}

function isEnabledStatus(value: string) {
	return !["inactive", "terminated", "disabled", "archived"].includes(
		normalizeStatus(value),
	);
}

function nullableText(value: string) {
	const trimmed = value.trim();

	return trimmed ? trimmed : null;
}

function parseBirthdate(value: string) {
	const trimmed = value.trim();

	if (!trimmed) {
		return null;
	}

	const slashMatch = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(trimmed);

	if (slashMatch) {
		const month = Number(slashMatch[1]);

		const day = Number(slashMatch[2]);

		const year = Number(slashMatch[3]);

		const date = new Date(Date.UTC(year, month - 1, day));

		if (!Number.isNaN(date.getTime())) {
			return date;
		}
	}

	const date = new Date(trimmed);

	return Number.isNaN(date.getTime()) ? null : date;
}

function generateTemporaryPassword() {
	return randomBytes(18).toString("base64url");
}

function usernameBaseFromEmail(email: string) {
	const local = email
		.split("@")[0]
		?.toLowerCase()
		.replace(/[^a-z0-9._]/g, "")
		.replace(/^[._]+|[._]+$/g, "")
		.slice(0, 24);

	return local || "user";
}

async function uniqueUsername(pool: Pool, email: string) {
	const base = usernameBaseFromEmail(email);

	let candidate = base;

	let suffix = 1;

	while (true) {
		const result = await pool.query<{
			id: string;
		}>(
			`
          SELECT id
          FROM "user"
          WHERE lower(username) =
            lower($1)
          LIMIT 1
        `,
			[candidate],
		);

		if (result.rowCount === 0) {
			return candidate;
		}

		suffix++;

		candidate = `${base.slice(
			0,
			Math.max(1, 29 - String(suffix).length),
		)}${suffix}`;
	}
}

function csvEscape(value: string) {
	return `"${value.replaceAll('"', '""')}"`;
}

/*
 * Small RFC4180-style CSV parser.
 *
 * Handles:
 * - quoted fields
 * - commas inside quoted fields
 * - doubled quotes
 * - CRLF / LF
 * - newlines inside quoted fields
 */
function parseCsv(content: string): CsvRow[] {
	const table: string[][] = [];

	let row: string[] = [];

	let field = "";

	let quoted = false;

	for (let index = 0; index < content.length; index++) {
		const character = content[index];

		if (quoted) {
			if (character === '"') {
				if (content[index + 1] === '"') {
					field += '"';
					index++;
				} else {
					quoted = false;
				}
			} else {
				field += character;
			}

			continue;
		}

		if (character === '"') {
			quoted = true;

			continue;
		}

		if (character === ",") {
			row.push(field);

			field = "";

			continue;
		}

		if (character === "\n") {
			row.push(field);

			field = "";

			if (row.some((value) => value.length > 0)) {
				table.push(row);
			}

			row = [];

			continue;
		}

		if (character === "\r") {
			continue;
		}

		field += character;
	}

	if (field.length > 0 || row.length > 0) {
		row.push(field);

		if (row.some((value) => value.length > 0)) {
			table.push(row);
		}
	}

	if (table.length === 0) {
		return [];
	}

	const headers = table[0].map((value) => value.trim());

	const required = [
		"First name",
		"Last name",
		"Email",
		"Mobile phone",
		"Location",
		"Department",
		"Role",
		"Birthdate",
		"Employee ID",
		"User status",
	];

	for (const header of required) {
		if (!headers.includes(header)) {
			throw new Error(`CSV is missing required column "${header}"`);
		}
	}

	return table.slice(1).map((values) => {
		const record: CsvRow = {};

		for (let index = 0; index < headers.length; index++) {
			record[headers[index]] = values[index] ?? "";
		}

		return record;
	});
}

async function getTargetLocations({
	pool,
	sourceId,
}: {
	pool: Pool;
	sourceId: string;
}) {
	/*
	 * A CSV Source feeds only organizations
	 * explicitly assigned to that source.
	 *
	 * organizationIntegration still controls whether
	 * the 7shifts CSV plugin itself is enabled.
	 */
	const result = await pool.query<TargetLocation>(
		`
        SELECT
          l.id,
          l."organizationId",
          l.name
        FROM
          "sevenShiftsLocation" l

        INNER JOIN
          "sevenShiftsCsvOrganizationSource" os
          ON
            os."organizationId" =
              l."organizationId"

        INNER JOIN
          "organizationIntegration" oi
          ON
            oi."organizationId" =
              l."organizationId"

        WHERE
          os."sourceId" =
            $1

          AND
          oi."pluginId" =
            'seven-shifts-csv'

          AND
          oi.enabled = true

          AND
          l.active = true

        ORDER BY
          l.name
      `,
		[sourceId],
	);

	return result.rows;
}

async function getTargetRoles(pool: Pool, locations: TargetLocation[]) {
	if (locations.length === 0) {
		return [];
	}

	const ids = locations.map((location) => location.id);

	const result = await pool.query<TargetRole>(
		`
        SELECT
          id,
          "locationId",
          name
        FROM
          "sevenShiftsRole"
        WHERE
          "locationId" =
            ANY($1::text[])
          AND
          active = true
      `,
		[ids],
	);

	return result.rows;
}

async function ensureMember({
	pool,
	organizationId,
	userId,
}: {
	pool: Pool;
	organizationId: string;
	userId: string;
}) {
	const existing = await pool.query<{
		id: string;
	}>(
		`
        SELECT id
        FROM member
        WHERE
          "organizationId" = $1
          AND
          "userId" = $2
        LIMIT 1
      `,
		[organizationId, userId],
	);

	if (existing.rowCount === 1) {
		return false;
	}

	await pool.query(
		`
      INSERT INTO member (
        id,
        "organizationId",
        "userId",
        role,
        "createdAt"
      )
      VALUES (
        $1,
        $2,
        $3,
        'member',
        CURRENT_TIMESTAMP
      )
    `,
		[randomUUID(), organizationId, userId],
	);

	return true;
}

export const sevenShiftsCsv = ({ pool, storageRoot }: SevenShiftsCsvOptions) =>
	({
		id: "seven-shifts-csv",

		endpoints: {
			listSevenShiftsCsvSources: createAuthEndpoint(
				"/seven-shifts-csv/sources",
				{
					method: "GET",
					use: [sessionMiddleware],
				},
				async (ctx) => {
					const allowed = await isGlobalAdmin(
						pool,
						ctx.context.session.user.id,
						true,
					);

					if (!allowed) {
						return ctx.json(
							{
								error: "Forbidden",
							},
							{
								status: 403,
							},
						);
					}

					const result = await pool.query<{
						id: string;
						name: string;
						organizationCount: number;
						createdAt: Date;
						updatedAt: Date;
					}>(
						`
                  SELECT
                    s.id,
                    s.name,
                    COUNT(
                      os.id
                    )::int AS
                      "organizationCount",
                    s."createdAt",
                    s."updatedAt"
                  FROM
                    "sevenShiftsCsvSource" s
                  LEFT JOIN
                    "sevenShiftsCsvOrganizationSource" os
                    ON
                      os."sourceId" =
                        s.id
                  GROUP BY
                    s.id,
                    s.name,
                    s."createdAt",
                    s."updatedAt"
                  ORDER BY
                    s.name ASC
                `,
					);

					return ctx.json({
						sources: result.rows,
					});
				},
			),

			createSevenShiftsCsvSource: createAuthEndpoint(
				"/seven-shifts-csv/sources/create",
				{
					method: "POST",
					use: [sessionMiddleware],
					body: createCsvSourceBodySchema,
				},
				async (ctx) => {
					const allowed = await isGlobalAdmin(
						pool,
						ctx.context.session.user.id,
					);

					if (!allowed) {
						return ctx.json(
							{
								error: "Forbidden",
							},
							{
								status: 403,
							},
						);
					}

					const name = ctx.body.name.trim();

					try {
						const result = await pool.query<{
							id: string;
							name: string;
							createdAt: Date;
							updatedAt: Date;
						}>(
							`
                    INSERT INTO
                      "sevenShiftsCsvSource" (
                        id,
                        name,
                        "createdAt",
                        "updatedAt"
                      )
                    VALUES (
                      $1,
                      $2,
                      CURRENT_TIMESTAMP,
                      CURRENT_TIMESTAMP
                    )
                    RETURNING
                      id,
                      name,
                      "createdAt",
                      "updatedAt"
                  `,
							[randomUUID(), name],
						);

						return ctx.json({
							source: result.rows[0],
						});
					} catch (error) {
						if (
							error &&
							typeof error === "object" &&
							"code" in error &&
							error.code === "23505"
						) {
							return ctx.json(
								{
									error: `A CSV Source named "${name}" already exists`,
								},
								{
									status: 409,
								},
							);
						}

						throw error;
					}
				},
			),

			renameSevenShiftsCsvSource: createAuthEndpoint(
				"/seven-shifts-csv/sources/rename",
				{
					method: "POST",
					use: [sessionMiddleware],
					body: renameCsvSourceBodySchema,
				},
				async (ctx) => {
					const allowed = await isGlobalAdmin(
						pool,
						ctx.context.session.user.id,
					);

					if (!allowed) {
						return ctx.json(
							{
								error: "Forbidden",
							},
							{
								status: 403,
							},
						);
					}

					const { sourceId } = ctx.body;

					const name = ctx.body.name.trim();

					try {
						const result = await pool.query<{
							id: string;
							name: string;
							createdAt: Date;
							updatedAt: Date;
						}>(
							`
                    UPDATE
                      "sevenShiftsCsvSource"
                    SET
                      name = $1,
                      "updatedAt" =
                        CURRENT_TIMESTAMP
                    WHERE
                      id = $2
                    RETURNING
                      id,
                      name,
                      "createdAt",
                      "updatedAt"
                  `,
							[name, sourceId],
						);

						if (result.rowCount !== 1) {
							return ctx.json(
								{
									error: "CSV Source not found",
								},
								{
									status: 404,
								},
							);
						}

						return ctx.json({
							source: result.rows[0],
						});
					} catch (error) {
						if (
							error &&
							typeof error === "object" &&
							"code" in error &&
							error.code === "23505"
						) {
							return ctx.json(
								{
									error: `A CSV Source named "${name}" already exists`,
								},
								{
									status: 409,
								},
							);
						}

						throw error;
					}
				},
			),

			deleteSevenShiftsCsvSource: createAuthEndpoint(
				"/seven-shifts-csv/sources/delete",
				{
					method: "POST",
					use: [sessionMiddleware],
					body: z.object({
						sourceId: z.string().min(1),
					}),
				},
				async (ctx) => {
					const allowed = await isGlobalAdmin(
						pool,
						ctx.context.session.user.id,
					);

					if (!allowed) {
						return ctx.json(
							{
								error: "Forbidden",
							},
							{
								status: 403,
							},
						);
					}

					const { sourceId } = ctx.body;

					const source = await pool.query<{
						id: string;
						name: string;
						organizationCount: number;
					}>(
						`
                  SELECT
                    s.id,
                    s.name,
                    COUNT(
                      os.id
                    )::int AS
                      "organizationCount"
                  FROM
                    "sevenShiftsCsvSource" s
                  LEFT JOIN
                    "sevenShiftsCsvOrganizationSource" os
                    ON
                      os."sourceId" =
                        s.id
                  WHERE
                    s.id = $1
                  GROUP BY
                    s.id,
                    s.name
                `,
						[sourceId],
					);

					if (source.rowCount !== 1) {
						return ctx.json(
							{
								error: "CSV Source not found",
							},
							{
								status: 404,
							},
						);
					}

					const currentSource = source.rows[0];

					if (currentSource.organizationCount > 0) {
						return ctx.json(
							{
								error: `CSV Source "${currentSource.name}" is assigned to ${currentSource.organizationCount} organization${currentSource.organizationCount === 1 ? "" : "s"}. Reassign those organizations before deleting this source.`,
							},
							{
								status: 409,
							},
						);
					}

					/*
					 * Repeat the assignment check in the DELETE itself
					 * so an organization cannot become attached between
					 * the preflight check and the destructive write.
					 */
					const deleted = await pool.query<{
						id: string;
						name: string;
					}>(
						`
                  DELETE FROM
                    "sevenShiftsCsvSource" s
                  WHERE
                    s.id = $1
                    AND NOT EXISTS (
                      SELECT
                        1
                      FROM
                        "sevenShiftsCsvOrganizationSource" os
                      WHERE
                        os."sourceId" =
                          s.id
                    )
                  RETURNING
                    s.id,
                    s.name
                `,
						[sourceId],
					);

					if (deleted.rowCount !== 1) {
						return ctx.json(
							{
								error:
									"CSV Source is currently assigned to an organization. Reassign it before deleting this source.",
							},
							{
								status: 409,
							},
						);
					}

					const directory = getCsvSourceDirectory(storageRoot, sourceId);

					await rm(directory, {
						recursive: true,
						force: true,
					});

					return ctx.json({
						deleted: true,
						source: deleted.rows[0],
					});
				},
			),

			setSevenShiftsCsvOrganizationSource: createAuthEndpoint(
				"/seven-shifts-csv/sources/assign",
				{
					method: "POST",
					use: [sessionMiddleware],
					body: z.object({
						organizationId: z.string().min(1),
						sourceId: z.string().min(1).nullable(),
					}),
				},
				async (ctx) => {
					const allowed = await isGlobalAdmin(
						pool,
						ctx.context.session.user.id,
					);

					if (!allowed) {
						return ctx.json(
							{
								error: "Forbidden",
							},
							{
								status: 403,
							},
						);
					}

					const { organizationId, sourceId } = ctx.body;

					const organization = await pool.query<{
						id: string;
						name: string;
					}>(
						`
                  SELECT
                    id,
                    name
                  FROM
                    organization
                  WHERE
                    id = $1
                  LIMIT 1
                `,
						[organizationId],
					);

					if (organization.rowCount !== 1) {
						return ctx.json(
							{
								error: "Organization not found",
							},
							{
								status: 404,
							},
						);
					}

					if (sourceId === null) {
						await pool.query(
							`
                  DELETE FROM
                    "sevenShiftsCsvOrganizationSource"
                  WHERE
                    "organizationId" =
                      $1
                `,
							[organizationId],
						);

						return ctx.json({
							organizationId,
							sourceType: "unassigned",
							sourceId: null,
							sourceName: null,
						});
					}

					const source = await pool.query<{
						id: string;
						name: string;
					}>(
						`
                  SELECT
                    id,
                    name
                  FROM
                    "sevenShiftsCsvSource"
                  WHERE
                    id = $1
                  LIMIT 1
                `,
						[sourceId],
					);

					if (source.rowCount !== 1) {
						return ctx.json(
							{
								error: "CSV Source not found",
							},
							{
								status: 404,
							},
						);
					}

					const result = await pool.query<{
						organizationId: string;
						sourceId: string;
					}>(
						`
                  INSERT INTO
                    "sevenShiftsCsvOrganizationSource" (
                      id,
                      "organizationId",
                      "sourceId",
                      "createdAt",
                      "updatedAt"
                    )
                  VALUES (
                    $1,
                    $2,
                    $3,
                    CURRENT_TIMESTAMP,
                    CURRENT_TIMESTAMP
                  )
                  ON CONFLICT (
                    "organizationId"
                  )
                  DO UPDATE SET
                    "sourceId" =
                      EXCLUDED."sourceId",
                    "updatedAt" =
                      CURRENT_TIMESTAMP
                  RETURNING
                    "organizationId",
                    "sourceId"
                `,
						[randomUUID(), organizationId, sourceId],
					);

					return ctx.json({
						organizationId: result.rows[0].organizationId,
						sourceType: "shared",
						sourceId: result.rows[0].sourceId,
						sourceName: source.rows[0].name,
					});
				},
			),

			listSevenShiftsCsvFiles: createAuthEndpoint(
				"/seven-shifts-csv/files",
				{
					method: "GET",
					use: [sessionMiddleware],
					query: filesQuerySchema,
				},
				async (ctx) => {
					const { sourceId } = ctx.query;

					if (!(await csvSourceExists(pool, sourceId))) {
						return ctx.json(
							{
								error: "CSV Source not found",
							},
							{
								status: 404,
							},
						);
					}

					const allowed = await isGlobalAdmin(
						pool,
						ctx.context.session.user.id,
						true,
					);

					if (!allowed) {
						return ctx.json(
							{
								error: "Forbidden",
							},
							{
								status: 403,
							},
						);
					}

					const directory = getCsvSourceDirectory(storageRoot, sourceId);

					const files = await listStoredFiles(directory);

					let selectedFileId = await readSelectedFileId(directory);

					if (
						!selectedFileId ||
						!files.some((file) => file.id === selectedFileId)
					) {
						selectedFileId = files[0]?.id ?? null;

						if (selectedFileId) {
							await writeSelectedFileId(directory, selectedFileId);
						}
					}

					return ctx.json({
						selectedFileId,
						files,
					});
				},
			),

			uploadSevenShiftsCsvFile: createAuthEndpoint(
				"/seven-shifts-csv/upload",
				{
					method: "POST",
					use: [sessionMiddleware],
					body: uploadBodySchema,
				},
				async (ctx) => {
					const { sourceId, fileName, content } = ctx.body;

					if (!(await csvSourceExists(pool, sourceId))) {
						return ctx.json(
							{
								error: "CSV Source not found",
							},
							{
								status: 404,
							},
						);
					}

					const allowed = await isGlobalAdmin(
						pool,
						ctx.context.session.user.id,
					);

					if (!allowed) {
						return ctx.json(
							{
								error: "Forbidden",
							},
							{
								status: 403,
							},
						);
					}

					let safeName: string;

					try {
						safeName = validateFileName(fileName);
					} catch (error) {
						return ctx.json(
							{
								error: error instanceof Error ? error.message : "Invalid file",
							},
							{
								status: 400,
							},
						);
					}

					const byteSize = Buffer.byteLength(content, "utf8");

					if (byteSize > MAX_FILE_BYTES) {
						return ctx.json(
							{
								error: "CSV file exceeds the 10 MB upload limit",
							},
							{
								status: 413,
							},
						);
					}

					/*
					 * Validate the CSV before storing it.
					 */
					try {
						parseCsv(content);
					} catch (error) {
						return ctx.json(
							{
								error: error instanceof Error ? error.message : "Invalid CSV",
							},
							{
								status: 400,
							},
						);
					}

					const directory = getCsvSourceDirectory(storageRoot, sourceId);

					await mkdir(directory, {
						recursive: true,
					});

					const id = randomUUID();

					const storedName = `${id}.csv`;

					const metadata: StoredCsvMetadata = {
						id,
						originalName: safeName,
						storedName,
						size: byteSize,
						uploadedAt: new Date().toISOString(),
					};

					await writeFile(join(directory, storedName), content, "utf8");

					await writeFile(
						join(directory, `${id}.json`),
						JSON.stringify(metadata, null, 2),
						"utf8",
					);

					await writeSelectedFileId(directory, id);

					return ctx.json({
						file: metadata,
						selectedFileId: id,
					});
				},
			),

			selectSevenShiftsCsvFile: createAuthEndpoint(
				"/seven-shifts-csv/select",
				{
					method: "POST",
					use: [sessionMiddleware],
					body: selectBodySchema,
				},
				async (ctx) => {
					const { sourceId, fileId } = ctx.body;

					if (!(await csvSourceExists(pool, sourceId))) {
						return ctx.json(
							{
								error: "CSV Source not found",
							},
							{
								status: 404,
							},
						);
					}

					const allowed = await isGlobalAdmin(
						pool,
						ctx.context.session.user.id,
					);

					if (!allowed) {
						return ctx.json(
							{
								error: "Forbidden",
							},
							{
								status: 403,
							},
						);
					}

					const directory = getCsvSourceDirectory(storageRoot, sourceId);

					const metadata = await findStoredFile(directory, fileId);

					if (!metadata) {
						return ctx.json(
							{
								error: "CSV file not found",
							},
							{
								status: 404,
							},
						);
					}

					await writeSelectedFileId(directory, fileId);

					return ctx.json({
						selectedFileId: fileId,
					});
				},
			),

			importSevenShiftsCsv: createAuthEndpoint(
				"/seven-shifts-csv/import",
				{
					method: "POST",
					use: [sessionMiddleware],
					body: importBodySchema,
				},
				async (ctx) => {
					const { sourceId } = ctx.body;

					if (!(await csvSourceExists(pool, sourceId))) {
						return ctx.json(
							{
								error: "CSV Source not found",
							},
							{
								status: 404,
							},
						);
					}

					const allowed = await isGlobalAdmin(
						pool,
						ctx.context.session.user.id,
					);

					if (!allowed) {
						return ctx.json(
							{
								error: "Forbidden",
							},
							{
								status: 403,
							},
						);
					}

					const directory = getCsvSourceDirectory(storageRoot, sourceId);

					const selectedFileId = await readSelectedFileId(directory);

					if (!selectedFileId) {
						return ctx.json(
							{
								error: "No CSV file is selected",
							},
							{
								status: 400,
							},
						);
					}

					const metadata = await findStoredFile(directory, selectedFileId);

					if (!metadata) {
						return ctx.json(
							{
								error: "Selected CSV file was not found",
							},
							{
								status: 404,
							},
						);
					}

					const csvPath = join(directory, metadata.storedName);

					let rows: CsvRow[];

					try {
						const content = await readFile(csvPath, "utf8");

						rows = parseCsv(content);
					} catch (error) {
						return ctx.json(
							{
								error:
									error instanceof Error ? error.message : "Unable to read CSV",
							},
							{
								status: 400,
							},
						);
					}

					const locations = await getTargetLocations({
						pool,
						sourceId,
					});

					const locationByName = new Map(
						locations.map((location) => [
							normalizeKey(location.name),
							location,
						]),
					);

					const applicableRows = rows.filter((row) =>
						locationByName.has(normalizeKey(row["Location"] ?? "")),
					);

					/*
					 * Important:
					 *
					 * An organization with no mapped
					 * sevenShiftsLocation is a valid
					 * zero-row import.
					 *
					 * Test1 should land here.
					 */
					if (applicableRows.length === 0) {
						const report: ImportReport = {
							fileId: metadata.id,
							fileName: metadata.originalName,

							sourceRows: rows.length,

							applicableRows: 0,

							ignoredRows: rows.length,

							skippedWithoutEmail: 0,

							employeesSeen: 0,

							usersCreated: 0,

							usersUpdated: 0,

							assignmentsCreated: 0,

							assignmentsRemoved: 0,

							membershipsCreated: 0,

							membershipsRemoved: 0,

							usersDisabled: 0,

							disabledEmployees: 0,

							generatedPasswordFile: null,

							completedAt: new Date().toISOString(),
						};

						return ctx.json({
							report,
						});
					}

					const roles = await getTargetRoles(pool, locations);

					const roleMap = new Map(
						roles.map((role) => [
							`${role.locationId}\u0000${normalizeKey(role.name)}`,
							role,
						]),
					);

					/*
					 * Pre-validate assignment mappings before
					 * changing users or deleting assignments.
					 */
					for (const row of applicableRows) {
						const location = locationByName.get(
							normalizeKey(row["Location"] ?? ""),
						);

						const roleName = (row["Role"] ?? "").trim();

						if (!location || !roleName) {
							continue;
						}

						const role = roleMap.get(
							`${location.id}\u0000${normalizeKey(roleName)}`,
						);

						if (!role) {
							return ctx.json(
								{
									error: `No mapped 7shifts role "${roleName}" exists for location "${location.name}"`,
								},
								{
									status: 400,
								},
							);
						}
					}

					const employeeRows = new Map<string, CsvRow>();

					let skippedWithoutEmail = 0;

					for (const row of applicableRows) {
						const email = (row["Email"] ?? "").trim().toLowerCase();

						if (!email) {
							skippedWithoutEmail++;

							continue;
						}

						const emailKey = canonicalEmail(email);

						if (!employeeRows.has(emailKey)) {
							employeeRows.set(emailKey, row);
						}
					}

					let usersCreated = 0;

					let usersUpdated = 0;

					let membershipsCreated = 0;

					let assignmentsCreated = 0;

					let assignmentsRemoved = 0;

					let usersDisabled = 0;

					let disabledEmployees = 0;

					const userByEmail = new Map<
						string,
						{
							userId: string;
							employeeId: string;
						}
					>();

					const newPasswords: Array<{
						name: string;
						email: string;
						username: string;
						password: string;
					}> = [];

					/*
					 * Resolve/create each distinct employee.
					 *
					 * Existing Better Auth users and 7shifts employee
					 * records are diffed before writing. Unchanged
					 * records are left untouched.
					 */
					for (const [emailKey, row] of employeeRows) {
						const email = (row["Email"] ?? "").trim().toLowerCase();

						const firstName = (row["First name"] ?? "").trim();

						const lastName = (row["Last name"] ?? "").trim();

						const name = `${firstName} ${lastName}`.trim() || email;

						const mobilePhone = (row["Mobile phone"] ?? "").trim();

						const employeeNumber = (row["Employee ID"] ?? "").trim();

						const status = (row["User status"] ?? "").trim();

						const enabled = isEnabledStatus(status);

						const desiredEmployeeNumber = nullableText(employeeNumber);

						const desiredFirstName = nullableText(firstName);

						const desiredLastName = nullableText(lastName);

						const desiredMobilePhone = nullableText(mobilePhone);

						const desiredBirthdate = parseBirthdate(row["Birthdate"] ?? "");

						const desiredStatus = nullableText(status);

						const existingUser = await pool.query<{
							id: string;
							name: string;
							username: string | null;
							banned: boolean;
							banReason: string | null;
							banExpires: Date | null;
						}>(
							`
                    SELECT
                      id,
                      name,
                      username,
                      banned,
                      "banReason",
                      "banExpires"
                    FROM
                      "user"
                    WHERE
                      lower(email) =
                        lower($1)
                      OR
                      lower(email) =
                        lower($2)
                    LIMIT 1
                  `,
							[email, emailKey],
						);

						let userId: string;

						let created = false;

						let username: string;

						let userChanged = false;

						let employeeChanged = false;

						if (existingUser.rowCount === 1) {
							const currentUser = existingUser.rows[0];

							userId = currentUser.id;

							username =
								currentUser.username ?? (await uniqueUsername(pool, email));

							const desiredBanned = !enabled;

							const desiredBanReason = desiredBanned
								? "Disabled in 7shifts"
								: null;

							if (!currentUser.banned && desiredBanned) {
								usersDisabled++;
							}

							userChanged =
								currentUser.name !== name ||
								currentUser.username !== username ||
								currentUser.banned !== desiredBanned ||
								currentUser.banReason !== desiredBanReason ||
								currentUser.banExpires !== null;

							if (userChanged) {
								await pool.query(
									`
                      UPDATE
                        "user"
                      SET
                        name = $1,
                        username = $2,
                        banned = $3,
                        "banReason" = $4,
                        "banExpires" =
                          NULL,
                        "updatedAt" =
                          CURRENT_TIMESTAMP
                      WHERE
                        id = $5
                    `,
									[name, username, desiredBanned, desiredBanReason, userId],
								);
							}
						} else {
							username = await uniqueUsername(pool, email);

							const password = generateTemporaryPassword();

							const createdUser = await ctx.context.internalAdapter.createUser({
								email,
								name,
								role: "user",
							});

							if (!createdUser?.id) {
								throw new Error(`Unable to create Better Auth user ${email}`);
							}

							userId = createdUser.id;

							await pool.query(
								`
                    UPDATE
                      "user"
                    SET
                      username = $1,
                      banned = $2,
                      "banReason" =
                        CASE
                          WHEN $2
                          THEN
                            'Disabled in 7shifts'
                          ELSE
                            NULL
                        END,
                      "banExpires" =
                        NULL,
                      "updatedAt" =
                        CURRENT_TIMESTAMP
                    WHERE
                      id = $3
                  `,
								[username, !enabled, userId],
							);

							const hashedPassword = await ctx.context.password.hash(password);

							await ctx.context.internalAdapter.linkAccount({
								accountId: userId,
								providerId: "credential",
								password: hashedPassword,
								userId,
							});

							newPasswords.push({
								name,
								email,
								username,
								password,
							});

							created = true;

							usersCreated++;
						}

						if (!enabled) {
							disabledEmployees++;
						}

						await upsertUserProfile(pool, userId, {
							firstName: desiredFirstName,
							lastName: desiredLastName,
							mobilePhone: desiredMobilePhone,
							birthdate: desiredBirthdate,
						});

						const existingEmployee = await pool.query<{
							id: string;
							employeeId: string | null;
							status: string | null;
							enabled: boolean;
						}>(
							`
                SELECT
                  id,
                  "employeeId",
                  status,
                  enabled
                FROM
                  "sevenShiftsEmployee"
                WHERE
                  "userId" = $1
                LIMIT 1
              `,
							[userId],
						);

						let employeeRecordId: string;

						if (existingEmployee.rowCount === 1) {
							const currentEmployee = existingEmployee.rows[0];

							employeeRecordId = currentEmployee.id;

							employeeChanged =
								currentEmployee.employeeId !== desiredEmployeeNumber ||
								currentEmployee.status !== desiredStatus ||
								currentEmployee.enabled !== enabled;

							if (employeeChanged) {
								await pool.query(
									`
                  UPDATE
                    "sevenShiftsEmployee"
                  SET
                    "employeeId" = $1,
                    status = $2,
                    enabled = $3,
                    "sourceUpdatedAt" =
                      CURRENT_TIMESTAMP
                  WHERE
                    id = $4
                `,
									[
										desiredEmployeeNumber,
										desiredStatus,
										enabled,
										employeeRecordId,
									],
								);
							}
						} else {
							employeeRecordId = randomUUID();

							await pool.query(
								`
                INSERT INTO
                  "sevenShiftsEmployee" (
                    id,
                    "userId",
                    "employeeId",
                    status,
                    enabled,
                    "mustChangePassword",
                    "sourceUpdatedAt"
                  )
                VALUES (
                  $1,
                  $2,
                  $3,
                  $4,
                  $5,
                  $6,
                  CURRENT_TIMESTAMP
                )
              `,
								[
									employeeRecordId,
									userId,
									desiredEmployeeNumber,
									desiredStatus,
									enabled,
									created,
								],
							);

							employeeChanged = true;
						}

						if (!created && (userChanged || employeeChanged)) {
							usersUpdated++;
						}

						userByEmail.set(emailKey, {
							userId,
							employeeId: employeeRecordId,
						});
					}

					/*
					 * Build the desired assignment set from the CSV,
					 * then diff it against the existing assignments.
					 *
					 * Existing matching rows are untouched.
					 * Only new assignments are inserted and assignments
					 * no longer present in the CSV are removed.
					 */
					const targetLocationIds = locations.map((location) => location.id);

					const desiredAssignments = new Map<
						string,
						{
							employeeId: string;
							locationId: string;
							roleId: string;
						}
					>();

					const membershipKeys = new Set<string>();

					for (const row of applicableRows) {
						const email = (row["Email"] ?? "").trim().toLowerCase();

						if (!email) {
							continue;
						}

						const employee = userByEmail.get(canonicalEmail(email));

						if (!employee) {
							continue;
						}

						const location = locationByName.get(
							normalizeKey(row["Location"] ?? ""),
						);

						if (!location) {
							continue;
						}

						const membershipKey = `${location.organizationId}\u0000${employee.userId}`;

						if (!membershipKeys.has(membershipKey)) {
							membershipKeys.add(membershipKey);

							if (
								await ensureMember({
									pool,
									organizationId: location.organizationId,
									userId: employee.userId,
								})
							) {
								membershipsCreated++;
							}
						}

						const roleName = (row["Role"] ?? "").trim();

						if (!roleName) {
							continue;
						}

						const role = roleMap.get(
							`${location.id}\u0000${normalizeKey(roleName)}`,
						);

						if (!role) {
							continue;
						}

						const assignmentKey = `${employee.employeeId}\u0000${location.id}\u0000${role.id}`;

						if (desiredAssignments.has(assignmentKey)) {
							continue;
						}

						desiredAssignments.set(assignmentKey, {
							employeeId: employee.employeeId,
							locationId: location.id,
							roleId: role.id,
						});
					}

					type ExistingAssignment = {
						id: string;
						employeeId: string;
						locationId: string;
						roleId: string;
					};

					let existingAssignments: ExistingAssignment[] = [];

					if (targetLocationIds.length > 0) {
						const result = await pool.query<ExistingAssignment>(
							`
                    SELECT
                      id,
                      "employeeId",
                      "locationId",
                      "roleId"
                    FROM
                      "sevenShiftsAssignment"
                    WHERE
                      "locationId" =
                        ANY(
                          $1::text[]
                        )
                  `,
							[targetLocationIds],
						);

						existingAssignments = result.rows;
					}

					const existingByKey = new Map<string, ExistingAssignment>();

					const duplicateExistingIds: string[] = [];

					for (const assignment of existingAssignments) {
						const key = `${assignment.employeeId}\u0000${assignment.locationId}\u0000${assignment.roleId}`;

						if (existingByKey.has(key)) {
							duplicateExistingIds.push(assignment.id);

							continue;
						}

						existingByKey.set(key, assignment);
					}

					const assignmentIdsToRemove = [...duplicateExistingIds];

					for (const [key, assignment] of existingByKey) {
						if (!desiredAssignments.has(key)) {
							assignmentIdsToRemove.push(assignment.id);
						}
					}

					if (assignmentIdsToRemove.length > 0) {
						const removed = await pool.query(
							`
                    DELETE FROM
                      "sevenShiftsAssignment"
                    WHERE
                      id =
                        ANY(
                          $1::text[]
                        )
                  `,
							[assignmentIdsToRemove],
						);

						assignmentsRemoved = removed.rowCount ?? 0;
					}

					for (const [key, assignment] of desiredAssignments) {
						if (existingByKey.has(key)) {
							continue;
						}

						await pool.query(
							`
                  INSERT INTO
                    "sevenShiftsAssignment" (
                      id,
                      "employeeId",
                      "locationId",
                      "roleId"
                    )
                  VALUES (
                    $1,
                    $2,
                    $3,
                    $4
                  )
                `,
							[
								randomUUID(),
								assignment.employeeId,
								assignment.locationId,
								assignment.roleId,
							],
						);

						assignmentsCreated++;
					}

					let generatedPasswordFile: string | null = null;

					if (newPasswords.length > 0) {
						generatedPasswordFile = join(
							directory,
							`new-user-passwords-${Date.now()}.csv`,
						);

						const output =
							[
								["name", "username", "email", "temporary_password"]
									.map(csvEscape)
									.join(","),

								...newPasswords.map((item) =>
									[item.name, item.username, item.email, item.password]
										.map(csvEscape)
										.join(","),
								),
							].join("\n") + "\n";

						await writeFile(generatedPasswordFile, output, {
							encoding: "utf8",
							mode: 0o600,
						});
					}

					const report: ImportReport = {
						fileId: metadata.id,

						fileName: metadata.originalName,

						sourceRows: rows.length,

						applicableRows: applicableRows.length,

						ignoredRows: rows.length - applicableRows.length,

						skippedWithoutEmail,

						employeesSeen: employeeRows.size,

						usersCreated,

						usersUpdated,

						assignmentsCreated,

						assignmentsRemoved,

						membershipsCreated,

						/*
						 * Membership deletion is intentionally
						 * conservative for now. Existing Better Auth
						 * memberships may have been added manually
						 * or by another integration.
						 */
						membershipsRemoved: 0,

						usersDisabled,

						disabledEmployees,

						generatedPasswordFile,

						completedAt: new Date().toISOString(),
					};

					return ctx.json({
						report,
					});
				},
			),
		},

		schema: {
			sevenShiftsCsvSource: {
				modelName: "sevenShiftsCsvSource",

				fields: {
					name: {
						type: "string",
						required: true,
						unique: true,
					},

					createdAt: {
						type: "date",
						required: true,
						defaultValue: () => new Date(),
					},

					updatedAt: {
						type: "date",
						required: true,
						defaultValue: () => new Date(),
					},
				},
			},

			sevenShiftsCsvOrganizationSource: {
				modelName: "sevenShiftsCsvOrganizationSource",

				fields: {
					organizationId: {
						type: "string",
						required: true,
						unique: true,
						references: {
							model: "organization",
							field: "id",
							onDelete: "cascade",
						},
					},

					sourceId: {
						type: "string",
						required: true,
						index: true,
						references: {
							model: "sevenShiftsCsvSource",
							field: "id",
							onDelete: "cascade",
						},
					},

					createdAt: {
						type: "date",
						required: true,
						defaultValue: () => new Date(),
					},

					updatedAt: {
						type: "date",
						required: true,
						defaultValue: () => new Date(),
					},
				},
			},
		},
	}) satisfies BetterAuthPlugin;
