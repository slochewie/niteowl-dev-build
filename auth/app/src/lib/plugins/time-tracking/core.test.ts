import assert from "node:assert/strict";
import { beforeEach, describe, it } from "node:test";

import {
	TimeTrackingError,
	TimeTrackingService,
	type TimeEntry,
	type TimeTrackingStore,
	type ValidatedTimeEntryInput,
	validateTimeEntryInput,
} from "./core.ts";

class MemoryStore implements TimeTrackingStore {
	readonly memberships = new Set<string>();
	readonly entries: TimeEntry[] = [];
	private nextId = 1;

	addMembership(organizationId: string, userId: string) {
		this.memberships.add(`${organizationId}:${userId}`);
	}

	async hasActiveMembership(organizationId: string, userId: string) {
		return this.memberships.has(`${organizationId}:${userId}`);
	}

	async createEntry(userId: string, input: ValidatedTimeEntryInput) {
		const now = new Date();
		const entry: TimeEntry = {
			...input,
			id: `entry-${this.nextId++}`,
			userId,
			createdAt: now,
			updatedAt: now,
		};
		this.entries.push(entry);
		return entry;
	}

	async listEntries(organizationId: string, userId: string) {
		return this.entries.filter(
			(entry) =>
				entry.organizationId === organizationId && entry.userId === userId,
		);
	}

	async updateOwnEntry(
		userId: string,
		input: ValidatedTimeEntryInput & { entryId: string },
	) {
		const entry = this.entries.find(
			(candidate) =>
				candidate.id === input.entryId &&
				candidate.organizationId === input.organizationId &&
				candidate.userId === userId,
		);
		if (!entry) return null;

		Object.assign(entry, input, { updatedAt: new Date() });
		return entry;
	}

	async deleteOwnEntry(
		organizationId: string,
		entryId: string,
		userId: string,
	) {
		const index = this.entries.findIndex(
			(entry) =>
				entry.id === entryId &&
				entry.organizationId === organizationId &&
				entry.userId === userId,
		);
		if (index === -1) return null;
		return this.entries.splice(index, 1)[0] ?? null;
	}
}

const input = {
	organizationId: "org-a",
	workDate: "2026-10-16",
	startTime: "09:00",
	endTime: "17:30",
	endsNextDay: false,
	notes: "Regular shift",
};

async function expectError(
	operation: () => Promise<unknown>,
	status: TimeTrackingError["status"],
) {
	await assert.rejects(operation, (error) => {
		assert.ok(error instanceof TimeTrackingError);
		assert.equal(error.status, status);
		return true;
	});
}

describe("TimeTrackingService", () => {
	let store: MemoryStore;
	let service: TimeTrackingService;

	beforeEach(() => {
		store = new MemoryStore();
		service = new TimeTrackingService(store);
	});

	it("requires authentication", async () => {
		await expectError(() => service.create(null, input), 401);
		await expectError(() => service.list(undefined, "org-a"), 401);
	});

	it("requires active organization membership", async () => {
		await expectError(() => service.create("user-a", input), 403);
		await expectError(() => service.list("user-a", "org-a"), 403);
	});

	it("prevents cross-organization access", async () => {
		store.addMembership("org-a", "user-a");
		store.addMembership("org-b", "user-a");
		await service.create("user-a", input);

		assert.deepEqual(await service.list("user-a", "org-b"), []);
		await expectError(
			() =>
				service.update("user-a", {
					...input,
					organizationId: "org-b",
					entryId: "entry-1",
				}),
			404,
		);
	});

	it("enforces entry ownership", async () => {
		store.addMembership("org-a", "user-a");
		store.addMembership("org-a", "user-b");
		await service.create("user-a", input);

		assert.deepEqual(await service.list("user-b", "org-a"), []);
		await expectError(
			() => service.delete("user-b", "org-a", "entry-1"),
			404,
		);
	});

	it("validates calendar dates and 24-hour times", () => {
		assert.throws(
			() => validateTimeEntryInput({ ...input, workDate: "2026-02-29" }),
			TimeTrackingError,
		);
		assert.throws(
			() => validateTimeEntryInput({ ...input, startTime: "24:00" }),
			TimeTrackingError,
		);
		assert.throws(
			() => validateTimeEntryInput({ ...input, endTime: "08:00" }),
			TimeTrackingError,
		);
	});

	it("calculates overnight duration server-side", () => {
		const validated = validateTimeEntryInput({
			...input,
			startTime: "22:30",
			endTime: "06:15",
			endsNextDay: true,
		});

		assert.equal(validated.durationMinutes, 465);
	});

	it("supports create, list, update, and delete", async () => {
		store.addMembership("org-a", "user-a");
		const created = await service.create("user-a", input);
		assert.equal(created.durationMinutes, 510);
		assert.equal((await service.list("user-a", "org-a")).length, 1);

		const updated = await service.update("user-a", {
			...input,
			entryId: created.id,
			endTime: "18:00",
			notes: "Extended shift",
		});
		assert.equal(updated.durationMinutes, 540);
		assert.equal(updated.notes, "Extended shift");

		const deleted = await service.delete("user-a", "org-a", created.id);
		assert.equal(deleted.id, created.id);
		assert.deepEqual(await service.list("user-a", "org-a"), []);
	});
});
