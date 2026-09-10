import {
	createAuthEndpoint,
	sessionMiddleware,
} from "better-auth/api";
import type { Pool } from "pg";

import { isGlobalAdmin } from "../organization-member-status/access.js";
import { getUserLocationPermissions } from "../seven-shifts/access.js";

type OrganizationsEndpointOptions = {
	pool: Pool;
};

type ScheduleOrganizationRow = {
	id: string;
	name: string;
	slug: string;
	logo: string | null;
	enabled: boolean;
	sevenShiftsLocationId: number;
	sevenShiftsLocationName: string;
	timezone: string | null;
};

type MembershipRow = {
	organizationId: string;
	role: string;
	active: boolean;
};

export const createListSevenShiftsScheduleOrganizationsEndpoint = ({
	pool,
}: OrganizationsEndpointOptions) =>
	createAuthEndpoint(
		"/seven-shifts-schedules/organizations",
		{
			method: "GET",
			use: [sessionMiddleware],
		},
		async (ctx) => {
			const userId =
				ctx.context.session.user.id;

			const organizations =
				await pool.query<ScheduleOrganizationRow>(
					`
						SELECT DISTINCT
							o.id,
							o.name,
							o.slug,
							o.logo,
							COALESCE(
								status.enabled,
								true
							) AS enabled,
							mapping."sevenShiftsLocationId",
							mapping."sevenShiftsLocationName",
							(
								SELECT
									shift."locationTimezone"
								FROM
									"sevenShiftsScheduledShift"
										AS shift
								WHERE
									shift."organizationId" =
										o.id
								ORDER BY
									shift."updatedAt" DESC
								LIMIT 1
							) AS timezone
						FROM organization AS o
						JOIN
							"sevenShiftsApiOrganizationSource"
								AS mapping
							ON mapping."organizationId" =
								o.id
						LEFT JOIN
							"organizationStatus"
								AS status
							ON status."organizationId" =
								o.id
						ORDER BY
							o.name
					`,
				);

			const globalAdmin =
				await isGlobalAdmin(
					pool,
					userId,
					true,
				);

			if (globalAdmin) {
				return ctx.json({
					organizations:
						organizations.rows,
				});
			}

			const organizationIds =
				organizations.rows.map(
					(organization) =>
						organization.id,
				);

			if (organizationIds.length === 0) {
				return ctx.json({
					organizations: [],
				});
			}

			const [
				memberships,
				locationPermissions,
			] = await Promise.all([
				pool.query<MembershipRow>(
					`
						SELECT
							member."organizationId",
							member.role,
							COALESCE(
								status.active,
								true
							) AS active
						FROM member
						LEFT JOIN
							"organizationMemberStatus"
								AS status
							ON status."memberId" =
								member.id
						WHERE
							member."userId" = $1
							AND member."organizationId" =
								ANY($2::text[])
					`,
					[
						userId,
						organizationIds,
					],
				),

				getUserLocationPermissions(
					pool,
					userId,
				),
			]);

			const membershipByOrganization =
				new Map(
					memberships.rows.map(
						(membership) => [
							membership.organizationId,
							membership,
						],
					),
				);

			const permittedScheduleOrganizations =
				new Set(
					locationPermissions
						.filter(
							(permission) =>
								permission.app ===
								"schedules",
						)
						.map(
							(permission) =>
								permission.organizationId,
						),
				);

			const allowedOrganizations =
				organizations.rows.filter(
					(organization) => {
						if (!organization.enabled) {
							return false;
						}

						const membership =
							membershipByOrganization.get(
								organization.id,
							);

						if (!membership?.active) {
							return false;
						}

						return (
							membership.role === "owner" ||
							membership.role === "admin" ||
							permittedScheduleOrganizations.has(
								organization.id,
							)
						);
					},
				);

			return ctx.json({
				organizations:
					allowedOrganizations,
			});
		},
	);
