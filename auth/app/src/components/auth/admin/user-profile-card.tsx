import {
  useState
} from "react"
import {
  Save,
  UserRound
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  updateAdminUserProfile
} from "@/lib/admin/users"
import type {
  UserProfile
} from "@/lib/plugins/user-profile/index"

type UserProfileCardProps = {
  userId: string
  profile: UserProfile | null
}

type FormState = {
  firstName: string
  lastName: string
  preferredFirstName: string
  preferredLastName: string
  pronouns: string
  birthdate: string
  mobilePhone: string
  homePhone: string
  address: string
  city: string
  stateProvince: string
  postalCode: string
  emergencyContactName: string
  emergencyContactPhone: string
}

function dateInputValue(
  value: Date | null | undefined
) {
  if (!value) {
    return ""
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ""
  }

  return date.toISOString().slice(0, 10)
}

function initialForm(
  profile: UserProfile | null
): FormState {
  return {
    firstName:
      profile?.firstName ?? "",
    lastName:
      profile?.lastName ?? "",
    preferredFirstName:
      profile?.preferredFirstName ?? "",
    preferredLastName:
      profile?.preferredLastName ?? "",
    pronouns:
      profile?.pronouns ?? "",
    birthdate:
      dateInputValue(
        profile?.birthdate
      ),
    mobilePhone:
      profile?.mobilePhone ?? "",
    homePhone:
      profile?.homePhone ?? "",
    address:
      profile?.address ?? "",
    city:
      profile?.city ?? "",
    stateProvince:
      profile?.stateProvince ?? "",
    postalCode:
      profile?.postalCode ?? "",
    emergencyContactName:
      profile?.emergencyContactName ?? "",
    emergencyContactPhone:
      profile?.emergencyContactPhone ?? ""
  }
}

function nullable(
  value: string
) {
  const trimmed = value.trim()

  return trimmed
    ? trimmed
    : null
}

export function UserProfileCard({
  userId,
  profile
}: UserProfileCardProps) {
  const [form, setForm] =
    useState<FormState>(
      () => initialForm(profile)
    )

  const [saving, setSaving] =
    useState(false)

  const [saved, setSaved] =
    useState(false)

  const [error, setError] =
    useState<string | null>(null)

  function setField(
    field: keyof FormState,
    value: string
  ) {
    setSaved(false)

    setForm((current) => ({
      ...current,
      [field]: value
    }))
  }

  async function save() {
    setSaving(true)
    setSaved(false)
    setError(null)

    try {
      await updateAdminUserProfile({
        data: {
          userId,
          fields: {
            firstName:
              nullable(form.firstName),
            lastName:
              nullable(form.lastName),
            preferredFirstName:
              nullable(
                form.preferredFirstName
              ),
            preferredLastName:
              nullable(
                form.preferredLastName
              ),
            pronouns:
              nullable(form.pronouns),
            birthdate:
              form.birthdate
                ? new Date(
                    form.birthdate +
                      "T00:00:00.000Z"
                  )
                : null,
            mobilePhone:
              nullable(
                form.mobilePhone
              ),
            homePhone:
              nullable(
                form.homePhone
              ),
            address:
              nullable(form.address),
            city:
              nullable(form.city),
            stateProvince:
              nullable(
                form.stateProvince
              ),
            postalCode:
              nullable(
                form.postalCode
              ),
            emergencyContactName:
              nullable(
                form.emergencyContactName
              ),
            emergencyContactPhone:
              nullable(
                form.emergencyContactPhone
              )
          }
        }
      })

      setSaved(true)
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Unable to save user profile"
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserRound className="size-5" />
          User Profile
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-8">
        <section className="space-y-4">
          <div>
            <h3 className="font-medium">
              Personal
            </h3>

            <p className="text-sm text-muted-foreground">
              Shared user information available to integrations.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <ProfileField
              label="First name"
              value={form.firstName}
              onChange={(value) =>
                setField(
                  "firstName",
                  value
                )
              }
            />

            <ProfileField
              label="Last name"
              value={form.lastName}
              onChange={(value) =>
                setField(
                  "lastName",
                  value
                )
              }
            />

            <ProfileField
              label="Preferred first name"
              value={
                form.preferredFirstName
              }
              onChange={(value) =>
                setField(
                  "preferredFirstName",
                  value
                )
              }
            />

            <ProfileField
              label="Preferred last name"
              value={
                form.preferredLastName
              }
              onChange={(value) =>
                setField(
                  "preferredLastName",
                  value
                )
              }
            />

            <ProfileField
              label="Pronouns"
              value={form.pronouns}
              onChange={(value) =>
                setField(
                  "pronouns",
                  value
                )
              }
            />

            <div className="space-y-2">
              <Label htmlFor="profile-birthdate">
                Birthday
              </Label>

              <Input
                id="profile-birthdate"
                type="date"
                value={form.birthdate}
                onChange={(event) =>
                  setField(
                    "birthdate",
                    event.target.value
                  )
                }
              />
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="font-medium">
            Contact
          </h3>

          <div className="grid gap-4 md:grid-cols-2">
            <ProfileField
              label="Mobile phone"
              value={form.mobilePhone}
              type="tel"
              onChange={(value) =>
                setField(
                  "mobilePhone",
                  value
                )
              }
            />

            <ProfileField
              label="Home phone"
              value={form.homePhone}
              type="tel"
              onChange={(value) =>
                setField(
                  "homePhone",
                  value
                )
              }
            />

            <ProfileField
              label="Address"
              value={form.address}
              onChange={(value) =>
                setField(
                  "address",
                  value
                )
              }
            />

            <ProfileField
              label="ZIP / postal code"
              value={form.postalCode}
              onChange={(value) =>
                setField(
                  "postalCode",
                  value
                )
              }
            />

            <ProfileField
              label="City"
              value={form.city}
              onChange={(value) =>
                setField(
                  "city",
                  value
                )
              }
            />

            <ProfileField
              label="State / province"
              value={form.stateProvince}
              onChange={(value) =>
                setField(
                  "stateProvince",
                  value
                )
              }
            />
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="font-medium">
            Emergency Contact
          </h3>

          <div className="grid gap-4 md:grid-cols-2">
            <ProfileField
              label="Contact name"
              value={
                form.emergencyContactName
              }
              onChange={(value) =>
                setField(
                  "emergencyContactName",
                  value
                )
              }
            />

            <ProfileField
              label="Contact number"
              value={
                form.emergencyContactPhone
              }
              type="tel"
              onChange={(value) =>
                setField(
                  "emergencyContactPhone",
                  value
                )
              }
            />
          </div>
        </section>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            onClick={save}
            disabled={saving}
          >
            <Save />
            {saving
              ? "Saving..."
              : "Save profile"}
          </Button>

          {saved && (
            <span className="text-sm text-muted-foreground">
              Saved
            </span>
          )}

          {error && (
            <span className="text-sm text-destructive">
              {error}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function ProfileField({
  label,
  value,
  type = "text",
  onChange
}: {
  label: string
  value: string
  type?: "text" | "tel"
  onChange: (value: string) => void
}) {
  const id =
    "profile-" +
    label
      .toLowerCase()
      .replace(
        /[^a-z0-9]+/g,
        "-"
      )

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
      </Label>

      <Input
        id={id}
        type={type}
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
      />
    </div>
  )
}
