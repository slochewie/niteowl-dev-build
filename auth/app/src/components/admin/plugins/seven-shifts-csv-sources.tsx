"use client"

import {
  Plus,
  Save,
  Trash2
} from "lucide-react"
import {
  useEffect,
  useMemo,
  useState
} from "react"
import {
  useRouter
} from "@tanstack/react-router"
import { toast } from "sonner"

import {
  SevenShiftsCsvImportCard
} from "@/components/admin/plugins/seven-shifts-csv-import-card"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"

import {
  createAdminSevenShiftsCsvSource,
  deleteAdminSevenShiftsCsvSource,
  renameAdminSevenShiftsCsvSource,
  type AdminSevenShiftsCsvSource
} from "@/lib/admin/plugins"

export function SevenShiftsCsvSources({
  sources
}: {
  sources:
    AdminSevenShiftsCsvSource[]
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
    newSourceName,
    setNewSourceName
  ] = useState("")

  const [
    saving,
    setSaving
  ] = useState(false)

  const [
    creating,
    setCreating
  ] = useState(false)

  const [
    deleting,
    setDeleting
  ] = useState(false)

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
    },
    [
      selectedSource
    ]
  )

  async function createSource() {
    const name =
      newSourceName.trim()

    if (!name) {
      toast.error(
        "Enter a CSV Source name"
      )

      return
    }

    setCreating(true)

    try {
      const result =
        await createAdminSevenShiftsCsvSource({
          data: {
            name
          }
        })

      setSelectedSourceId(
        result.source.id
      )

      setNewSourceName(
        ""
      )

      toast.success(
        `CSV Source "${result.source.name}" created`
      )

      await router.invalidate()
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to create CSV Source"
      )
    } finally {
      setCreating(false)
    }
  }

  async function renameSource() {
    if (
      !selectedSource
    ) {
      return
    }

    const name =
      sourceName.trim()

    if (!name) {
      toast.error(
        "CSV Source name cannot be empty"
      )

      return
    }

    if (
      name ===
      selectedSource.name
    ) {
      return
    }

    setSaving(true)

    try {
      const result =
        await renameAdminSevenShiftsCsvSource({
          data: {
            sourceId:
              selectedSource.id,
            name
          }
        })

      toast.success(
        `CSV Source renamed to "${result.source.name}"`
      )

      await router.invalidate()
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to rename CSV Source"
      )
    } finally {
      setSaving(false)
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
        `Reassign the ${selectedSource.organizationCount} organization${selectedSource.organizationCount === 1 ? "" : "s"} using this CSV Source before deleting it.`
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
        await deleteAdminSevenShiftsCsvSource({
          data: {
            sourceId:
              deletedSourceId
          }
        })

      toast.success(
        `CSV Source "${result.source.name}" deleted`
      )

      setSelectedSourceId(
        nextSource?.id ??
        ""
      )

      await router.invalidate()
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to delete CSV Source"
      )
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            CSV Sources
          </CardTitle>

          <CardDescription>
            Each CSV Source has its own uploaded-file history and selected CSV, and can feed one or more organizations.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid gap-2">
            <Label>
              CSV Source
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
                <SelectValue placeholder="Select a CSV Source" />
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
            <div className="grid gap-2">
              <Label
                htmlFor="seven-shifts-csv-source-name"
              >
                Source Name
              </Label>

              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  id="seven-shifts-csv-source-name"
                  value={
                    sourceName
                  }
                  disabled={
                    saving ||
                    creating
                  }
                  onChange={(
                    event
                  ) =>
                    setSourceName(
                      event.target.value
                    )
                  }
                />

                <Button
                  type="button"
                  variant="outline"
                  disabled={
                    saving ||
                    creating ||
                    !sourceName.trim() ||
                    sourceName.trim() ===
                      selectedSource.name
                  }
                  onClick={() =>
                    void renameSource()
                  }
                >
                  <Save />

                  {saving
                    ? "Saving…"
                    : "Rename"}
                </Button>
              </div>
            </div>
          )}

          <div className="grid gap-2">
            <Label
              htmlFor="seven-shifts-new-csv-source"
            >
              Add CSV Source
            </Label>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                id="seven-shifts-new-csv-source"
                value={
                  newSourceName
                }
                placeholder="CSV Source name"
                disabled={
                  creating ||
                  saving
                }
                onChange={(
                  event
                ) =>
                  setNewSourceName(
                    event.target.value
                  )
                }
                onKeyDown={(
                  event
                ) => {
                  if (
                    event.key ===
                    "Enter"
                  ) {
                    event.preventDefault()

                    void createSource()
                  }
                }}
              />

              <Button
                type="button"
                disabled={
                  creating ||
                  saving ||
                  !newSourceName.trim()
                }
                onClick={() =>
                  void createSource()
                }
              >
                <Plus />

                {creating
                  ? "Adding…"
                  : "Add CSV Source"}
              </Button>
            </div>
          </div>

          {selectedSource && (
            <div className="border-t pt-6">
              <div className="space-y-3">
                <div>
                  <div className="font-medium">
                    Delete CSV Source
                  </div>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {selectedSource.organizationCount >
                    0
                      ? `This CSV Source is assigned to ${selectedSource.organizationCount} organization${selectedSource.organizationCount === 1 ? "" : "s"}. Reassign them before deleting this source.`
                      : "Permanently delete this CSV Source and its uploaded CSV file history."}
                  </p>
                </div>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      type="button"
                      variant="destructive"
                      disabled={
                        deleting ||
                        saving ||
                        creating ||
                        selectedSource.organizationCount >
                          0
                      }
                    >
                      <Trash2 />

                      Delete CSV Source
                    </Button>
                  </AlertDialogTrigger>

                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Delete {selectedSource.name}?
                      </AlertDialogTitle>

                      <AlertDialogDescription>
                        This permanently deletes the CSV Source and all CSV files stored for it. This action cannot be undone.
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
                          : "Delete CSV Source"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedSource && (
        <SevenShiftsCsvImportCard
          sourceId={
            selectedSource.id
          }
          sourceName={
            selectedSource.name
          }
        />
      )}
    </div>
  )
}
