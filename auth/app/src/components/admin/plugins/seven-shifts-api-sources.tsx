"use client"

import {
  KeyRound,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  Unlink
} from "lucide-react"
import {
  useEffect,
  useMemo,
  useState
} from "react"
import {
  useRouter
} from "@tanstack/react-router"
import {
  toast
} from "sonner"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog"

import {
  Badge
} from "@/components/ui/badge"
import {
  Button
} from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  Input
} from "@/components/ui/input"
import {
  Label
} from "@/components/ui/label"
import {
  Progress
} from "@/components/ui/progress"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"

import {
  assignAdminSevenShiftsApiLocation,
  createAdminSevenShiftsApiSource,
  deleteAdminSevenShiftsApiSource,
  getAdminSevenShiftsApiLocations,
  previewAdminSevenShiftsApiSync,
  syncAdminSevenShiftsApiSource,
  testAdminSevenShiftsApiSource,
  unassignAdminSevenShiftsApiLocation,
  updateAdminSevenShiftsApiSource,
  type AdminPluginOrganization,
  type AdminSevenShiftsApiLocation,
  type AdminSevenShiftsApiLocationMapping,
  type AdminSevenShiftsApiSource
} from "@/lib/admin/plugins"

type SevenShiftsApiSyncPreview = {
  counts: {
    mappedOrganizations: number
    companyLocations: number
    mappedLocations: number
    companyDepartments: number
    mappedDepartments: number
    companyRoles: number
    mappedRoles: number
    companyUsers: number
    activeCompanyUsers: number
    inactiveCompanyUsers: number
  }
  userSample: Array<{
    id: number
    first_name: string
    last_name: string
    email?: string | null
    employee_id?: string | null
    active: boolean
  }>
}

type SevenShiftsApiSyncChange = {
  userId: string
  userName: string
  section: "Account" | "Organizations"
  label: string
  before: string | null
  after: string | null
}

type SevenShiftsApiSyncReport = {
  mappedOrganizations: number
  mappedLocations: number
  departmentsSynced: number
  rolesSynced: number
  usersSeen: number
  usersManaged: number
  usersCreated: number
  usersUpdated: number
  usersPushedToSevenShifts: number
  usersDisabled: number
  skippedWithoutEmail: number
  membershipsCreated: number
  assignmentsCreated: number
  assignmentsRemoved: number
  changes: SevenShiftsApiSyncChange[]
  generatedCredentials: Array<{
    name: string
    email: string
    username: string
    password: string
  }>
  completedAt: string
}

const DEFAULT_API_VERSION =
  "2026-01-01"

