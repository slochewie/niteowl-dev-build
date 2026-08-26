"use client";

import {
  Building2,
  Plus,
  RefreshCw,
  ServerCog,
  Settings2,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  createAdminGlauthSource,
  deleteAdminGlauthSource,
  reconcileAdminGlauthSource,
  setAdminGlauthOrganizationSource,
  updateAdminGlauthSource,
  type AdminGlauthSource,
  type AdminPluginOrganization,
} from "@/lib/admin/plugins";

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function GlauthSources({
  sources,
  organizations,
}: {
  sources: AdminGlauthSource[];
  organizations: AdminPluginOrganization[];
}) {
  const router = useRouter();

  const [pendingOrganizationId, setPendingOrganizationId] = useState<
    string | null
  >(null);

  const [createOpen, setCreateOpen] = useState(false);

  const [sourceName, setSourceName] = useState("");

  const [sourceSlug, setSourceSlug] = useState("");

  const [slugWasEdited, setSlugWasEdited] = useState(false);

  const [creating, setCreating] = useState(false);

  const [reconcilingSourceId, setReconcilingSourceId] = useState<string | null>(
    null,
  );

  const [editingSource, setEditingSource] = useState<AdminGlauthSource | null>(
    null,
  );

  const [togglingSourceId, setTogglingSourceId] = useState<string | null>(null);

  const [deletingSourceId, setDeletingSourceId] = useState<string | null>(null);

  const [savingSource, setSavingSource] = useState(false);

  const effectiveSlug = useMemo(
    () => (slugWasEdited ? sourceSlug : slugify(sourceName)),
    [sourceName, sourceSlug, slugWasEdited],
  );

  async function createSource() {
    const name = sourceName.trim();

    const slug = effectiveSlug.trim();

    if (!name) {
      toast.error("Source name is required");
      return;
    }

    if (!slug) {
      toast.error("Source slug is required");
      return;
    }

    setCreating(true);

    try {
      await createAdminGlauthSource({
        data: {
          name,
          slug,
        },
      });

      toast.success("GLAuth source created");

      setSourceName("");
      setSourceSlug("");
      setSlugWasEdited(false);
      setCreateOpen(false);

      await router.invalidate();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to create GLAuth source",
      );
    } finally {
      setCreating(false);
    }
  }

  async function saveSourceSettings() {
    if (!editingSource) {
      return;
    }

    setSavingSource(true);

    try {
      await updateAdminGlauthSource({
        data: {
          sourceId: editingSource.id,
          name: editingSource.name,
          uidStart: editingSource.uidStart,
          gidNumber: editingSource.gidNumber,
          userGroupName: editingSource.userGroupName,
          enabled: editingSource.enabled,
        },
      });

      toast.success("GLAuth source updated");

      setEditingSource(null);

      await router.invalidate();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to update GLAuth source",
      );
    } finally {
      setSavingSource(false);
    }
  }

  async function deleteSource(source: AdminGlauthSource) {
    const confirmed = window.confirm(
      `Delete "${source.name}"? This permanently removes the GLAuth source, projected directory data, service accounts, runtime schema, and runtime container.`,
    );

    if (!confirmed) {
      return;
    }

    setDeletingSourceId(source.id);

    try {
      await deleteAdminGlauthSource({
        data: {
          sourceId: source.id,
        },
      });

      toast.success("GLAuth source deleted");

      await router.invalidate();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to delete GLAuth source",
      );
    } finally {
      setDeletingSourceId(null);
    }
  }

  async function toggleSourceEnabled(source: AdminGlauthSource) {
    setTogglingSourceId(source.id);

    try {
      await updateAdminGlauthSource({
        data: {
          sourceId: source.id,
          name: source.name,
          uidStart: source.uidStart,
          gidNumber: source.gidNumber,
          userGroupName: source.userGroupName,
          enabled: !source.enabled,
        },
      });

      toast.success(
        source.enabled ? "GLAuth source disabled" : "GLAuth source enabled",
      );

      await router.invalidate();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to update GLAuth source",
      );
    } finally {
      setTogglingSourceId(null);
    }
  }

  async function reconcileSource(sourceId: string) {
    setReconcilingSourceId(sourceId);

    try {
      const result = await reconcileAdminGlauthSource({
        data: {
          sourceId,
        },
      });

      toast.success(
        `${result.sourceName}: ${result.users} users projected, ${result.disabled} disabled`,
      );

      await router.invalidate();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to reconcile GLAuth source",
      );
    } finally {
      setReconcilingSourceId(null);
    }
  }

  async function assignSource(organizationId: string, value: string) {
    setPendingOrganizationId(organizationId);

    try {
      await setAdminGlauthOrganizationSource({
        data: {
          organizationId,

          sourceId: value === "none" ? null : value,
        },
      });

      toast.success("GLAuth source updated");

      await router.invalidate();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to update GLAuth source",
      );
    } finally {
      setPendingOrganizationId(null);
    }
  }

  function sourceForOrganization(organizationId: string) {
    return (
      sources.find((source) =>
        source.organizationIds.includes(organizationId),
      ) ?? null
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle>GLAuth Sources</CardTitle>

              <CardDescription className="mt-1">
                Each source represents an LDAP directory. A source can serve one
                Better Auth organization or multiple related organizations.
              </CardDescription>
            </div>

            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 size-4" />
                  Add Source
                </Button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add GLAuth Source</DialogTitle>

                  <DialogDescription>
                    Create an LDAP directory source that can be assigned to one
                    or more Better Auth organizations.
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-2">
                  <div className="grid gap-2">
                    <Label htmlFor="glauth-source-name">Name</Label>

                    <Input
                      id="glauth-source-name"
                      value={sourceName}
                      onChange={(event) => setSourceName(event.target.value)}
                      placeholder="ASH Bars Directory"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="glauth-source-slug">Slug</Label>

                    <Input
                      id="glauth-source-slug"
                      value={effectiveSlug}
                      onChange={(event) => {
                        setSlugWasEdited(true);

                        setSourceSlug(slugify(event.target.value));
                      }}
                      placeholder="ash-bars"
                    />

                    <p className="text-xs text-muted-foreground">
                      LDAP base:{" "}
                      <span className="font-mono">
                        ou={effectiveSlug || "source-slug"},dc=niteowl,dc=dev
                      </span>
                    </p>
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setCreateOpen(false)}
                    disabled={creating}
                  >
                    Cancel
                  </Button>

                  <Button
                    onClick={() => void createSource()}
                    disabled={creating}
                  >
                    {creating ? "Creating..." : "Create Source"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {sources.length === 0 ? (
            <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
              No GLAuth sources configured.
            </div>
          ) : (
            sources.map((source) => (
              <div
                key={source.id}
                className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted">
                  <ServerCog className="size-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="font-medium">{source.name}</div>

                    <Badge
                      variant={
                        !source.enabled
                          ? "secondary"
                          : source.runtimeStatus === "ready"
                            ? "default"
                            : source.runtimeStatus === "error"
                              ? "destructive"
                              : "secondary"
                      }
                      className="capitalize"
                    >
                      {source.enabled ? source.runtimeStatus : "disabled"}
                    </Badge>

                    {source.runtimePort ? (
                      <Badge variant="outline">
                        LDAP :{source.runtimePort}
                      </Badge>
                    ) : null}
                  </div>

                  <div className="truncate font-mono text-xs text-muted-foreground">
                    {source.baseDn}
                  </div>

                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span>{source.projectedUsers} projected</span>

                    <span>{source.activeUsers} active</span>

                    <span>{source.disabledUsers} disabled</span>

                    <span>
                      {source.lastReconciledAt
                        ? `Last reconciled ${new Date(
                            source.lastReconciledAt,
                          ).toLocaleString()}`
                        : "Never reconciled"}
                    </span>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <Badge variant="secondary">
                    {source.organizationIds.length} organizations
                  </Badge>

                  <Button
                    variant={source.enabled ? "outline" : "default"}
                    size="sm"
                    disabled={togglingSourceId !== null}
                    onClick={() => void toggleSourceEnabled(source)}
                  >
                    {togglingSourceId === source.id
                      ? source.enabled
                        ? "Disabling..."
                        : "Enabling..."
                      : source.enabled
                        ? "Disable"
                        : "Enable"}
                  </Button>

                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={
                      deletingSourceId !== null || togglingSourceId !== null
                    }
                    onClick={() => void deleteSource(source)}
                  >
                    <Trash2 className="mr-2 size-4" />
                    {deletingSourceId === source.id ? "Deleting..." : "Delete"}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingSource(source)}
                  >
                    <Settings2 className="mr-2 size-4" />
                    Settings
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!source.enabled || reconcilingSourceId !== null}
                    onClick={() => void reconcileSource(source.id)}
                  >
                    <RefreshCw
                      className={[
                        "mr-2 size-4",
                        reconcilingSourceId === source.id ? "animate-spin" : "",
                      ].join(" ")}
                    />

                    {reconcilingSourceId === source.id
                      ? "Reconciling..."
                      : "Reconcile"}
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Organization Sources</CardTitle>

          <CardDescription>
            Choose which GLAuth directory projects identities for each Better
            Auth organization.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          {organizations.length === 0 ? (
            <div className="px-6 pb-6 text-sm text-muted-foreground">
              No organizations
            </div>
          ) : (
            organizations.map((organization, index) => {
              const source = sourceForOrganization(organization.id);

              return (
                <div
                  key={organization.id}
                  className={[
                    "grid gap-4 px-6 py-4 sm:grid-cols-[minmax(240px,1fr)_minmax(220px,320px)] sm:items-center",
                    index > 0 ? "border-t" : "",
                  ].join(" ")}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted">
                      {organization.logo ? (
                        <img
                          src={organization.logo}
                          alt=""
                          className="size-full object-cover"
                        />
                      ) : (
                        <Building2 className="size-5 text-muted-foreground" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="truncate font-medium">
                        {organization.name}
                      </div>

                      <div className="truncate text-sm text-muted-foreground">
                        /{organization.slug}
                      </div>
                    </div>
                  </div>

                  <Select
                    value={source?.id ?? "none"}
                    disabled={pendingOrganizationId !== null}
                    onValueChange={(value) =>
                      void assignSource(organization.id, value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select GLAuth source" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="none">No GLAuth source</SelectItem>

                      {sources.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      <Dialog
        open={editingSource !== null}
        onOpenChange={(open) => {
          if (!open) {
            setEditingSource(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>GLAuth Source Settings</DialogTitle>

            <DialogDescription>
              Configure LDAP numbering and directory settings for this source.
            </DialogDescription>
          </DialogHeader>

          {editingSource && (
            <div className="grid gap-4 py-2">
              <div className="grid gap-2">
                <Label>Name</Label>

                <Input
                  value={editingSource.name}
                  onChange={(event) =>
                    setEditingSource({
                      ...editingSource,
                      name: event.target.value,
                    })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label>Base DN</Label>

                <Input value={editingSource.baseDn} disabled />
              </div>

              <div className="grid gap-2">
                <Label>UID Start</Label>

                <Input
                  type="number"
                  value={editingSource.uidStart}
                  onChange={(event) =>
                    setEditingSource({
                      ...editingSource,
                      uidStart: Number(event.target.value),
                    })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label>Primary Group GID</Label>

                <Input
                  type="number"
                  value={editingSource.gidNumber}
                  onChange={(event) =>
                    setEditingSource({
                      ...editingSource,
                      gidNumber: Number(event.target.value),
                    })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label>User Group Name</Label>

                <Input
                  value={editingSource.userGroupName}
                  onChange={(event) =>
                    setEditingSource({
                      ...editingSource,
                      userGroupName: event.target.value,
                    })
                  }
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              disabled={savingSource}
              onClick={() => setEditingSource(null)}
            >
              Cancel
            </Button>

            <Button
              disabled={savingSource || !editingSource}
              onClick={() => void saveSourceSettings()}
            >
              {savingSource ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
