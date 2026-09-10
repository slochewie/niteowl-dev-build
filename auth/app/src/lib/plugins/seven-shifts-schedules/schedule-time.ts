type DateParts = {
	year: number;
	month: number;
	day: number;
};

function parseDateParts(
	value: string,
): DateParts | null {
	const match =
		/^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

	if (!match) {
		return null;
	}

	const parts = {
		year: Number(match[1]),
		month: Number(match[2]),
		day: Number(match[3]),
	};

	const date = new Date(
		Date.UTC(
			parts.year,
			parts.month - 1,
			parts.day,
		),
	);

	if (
		date.getUTCFullYear() !== parts.year ||
		date.getUTCMonth() !== parts.month - 1 ||
		date.getUTCDate() !== parts.day
	) {
		return null;
	}

	return parts;
}

export function addDays(
	value: string,
	days: number,
) {
	const parts = parseDateParts(value);

	if (!parts) {
		throw new Error("Invalid schedule date");
	}

	const date = new Date(
		Date.UTC(
			parts.year,
			parts.month - 1,
			parts.day + days,
		),
	);

	return [
		date.getUTCFullYear(),
		String(date.getUTCMonth() + 1).padStart(2, "0"),
		String(date.getUTCDate()).padStart(2, "0"),
	].join("-");
}

export function isSunday(
	value: string,
) {
	const parts = parseDateParts(value);

	if (!parts) {
		return false;
	}

	return (
		new Date(
			Date.UTC(
				parts.year,
				parts.month - 1,
				parts.day,
			),
		).getUTCDay() === 0
	);
}

export function validateTimezone(
	timezone: string,
) {
	try {
		new Intl.DateTimeFormat(
			"en-US",
			{
				timeZone: timezone,
			},
		).format(new Date());
	} catch {
		throw new Error(
			"Invalid 7shifts location timezone: " +
				timezone,
		);
	}
}

function zonedParts(
	instant: Date,
	timezone: string,
) {
	const values = Object.fromEntries(
		new Intl.DateTimeFormat(
			"en-US",
			{
				timeZone: timezone,
				year: "numeric",
				month: "2-digit",
				day: "2-digit",
				hour: "2-digit",
				minute: "2-digit",
				second: "2-digit",
				hourCycle: "h23",
			},
		)
			.formatToParts(instant)
			.filter((part) => part.type !== "literal")
			.map((part) => [
				part.type,
				part.value,
			]),
	);

	return {
		year: Number(values.year),
		month: Number(values.month),
		day: Number(values.day),
		hour: Number(values.hour),
		minute: Number(values.minute),
		second: Number(values.second),
	};
}

export function localMidnightToUtc(
	value: string,
	timezone: string,
) {
	const parts = parseDateParts(value);

	if (!parts) {
		throw new Error("Invalid schedule date");
	}

	validateTimezone(timezone);

	const desired =
		Date.UTC(
			parts.year,
			parts.month - 1,
			parts.day,
		);

	let candidate = desired;

	for (let attempt = 0; attempt < 4; attempt++) {
		const local =
			zonedParts(
				new Date(candidate),
				timezone,
			);

		const represented =
			Date.UTC(
				local.year,
				local.month - 1,
				local.day,
				local.hour,
				local.minute,
				local.second,
			);

		const difference =
			represented - desired;

		if (difference === 0) {
			return new Date(candidate);
		}

		candidate -= difference;
	}

	throw new Error(
		"Unable to calculate local midnight for " +
			value +
			" in " +
			timezone,
	);
}

export function localDate(
	instant: Date,
	timezone: string,
) {
	const parts =
		zonedParts(
			instant,
			timezone,
		);

	return [
		parts.year,
		String(parts.month).padStart(2, "0"),
		String(parts.day).padStart(2, "0"),
	].join("-");
}

export function requiredApiDate(
	value: string,
	field: string,
	shiftId: number,
) {
	const date = new Date(value);

	if (Number.isNaN(date.getTime())) {
		throw new Error(
			"7shifts shift " +
				shiftId +
				" has an invalid " +
				field,
		);
	}

	return date;
}

export function optionalApiDate(
	value: string | null | undefined,
	field: string,
	shiftId: number,
) {
	if (!value) {
		return null;
	}

	return requiredApiDate(
		value,
		field,
		shiftId,
	);
}
