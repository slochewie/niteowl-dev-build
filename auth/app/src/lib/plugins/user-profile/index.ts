import type { BetterAuthPlugin } from "better-auth";
import type { Pool } from "pg";

export type UserProfile = {
  id: string;
  userId: string;

  firstName: string | null;
  lastName: string | null;
  preferredFirstName: string | null;
  preferredLastName: string | null;
  pronouns: string | null;

  birthdate: Date | null;

  mobilePhone: string | null;
  homePhone: string | null;

  address: string | null;
  city: string | null;
  stateProvince: string | null;
  postalCode: string | null;

  emergencyContactName: string | null;
  emergencyContactPhone: string | null;

  createdAt: Date;
  updatedAt: Date;
};

export type UserProfileFields = {
  firstName?: string | null;
  lastName?: string | null;
  preferredFirstName?: string | null;
  preferredLastName?: string | null;
  pronouns?: string | null;

  birthdate?: Date | null;

  mobilePhone?: string | null;
  homePhone?: string | null;

  address?: string | null;
  city?: string | null;
  stateProvince?: string | null;
  postalCode?: string | null;

  emergencyContactName?: string | null;
  emergencyContactPhone?: string | null;
};

type UserProfilePluginOptions = {
  pool: Pool;
};

export async function getUserProfile(
  pool: Pool,
  userId: string,
): Promise<UserProfile | null> {
  const result = await pool.query<UserProfile>(
    `
      SELECT
        id,
        "userId",
        "firstName",
        "lastName",
        "preferredFirstName",
        "preferredLastName",
        pronouns,
        birthdate,
        "mobilePhone",
        "homePhone",
        address,
        city,
        "stateProvince",
        "postalCode",
        "emergencyContactName",
        "emergencyContactPhone",
        "createdAt",
        "updatedAt"
      FROM "userProfile"
      WHERE "userId" = $1
      LIMIT 1
    `,
    [userId],
  );

  return result.rows[0] ?? null;
}

export async function upsertUserProfile(
  pool: Pool,
  userId: string,
  fields: UserProfileFields,
): Promise<UserProfile> {
  const existing =
    await getUserProfile(pool, userId);

  if (!existing) {
    const result = await pool.query<UserProfile>(
      `
        INSERT INTO "userProfile" (
          id,
          "userId",
          "firstName",
          "lastName",
          "preferredFirstName",
          "preferredLastName",
          pronouns,
          birthdate,
          "mobilePhone",
          "homePhone",
          address,
          city,
          "stateProvince",
          "postalCode",
          "emergencyContactName",
          "emergencyContactPhone",
          "createdAt",
          "updatedAt"
        )
        VALUES (
          gen_random_uuid()::text,
          $1,
          $2,
          $3,
          $4,
          $5,
          $6,
          $7,
          $8,
          $9,
          $10,
          $11,
          $12,
          $13,
          $14,
          $15,
          NOW(),
          NOW()
        )
        RETURNING *
      `,
      [
        userId,
        fields.firstName ?? null,
        fields.lastName ?? null,
        fields.preferredFirstName ?? null,
        fields.preferredLastName ?? null,
        fields.pronouns ?? null,
        fields.birthdate ?? null,
        fields.mobilePhone ?? null,
        fields.homePhone ?? null,
        fields.address ?? null,
        fields.city ?? null,
        fields.stateProvince ?? null,
        fields.postalCode ?? null,
        fields.emergencyContactName ?? null,
        fields.emergencyContactPhone ?? null,
      ],
    );

    return result.rows[0];
  }

  const merged = {
    firstName:
      fields.firstName !== undefined
        ? fields.firstName
        : existing.firstName,
    lastName:
      fields.lastName !== undefined
        ? fields.lastName
        : existing.lastName,
    preferredFirstName:
      fields.preferredFirstName !== undefined
        ? fields.preferredFirstName
        : existing.preferredFirstName,
    preferredLastName:
      fields.preferredLastName !== undefined
        ? fields.preferredLastName
        : existing.preferredLastName,
    pronouns:
      fields.pronouns !== undefined
        ? fields.pronouns
        : existing.pronouns,
    birthdate:
      fields.birthdate !== undefined
        ? fields.birthdate
        : existing.birthdate,
    mobilePhone:
      fields.mobilePhone !== undefined
        ? fields.mobilePhone
        : existing.mobilePhone,
    homePhone:
      fields.homePhone !== undefined
        ? fields.homePhone
        : existing.homePhone,
    address:
      fields.address !== undefined
        ? fields.address
        : existing.address,
    city:
      fields.city !== undefined
        ? fields.city
        : existing.city,
    stateProvince:
      fields.stateProvince !== undefined
        ? fields.stateProvince
        : existing.stateProvince,
    postalCode:
      fields.postalCode !== undefined
        ? fields.postalCode
        : existing.postalCode,
    emergencyContactName:
      fields.emergencyContactName !== undefined
        ? fields.emergencyContactName
        : existing.emergencyContactName,
    emergencyContactPhone:
      fields.emergencyContactPhone !== undefined
        ? fields.emergencyContactPhone
        : existing.emergencyContactPhone,
  };

  const result = await pool.query<UserProfile>(
    `
      UPDATE "userProfile"
      SET
        "firstName" = $2,
        "lastName" = $3,
        "preferredFirstName" = $4,
        "preferredLastName" = $5,
        pronouns = $6,
        birthdate = $7,
        "mobilePhone" = $8,
        "homePhone" = $9,
        address = $10,
        city = $11,
        "stateProvince" = $12,
        "postalCode" = $13,
        "emergencyContactName" = $14,
        "emergencyContactPhone" = $15,
        "updatedAt" = NOW()
      WHERE "userId" = $1
      RETURNING *
    `,
    [
      userId,
      merged.firstName,
      merged.lastName,
      merged.preferredFirstName,
      merged.preferredLastName,
      merged.pronouns,
      merged.birthdate,
      merged.mobilePhone,
      merged.homePhone,
      merged.address,
      merged.city,
      merged.stateProvince,
      merged.postalCode,
      merged.emergencyContactName,
      merged.emergencyContactPhone,
    ],
  );

  return result.rows[0];
}

export const userProfile = ({
  pool: _pool,
}: UserProfilePluginOptions) =>
  ({
    id: "user-profile",

    schema: {
      userProfile: {
        modelName: "userProfile",

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

          firstName: {
            type: "string",
            required: false,
          },

          lastName: {
            type: "string",
            required: false,
          },

          preferredFirstName: {
            type: "string",
            required: false,
          },

          preferredLastName: {
            type: "string",
            required: false,
          },

          pronouns: {
            type: "string",
            required: false,
          },

          birthdate: {
            type: "date",
            required: false,
          },

          mobilePhone: {
            type: "string",
            required: false,
          },

          homePhone: {
            type: "string",
            required: false,
          },

          address: {
            type: "string",
            required: false,
          },

          city: {
            type: "string",
            required: false,
          },

          stateProvince: {
            type: "string",
            required: false,
          },

          postalCode: {
            type: "string",
            required: false,
          },

          emergencyContactName: {
            type: "string",
            required: false,
          },

          emergencyContactPhone: {
            type: "string",
            required: false,
          },

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
      },
    },
  }) satisfies BetterAuthPlugin;
