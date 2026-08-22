"use client"

import {
  AlertCircle,
  KeyRound,
  LockKeyhole,
  Plus,
  RadioTower,
  Server,
  Settings2,
  Upload,
  Wifi
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
import { Switch } from "@/components/ui/switch"

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

      {pluginId === "wifi" && (
        <WifiPreview />
      )}

      {pluginId === "mqtt" && (
        <MqttPreview />
      )}

      {pluginId === "counter" && (
        <CounterPreview />
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

function WifiPreview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          WiFi Networks
        </CardTitle>

        <CardDescription>
          Saved organization networks that could later be written to managed devices during provisioning.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="rounded-lg border p-4">
          <div className="mb-4 flex items-center gap-2">
            <Wifi className="size-4" />

            <span className="font-medium">
              Primary Network
            </span>
          </div>

          <div className="grid gap-4">
            <PreviewField
              label="SSID"
              placeholder="Organization WiFi"
            />

            <PreviewField
              label="Password"
              placeholder="••••••••••••••••"
              type="password"
            />

            <div className="flex items-center justify-between rounded-md border p-3">
              <div>
                <div className="text-sm font-medium">
                  Hidden network
                </div>

                <div className="text-xs text-muted-foreground">
                  Device must explicitly connect to this SSID
                </div>
              </div>

              <Switch disabled />
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          disabled
        >
          <Plus />
          Add Network
        </Button>
      </CardContent>
    </Card>
  )
}

function MqttPreview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          MQTT Broker
        </CardTitle>

        <CardDescription>
          Reusable broker settings for Counter and future MQTT-based plugins.
        </CardDescription>
      </CardHeader>

      <CardContent className="grid gap-5">
        <PreviewField
          label="Broker"
          icon={<Server />}
          placeholder="mqtt.example.com"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <PreviewField
            label="Port"
            placeholder="8883"
          />

          <PreviewField
            label="Protocol"
            placeholder="MQTTS"
          />
        </div>

        <PreviewField
          label="Username"
          placeholder="MQTT username"
        />

        <PreviewField
          label="Password"
          type="password"
          placeholder="••••••••••••••••"
        />

        <PreviewField
          label="Topic Prefix"
          icon={<RadioTower />}
          placeholder="organizations/{organization}/"
        />

        <div className="flex items-center justify-between rounded-md border p-3">
          <div>
            <div className="text-sm font-medium">
              TLS
            </div>

            <div className="text-xs text-muted-foreground">
              Require an encrypted broker connection
            </div>
          </div>

          <Switch
            checked
            disabled
          />
        </div>

        <Button disabled>
          Test Broker
        </Button>
      </CardContent>
    </Card>
  )
}

function CounterPreview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Counter
        </CardTitle>

        <CardDescription>
          Placeholder organization defaults for NiteOwl capacity counters.
        </CardDescription>
      </CardHeader>

      <CardContent className="grid gap-5">
        <PreviewField
          label="Default Counter Name"
          placeholder="Front Door"
        />

        <PreviewField
          label="Maximum Capacity"
          placeholder="250"
        />

        <div className="flex items-center justify-between rounded-md border p-3">
          <div>
            <div className="text-sm font-medium">
              Allow negative counts
            </div>

            <div className="text-xs text-muted-foreground">
              Permit a counter value below zero
            </div>
          </div>

          <Switch disabled />
        </div>

        <div className="flex items-center justify-between rounded-md border p-3">
          <div>
            <div className="text-sm font-medium">
              MQTT integration
            </div>

            <div className="text-xs text-muted-foreground">
              Use the organization's saved MQTT connection
            </div>
          </div>

          <Switch
            checked
            disabled
          />
        </div>

        <div className="flex items-center justify-between rounded-md border p-3">
          <div>
            <div className="text-sm font-medium">
              WiFi provisioning
            </div>

            <div className="text-xs text-muted-foreground">
              Allow saved WiFi credentials during device setup
            </div>
          </div>

          <Switch
            checked
            disabled
          />
        </div>

        <Button
          variant="outline"
          disabled
        >
          <Settings2 />
          Add Counter
        </Button>
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
