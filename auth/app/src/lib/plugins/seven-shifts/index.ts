import type { Pool } from "pg";
import type { BetterAuthPlugin } from "better-auth";
import {
  createAuthEndpoint,
  sessionMiddleware,
} from "better-auth/api";

import { getUserLocationPermissions } from "./access.js";

type SevenShiftsPluginOptions = {
  pool: Pool;
};

export const sevenShifts = ({
  pool,
}: SevenShiftsPluginOptions) =>
  ({
    id: "seven-shifts",

    endpoints: {
      sevenShiftsAccess: createAuthEndpoint(
        "/seven-shifts/access",
        {
          method: "GET",
          use: [sessionMiddleware],
        },
        async (ctx) => {
          const session = ctx.context.session;

          const permissions =
            await getUserLocationPermissions(
              pool,
              session.user.id,
            );

          return ctx.json({
            userId: session.user.id,
            permissions,
          });
        },
      ),

      sevenShiftsMemberStatus: createAuthEndpoint(
        "/seven-shifts/member-status",
        {
          method: "GET",
          use: [sessionMiddleware],
        },
        async (ctx) => {
          const session = ctx.context.session;

          const requestUrl = ctx.request?.url;

          if (!requestUrl) {
            return ctx.json(
              {
                error: "Unable to determine request URL",
              },
              {
                status: 400,
              },
            );
          }

          const organizationId =
            new URL(requestUrl).searchParams.get(
              "organizationId",
            );

          if (!organizationId) {
            return ctx.json(
              {
                error: "organizationId is required",
              },
              {
                status: 400,
              },
            );
          }

          /*
           * A caller may only inspect statuses for an organization
           * they belong to.
           */
          const membership = await pool.query<{
            id: string;
          }>(
            `
              SELECT id
              FROM member
              WHERE "organizationId" = $1
                AND "userId" = $2
              LIMIT 1
            `,
            [
              organizationId,
              session.user.id,
            ],
          );

          if (membership.rowCount !== 1) {
            return ctx.json(
              {
                error: "Forbidden",
              },
              {
                status: 403,
              },
            );
          }

          /*
           * Better Auth's organization member projection does not
           * necessarily expose Admin-plugin fields such as banned.
           *
           * Fetch account state directly from Better Auth's user table
           * for every member of this organization.
           */
          const result = await pool.query<{
            userId: string;
            banned: boolean;
            banReason: string | null;
          }>(
            `
              SELECT
                u.id AS "userId",
                COALESCE(u.banned, false) AS banned,
                u."banReason" AS "banReason"
              FROM member m
              JOIN "user" u
                ON u.id = m."userId"
              WHERE m."organizationId" = $1
              ORDER BY u.name, u.email
            `,
            [organizationId],
          );

          const users = Object.fromEntries(
            result.rows.map((row) => [
              row.userId,
              {
                banned: row.banned,
                banReason: row.banReason,
              },
            ]),
          );

          return ctx.json({
            organizationId,
            users,
          });
        },
      ),
    },

    schema: {
      sevenShiftsEmployee: {
        modelName: "sevenShiftsEmployee",
        fields: {
          userId: {
            type: "string",
            required: true,
            unique: true,
            references: {
              model: "user",
              field: "id",
              onDelete: "cascade",
            },
          },

          legacyUserId: {
            type: "number",
            required: false,
            unique: true,
          },

          employeeId: {
            type: "string",
            required: false,
          },

          sevenShiftsUserId: {
            type: "number",
            required: false,
            unique: true,
          },

          firstName: {
            type: "string",
            required: false,
          },

          lastName: {
            type: "string",
            required: false,
          },

          mobilePhone: {
            type: "string",
            required: false,
          },

          birthdate: {
            type: "date",
            required: false,
          },

          status: {
            type: "string",
            required: false,
          },

          enabled: {
            type: "boolean",
            required: true,
          },

          mustChangePassword: {
            type: "boolean",
            required: true,
          },

          sourceCreatedAt: {
            type: "date",
            required: false,
          },

          sourceUpdatedAt: {
            type: "date",
            required: false,
          },
        },
      },

      sevenShiftsLocation: {
        modelName: "sevenShiftsLocation",
        fields: {
          sevenShiftsLocationId: {
            type: "number",
            required: true,
            unique: true,
          },

          organizationId: {
            type: "string",
            required: false,
            unique: true,
            references: {
              model: "organization",
              field: "id",
              onDelete: "set null",
            },
          },

          guid: {
            type: "string",
            required: false,
          },

          name: {
            type: "string",
            required: true,
          },

          active: {
            type: "boolean",
            required: true,
          },

          source: {
            type: "string",
            required: true,
          },

          sourceCreatedAt: {
            type: "date",
            required: false,
          },

          sourceUpdatedAt: {
            type: "date",
            required: false,
          },
        },
      },

      sevenShiftsDepartment: {
        modelName: "sevenShiftsDepartment",
        fields: {
          sevenShiftsDepartmentId: {
            type: "number",
            required: true,
            unique: true,
          },

          companyId: {
            type: "number",
            required: true,
          },

          locationId: {
            type: "string",
            required: true,
            references: {
              model: "sevenShiftsLocation",
              field: "id",
              onDelete: "cascade",
            },
          },

          name: {
            type: "string",
            required: true,
          },

          active: {
            type: "boolean",
            required: true,
          },

          source: {
            type: "string",
            required: true,
          },

          sourceCreatedAt: {
            type: "date",
            required: false,
          },

          sourceUpdatedAt: {
            type: "date",
            required: false,
          },
        },
      },

      sevenShiftsRole: {
        modelName: "sevenShiftsRole",
        fields: {
          sevenShiftsRoleId: {
            type: "number",
            required: true,
            unique: true,
          },

          companyId: {
            type: "number",
            required: true,
          },

          locationId: {
            type: "string",
            required: true,
            references: {
              model: "sevenShiftsLocation",
              field: "id",
              onDelete: "cascade",
            },
          },

          departmentId: {
            type: "string",
            required: false,
            references: {
              model: "sevenShiftsDepartment",
              field: "id",
              onDelete: "set null",
            },
          },

          name: {
            type: "string",
            required: true,
          },

          active: {
            type: "boolean",
            required: true,
          },

          source: {
            type: "string",
            required: true,
          },

          sourceCreatedAt: {
            type: "date",
            required: false,
          },

          sourceUpdatedAt: {
            type: "date",
            required: false,
          },
        },
      },

      sevenShiftsAssignment: {
        modelName: "sevenShiftsAssignment",
        fields: {
          employeeId: {
            type: "string",
            required: true,
            references: {
              model: "sevenShiftsEmployee",
              field: "id",
              onDelete: "cascade",
            },
          },

          locationId: {
            type: "string",
            required: true,
            references: {
              model: "sevenShiftsLocation",
              field: "id",
              onDelete: "cascade",
            },
          },

          roleId: {
            type: "string",
            required: true,
            references: {
              model: "sevenShiftsRole",
              field: "id",
              onDelete: "cascade",
            },
          },

          legacyAssignmentId: {
            type: "number",
            required: false,
            unique: true,
          },
        },
      },
    },
  }) satisfies BetterAuthPlugin;
