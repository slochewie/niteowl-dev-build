"use client"

import {
  useActiveOrganization,
  useAuth,
} from "@better-auth-ui/react"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"

import { Button } from "#/components/ui/button.tsx"
import { Card } from "#/components/ui/card.tsx"
import { Input } from "#/components/ui/input.tsx"
import { Label } from "#/components/ui/label.tsx"
import { Switch } from "#/components/ui/switch.tsx"

type UnifiConfigResponse = {
  configured?: boolean
  organizationId?: string
  enabled?: boolean
  consoleUrl?: string
  verifyTls?: boolean
  hasApiToken?: boolean
  error?: string
  message?: string
}

async function readResponse(
  response: Response,
): Promise<UnifiConfigResponse> {
  const text =
    await response.text()

  if (!text) {
    return {}
  }

  try {
    return JSON.parse(
      text,
    ) as UnifiConfigResponse
  } catch {
    throw new Error(
      `Server returned HTTP ${response.status}: ${text}`,
    )
  }
}

export function OrganizationUnifiIdentity() {
  const { authClient } = useAuth()

  const { data: organization } =
    useActiveOrganization(authClient)

  const [enabled, setEnabled] =
    useState(false)

  const [consoleUrl, setConsoleUrl] =
    useState("")

  const [apiToken, setApiToken] =
    useState("")

  const [verifyTls, setVerifyTls] =
    useState(true)

  const [hasApiToken, setHasApiToken] =
    useState(false)

  const [loading, setLoading] =
    useState(false)

  const [saving, setSaving] =
    useState(false)

  const loadConfig =
    useCallback(async () => {
      if (!organization?.id) {
        return
      }

      setLoading(true)

      try {
        const response =
          await fetch(
            `/api/auth/unifi-identity/config?organizationId=${encodeURIComponent(
              organization.id,
            )}`,
            {
              credentials: "include",
            },
          )

        const data =
          await readResponse(
            response,
          )

        if (!response.ok) {
          throw new Error(
            data.error ??
              data.message ??
              `Unable to load UniFi Identity settings (${response.status})`,
          )
        }

        if (
          data.configured &&
          data.organizationId ===
            organization.id
        ) {
          setEnabled(
            data.enabled ?? false,
          )

          setConsoleUrl(
            data.consoleUrl ?? "",
          )

          setVerifyTls(
            data.verifyTls ?? true,
          )

          setHasApiToken(
            data.hasApiToken ?? false,
          )
        } else {
          setEnabled(false)
          setConsoleUrl("")
          setVerifyTls(true)
          setHasApiToken(false)
        }

        setApiToken("")
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Unable to load UniFi Identity settings",
        )
      } finally {
        setLoading(false)
      }
    }, [organization?.id])

  useEffect(() => {
    setEnabled(false)
    setConsoleUrl("")
    setApiToken("")
    setVerifyTls(true)
    setHasApiToken(false)

    void loadConfig()
  }, [loadConfig])

  async function save() {
    if (!organization?.id) {
      toast.error(
        "No organization is selected",
      )
      return
    }

    if (!consoleUrl.trim()) {
      toast.error(
        "Console URL is required",
      )
      return
    }

    if (
      !hasApiToken &&
      !apiToken.trim()
    ) {
      toast.error(
        "API token is required",
      )
      return
    }

    setSaving(true)

    try {
      const response =
        await fetch(
          "/api/auth/unifi-identity/config",
          {
            method: "PUT",
            credentials: "include",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              organizationId:
                organization.id,
              enabled,
              consoleUrl:
                consoleUrl.trim(),
              ...(apiToken.trim()
                ? {
                    apiToken:
                      apiToken.trim(),
                  }
                : {}),
              verifyTls,
            }),
          },
        )

      const data =
        await readResponse(
          response,
        )

      if (!response.ok) {
        throw new Error(
          data.error ??
            data.message ??
            `Unable to save UniFi Identity settings (${response.status})`,
        )
      }

      if (
        !data.configured ||
        data.organizationId !==
          organization.id
      ) {
        throw new Error(
          `UniFi configuration was not saved for ${organization.name}`,
        )
      }

      setEnabled(
        data.enabled ?? false,
      )

      setConsoleUrl(
        data.consoleUrl ?? "",
      )

      setVerifyTls(
        data.verifyTls ?? true,
      )

      setHasApiToken(
        data.hasApiToken ?? true,
      )

      setApiToken("")

      await loadConfig()

      toast.success(
        `UniFi Identity settings saved for ${organization.name}`,
      )
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to save UniFi Identity settings",
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="space-y-5 p-6">
      <div>
        <h3 className="font-medium">
          UniFi Identity
        </h3>

        <p className="text-sm text-muted-foreground">
          Configure organization WiFi access.
        </p>

        {organization && (
          <p className="mt-1 text-xs text-muted-foreground">
            {organization.name}
            {" · "}
            {organization.id}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <Label>
          Enable UniFi Identity
        </Label>

        <Switch
          checked={enabled}
          disabled={
            loading ||
            saving
          }
          onCheckedChange={
            setEnabled
          }
        />
      </div>

      <div className="space-y-2">
        <Label>
          Console URL
        </Label>

        <Input
          value={consoleUrl}
          disabled={
            loading ||
            saving
          }
          onChange={(event) =>
            setConsoleUrl(
              event.target.value,
            )
          }
          placeholder="https://192.168.x.x:12445"
        />
      </div>

      <div className="space-y-2">
        <Label>
          API Token
        </Label>

        <Input
          type="text"
          name="unifi-api-token"
          autoComplete="off"
          data-1p-ignore
          data-lpignore="true"
          value={apiToken}
          disabled={
            loading ||
            saving
          }
          onChange={(event) =>
            setApiToken(
              event.target.value,
            )
          }
          placeholder={
            hasApiToken
              ? "Configured — leave blank to keep current token"
              : "Enter API token"
          }
        />
      </div>

      <div className="flex items-center justify-between">
        <Label>
          Verify TLS
        </Label>

        <Switch
          checked={verifyTls}
          disabled={
            loading ||
            saving
          }
          onCheckedChange={
            setVerifyTls
          }
        />
      </div>

      <Button
        className="w-full"
        onClick={save}
        disabled={
          loading ||
          saving
        }
      >
        {saving
          ? "Saving..."
          : "Save"}
      </Button>
    </Card>
  )
}
