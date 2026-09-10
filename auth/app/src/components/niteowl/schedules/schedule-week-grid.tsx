"use client";

import {
	addDays,
	format,
	parseISO,
} from "date-fns";
import {
	CalendarOff,
	Users,
} from "lucide-react";
import {
	useMemo,
} from "react";

import { NiteOwlUserAvatar } from "@/components/niteowl/user-avatar";
import {
	Card,
	CardContent,
 CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import type {
	ScheduleShift,
	ScheduleWeek,
} from "@/lib/schedules";
import { cn } from "@/lib/utils";

type EmployeeScheduleRow = {
	key: string;
	name: string;
	user: ScheduleShift["user"];
	shifts: ScheduleShift[];
};

type RoleScheduleGroup = {
	key: string;
	name: string;
	rows: EmployeeScheduleRow[];
};

const roleTones = [
	{
		header:
			"border-chart-1/40 bg-chart-1/15",
		marker:
			"bg-chart-1 text-white",
	},
	{
		header:
			"border-chart-2/40 bg-chart-2/15",
		marker:
			"bg-chart-2 text-white",
	},
	{
		header:
			"border-chart-3/40 bg-chart-3/15",
		marker:
			"bg-chart-3 text-white",
	},
	{
		header:
			"border-chart-4/40 bg-chart-4/15",
		marker:
			"bg-chart-4 text-foreground",
	},
	{
		header:
			"border-chart-5/40 bg-chart-5/15",
		marker:
			"bg-chart-5 text-foreground",
	},
] as const;

function roleTone(
	value: string,
) {
	let hash = 0;

	for (const character of value) {
		hash =
			(hash * 31 +
				character.charCodeAt(0)) |
			0;
	}

	return roleTones[
		Math.abs(hash) %
			roleTones.length
	];
}

function roleInitial(
	name: string,
) {
	return name
		.trim()
		.charAt(0)
		.toUpperCase() || "?";
}

function localTime(
	value: string,
	timezone: string,
) {
	const formatted =
		new Intl.DateTimeFormat(
			undefined,
			{
				hour: "numeric",
				minute: "2-digit",
				timeZone: timezone,
			},
		).format(
			new Date(value),
		);

	return formatted.replace(
		":00",
		"",
	);
}

function shiftLabel(
	shift: ScheduleShift,
) {
	const start =
		localTime(
			shift.start,
			shift.timezone,
		);

	let end = "No end";

	if (shift.closesLocation) {
		end = "CL";
	} else if (
		shift.endsAtBusinessDecline
	) {
		end = "BD";
	} else if (shift.end) {
		end =
			localTime(
				shift.end,
				shift.timezone,
			);
	}

	return `${start} – ${end}`;
}

function weeklyHours(
	shifts: ScheduleShift[],
) {
	const milliseconds =
		shifts.reduce(
			(total, shift) => {
				if (
					!shift.end ||
					shift.deleted
				) {
					return total;
				}

				return (
					total +
					Math.max(
						0,
						new Date(
							shift.end,
						).getTime() -
							new Date(
								shift.start,
							).getTime(),
					)
				);
			},
			0,
		);

	return milliseconds /
		3_600_000;
}

function groupSchedule(
	shifts: ScheduleShift[],
) {
	const groups =
		new Map<
			string,
			{
				name: string;
				rows: Map<
					string,
					EmployeeScheduleRow
				>;
			}
		>();

	for (const shift of shifts) {
		const openShift =
			shift.open ||
			shift.unassigned ||
			shift.user === null;

		const groupKey =
			openShift
				? "open-shifts"
				: String(
						shift.role?.id ??
							"unassigned-role",
					);

		const groupName =
			openShift
				? "Open Shifts"
				: shift.role?.name ||
					"Unassigned Role";

		let group =
			groups.get(groupKey);

		if (!group) {
			group = {
				name: groupName,
				rows: new Map(),
			};

			groups.set(
				groupKey,
				group,
			);
		}

		const rowKey =
			openShift
				? "open"
				: shift.user?.id ??
					"unassigned";

		let row =
			group.rows.get(rowKey);

		if (!row) {
			row = {
				key: rowKey,
				name:
					openShift
						? "Available shifts"
						: shift.user?.name ||
							"Unassigned",
				user:
					openShift
						? null
						: shift.user,
				shifts: [],
			};

			group.rows.set(
				rowKey,
				row,
			);
		}

		row.shifts.push(shift);
	}

	return [...groups.entries()]
		.map<RoleScheduleGroup>(
			([key, group]) => ({
				key,
				name: group.name,
				rows: [...group.rows.values()]
					.sort(
						(left, right) =>
							left.name.localeCompare(
								right.name,
							),
					),
			}),
		)
		.sort((left, right) => {
			if (
				left.key ===
				"open-shifts"
			) {
				return -1;
			}

			if (
				right.key ===
				"open-shifts"
			) {
				return 1;
			}

			return left.name.localeCompare(
				right.name,
			);
		});
}

function ShiftBlock({
	shift,
	roleName,
}: {
	shift: ScheduleShift;
	roleName: string;
}) {
	const tone =
		roleTone(roleName);

	const label =
		shiftLabel(shift);

	const details = [
		label,
		shift.station.name,
		shift.notes,
		shift.deleted
			? "Deleted"
			: null,
	]
		.filter(Boolean)
		.join(" · ");

	return (
		<div
			title={details}
			className={cn(
				"flex min-h-8 items-stretch overflow-hidden rounded-md border bg-background text-xs shadow-xs",
				shift.deleted &&
					"border-destructive/40 opacity-60",
			)}
		>
			<span
				className={cn(
					"flex w-7 shrink-0 items-center justify-center font-semibold",
					shift.deleted
						? "bg-destructive text-white"
						: tone.marker,
				)}
			>
				{roleInitial(
					roleName,
				)}
			</span>

			<span
				className={cn(
					"flex min-w-0 flex-1 items-center px-2 py-1 font-medium",
					shift.deleted &&
						"line-through",
				)}
			>
				<span className="truncate">
					{label}
				</span>
			</span>
		</div>
	);
}

export function ScheduleWeekGrid({
	schedule,
}: {
	schedule: ScheduleWeek;
}) {
	const groups =
		useMemo(
			() =>
				groupSchedule(
					schedule.shifts,
				),
			[schedule.shifts],
		);

	const days =
		useMemo(
			() =>
				Array.from(
					{
						length: 7,
					},
					(_, index) =>
						format(
							addDays(
								parseISO(
									schedule.week.start,
								),
								index,
							),
							"yyyy-MM-dd",
						),
				),
			[schedule.week.start],
		);

	const today =
		format(
			new Date(),
			"yyyy-MM-dd",
		);

	if (
		schedule.shifts.length === 0
	) {
		return (
			<Card>
				<CardContent>
					<Empty>
						<EmptyHeader>
							<EmptyMedia variant="icon">
								<CalendarOff />
							</EmptyMedia>

							<EmptyTitle>
								No scheduled shifts
							</EmptyTitle>

							<EmptyDescription>
								There are no stored shifts for this organization and week.
							</EmptyDescription>
						</EmptyHeader>
					</Empty>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="gap-0 overflow-hidden py-0">
			<CardHeader className="border-b py-4">
				<CardTitle>
					Roles view
				</CardTitle>

				<CardDescription>
					Employees grouped by their scheduled 7shifts role
				</CardDescription>
			</CardHeader>

			<CardContent className="p-0">
				<div className="overflow-x-auto">
					<div className="min-w-[72rem]">
						<div className="grid grid-cols-[minmax(220px,1.5fr)_repeat(7,minmax(140px,1fr))] border-b">
							<div className="flex items-center gap-2 border-r p-3 font-medium">
								<Users />

								Team member
							</div>

							{days.map(
								(day) => {
									const shiftCount =
										schedule.shifts.filter(
											(shift) =>
												shift.scheduleDate ===
												day,
										).length;

									return (
										<div
											key={day}
											className={cn(
												"border-r p-3 last:border-r-0",
												day === today &&
													"bg-accent",
											)}
										>
											<div className="font-semibold">
												{format(
													parseISO(
														day,
													),
													"EEE",
												)}
											</div>

											<div className="flex items-center justify-between text-sm text-muted-foreground">
												<span>
													{format(
														parseISO(
															day,
														),
														"MMM d",
													)}
												</span>

												<span>
													{shiftCount}
												</span>
											</div>
										</div>
									);
								},
							)}
						</div>

						{groups.map(
							(group) => {
								const tone =
									roleTone(
										group.name,
									);

								return (
									<div key={group.key}>
										<div
											className={cn(
												"border-b border-l-4 px-3 py-2 text-sm font-semibold",
												tone.header,
											)}
										>
											{group.name}
										</div>

										{group.rows.map(
											(row) => {
												const hours =
													weeklyHours(
														row.shifts,
													);

												return (
													<div
														key={row.key}
														className="grid grid-cols-[minmax(220px,1.5fr)_repeat(7,minmax(140px,1fr))] border-b last:border-b-0"
													>
														<div className="flex min-w-0 items-center gap-3 border-r p-3">
															<NiteOwlUserAvatar
																className="size-9"
																user={
																	row.user
																		? {
																				id:
																					row.user.id,
																				name:
																					row.user.name ??
																					undefined,
																				image:
																					row.user.image ??
																					undefined,
																			}
																		: {
																				name:
																					row.name,
																			}
																}
																fallback={
																	row.user
																		? undefined
																		: roleInitial(
																				group.name,
																			)
																}
															/>

															<div className="min-w-0">
																<div className="truncate text-sm font-medium">
																	{row.name}
																</div>

																<div className="text-xs text-muted-foreground">
																	{hours.toFixed(
																		hours %
																			1 ===
																			0
																			? 0
																			: 1,
																	)}{" "}
																	hrs
																</div>
															</div>
														</div>

														{days.map(
															(day) => {
																const dayShifts =
																	row.shifts.filter(
																		(shift) =>
																			shift.scheduleDate ===
																			day,
																	);

																return (
																	<div
																		key={
																			day
																		}
																		className={cn(
																			"flex min-h-16 flex-col gap-1 border-r p-2 last:border-r-0",
																			day ===
																				today &&
																				"bg-accent/40",
																		)}
																	>
																		{dayShifts.map(
																			(
																				shift,
																			) => (
																				<ShiftBlock
																					key={
																						shift.sevenShiftsShiftId
																					}
																					shift={
																						shift
																					}
																					roleName={
																						group.name
																					}
																				/>
																			),
																		)}
																	</div>
																);
															},
														)}
													</div>
												);
											},
										)}
									</div>
								);
							},
						)}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
