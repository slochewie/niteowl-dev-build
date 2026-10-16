export type TimeEntryInput = {
	organizationId: string;
	workDate: string;
	startTime: string;
	endTime: string;
	endsNextDay: boolean;
	notes?: string | null;
};

export type TimeEntryUpdate = TimeEntryInput & {
	entryId: string;
};

export type TimeEntry = {
	id: string;
	organizationId: string;
	userId: string;
	workDate: string;
	startTime: string;
	endTime: string;
	endsNextDay: boolean;
	durationMinutes: number;
	notes: string | null;
	createdAt: Date;
	updatedAt: Date;
};

export type ValidatedTimeEntryInput = TimeEntryInput & {
	durationMinutes: number;
	notes: string | null;
};

export class TimeTrackingError extends Error {
	readonly status: 400 | 401 | 403 | 404;

	constructor(
		message: string,
		status: 400 | 401 | 403 | 404,
	) {
		super(message);
		this.name = "TimeTrackingError";
		this.status = status;
	}
}

export interface TimeTrackingStore {
	hasActiveMembership(organizationId: string, userId: string): Promise<boolean>;
	createEntry(userId: string, input: ValidatedTimeEntryInput): Promise<TimeEntry>;
	listEntries(organizationId: string, userId: string): Promise<TimeEntry[]>;
	updateOwnEntry(
		userId: string,
		input: ValidatedTimeEntryInput & { entryId: string },
	): Promise<TimeEntry | null>;
	deleteOwnEntry(
		organizationId: string,
		entryId: string,
		userId: string,
	): Promise<TimeEntry | null>;
}

const datePattern = /^(\d{4})-(\d{2})-(\d{2})$/;
const timePattern = /^(\d{2}):(\d{2})$/;

function requireIdentifier(value: string, label: string) {
	if (value.trim().length === 0) {
		throw new TimeTrackingError(`${label} is required`, 400);
	}
}

function parseWorkDate(value: string) {
	const match = datePattern.exec(value);
	if (!match) {
		throw new TimeTrackingError("workDate must use YYYY-MM-DD", 400);
	}

	const year = Number(match[1]);
	const month = Number(match[2]);
	const day = Number(match[3]);
	const date = new Date(Date.UTC(year, month - 1, day));

	if (
		date.getUTCFullYear() !== year ||
		date.getUTCMonth() !== month - 1 ||
		date.getUTCDate() !== day
	) {
		throw new TimeTrackingError("workDate is not a valid calendar date", 400);
	}
}

function parseTime(value: string, label: "startTime" | "endTime") {
	const match = timePattern.exec(value);
	if (!match) {
		throw new TimeTrackingError(`${label} must use HH:mm`, 400);
	}

	const hour = Number(match[1]);
	const minute = Number(match[2]);
	if (hour > 23 || minute > 59) {
		throw new TimeTrackingError(`${label} is not a valid time`, 400);
	}

	return hour * 60 + minute;
}

export function validateTimeEntryInput(
	input: TimeEntryInput,
): ValidatedTimeEntryInput {
	requireIdentifier(input.organizationId, "organizationId");
	parseWorkDate(input.workDate);

	const startMinutes = parseTime(input.startTime, "startTime");
	const endMinutes = parseTime(input.endTime, "endTime");
	const durationMinutes =
		endMinutes - startMinutes + (input.endsNextDay ? 24 * 60 : 0);

	if (durationMinutes <= 0) {
		throw new TimeTrackingError(
			input.endsNextDay
				? "Overnight duration must be positive"
				: "endTime must be after startTime unless endsNextDay is true",
			400,
		);
	}

	if (durationMinutes > 24 * 60) {
		throw new TimeTrackingError("A time entry cannot exceed 24 hours", 400);
	}

	const notes = input.notes?.trim() || null;
	if (notes && notes.length > 2000) {
		throw new TimeTrackingError("notes cannot exceed 2000 characters", 400);
	}

	return {
		...input,
		organizationId: input.organizationId.trim(),
		notes,
		durationMinutes,
	};
}

function requireUserId(userId: string | null | undefined) {
	if (!userId) {
		throw new TimeTrackingError("Authentication required", 401);
	}

	return userId;
}

async function requireMembership(
	store: TimeTrackingStore,
	organizationId: string,
	userId: string,
) {
	if (!(await store.hasActiveMembership(organizationId, userId))) {
		throw new TimeTrackingError("Forbidden", 403);
	}
}

export class TimeTrackingService {
	private readonly store: TimeTrackingStore;

	constructor(store: TimeTrackingStore) {
		this.store = store;
	}

	async create(userId: string | null | undefined, input: TimeEntryInput) {
		const authenticatedUserId = requireUserId(userId);
		const validated = validateTimeEntryInput(input);
		await requireMembership(
			this.store,
			validated.organizationId,
			authenticatedUserId,
		);

		return this.store.createEntry(authenticatedUserId, validated);
	}

	async list(userId: string | null | undefined, organizationId: string) {
		const authenticatedUserId = requireUserId(userId);
		requireIdentifier(organizationId, "organizationId");
		const normalizedOrganizationId = organizationId.trim();
		await requireMembership(
			this.store,
			normalizedOrganizationId,
			authenticatedUserId,
		);

		return this.store.listEntries(
			normalizedOrganizationId,
			authenticatedUserId,
		);
	}

	async update(userId: string | null | undefined, input: TimeEntryUpdate) {
		const authenticatedUserId = requireUserId(userId);
		requireIdentifier(input.entryId, "entryId");
		const validated = validateTimeEntryInput(input);
		await requireMembership(
			this.store,
			validated.organizationId,
			authenticatedUserId,
		);

		const entry = await this.store.updateOwnEntry(authenticatedUserId, {
			...validated,
			entryId: input.entryId.trim(),
		});

		if (!entry) {
			throw new TimeTrackingError("Time entry not found", 404);
		}

		return entry;
	}

	async delete(
		userId: string | null | undefined,
		organizationId: string,
		entryId: string,
	) {
		const authenticatedUserId = requireUserId(userId);
		requireIdentifier(organizationId, "organizationId");
		requireIdentifier(entryId, "entryId");
		const normalizedOrganizationId = organizationId.trim();
		await requireMembership(
			this.store,
			normalizedOrganizationId,
			authenticatedUserId,
		);

		const entry = await this.store.deleteOwnEntry(
			normalizedOrganizationId,
			entryId.trim(),
			authenticatedUserId,
		);

		if (!entry) {
			throw new TimeTrackingError("Time entry not found", 404);
		}

		return entry;
	}
}
