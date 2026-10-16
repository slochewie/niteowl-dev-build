import { randomUUID } from "node:crypto";

import type { BetterAuthPlugin } from "better-auth";
import { createAuthEndpoint, sessionMiddleware } from "better-auth/api";
import type { Pool } from "pg";
import * as z from "zod";

import {
	TimeTrackingError,
	TimeTrackingService,
	type TimeEntry,
	type TimeTrackingStore,
} from "./core.js";

type TimeTrackingOptions = {
	pool: Pool;
};

const organizationQuerySchema = z.object({
	organizationId: z.string().min(1),
});

const timeEntryBodySchema = z.object({
	organizationId: z.string().min(1),
	workDate: z.string().min(1),
	startTime: z.string().min(1),
	endTime: z.string().min(1),
	endsNextDay: z.boolean(),
	notes: z.string().max(2000).nullable().optional(),
});

const updateTimeEntryBodySchema = timeEntryBodySchema.extend({
	entryId: z.string().min(1),
});

const deleteTimeEntryBodySchema = z.object({
	organizationId: z.string().min(1),
	entryId: z.string().min(1),
});

function postgresStore(pool: Pool): TimeTrackingStore {
	return {
		async hasActiveMembership(organizationId, userId) {
			const result = await pool.query(
				`
					SELECT 1
					FROM member m
					INNER JOIN "user" u
						ON u.id = m."userId"
					INNER JOIN organization o
						ON o.id = m."organizationId"
					LEFT JOIN "organizationStatus" os
						ON os."organizationId" = o.id
					LEFT JOIN "organizationMemberStatus" oms
						ON oms."memberId" = m.id
					WHERE
						m."organizationId" = $1
						AND m."userId" = $2
						AND COALESCE(u.banned, false) = false
						AND COALESCE(os.enabled, true) = true
						AND COALESCE(oms.active, true) = true
					LIMIT 1
				`,
				[organizationId, userId],
			);

			return result.rowCount === 1;
		},

		async createEntry(userId, input) {
			const result = await pool.query<TimeEntry>(
				`
					INSERT INTO "timeEntry" (
						id,
						"organizationId",
						"userId",
						"workDate",
						"startTime",
						"endTime",
						"endsNextDay",
						"durationMinutes",
						notes,
						"createdAt",
						"updatedAt"
					)
					VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
					RETURNING *
				`,
				[
					randomUUID(),
					input.organizationId,
					userId,
					input.workDate,
					input.startTime,
					input.endTime,
					input.endsNextDay,
					input.durationMinutes,
					input.notes,
				],
			);

			const entry = result.rows[0];
			if (!entry) {
				throw new Error("Time entry insert did not return a row");
			}

			return entry;
		},

		async listEntries(organizationId, userId) {
			const result = await pool.query<TimeEntry>(
				`
					SELECT *
					FROM "timeEntry"
					WHERE "organizationId" = $1 AND "userId" = $2
					ORDER BY "workDate" DESC, "startTime" DESC, "createdAt" DESC
				`,
				[organizationId, userId],
			);

			return result.rows;
		},

		async updateOwnEntry(userId, input) {
			const result = await pool.query<TimeEntry>(
				`
					UPDATE "timeEntry"
					SET
						"workDate" = $1,
						"startTime" = $2,
						"endTime" = $3,
						"endsNextDay" = $4,
						"durationMinutes" = $5,
						notes = $6,
						"updatedAt" = CURRENT_TIMESTAMP
					WHERE id = $7 AND "organizationId" = $8 AND "userId" = $9
					RETURNING *
				`,
				[
					input.workDate,
					input.startTime,
					input.endTime,
					input.endsNextDay,
					input.durationMinutes,
					input.notes,
					input.entryId,
					input.organizationId,
					userId,
				],
			);

			return result.rows[0] ?? null;
		},

		async deleteOwnEntry(organizationId, entryId, userId) {
			const result = await pool.query<TimeEntry>(
				`
					DELETE FROM "timeEntry"
					WHERE id = $1 AND "organizationId" = $2 AND "userId" = $3
					RETURNING *
				`,
				[entryId, organizationId, userId],
			);

			return result.rows[0] ?? null;
		},
	};
}

async function respond<T>(
	ctx: { json: (body: unknown, init?: { status: number }) => T },
	operation: () => Promise<unknown>,
) {
	try {
		return ctx.json(await operation());
	} catch (error) {
		if (error instanceof TimeTrackingError) {
			return ctx.json({ error: error.message }, { status: error.status });
		}

		throw error;
	}
}

export const timeTracking = ({ pool }: TimeTrackingOptions) => {
	const service = new TimeTrackingService(postgresStore(pool));

	return {
		id: "time-tracking",

		endpoints: {
			listTimeEntries: createAuthEndpoint(
				"/time-tracking/entries",
				{
					method: "GET",
					use: [sessionMiddleware],
					query: organizationQuerySchema,
				},
				async (ctx) =>
					respond(ctx, async () => ({
						entries: await service.list(
							ctx.context.session.user.id,
							ctx.query.organizationId,
						),
					})),
			),

			createTimeEntry: createAuthEndpoint(
				"/time-tracking/entries/create",
				{
					method: "POST",
					use: [sessionMiddleware],
					body: timeEntryBodySchema,
				},
				async (ctx) =>
					respond(ctx, async () => ({
						entry: await service.create(
							ctx.context.session.user.id,
							ctx.body,
						),
					})),
			),

			updateTimeEntry: createAuthEndpoint(
				"/time-tracking/entries/update",
				{
					method: "POST",
					use: [sessionMiddleware],
					body: updateTimeEntryBodySchema,
				},
				async (ctx) =>
					respond(ctx, async () => ({
						entry: await service.update(
							ctx.context.session.user.id,
							ctx.body,
						),
					})),
			),

			deleteTimeEntry: createAuthEndpoint(
				"/time-tracking/entries/delete",
				{
					method: "POST",
					use: [sessionMiddleware],
					body: deleteTimeEntryBodySchema,
				},
				async (ctx) =>
					respond(ctx, async () => ({
						deleted: true,
						entry: await service.delete(
							ctx.context.session.user.id,
							ctx.body.organizationId,
							ctx.body.entryId,
						),
					})),
			),
		},

		schema: {
			timeEntry: {
				modelName: "timeEntry",
				fields: {
					organizationId: {
						type: "string",
						required: true,
						references: {
							model: "organization",
							field: "id",
							onDelete: "cascade",
						},
					},
					userId: {
						type: "string",
						required: true,
						references: {
							model: "user",
							field: "id",
							onDelete: "cascade",
						},
					},
					workDate: { type: "string", required: true },
					startTime: { type: "string", required: true },
					endTime: { type: "string", required: true },
					endsNextDay: {
						type: "boolean",
						required: true,
						defaultValue: false,
					},
					durationMinutes: { type: "number", required: true },
					notes: { type: "string", required: false },
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
				indexes: [
					{ fields: ["organizationId", "userId", "workDate"] },
				],
			},
		},
	} satisfies BetterAuthPlugin;
};
