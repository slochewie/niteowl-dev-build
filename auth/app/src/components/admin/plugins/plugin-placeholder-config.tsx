"use client"

import {
  AlertCircle,
  KeyRound,
  LockKeyhole,
  Upload
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import type {
  PlannedIntegrationId
} from "@/lib/plugins/integration-manager/registry"

export function PluginPlaceholderConfig({
  pluginId
}: {
  pluginId:
    PlannedIntegrationId
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-dashed p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 size-5 shrink-0 text-muted-foreground" />

          <div>
            <div className="font-medium">
              Configuration preview
            </div>

            <p className="mt-1 text-sm text-muted-foreground">
              This integration has not been implemented yet. These controls are only a UI preview and do not save data or contact an external service.
            </p>
          </div>
        </div>
      </div>

      {pluginId === "toast-api" && (
        <ToastPreview />
      )}

      {pluginId === "paychex-api" && (
        <PaychexPreview />
      )}

    </div>
  )
}

function ToastPreview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Toast Connection
        </CardTitle>

        <CardDescription>
          Placeholder OAuth/API configuration based on the likely connection requirements.
        </CardDescription>
      </CardHeader>

      <CardContent className="grid gap-5">
        <PreviewField
          label="Client ID"
          icon={<KeyRound />}
          placeholder="Toast client ID"
        />

        <PreviewField
          label="Client Secret"
          icon={<LockKeyhole />}
          placeholder="••••••••••••••••"
          type="password"
        />

        <PreviewField
          label="Restaurant / Location ID"
          placeholder="Location identifier"
        />

        <div className="flex flex-wrap gap-2">
          <Button disabled>
            Connect with Toast
          </Button>

          <Button
            variant="outline"
            disabled
          >
            Test Connection
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function PaychexPreview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Paychex Connection
        </CardTitle>

        <CardDescription>
          Placeholder configuration for future payroll and employee synchronization.
        </CardDescription>
      </CardHeader>

      <CardContent className="grid gap-5">
        <PreviewField
          label="Client ID"
          icon={<KeyRound />}
          placeholder="Paychex client ID"
        />

        <PreviewField
          label="Client Secret"
          icon={<LockKeyhole />}
          placeholder="••••••••••••••••"
          type="password"
        />

        <PreviewField
          label="Company ID"
          placeholder="Paychex company identifier"
        />

        <div className="flex flex-wrap gap-2">
          <Button disabled>
            Connect Paychex
          </Button>

          <Button
            variant="outline"
            disabled
          >
            Test Connection
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function PreviewField({
  label,
  placeholder,
  type = "text",
  icon
}: {
  label: string
  placeholder: string
  type?: string
  icon?: React.ReactNode
}) {
  return (
    <div className="grid gap-2">
      <Label>
        {label}
      </Label>

      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground [&>svg]:size-4">
            {icon}
          </div>
        )}

        <Input
          type={type}
          disabled
          placeholder={
            placeholder
          }
          className={
            icon
              ? "pl-9"
              : undefined
          }
        />
      </div>
    </div>
  )
}
