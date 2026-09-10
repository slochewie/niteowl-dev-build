"use client";

import {
	addDays,
	format,
	parseISO,
	startOfWeek,
} from "date-fns";
import {
	CalendarDays,
	ChevronLeft,
	ChevronRight,
	MapPin,
} from "lucide-react";
import {
	useState,
} from "react";
import {
	useQuery,
} from "@tanstack/react-query";

import { ScheduleWeekGrid } from "@/components/niteowl/schedules/schedule-week-grid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
	getScheduleOrganizations,
	getScheduleWeek,
} from "@/lib/schedules";

function currentSunday() {
	return format(
		startOfWeek(
			new Date(),
			{
				weekStartsOn: 0,
			},
		),
		"yyyy-MM-dd",
	);
}

const scheduleLoadingRows = [
	"schedule-loading-1",
	"schedule-loading-2",
	"schedule-loading-3",
	"schedule-loading-4",
	"schedule-loading-5",
	"schedule-loading-6",
	"schedule-loading-7",
	"schedule-loading-8",
];

function ScheduleLoading() {
	return (
		<Card>
			<CardHeader>
				<Skeleton className="h-5 w-28" />
				<Skeleton className="h-4 w-64" />
			</CardHeader>

			<CardContent className="flex flex-col gap-3">
				{scheduleLoadingRows.map(
					(row) => (
						<Skeleton
							key={row}
							className="h-16 w-full"
						/>
					),
				)}
			</CardContent>
		</Card>
	);
}

