import type { BetterAuthPlugin } from "better-auth";
import { createAuthEndpoint, sessionMiddleware } from "better-auth/api";
import type { Pool } from "pg";
import * as z from "zod";

import {
	listSevenShiftsShifts,
	SevenShiftsApiError,
} from "../seven-shifts-api/client.js";
import { getSevenShiftsApiConnection } from "../seven-shifts-api/source.js";

type SevenShiftsSchedulesOptions = {
	pool: Pool;
	encryptionKey: string;
};

type UserRoleRow = {
	role: string | null;
};

const previewBodySchema = z.object({
	sourceId: z.string().min(1),
	start: z.string().datetime({
		offset: true,
	}),
	end: z.string().datetime({
		offset: true,
	}),
});

async function isGlobalAdmin(pool: Pool, userId: string) {
	const result = await pool.query<UserRoleRow>(
		`
				SELECT role
				FROM "user"
				WHERE id = $1
				LIMIT 1
			`,
		[userId],
	);

	return result.rows[0]?.role === "admin";
}

function errorMessage(error: unknown) {
	if (error instanceof SevenShiftsApiError) {
		return "7shifts API returned HTTP " + error.status;
	}

	if (error instanceof Error) {
		return error.message;
	}

	return "Unable to load schedules from 7shifts";
}

export const sevenShiftsSchedules = ({
	pool,
	encryptionKey,
}: SevenShiftsSchedulesOptions) =>
	({
		id: "seven-shifts-schedules",

		endpoints: {
			previewSevenShiftsSchedules: createAuthEndpoint(
				"/seven-shifts-schedules/preview",
				{
					method: "POST",
					use: [sessionMiddleware],
					body: previewBodySchema,
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

					const start = new Date(ctx.body.start);

					const end = new Date(ctx.body.end);

					if (end <= start) {
						return ctx.json(
							{
								error: "end must be after start",
							},
							{
								status: 400,
							},
						);
					}

					const rangeDays = (end.getTime() - start.getTime()) / 86_400_000;

					if (rangeDays > 31) {
						return ctx.json(
							{
								error: "Schedule previews are limited to 31 days",
							},
							{
								status: 400,
							},
						);
					}

					try {
						const connection = await getSevenShiftsApiConnection({
							pool,
							sourceId: ctx.body.sourceId,
							encryptionKey,
						});

						const mappings = await pool.query<{
							organizationId: string;
							organizationName: string;
							sevenShiftsLocationId: number;
							sevenShiftsLocationName: string;
						}>(
							`
										SELECT
											os."organizationId",
											o.name AS "organizationName",
											os."sevenShiftsLocationId",
											os."sevenShiftsLocationName"
										FROM
											"sevenShiftsApiOrganizationSource"
												AS os
										JOIN organization AS o
											ON o.id =
												os."organizationId"
										WHERE
											os."sourceId" = $1
										ORDER BY
											o.name,
											os."sevenShiftsLocationName"
									`,
							[connection.source.id],
						);

						const shifts = await listSevenShiftsShifts({
							accessToken: connection.accessToken,
							companyId: connection.companyId,
							start: start.toISOString(),
							end: end.toISOString(),
							apiVersion: connection.apiVersion,
						});

						const mappingByLocation = new Map(
							mappings.rows.map((mapping) => [
								mapping.sevenShiftsLocationId,
								mapping,
							]),
						);

						const mappedShifts = shifts.filter((shift) =>
							mappingByLocation.has(shift.location_id),
						);

						const organizations = mappings.rows.map((mapping) => {
							const organizationShifts = mappedShifts.filter(
								(shift) => shift.location_id === mapping.sevenShiftsLocationId,
							);

							return {
								organizationId: mapping.organizationId,
								organizationName: mapping.organizationName,
								sevenShiftsLocationId: mapping.sevenShiftsLocationId,
								sevenShiftsLocationName: mapping.sevenShiftsLocationName,
								shifts: organizationShifts.length,
								openShifts: organizationShifts.filter(
									(shift) => shift.open === true,
								).length,
								deletedShifts: organizationShifts.filter(
									(shift) => shift.deleted === true,
								).length,
							};
						});

						return ctx.json({
							source: {
								id: connection.source.id,
								name: connection.source.name,
								companyId: connection.companyId,
								companyName: connection.source.companyName,
							},
							range: {
								start: start.toISOString(),
								end: end.toISOString(),
							},
							summary: {
								totalShifts: shifts.length,
								mappedShifts: mappedShifts.length,
								unmappedShifts: shifts.length - mappedShifts.length,
								openShifts: mappedShifts.filter((shift) => shift.open === true)
									.length,
								deletedShifts: mappedShifts.filter(
									(shift) => shift.deleted === true,
								).length,
							},
							organizations,
						});
					} catch (error) {
						return ctx.json(
							{
								error: errorMessage(error),
							},
							{
								status: 400,
							},
						);
					}
				},
			),
		},
	}) satisfies BetterAuthPlugin;
