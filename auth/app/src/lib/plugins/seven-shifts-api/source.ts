import type { Pool } from "pg";

import { decryptApiSecret } from "../api-source/secret.js";

export type SevenShiftsApiSourceRow = {
	id: string;
	name: string;
	accessToken: string;
	companyId: number | null;
	companyName: string | null;
	apiVersion: string;
	lastTestedAt: Date | null;
	lastSyncAt: Date | null;
	createdAt: Date;
	updatedAt: Date;
};

export async function getSevenShiftsApiSource(pool: Pool, sourceId: string) {
	const result = await pool.query<SevenShiftsApiSourceRow>(
		`
				SELECT
					id,
					name,
					"accessToken",
					"companyId",
					"companyName",
					"apiVersion",
					"lastTestedAt",
					"lastSyncAt",
					"createdAt",
					"updatedAt"
				FROM "sevenShiftsApiSource"
				WHERE id = $1
				LIMIT 1
			`,
		[sourceId],
	);

	return result.rows[0] ?? null;
}

export async function getSevenShiftsApiConnection({
	pool,
	sourceId,
	encryptionKey,
}: {
	pool: Pool;
	sourceId: string;
	encryptionKey: string;
}) {
	const source = await getSevenShiftsApiSource(pool, sourceId);

	if (!source) {
		throw new Error("7shifts API Source not found");
	}

	if (source.companyId === null) {
		throw new Error("Test this API Source before loading schedules");
	}

	return {
		source,
		accessToken: decryptApiSecret(source.accessToken, encryptionKey),
		companyId: source.companyId,
		apiVersion: source.apiVersion,
	};
}