export function SevenShiftsApiSources({
  sources,
  organizations
}: {
  sources:
    AdminSevenShiftsApiSource[]
  organizations:
    AdminPluginOrganization[]
}) {
  const router =
    useRouter()

  const [
    selectedSourceId,
    setSelectedSourceId
  ] = useState(
    sources[0]?.id ??
      ""
  )

  const [
    sourceName,
    setSourceName
  ] = useState("")

  const [
    accessToken,
    setAccessToken
  ] = useState("")

  const [
    apiVersion,
    setApiVersion
  ] = useState(
    DEFAULT_API_VERSION
  )

  const [
    newSourceName,
    setNewSourceName
  ] = useState("")

  const [
    newAccessToken,
    setNewAccessToken
  ] = useState("")

  const [
    creating,
    setCreating
  ] = useState(false)

  const [
    saving,
    setSaving
  ] = useState(false)

  const [
    testing,
    setTesting
  ] = useState(false)

  const [
    loadingLocations,
    setLoadingLocations
  ] = useState(false)

  const [
    locations,
    setLocations
  ] = useState<
    AdminSevenShiftsApiLocation[]
  >([])

  const [
    mappings,
    setMappings
  ] = useState<
    AdminSevenShiftsApiLocationMapping[]
  >([])

  const [
    previewing,
    setPreviewing
  ] = useState(false)

  const [
    syncPreview,
    setSyncPreview
  ] = useState<
    SevenShiftsApiSyncPreview | null
  >(null)

  const [
    syncing,
    setSyncing
  ] = useState(false)

  const [
    deleting,
    setDeleting
  ] = useState(false)

  const [
    unassigningLocationId,
    setUnassigningLocationId
  ] = useState<number | null>(
    null
  )

  const [
    syncReport,
    setSyncReport
  ] = useState<
    SevenShiftsApiSyncReport | null
  >(null)

  const selectedSource =
    useMemo(
      () =>
        sources.find(
          (source) =>
            source.id ===
            selectedSourceId
        ) ??
        null,
      [
        sources,
        selectedSourceId
      ]
    )

  useEffect(
    () => {
      if (
        sources.length ===
        0
      ) {
        setSelectedSourceId(
          ""
        )

        return
      }

      if (
        !sources.some(
          (source) =>
            source.id ===
            selectedSourceId
        )
      ) {
        setSelectedSourceId(
          sources[0].id
        )
      }
    },
    [
      sources,
      selectedSourceId
    ]
  )

  useEffect(
    () => {
      setSourceName(
        selectedSource?.name ??
          ""
      )

      setApiVersion(
        selectedSource?.apiVersion ??
          DEFAULT_API_VERSION
      )

      setAccessToken("")
      setLocations([])
      setMappings([])
    setSyncPreview(null)
    setSyncReport(null)
    },
    [
      selectedSource?.id,
      selectedSource?.name,
      selectedSource?.apiVersion
    ]
  )

  async function createSource() {
    const name =
      newSourceName.trim()

    const token =
      newAccessToken.trim()

    if (!name) {
      toast.error(
        "Enter an API Source name"
      )

      return
    }

    if (!token) {
      toast.error(
        "Enter a 7shifts Access Token"
      )

      return
    }

    setCreating(true)

    try {
      const result =
        await createAdminSevenShiftsApiSource({
          data: {
            name,
            accessToken:
              token,
            apiVersion:
              DEFAULT_API_VERSION
          }
        })

      setSelectedSourceId(
        result.source.id
      )

      setNewSourceName("")
      setNewAccessToken("")

      toast.success(
        `API Source "${result.source.name}" created`
      )

      await router.invalidate()
    } catch (
      error
    ) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to create API Source"
      )
    } finally {
      setCreating(false)
    }
  }

  async function saveSource() {
    if (
      !selectedSource
    ) {
      return
    }

    const name =
      sourceName.trim()

    if (!name) {
      toast.error(
        "API Source name cannot be empty"
      )

      return
    }

    setSaving(true)

    try {
      const result =
        await updateAdminSevenShiftsApiSource({
          data: {
            sourceId:
              selectedSource.id,
            name,
            apiVersion:
              apiVersion.trim() ||
              DEFAULT_API_VERSION,
            ...(accessToken.trim()
              ? {
                  accessToken:
                    accessToken.trim()
                }
              : {})
          }
        })

      setAccessToken("")

      toast.success(
        `API Source "${result.source.name}" saved`
      )

      await router.invalidate()
    } catch (
      error
    ) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to save API Source"
      )
    } finally {
      setSaving(false)
    }
  }

  async function loadLocations(
    showSuccess = false
  ) {
    if (
      !selectedSource
    ) {
      return
    }

    setLoadingLocations(true)

    try {
      const result =
        await getAdminSevenShiftsApiLocations({
          data: {
            sourceId:
              selectedSource.id
          }
        })

      setLocations(
        result.locations
      )

      setMappings(
        result.mappings
      )

      if (
        showSuccess
      ) {
        toast.success(
          "7shifts locations refreshed"
        )
      }
    } catch (
      error
    ) {
      setLocations([])
      setMappings([])

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to load 7shifts locations"
      )
    } finally {
      setLoadingLocations(false)
    }
  }

  async function testSource() {
    if (
      !selectedSource
    ) {
      return
    }

    setTesting(true)

    try {
      const result =
        await testAdminSevenShiftsApiSource({
          data: {
            sourceId:
              selectedSource.id
          }
        })

      toast.success(
        `Connected to ${result.company.name}`
      )

      await router.invalidate()

      setLocations(
        result.locations
      )

      await loadLocations()
    } catch (
      error
    ) {
      toast.error(
        error instanceof Error
          ? error.message
          : "7shifts connection test failed"
      )
    } finally {
      setTesting(false)
    }
  }

  async function previewSync() {
    if (
      !selectedSource
    ) {
      return
    }

    setPreviewing(true)
    setSyncReport(null)
    setSyncPreview(null)

    try {
      const result =
        await previewAdminSevenShiftsApiSync({
          data: {
            sourceId:
              selectedSource.id
          }
        })

      setSyncPreview(
        result
      )

      toast.success(
        "Sync preview loaded"
      )
    } catch (
      error
    ) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to preview 7shifts synchronization"
      )
    } finally {
      setPreviewing(false)
    }
  }

  async function syncNow() {
    if (
      !selectedSource
    ) {
      return
    }

    setSyncing(true)
    setSyncPreview(null)
    setSyncReport(null)

    try {
      const result =
        await syncAdminSevenShiftsApiSource({
          data: {
            sourceId:
              selectedSource.id
          }
        })

      setSyncReport(
        result.report
      )

      toast.success(
        "7shifts synchronization completed"
      )

      await router.invalidate()
    } catch (
      error
    ) {
      toast.error(
        error instanceof Error
          ? error.message
          : "7shifts synchronization failed"
      )
    } finally {
      setSyncing(false)
    }
  }

  async function assignLocation({
    organizationId,
    sevenShiftsLocationId
  }: {
    organizationId: string
    sevenShiftsLocationId: number
  }) {
    if (
      !selectedSource
    ) {
      return
    }

    try {
      await assignAdminSevenShiftsApiLocation({
        data: {
          sourceId:
            selectedSource.id,
          organizationId,
          sevenShiftsLocationId
        }
      })

      toast.success(
        "7shifts location assigned"
      )

      await loadLocations()
      await router.invalidate()
    } catch (
      error
    ) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to assign 7shifts location"
      )
    }
  }

  async function unassignLocation({
    sevenShiftsLocationId
  }: {
    sevenShiftsLocationId: number
  }) {
    if (
      !selectedSource
    ) {
      return
    }

    setUnassigningLocationId(
      sevenShiftsLocationId
    )

    try {
      await unassignAdminSevenShiftsApiLocation({
        data: {
          sourceId:
            selectedSource.id,
          sevenShiftsLocationId
        }
      })

      toast.success(
        "7shifts location unassigned"
      )

      setSyncPreview(null)
      setSyncReport(null)

      await loadLocations()
      await router.invalidate()
    } catch (
      error
    ) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to unassign 7shifts location"
      )
    } finally {
      setUnassigningLocationId(
        null
      )
    }
  }

  async function deleteSource() {
    if (
      !selectedSource
    ) {
      return
    }

    if (
      selectedSource.organizationCount >
      0
    ) {
      toast.error(
        `Unassign the ${selectedSource.organizationCount} organization${selectedSource.organizationCount === 1 ? "" : "s"} using this API Source before deleting it.`
      )

      return
    }

    const deletedSourceId =
      selectedSource.id

    const nextSource =
      sources.find(
        (source) =>
          source.id !==
          deletedSourceId
      ) ??
      null

    setDeleting(true)

    try {
      const result =
        await deleteAdminSevenShiftsApiSource({
          data: {
            sourceId:
              deletedSourceId
          }
        })

      toast.success(
        `API Source "${result.source.name}" deleted`
      )

      setSelectedSourceId(
        nextSource?.id ??
        ""
      )

      setLocations([])
      setMappings([])
      setSyncPreview(null)
      setSyncReport(null)

      await router.invalidate()
    } catch (
      error
    ) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to delete API Source"
      )
    } finally {
      setDeleting(false)
    }
  }

  const busy =
    creating ||
    saving ||
    testing ||
    loadingLocations ||
    previewing ||
    syncing ||
    deleting ||
    unassigningLocationId !==
      null

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            API Sources
          </CardTitle>

          <CardDescription>
            Each API Source stores one 7shifts company connection and can provide workforce data to one or more organizations.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid gap-2">
            <Label>
              API Source
            </Label>

            <Select
              value={
                selectedSourceId
              }
              disabled={
                sources.length ===
                0
              }
              onValueChange={
                setSelectedSourceId
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an API Source" />
              </SelectTrigger>

              <SelectContent>
                {sources.map(
                  (source) => (
                    <SelectItem
                      key={
                        source.id
                      }
                      value={
                        source.id
                      }
                    >
                      {source.name}
                      {" · "}
                      {source.organizationCount}
                      {" "}
                      {source.organizationCount ===
                      1
                        ? "organization"
                        : "organizations"}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>

          {selectedSource && (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label
                    htmlFor="seven-shifts-api-source-name"
                  >
                    Source Name
                  </Label>

                  <Input
                    id="seven-shifts-api-source-name"
                    value={
                      sourceName
                    }
                    disabled={
                      busy
                    }
                    onChange={(
                      event
                    ) =>
                      setSourceName(
                        event.target.value
                      )
                    }
                  />
                </div>

                <div className="grid gap-2">
                  <Label
                    htmlFor="seven-shifts-api-version"
                  >
                    API Version
                  </Label>

                  <Input
                    id="seven-shifts-api-version"
                    value={
                      apiVersion
                    }
                    disabled={
                      busy
                    }
                    onChange={(
                      event
                    ) =>
                      setApiVersion(
                        event.target.value
                      )
                    }
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label
                  htmlFor="seven-shifts-api-token"
                >
                  Access Token
                </Label>

                <Input
                  id="seven-shifts-api-token"
                  type="password"
                  value={
                    accessToken
                  }
                  placeholder={
                    selectedSource.hasAccessToken
                      ? "Token stored — leave blank to keep current token"
                      : "7shifts Access Token"
                  }
                  disabled={
                    busy
                  }
                  onChange={(
                    event
                  ) =>
                    setAccessToken(
                      event.target.value
                    )
                  }
                />

                <p className="text-xs text-muted-foreground">
                  The stored token is encrypted and is never returned to the browser.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={
                    busy ||
                    !sourceName.trim()
                  }
                  onClick={() =>
                    void saveSource()
                  }
                >
                  <Save />

                  {saving
                    ? "Saving…"
                    : "Save"}
                </Button>

                <Button
                  type="button"
                  disabled={
                    busy
                  }
                  onClick={() =>
                    void testSource()
                  }
                >
                  <RefreshCw />

                  {testing
                    ? "Testing…"
                    : "Test Connection"}
                </Button>

                {selectedSource.companyName && (
                  <Badge variant="secondary">
                    {
                      selectedSource.companyName
                    }
                  </Badge>
                )}
              </div>

              <div className="grid gap-3 rounded-lg border p-4">
                <div className="grid gap-1">
                  <div className="text-sm font-medium">
                    Connection
                  </div>

                  <div className="text-sm text-muted-foreground">
                    {selectedSource.companyName
                      ? `${selectedSource.companyName} · Company ID ${selectedSource.companyId}`
                      : "Not tested yet"}
                  </div>
                </div>

                {selectedSource.lastTestedAt && (
                  <div className="text-xs text-muted-foreground">
                    Last tested{" "}
                    {new Date(
                      selectedSource.lastTestedAt
                    ).toLocaleString()}
                  </div>
                )}
              </div>

              <div className="text-xs text-muted-foreground">
                Last successful sync{" "}
                {selectedSource.lastSyncAt
                  ? new Date(
                      selectedSource.lastSyncAt
                    ).toLocaleString()
                  : "Never"}
              </div>

            {selectedSource.companyId !==
              null && (
              <div className="space-y-4 rounded-lg border p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                {(syncPreview || syncReport) && (
                  <div>
                    <div className="font-medium">
                      {syncReport
                        ? "Last Sync Result"
                        : "Synchronization Preview"}
                    </div>

                    <div className="text-sm text-muted-foreground">
                      {syncReport
                        ? `Completed ${new Date(
                            syncReport.completedAt
                          ).toLocaleString()}`
                        : "Read live 7shifts workforce data without changing Better Auth."}
                    </div>
                  </div>
                )}

                  <Button
                    type="button"
                    variant="outline"
                    disabled={
                      busy
                    }
                    onClick={() =>
                      void previewSync()
                    }
                  >
                    <RefreshCw />

                    {previewing
                      ? "Loading…"
                      : "Preview Sync"}
                  </Button>

                <Button
                  type="button"
                  disabled={
                    busy
                  }
                  onClick={() =>
                    void syncNow()
                  }
                >
                  <RefreshCw />

                  {syncing
                    ? "Syncing…"
                    : "Sync Now"}
                </Button>
                </div>

                {(previewing || syncing) && (
                  <div className="space-y-2">
                    <Progress
                      value={100}
                      className="h-1 [&>div]:animate-pulse"
                    />

                    <div className="text-xs text-muted-foreground">
                      {previewing
                        ? "Loading synchronization preview…"
                        : "Synchronizing with 7shifts…"}
                    </div>
                  </div>
                )}

                {syncPreview && (
                  <div className="space-y-4">
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      <PreviewValue
                        label="Mapped Organizations"
                        value={
                          syncPreview.counts.mappedOrganizations
                        }
                      />

                      <PreviewValue
                        label="Mapped Locations"
                        value={
                          syncPreview.counts.mappedLocations
                        }
                      />

                      <PreviewValue
                        label="Mapped Departments"
                        value={
                          syncPreview.counts.mappedDepartments
                        }
                      />

                      <PreviewValue
                        label="Mapped Roles"
                        value={
                          syncPreview.counts.mappedRoles
                        }
                      />

                      <PreviewValue
                        label="Company Users"
                        value={
                          syncPreview.counts.companyUsers
                        }
                      />

                      <PreviewValue
                        label="Active Users"
                        value={
                          syncPreview.counts.activeCompanyUsers
                        }
                      />

                      <PreviewValue
                        label="Inactive Users"
                        value={
                          syncPreview.counts.inactiveCompanyUsers
                        }
                      />
                    </div>

                    {syncPreview.userSample.length >
                      0 && (
                      <div className="space-y-2">
                        <div className="text-sm font-medium">
                          User Sample
                        </div>

                        <div className="divide-y rounded-lg border">
                          {syncPreview.userSample.map(
                            (user) => (
                              <div
                                key={
                                  user.id
                                }
                                className="flex flex-col gap-1 p-3 text-sm sm:flex-row sm:items-center sm:justify-between"
                              >
                                <div>
                                  <div className="font-medium">
                                    {user.first_name}
                                    {" "}
                                    {user.last_name}
                                  </div>

                                  <div className="text-xs text-muted-foreground">
                                    {user.email ??
                                      "No email"}
                                  </div>
                                </div>

                                <div className="text-xs text-muted-foreground">
                                  {user.employee_id
                                    ? "Employee ID " +
                                      user.employee_id
                                    : "No Employee ID"}
                                  {" · "}
                                  {user.active
                                    ? "Active"
                                    : "Inactive"}
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                </div>
              )}

              {syncReport && (
                <div className="space-y-4">
                <div className="flex justify-end">
  <Badge variant="secondary">
  {syncReport.usersManaged}
  {" users managed"}
  </Badge>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <PreviewValue
                    label="Users Seen"
                    value={
                      syncReport.usersSeen
                    }
                  />

                  <PreviewValue
                    label="Users Managed"
                    value={
                      syncReport.usersManaged
                    }
                  />

                  <PreviewValue
                    label="Users Created"
                    value={
                      syncReport.usersCreated
                    }
                  />

                  <PreviewValue
                    label="Users Updated"
                    value={
                      syncReport.usersUpdated
                    }
                  />

                  <PreviewValue
                    label="Pushed to 7shifts"
                    value={
                      syncReport.usersPushedToSevenShifts
                    }
                  />

                  <PreviewValue
                    label="Inactive Users"
                    value={
                      syncReport.usersDisabled
                    }
                  />

                  <PreviewValue
                    label="Memberships Created"
                    value={
                      syncReport.membershipsCreated
                    }
                  />

                  <PreviewValue
                    label="Assignments Created"
                    value={
                      syncReport.assignmentsCreated
                    }
                  />

                  <PreviewValue
                    label="Assignments Removed"
                    value={
                      syncReport.assignmentsRemoved
                    }
                  />
                </div>

                {syncReport.skippedWithoutEmail >
                  0 && (
                  <div className="text-sm text-muted-foreground">
                    {syncReport.skippedWithoutEmail}
                    {syncReport.skippedWithoutEmail ===
                    1
                      ? " user was skipped because no email address was available."
                      : " users were skipped because no email address was available."}
                  </div>
                )}

                <SyncChanges
                  changes={
                    syncReport.changes
                  }
                  usersSeen={
                    syncReport.usersSeen
                  }
                />

                {syncReport.generatedCredentials.length >
                  0 && (
                  <div className="space-y-3">
                    <div>
                      <div className="font-medium">
                        New User Credentials
                      </div>

                      <div className="text-sm text-muted-foreground">
                        Save these temporary credentials now. The passwords are only returned by this sync operation.
                      </div>
                    </div>

                    <div className="divide-y rounded-lg border">
                      {syncReport.generatedCredentials.map(
                        (credential) => (
                          <div
                            key={
                              credential.email
                            }
                            className="grid gap-3 p-3 text-sm md:grid-cols-2"
                          >
                            <div>
                              <div className="font-medium">
                                {credential.name}
                              </div>

                              <div className="text-xs text-muted-foreground">
                                {credential.email}
                              </div>
                            </div>

                            <div className="space-y-1 text-xs">
                              <div>
                                Username:{" "}
                                <span className="font-mono">
                                  {credential.username}
                                </span>
                              </div>

                              <div>
                                Password:{" "}
                                <span className="font-mono">
                                  {credential.password}
                                </span>
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
                  </div>
                )}
              </div>
            )}

              {selectedSource.companyId !==
                null && (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="font-medium">
                        7shifts Locations
                      </div>

                      <div className="text-sm text-muted-foreground">
                        Map each discovered 7shifts location to its Better Auth organization.
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      disabled={
                        busy
                      }
                      onClick={() =>
                        void loadLocations(
                          true
                        )
                      }
                    >
                      <RefreshCw />

                      {loadingLocations
                        ? "Refreshing…"
                        : "Refresh Locations"}
                    </Button>
                  </div>

                  {locations.length ===
                  0 ? (
                    <div className="rounded-lg border p-6 text-sm text-muted-foreground">
                      Refresh locations to load the locations available from this 7shifts company.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {locations.map(
                        (location) => {
                          const mapping =
                            mappings.find(
                              (item) =>
                                item.sevenShiftsLocationId ===
                                location.id
                            )

                          return (
                            <div
                              key={
                                location.id
                              }
                              className="grid gap-4 rounded-lg border p-4 md:grid-cols-[minmax(220px,1fr)_minmax(260px,360px)] md:items-center"
                            >
                              <div className="min-w-0">
                                <div className="font-medium">
                                  {
                                    location.name
                                  }
                                </div>

                                <div className="text-sm text-muted-foreground">
                                  Location ID{" "}
                                  {
                                    location.id
                                  }
                                </div>
                              </div>

                              <div className="flex flex-col gap-2 sm:flex-row">
                                <Select
                                  value={
                                    mapping?.organizationId ??
                                    ""
                                  }
                                  disabled={
                                    busy
                                  }
                                  onValueChange={(
                                    organizationId
                                  ) =>
                                    void assignLocation({
                                      organizationId,
                                      sevenShiftsLocationId:
                                        location.id
                                    })
                                  }
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Assign organization" />
                                  </SelectTrigger>

                                  <SelectContent>
                                    {organizations.map(
                                      (
                                        organization
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
                                      )
                                    )}
                                  </SelectContent>
                                </Select>

                                {mapping && (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    disabled={
                                      busy
                                    }
                                    onClick={() =>
                                      void unassignLocation({
                                        sevenShiftsLocationId:
                                          location.id
                                      })
                                    }
                                  >
                                    <Unlink />

                                    {unassigningLocationId ===
                                    location.id
                                      ? "Unassigning…"
                                      : "Unassign"}
                                  </Button>
                                )}
                              </div>
                            </div>
                          )
                        }
                      )}
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {selectedSource && (
            <div className="border-t pt-6">
              <div className="rounded-lg border border-destructive/30 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="grid gap-1">
                    <div className="font-medium">
                      Delete API Source
                    </div>

                    <div className="text-sm text-muted-foreground">
                      {selectedSource.organizationCount >
                      0
                        ? `Unassign ${selectedSource.organizationCount} organization${selectedSource.organizationCount === 1 ? "" : "s"} before this API Source can be deleted.`
                        : "Permanently delete this API Source and its stored connection credentials."}
                    </div>
                  </div>

                  <AlertDialog>
                    <AlertDialogTrigger
                      asChild
                    >
                      <Button
                        type="button"
                        variant="destructive"
                        disabled={
                          busy ||
                          selectedSource.organizationCount >
                            0
                        }
                      >
                        <Trash2 />

                        Delete API Source
                      </Button>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Delete {selectedSource.name}?
                        </AlertDialogTitle>

                        <AlertDialogDescription>
                          This permanently deletes the API Source and its stored 7shifts connection credentials. Previously synchronized Better Auth users and workforce records are not deleted. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <AlertDialogFooter>
                        <AlertDialogCancel
                          disabled={
                            deleting
                          }
                        >
                          Cancel
                        </AlertDialogCancel>

                        <AlertDialogAction
                          variant="destructive"
                          disabled={
                            deleting
                          }
                          onClick={() =>
                            void deleteSource()
                          }
                        >
                          <Trash2 />

                          {deleting
                            ? "Deleting…"
                            : "Delete API Source"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          )}

          <div className="border-t pt-6">
            <div className="mb-4">
              <div className="font-medium">
                Add API Source
              </div>

              <div className="text-sm text-muted-foreground">
                Create a 7shifts company connection using an Access Token.
              </div>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label
                  htmlFor="seven-shifts-new-api-source"
                >
                  Source Name
                </Label>

                <Input
                  id="seven-shifts-new-api-source"
                  value={
                    newSourceName
                  }
                  placeholder="Example: ASH Bars"
                  disabled={
                    busy
                  }
                  onChange={(
                    event
                  ) =>
                    setNewSourceName(
                      event.target.value
                    )
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label
                  htmlFor="seven-shifts-new-api-token"
                >
                  Access Token
                </Label>

                <Input
                  id="seven-shifts-new-api-token"
                  type="password"
                  value={
                    newAccessToken
                  }
                  placeholder="7shifts Access Token"
                  disabled={
                    busy
                  }
                  onChange={(
                    event
                  ) =>
                    setNewAccessToken(
                      event.target.value
                    )
                  }
                />
              </div>

              <div>
                <Button
                  type="button"
                  disabled={
                    busy ||
                    !newSourceName.trim() ||
                    !newAccessToken.trim()
                  }
                  onClick={() =>
                    void createSource()
                  }
                >
                  <Plus />

                  {creating
                    ? "Adding…"
                    : "Add API Source"}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function SyncChanges({
  changes,
  usersSeen
}: {
  changes: SevenShiftsApiSyncChange[]
  usersSeen: number
}) {
  const userIds =
    Array.from(
      new Set(
        changes.map(
          (change) =>
            change.userId
        )
      )
    )

  if (
    changes.length ===
    0
  ) {
    return (
      <div className="space-y-2">
        <div className="font-medium">
          Changes
        </div>

        <div className="rounded-lg border p-4 text-sm text-muted-foreground">
          {usersSeen}
          {" users checked · No changes"}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="font-medium">
          Changes
        </div>

        <Badge variant="secondary">
          {usersSeen}
          {" users checked · "}
          {changes.length}
          {" "}
          {changes.length ===
          1
            ? "change"
            : "changes"}
          {" across "}
          {userIds.length}
          {" "}
          {userIds.length ===
          1
            ? "user"
            : "users"}
        </Badge>
      </div>

      <div className="space-y-3">
        {userIds.map(
          (userId) => {
            const userChanges =
              changes.filter(
                (change) =>
                  change.userId ===
                  userId
              )

            const userName =
              userChanges[0]
                ?.userName ??
              userId

            return (
              <div
                key={
                  userId
                }
                className="rounded-lg border"
              >
                <div className="border-b px-4 py-3 font-medium">
                  {userName}
                </div>

                <div className="space-y-4 p-4">
                  {(
                    [
                      "Account",
                      "Organizations"
                    ] as const
                  ).map(
                    (
                      section
                    ) => {
                      const sectionChanges =
                        userChanges.filter(
                          (
                            change
                          ) =>
                            change.section ===
                            section
                        )

                      if (
                        sectionChanges.length ===
                        0
                      ) {
                        return null
                      }

                      return (
                        <div
                          key={
                            section
                          }
                          className="space-y-2"
                        >
                          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            {
                              section
                            }
                          </div>

                          <div className="space-y-1 font-mono text-sm">
                            {sectionChanges.map(
                              (
                                change,
                                index
                              ) => (
                                <div
                                  key={
                                    change.label +
                                    String(
                                      index
                                    )
                                  }
                                  className="space-y-1"
                                >
                                  {change.before !==
                                    null && (
                                    <div>
                                      <span className="mr-2 text-destructive">
                                        -
                                      </span>

                                      <span>
                                        {
                                          change.label
                                        }
                                        {": "}
                                        {
                                          change.before
                                        }
                                      </span>
                                    </div>
                                  )}

                                  {change.after !==
                                    null && (
                                    <div>
                                      <span className="mr-2 text-emerald-600 dark:text-emerald-400">
                                        +
                                      </span>

                                      <span>
                                        {
                                          change.label
                                        }
                                        {": "}
                                        {
                                          change.after
                                        }
                                      </span>
                                    </div>
                                  )}
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )
                    }
                  )}
                </div>
              </div>
            )
          }
        )}
      </div>
    </div>
  )
}

function PreviewValue({
  label,
  value
}: {
  label: string
  value: number
}) {
  return (
    <div className="rounded-lg border p-3">
      <div className="text-xs text-muted-foreground">
        {label}
      </div>

      <div className="mt-1 text-xl font-semibold">
        {value}
      </div>
    </div>
  )
}
