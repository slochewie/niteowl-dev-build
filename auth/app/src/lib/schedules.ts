export type ScheduleOrganization = {
	id: string;
	name: string;
	slug: string;
	logo: string | null;
	enabled: boolean;
	sevenShiftsLocationId: number;
	sevenShiftsLocationName: string;
	timezone: string | null;
};

export type ScheduleShift = {
	sevenShiftsShiftId: number;
	user: {
		id: string;
		name: string | null;
		image: string | null;
	} | null;
	role: {
		id: number;
		name: string | null;
	} | null;
	station: {
		number: number | null;
		id: number | null;
		name: string | null;
	};
	timezone: string;
	scheduleDate: string;
	start: string;
	end: string | null;
	closesLocation: boolean;
	endsAtBusinessDecline: boolean;
	notes: string | null;
	draft: boolean;
	open: boolean;
	unassigned: boolean;
	publishStatus: string | null;
	attendanceStatus: string | null;
	lateMinutes: number | null;
	deleted: boolean;
};

export type ScheduleWeek = {
	organization: {
		id: string;
		name: string;
		sevenShiftsLocationId: number | null;
		sevenShiftsLocationName: string | null;
		timezone: string | null;
	};
	week: {
		start: string;
		end: string;
	};
	includeDeleted: boolean;
	summary: {
		shifts: number;
		assignedShifts: number;
		openShifts: number;
		deletedShifts: number;
	};
	shifts: ScheduleShift[];
};

function responseError(
	body: unknown,
	fallback: string,
) {
	if (
		typeof body === "object" &&
		body !== null &&
		"error" in body &&
		typeof body.error === "string"
	) {
		return body.error;
	}

	return fallback;
}

async function requestJson<T>(
	path: string,
	signal?: AbortSignal,
): Promise<T> {
	const response = await fetch(
		path,
		{
			credentials: "include",
			signal,
		},
	);

	const text =
		await response.text();

	let body: unknown = null;

	if (text) {
		try {
			body = JSON.parse(text);
		} catch {
			throw new Error(
				"Schedule service returned an invalid response",
			);
		}
	}

	if (!response.ok) {
		throw new Error(
			responseError(
				body,
				"Unable to load schedules",
			),
		);
	}

	if (body === null) {
		throw new Error(
			"Schedule service returned an empty response",
		);
	}

	return body as T;
}

export async function getScheduleOrganizations(
	signal?: AbortSignal,
) {
	const result =
		await requestJson<{
			organizations:
				ScheduleOrganization[];
		}>(
			"/api/auth/seven-shifts-schedules/organizations",
			signal,
		);

	return result.organizations;
}

export async function getScheduleWeek({
	organizationId,
	weekStart,
	includeDeleted,
	signal,
}: {
	organizationId: string;
	weekStart: string;
	includeDeleted: boolean;
	signal?: AbortSignal;
}) {
	const query =
		new URLSearchParams({
			organizationId,
			weekStart,
			includeDeleted:
				String(includeDeleted),
		});

	return requestJson<ScheduleWeek>(
		"/api/auth/seven-shifts-schedules/week?" +
			query.toString(),
		signal,
	);
}