export function SchedulePage() {
	const [
		selectedOrganizationId,
		setSelectedOrganizationId,
	] = useState("");

	const [
		weekStart,
		setWeekStart,
	] = useState(
		currentSunday,
	);

	const [
		includeDeleted,
		setIncludeDeleted,
	] = useState(false);

	const organizationsQuery =
		useQuery({
			queryKey: [
				"seven-shifts",
				"schedule-organizations",
			],
			queryFn: ({
				signal,
			}) =>
				getScheduleOrganizations(
					signal,
				),
			staleTime: 60_000,
		});

	const organizations =
		organizationsQuery.data ?? [];

	const organizationId =
		selectedOrganizationId ||
		organizations[0]?.id ||
		"";

	const selectedOrganization =
		organizations.find(
			(organization) =>
				organization.id ===
				organizationId,
		);

	const scheduleQuery =
		useQuery({
			queryKey: [
				"seven-shifts",
				"schedule-week",
				organizationId,
				weekStart,
				includeDeleted,
			],
			queryFn: ({
				signal,
			}) =>
				getScheduleWeek({
					organizationId,
					weekStart,
					includeDeleted,
					signal,
				}),
			enabled:
				organizationId.length > 0,
			staleTime: 30_000,
		});

	const weekEnd =
		addDays(
			parseISO(
				weekStart,
			),
			6,
		);

	function moveWeek(
		days: number,
	) {
		setWeekStart(
			(current) =>
				format(
					addDays(
						parseISO(
							current,
						),
						days,
					),
					"yyyy-MM-dd",
				),
		);
	}

	return (
		<div className="flex flex-1 flex-col">
			<div className="border-b px-4 py-6 md:px-6">
				<div className="flex items-center gap-3">
					<div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
						<CalendarDays />
					</div>

					<div>
						<h1 className="text-3xl font-semibold tracking-tight">
							Schedules
						</h1>

						<p className="mt-1 text-muted-foreground">
							View weekly schedules imported from 7shifts
						</p>
					</div>
				</div>
			</div>

			<div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
				<Card>
					<CardHeader>
						<CardTitle>
							Schedule week
						</CardTitle>

						<CardDescription>
							Select a location and navigate Sunday–Saturday workweeks.
						</CardDescription>
					</CardHeader>

					<CardContent className="flex flex-col gap-4">
						<div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
							<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
								<Select
									value={
										organizationId ||
										undefined
									}
									onValueChange={
										setSelectedOrganizationId
									}
									disabled={
										organizationsQuery.isPending ||
										organizations.length ===
											0
									}
								>
									<SelectTrigger className="w-full sm:w-72">
										<MapPin />

										<SelectValue placeholder="Select organization" />
									</SelectTrigger>

									<SelectContent>
										<SelectGroup>
											{organizations.map(
												(
													organization,
												) => (
													<SelectItem
														key={
															organization.id
														}
														value={
															organization.id
														}
													>
														{
															organization.name
														}
													</SelectItem>
												),
											)}
										</SelectGroup>
									</SelectContent>
								</Select>

								{selectedOrganization?.timezone ? (
									<Badge variant="outline">
										{
											selectedOrganization.timezone
										}
									</Badge>
								) : null}
							</div>

							<div className="flex flex-wrap items-center gap-2">
								<Button
									type="button"
									variant="outline"
									size="icon"
									title="Previous week"
									onClick={() =>
										moveWeek(
											-7,
										)
									}
								>
									<ChevronLeft />
									<span className="sr-only">
										Previous week
									</span>
								</Button>

								<div className="min-w-44 text-center text-sm font-medium">
									{format(
										parseISO(
											weekStart,
										),
										"MMM d",
									)}
									{" – "}
									{format(
										weekEnd,
										"MMM d, yyyy",
									)}
								</div>

								<Button
									type="button"
									variant="outline"
									size="icon"
									title="Next week"
									onClick={() =>
										moveWeek(
											7,
										)
									}
								>
									<ChevronRight />
									<span className="sr-only">
										Next week
									</span>
								</Button>

								<Button
									type="button"
									variant="outline"
									onClick={() =>
										setWeekStart(
											currentSunday(),
										)
									}
								>
									Today
								</Button>
							</div>
						</div>

						<div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4">
							<div className="flex flex-wrap gap-2">
								{scheduleQuery.data ? (
									<>
										<Badge variant="secondary">
											{
												scheduleQuery
													.data
													.summary
													.shifts
											}{" "}
											shifts
										</Badge>

										<Badge variant="outline">
											{
												scheduleQuery
													.data
													.summary
													.assignedShifts
											}{" "}
											assigned
										</Badge>

										{scheduleQuery
											.data
											.summary
											.openShifts >
										0 ? (
											<Badge variant="outline">
												{
													scheduleQuery
														.data
														.summary
														.openShifts
												}{" "}
												open
											</Badge>
										) : null}
									</>
								) : null}
							</div>

							<label
								htmlFor="include-deleted-shifts"
								className="flex cursor-pointer items-center gap-2 text-sm"
							>
								<Switch
									id="include-deleted-shifts"
									checked={
										includeDeleted
									}
									onCheckedChange={
										setIncludeDeleted
									}
								/>

								Show deleted shifts
							</label>
						</div>
					</CardContent>
				</Card>

				{organizationsQuery.isPending ? (
					<ScheduleLoading />
				) : organizationsQuery.isError ? (
					<Card>
						<CardContent>
							<Empty>
								<EmptyHeader>
									<EmptyMedia variant="icon">
										<CalendarDays />
									</EmptyMedia>

									<EmptyTitle>
										Unable to load locations
									</EmptyTitle>

									<EmptyDescription>
										{
											organizationsQuery
												.error
												.message
										}
									</EmptyDescription>
								</EmptyHeader>
							</Empty>
						</CardContent>
					</Card>
				) : organizations.length ===
					0 ? (
					<Card>
						<CardContent>
							<Empty>
								<EmptyHeader>
									<EmptyMedia variant="icon">
										<MapPin />
									</EmptyMedia>

									<EmptyTitle>
										No schedule locations
									</EmptyTitle>

									<EmptyDescription>
										You do not currently have access to a mapped 7shifts location.
									</EmptyDescription>
								</EmptyHeader>
							</Empty>
						</CardContent>
					</Card>
				) : scheduleQuery.isPending ? (
					<ScheduleLoading />
				) : scheduleQuery.isError ? (
					<Card>
						<CardContent>
							<Empty>
								<EmptyHeader>
									<EmptyMedia variant="icon">
										<CalendarDays />
									</EmptyMedia>

									<EmptyTitle>
										Unable to load schedule
									</EmptyTitle>

									<EmptyDescription>
										{
											scheduleQuery
												.error
												.message
										}
									</EmptyDescription>
								</EmptyHeader>
							</Empty>
						</CardContent>
					</Card>
				) : scheduleQuery.data ? (
					<ScheduleWeekGrid
						schedule={
							scheduleQuery.data
						}
					/>
				) : null}
			</div>
		</div>
	);
}
