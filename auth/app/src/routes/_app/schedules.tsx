import { createFileRoute } from "@tanstack/react-router";

import { SchedulePage } from "@/components/niteowl/schedules/schedule-page";

export const Route =
	createFileRoute(
		"/_app/schedules",
	)({
		component:
			SchedulePage,
	});
