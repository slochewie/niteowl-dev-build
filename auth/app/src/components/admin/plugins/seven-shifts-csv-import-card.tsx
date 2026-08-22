"use client"

import {
  CheckCircle2,
  FileSpreadsheet,
  Loader2,
  Upload
} from "lucide-react"
import {
  useCallback,
  useEffect,
  useRef,
  useState
} from "react"
import { toast } from "sonner"

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

type StoredCsvFile = {
  id: string
  originalName: string
  storedName: string
  size: number
  uploadedAt: string
}

type FilesResponse = {
  files?: StoredCsvFile[]
  selectedFileId?:
    | string
    | null
  error?: string
  message?: string
}

type UploadResponse = {
  file?: StoredCsvFile
  selectedFileId?: string
  error?: string
  message?: string
}

type SelectResponse = {
  selectedFileId?: string
  error?: string
  message?: string
}

type ImportReport = {
  fileId: string
  fileName: string

  sourceRows: number
  applicableRows: number
  ignoredRows: number
  skippedWithoutEmail: number

  employeesSeen: number
  usersCreated: number
  usersUpdated: number

  assignmentsCreated: number
  assignmentsRemoved: number

  membershipsCreated: number
  membershipsRemoved: number

  usersDisabled: number
  disabledEmployees: number

  generatedPasswordFile:
    | string
    | null

  completedAt: string
}

type ImportResponse = {
  report?: ImportReport
  error?: string
  message?: string
}

async function readResponse<T>(
  response: Response
): Promise<T> {
  const text =
    await response.text()

  if (!text) {
    throw new Error(
      `Server returned HTTP ${response.status} ${response.statusText || ""} with an empty response body`.trim()
    )
  }

  try {
    return JSON.parse(
      text
    ) as T
  } catch {
    throw new Error(
      `Server returned HTTP ${response.status} ${response.statusText || ""}: ${text}`.trim()
    )
  }
}

export function SevenShiftsCsvImportCard({
  sourceId,
  sourceName
}: {
  sourceId: string
  sourceName?: string
}) {
  const fileInputRef =
    useRef<HTMLInputElement>(
      null
    )

  const [
    files,
    setFiles
  ] = useState<
    StoredCsvFile[]
  >([])

  const [
    selectedFileId,
    setSelectedFileId
  ] = useState("")

  const [
    loading,
    setLoading
  ] = useState(true)

  const [
    uploadProgress,
    setUploadProgress
  ] = useState(0)

  const [
    uploading,
    setUploading
  ] = useState(false)

  const [
    selecting,
    setSelecting
  ] = useState(false)

  const [
    importing,
    setImporting
  ] = useState(false)

  const [
    importProgress,
    setImportProgress
  ] = useState(0)

  const [
    report,
    setReport
  ] =
    useState<ImportReport | null>(
      null
    )

  const [
    status,
    setStatus
  ] = useState(
    "Select or upload a CSV file."
  )

  const loadFiles =
    useCallback(async () => {
      setLoading(true)

      try {
        const params =
          new URLSearchParams({
            sourceId
          })

        const response =
          await fetch(
            `/api/auth/seven-shifts-csv/files?${params.toString()}`,
            {
              credentials:
                "include"
            }
          )

        const data =
          await readResponse<FilesResponse>(
            response
          )

        if (!response.ok) {
          throw new Error(
            data.error ??
              data.message ??
              `Unable to load CSV files (HTTP ${response.status})`
          )
        }

        const nextFiles =
          data.files ?? []

        setFiles(
          nextFiles
        )

        const nextSelected =
          data.selectedFileId ??
          nextFiles[0]?.id ??
          ""

        setSelectedFileId(
          nextSelected
        )

        if (
          nextFiles.length ===
          0
        ) {
          setStatus(
            "No CSV files uploaded yet."
          )
        } else {
          const selected =
            nextFiles.find(
              (file) =>
                file.id ===
                nextSelected
            )

          if (selected) {
            setStatus(
              `${selected.originalName} selected.`
            )
          }
        }
      } catch (error) {
        setFiles([])
        setSelectedFileId("")

        const message =
          error instanceof Error
            ? error.message
            : "Unable to load CSV files"

        setStatus(
          message
        )

        toast.error(
          message
        )
      } finally {
        setLoading(false)
      }
    }, [
      sourceId
    ])

  useEffect(() => {
    void loadFiles()
  }, [loadFiles])

  async function uploadFile(
    file: File
  ) {
    if (
      !file.name
        .toLowerCase()
        .endsWith(".csv")
    ) {
      toast.error(
        "Select a CSV file"
      )

      return
    }



    setUploading(true)
    setUploadProgress(10)
    setReport(null)

    setStatus(
      `Reading ${file.name}…`
    )

    try {
      const content =
        await file.text()

      setUploadProgress(40)

      setStatus(
        `Uploading ${file.name}…`
      )

      const response =
        await fetch(
          "/api/auth/seven-shifts-csv/upload",
          {
            method: "POST",
            credentials:
              "include",
            headers: {
              "Content-Type":
                "application/json"
            },
            body:
              JSON.stringify({
                sourceId,

                fileName:
                  file.name,

                content
              })
          }
        )

      setUploadProgress(80)

      const data =
        await readResponse<UploadResponse>(
          response
        )

      if (
        !response.ok ||
        !data.file
      ) {
        throw new Error(
          data.error ??
            data.message ??
            `Unable to upload CSV (HTTP ${response.status})`
        )
      }

      setUploadProgress(100)

      toast.success(
        "CSV uploaded"
      )

      await loadFiles()

      setSelectedFileId(
        data.selectedFileId ??
          data.file.id
      )

      setStatus(
        `${data.file.originalName} uploaded and selected.`
      )
    } catch (error) {
      setUploadProgress(0)

      const message =
        error instanceof Error
          ? error.message
          : "Unable to upload CSV"

      setStatus(
        message
      )

      toast.error(
        message
      )
    } finally {
      setUploading(false)

      if (
        fileInputRef.current
      ) {
        fileInputRef.current.value =
          ""
      }
    }
  }

  async function selectFile(
    fileId: string
  ) {

    const previous =
      selectedFileId

    setSelectedFileId(
      fileId
    )

    setSelecting(true)
    setReport(null)

    try {
      const response =
        await fetch(
          "/api/auth/seven-shifts-csv/select",
          {
            method:
              "POST",
            credentials:
              "include",
            headers: {
              "Content-Type":
                "application/json"
            },
            body:
              JSON.stringify({
                sourceId,
                fileId
              })
          }
        )

      const data =
        await readResponse<SelectResponse>(
          response
        )

      if (
        !response.ok ||
        !data.selectedFileId
      ) {
        throw new Error(
          data.error ??
            data.message ??
            "Unable to select CSV"
        )
      }

      const file =
        files.find(
          (item) =>
            item.id ===
            fileId
        )

      if (file) {
        setStatus(
          `${file.originalName} selected.`
        )
      }
    } catch (error) {
      setSelectedFileId(
        previous
      )

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to select CSV"
      )
    } finally {
      setSelecting(false)
    }
  }

  async function runImport() {
    if (
      !selectedFileId
    ) {
      return
    }


    setImporting(true)
    setImportProgress(15)
    setReport(null)

    const selected =
      files.find(
        (file) =>
          file.id ===
          selectedFileId
      )

    setStatus(
      `Preparing ${selected?.originalName ?? "CSV"}…`
    )

    try {
      setImportProgress(35)

      const request =
        fetch(
          "/api/auth/seven-shifts-csv/import",
          {
            method:
              "POST",
            credentials:
              "include",
            headers: {
              "Content-Type":
                "application/json"
            },
            body:
              JSON.stringify({
                sourceId
              })
          }
        )

      setImportProgress(60)

      setStatus(
        "Importing users, assignments, and organization memberships…"
      )

      const response =
        await request

      setImportProgress(90)

      const data =
        await readResponse<ImportResponse>(
          response
        )

      if (
        !response.ok ||
        !data.report
      ) {
        throw new Error(
          data.error ??
            data.message ??
            `Import failed (HTTP ${response.status})`
        )
      }

      setReport(
        data.report
      )

      setImportProgress(
        100
      )

      setStatus(
        `${data.report.fileName} imported successfully.`
      )

      toast.success(
        "7shifts CSV import completed"
      )
    } catch (error) {
      setImportProgress(0)

      const message =
        error instanceof Error
          ? error.message
          : "7shifts CSV import failed"

      setStatus(
        message
      )

      toast.error(
        message
      )
    } finally {
      setImporting(false)
    }
  }

  const selectedFile =
    files.find(
      (file) =>
        file.id ===
        selectedFileId
    )

  const title =
    `${sourceName ?? "CSV"} CSV Source`

  const description =
    `Upload and import workforce data for organizations assigned to ${sourceName ?? "this CSV Source"}.`

  const busy =
    loading ||
    uploading ||
    selecting ||
    importing

  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle>
          {title}
        </CardTitle>

        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>

      <CardContent className="min-w-0 space-y-6">
        <div className="grid min-w-0 gap-2">
          <Label
            htmlFor={`seven-shifts-csv-${sourceId}`}
          >
            Upload CSV
          </Label>

          <div className="flex min-w-0 flex-col gap-2 sm:flex-row">
            <Input
              ref={
                fileInputRef
              }
              id={`seven-shifts-csv-${sourceId}`}
              type="file"
              accept=".csv,text/csv"
              disabled={
                busy
              }
              className="min-w-0 flex-1"
              onChange={(
                event
              ) => {
                const file =
                  event
                    .target
                    .files?.[0]

                if (file) {
                  void uploadFile(
                    file
                  )
                }
              }}
            />

            <Button
              type="button"
              variant="outline"
              className="shrink-0"
              disabled={
                busy
              }
              onClick={() =>
                fileInputRef
                  .current
                  ?.click()
              }
            >
              <Upload />

              Browse
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            CSV files up to 10 MB. A newly uploaded file becomes the selected import source.
          </p>
        </div>

        {(uploading ||
          uploadProgress >
            0) && (
          <div className="min-w-0 space-y-2">
            <Progress
              value={
                uploadProgress
              }
            />

            {uploading && (
              <div className="truncate text-xs text-muted-foreground">
                {status}
              </div>
            )}
          </div>
        )}

        <div className="grid min-w-0 gap-2">
          <Label>
            Uploaded CSV
          </Label>

          <Select
            value={
              selectedFileId
            }
            disabled={
              busy ||
              files.length ===
                0
            }
            onValueChange={(
              value
            ) =>
              void selectFile(
                value
              )
            }
          >
            <SelectTrigger className="min-w-0 w-full overflow-hidden">
              <SelectValue
                className="min-w-0 truncate"
                placeholder={
                  loading
                    ? "Loading CSV files…"
                    : "Select an uploaded CSV"
                }
              />
            </SelectTrigger>

            <SelectContent className="max-w-[calc(100vw-2rem)]">
              {files.map(
                (file) => (
                  <SelectItem
                    key={
                      file.id
                    }
                    value={
                      file.id
                    }
                    className="min-w-0"
                  >
                    <span className="block max-w-[70vw] truncate sm:max-w-[32rem]">
                      {
                        file.originalName
                      }
                      {" · "}
                      {
                        formatUploadedAt(
                          file.uploadedAt
                        )
                      }
                    </span>
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </div>

        {selectedFile ? (
          <div className="flex min-w-0 items-start gap-3 overflow-hidden rounded-lg border p-4">
            <FileSpreadsheet className="mt-0.5 size-5 shrink-0 text-muted-foreground" />

            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium">
                {
                  selectedFile.originalName
                }
              </div>

              <div className="mt-1 truncate text-xs text-muted-foreground">
                {
                  formatFileSize(
                    selectedFile.size
                  )
                }
                {" · Uploaded "}
                {
                  formatUploadedAt(
                    selectedFile.uploadedAt
                  )
                }
              </div>
            </div>

            <Badge
              variant="secondary"
              className="shrink-0"
            >
              Selected
            </Badge>
          </div>
        ) : (
          <div className="min-w-0 rounded-lg border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
            {loading
              ? "Loading CSV files…"
              : status}
          </div>
        )}

        <div className="space-y-3">
          <Button
            type="button"
            disabled={
              busy ||
              !selectedFile
            }
            onClick={() =>
              void runImport()
            }
          >
            {importing ? (
              <>
                <Loader2 className="animate-spin" />
                Importing…
              </>
            ) : (
              "Run Import"
            )}
          </Button>

          {importing && (
            <div className="space-y-2">
              <Progress
                value={
                  importProgress
                }
              />

              <p className="text-xs text-muted-foreground">
                {status}
              </p>
            </div>
          )}
        </div>

        {report && (
          <div className="space-y-4 rounded-lg border p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-muted-foreground" />

              <div>
                <div className="font-medium">
                  Import completed
                </div>

                <p className="mt-1 text-sm text-muted-foreground">
                  {report.fileName}
                  {" · "}
                  {formatUploadedAt(
                    report.completedAt
                  )}
                </p>
              </div>
            </div>

            <div className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
              <ReportValue
                label="CSV Rows"
                value={
                  report.sourceRows
                }
              />

              <ReportValue
                label="Imported Rows"
                value={
                  report.applicableRows
                }
              />

              <ReportValue
                label="Ignored Rows"
                value={
                  report.ignoredRows
                }
              />

              <ReportValue
                label="Employees"
                value={
                  report.employeesSeen
                }
              />

              <ReportValue
                label="New Users"
                value={
                  report.usersCreated
                }
              />

              <ReportValue
                label="Updated Users"
                value={
                  report.usersUpdated
                }
              />

              <ReportValue
                label="Assignments"
                value={
                  report.assignmentsCreated
                }
              />

              <ReportValue
                label="Memberships Added"
                value={
                  report.membershipsCreated
                }
              />

              <ReportValue
                label="Memberships Removed"
                value={
                  report.membershipsRemoved
                }
              />

              <ReportValue
                label="Users Disabled"
                value={
                  report.usersDisabled
                }
              />

              <ReportValue
                label="Disabled Employees"
                value={
                  report.disabledEmployees
                }
              />

              {report.skippedWithoutEmail >
                0 && (
                <ReportValue
                  label="Missing Email"
                  value={
                    report.skippedWithoutEmail
                  }
                />
              )}
            </div>

            {report.generatedPasswordFile && (
              <p className="text-xs text-muted-foreground">
                Temporary credentials for newly created users were written to a protected server-side CSV for this CSV Source.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function ReportValue({
  label,
  value
}: {
  label: string
  value: number
}) {
  return (
    <div className="rounded-md bg-muted/40 px-3 py-2">
      <div className="text-xs text-muted-foreground">
        {label}
      </div>

      <div className="mt-1 font-medium tabular-nums">
        {value}
      </div>
    </div>
  )
}

function formatUploadedAt(
  value: string
) {
  return new Intl.DateTimeFormat(
    undefined,
    {
      dateStyle: "medium",
      timeStyle: "short"
    }
  ).format(
    new Date(value)
  )
}

function formatFileSize(
  bytes: number
) {
  if (
    bytes <
    1024
  ) {
    return `${bytes} B`
  }

  if (
    bytes <
    1024 * 1024
  ) {
    return `${(
      bytes / 1024
    ).toFixed(1)} KB`
  }

  return `${(
    bytes /
    (1024 * 1024)
  ).toFixed(1)} MB`
}
