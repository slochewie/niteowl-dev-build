import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useRef, useCallback } from "react";
import { u as useQuery } from "./useQuery-bnZbjTSo.mjs";
import { u as useQueryClient } from "./QueryClientProvider-BNL98aJf.mjs";
import { u as useMutation } from "./useMutation-C_XiO15s.mjs";
import { u as useInfiniteQuery } from "./useInfiniteQuery-BegVgW11.mjs";
import { l as usePluginOverrides, B as Button, q as cn$1, an as createMediaQueryKeys, T as createApiClient } from "./router-qu_5GP1h.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { u as useRouteLifecycle } from "./use-route-lifecycle-CK7wPPTX.mjs";
import { I as Input } from "./input-Ds7nu5GX.mjs";
import { D as Dialog, d as DialogContent, a as DialogHeader, b as DialogTitle, f as DialogClose } from "./dialog-B4u5EdHX.mjs";
import "./useBaseQuery-Bzp30GCu.mjs";
import "../_libs/better-call.mjs";
import "../_libs/react-error-boundary.mjs";
import "../_libs/pg.mjs";
import "../_libs/slug.mjs";
import { L as LoaderCircle, U as Upload, F as FolderPlus, f as Check, m as Folder, k as Trash2, S as Search, X, I as Image$1, d as ChevronRight, n as FolderOpen, o as File$1, g as Copy, p as Eye } from "../_libs/lucide-react.mjs";
import "./infiniteQueryObserver-CMC81Kyb.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "react-dom";
import "react-dom/server";
import "../_libs/isbot.mjs";
import "../_libs/@tanstack/react-router-ssr-query+[...].mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/@tanstack/router-ssr-query-core+[...].mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/btst__yar.mjs";
import "../_libs/rou3.mjs";
import "../_libs/lukemorales__query-key-factory.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/btst__adapter-drizzle.mjs";
import "../_libs/better-auth__core.mjs";
import "../_libs/better-auth__utils.mjs";
import "../_libs/@opentelemetry/semantic-conventions+[...].mjs";
import "../_libs/drizzle-orm.mjs";
import "../_libs/btst__db.mjs";
import "../_libs/zod.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-use-effect-event+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/better-fetch__fetch.mjs";
import "events";
import "util/types";
import "dns";
import "net";
import "tls";
import "../_libs/react.mjs";
import "../_libs/pg-types.mjs";
import "../_libs/postgres-array.mjs";
import "../_libs/postgres-date.mjs";
import "../_libs/postgres-interval.mjs";
import "../_libs/xtend.mjs";
import "../_libs/postgres-bytea.mjs";
import "../_libs/pg-int8.mjs";
import "util";
import "crypto";
import "../_libs/pg-connection-string.mjs";
import "fs";
import "../_libs/pg-protocol.mjs";
import "../_libs/pg-cloudflare.mjs";
import "../_libs/pgpass.mjs";
import "path";
import "stream";
import "../_libs/split2.mjs";
import "string_decoder";
import "../_libs/pg-pool.mjs";
function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Failed to load image: ${file.name}`));
    };
    img.src = url;
  });
}
const SKIP_TYPES = /* @__PURE__ */ new Set(["image/svg+xml", "image/gif"]);
async function compressImage(file, options = {}) {
  if (!file.type.startsWith("image/") || SKIP_TYPES.has(file.type)) {
    return file;
  }
  if (typeof document === "undefined") return file;
  const {
    maxWidth = 2048,
    maxHeight = 2048,
    quality = 0.85,
    outputFormat
  } = options;
  const img = await loadImage(file);
  let { width, height } = img;
  const needsResize = width > maxWidth || height > maxHeight;
  const needsFormatChange = outputFormat !== void 0 && outputFormat !== file.type;
  if (!needsResize && !needsFormatChange) return file;
  if (needsResize) {
    const ratio = Math.min(maxWidth / width, maxHeight / height);
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);
  }
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(img, 0, 0, width, height);
  const mimeType = outputFormat ?? file.type;
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("canvas.toBlob returned null"));
          return;
        }
        let name = file.name;
        if (outputFormat && outputFormat !== file.type) {
          const ext = outputFormat.split("/")[1] ?? "jpg";
          name = name.replace(/\.[^.]+$/, `.${ext}`);
        }
        resolve(new File([blob], name, { type: mimeType }));
      },
      mimeType,
      quality
    );
  });
}
const DEFAULT_IMAGE_COMPRESSION = {
  maxWidth: 2048,
  maxHeight: 2048,
  quality: 0.85
};
async function uploadAsset(config, input) {
  const {
    apiBaseURL,
    apiBasePath,
    headers,
    uploadMode = "direct",
    imageCompression
  } = config;
  const { file, folderId } = input;
  const processedFile = imageCompression === false ? file : await compressImage(
    file,
    imageCompression ?? DEFAULT_IMAGE_COMPRESSION
  );
  const base = `${apiBaseURL}${apiBasePath}`;
  const headersObj = new Headers(headers);
  if (uploadMode === "direct") {
    const formData = new FormData();
    formData.append("file", processedFile);
    if (folderId) formData.append("folderId", folderId);
    const res = await fetch(`${base}/media/upload`, {
      method: "POST",
      headers: headersObj,
      body: formData
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(err.message ?? "Upload failed");
    }
    return res.json();
  }
  if (uploadMode === "s3") {
    const tokenRes = await fetch(`${base}/media/upload/token`, {
      method: "POST",
      headers: {
        ...Object.fromEntries(headersObj.entries()),
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        filename: processedFile.name,
        mimeType: processedFile.type,
        size: processedFile.size,
        folderId
      })
    });
    if (!tokenRes.ok) {
      const err = await tokenRes.json().catch(() => ({ message: tokenRes.statusText }));
      throw new Error(err.message ?? "Failed to get upload token");
    }
    const token = await tokenRes.json();
    const putRes = await fetch(token.payload.uploadUrl, {
      method: "PUT",
      headers: token.payload.headers,
      body: processedFile
    });
    if (!putRes.ok) throw new Error("Failed to upload to S3");
    const assetRes = await fetch(`${base}/media/assets`, {
      method: "POST",
      headers: {
        ...Object.fromEntries(headersObj.entries()),
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        filename: processedFile.name,
        originalName: file.name,
        mimeType: processedFile.type,
        size: processedFile.size,
        url: token.payload.publicUrl,
        folderId
      })
    });
    if (!assetRes.ok) {
      const err = await assetRes.json().catch(() => ({ message: assetRes.statusText }));
      throw new Error(err.message ?? "Failed to register asset");
    }
    return assetRes.json();
  }
  if (uploadMode === "vercel-blob") {
    const { upload } = await import("../_libs/vercel__blob.mjs");
    const blob = await upload(processedFile.name, processedFile, {
      access: "public",
      handleUploadUrl: `${base}/media/upload/vercel-blob`,
      clientPayload: JSON.stringify({
        mimeType: processedFile.type,
        size: processedFile.size
      })
    });
    const assetRes = await fetch(`${base}/media/assets`, {
      method: "POST",
      headers: {
        ...Object.fromEntries(headersObj.entries()),
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        filename: processedFile.name,
        originalName: file.name,
        mimeType: processedFile.type,
        size: processedFile.size,
        url: blob.url,
        folderId
      })
    });
    if (!assetRes.ok) {
      const err = await assetRes.json().catch(() => ({ message: assetRes.statusText }));
      throw new Error(err.message ?? "Failed to register asset");
    }
    return assetRes.json();
  }
  throw new Error(`Unknown uploadMode: ${uploadMode}`);
}
function useMediaConfig() {
  return usePluginOverrides("media");
}
function useMediaApiClient() {
  const { apiBaseURL, apiBasePath, headers } = useMediaConfig();
  const client = createApiClient({
    baseURL: apiBaseURL,
    basePath: apiBasePath
  });
  return { client, headers };
}
function useAssets(params) {
  const { client, headers } = useMediaApiClient();
  const queries = createMediaQueryKeys(client, headers);
  const { queryClient } = useMediaConfig();
  params?.limit ?? 20;
  return useInfiniteQuery(
    {
      ...queries.mediaAssets.list(params),
      initialPageParam: 0,
      refetchOnMount: "always",
      getNextPageParam: (lastPage, _allPages, lastPageParam) => {
        const offset = (lastPage.offset ?? 0) + lastPage.items.length;
        return offset < lastPage.total ? offset : void 0;
      }
    },
    queryClient
  );
}
function useFolders(parentId) {
  const { client, headers } = useMediaApiClient();
  const queries = createMediaQueryKeys(client, headers);
  const { queryClient } = useMediaConfig();
  return useQuery(
    {
      ...queries.mediaFolders.list(parentId)
    },
    queryClient
  );
}
function useUploadAsset() {
  const {
    apiBaseURL,
    apiBasePath,
    headers,
    uploadMode = "direct",
    imageCompression,
    queryClient: qc
  } = useMediaConfig();
  const reactQueryClient = useQueryClient(qc);
  return useMutation(
    {
      mutationFn: async ({
        file,
        folderId
      }) => uploadAsset(
        {
          apiBaseURL,
          apiBasePath,
          headers,
          uploadMode,
          imageCompression
        },
        { file, folderId }
      ),
      onSuccess: () => {
        reactQueryClient.invalidateQueries({ queryKey: ["mediaAssets"] });
      }
    },
    qc
  );
}
function useDeleteAsset() {
  const {
    apiBaseURL,
    apiBasePath,
    headers,
    queryClient: qc
  } = useMediaConfig();
  const reactQueryClient = useQueryClient(qc);
  return useMutation(
    {
      mutationFn: async (id) => {
        const base = `${apiBaseURL}${apiBasePath}`;
        const headersObj = new Headers(headers);
        const res = await fetch(`${base}/media/assets/${id}`, {
          method: "DELETE",
          headers: headersObj
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({ message: res.statusText }));
          throw new Error(err.message ?? "Delete failed");
        }
      },
      onSuccess: () => {
        reactQueryClient.invalidateQueries({ queryKey: ["mediaAssets"] });
      }
    },
    qc
  );
}
function useCreateFolder() {
  const {
    apiBaseURL,
    apiBasePath,
    headers,
    queryClient: qc
  } = useMediaConfig();
  const reactQueryClient = useQueryClient(qc);
  return useMutation(
    {
      mutationFn: async (input) => {
        const base = `${apiBaseURL}${apiBasePath}`;
        const headersObj = new Headers(headers);
        const res = await fetch(`${base}/media/folders`, {
          method: "POST",
          headers: {
            ...Object.fromEntries(headersObj.entries()),
            "Content-Type": "application/json"
          },
          body: JSON.stringify(input)
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({ message: res.statusText }));
          throw new Error(err.message ?? "Failed to create folder");
        }
        return res.json();
      },
      onSuccess: () => {
        reactQueryClient.invalidateQueries({ queryKey: ["mediaFolders"] });
      }
    },
    qc
  );
}
function useDeleteFolder() {
  const {
    apiBaseURL,
    apiBasePath,
    headers,
    queryClient: qc
  } = useMediaConfig();
  const reactQueryClient = useQueryClient(qc);
  return useMutation(
    {
      mutationFn: async (id) => {
        const base = `${apiBaseURL}${apiBasePath}`;
        const headersObj = new Headers(headers);
        const res = await fetch(`${base}/media/folders/${id}`, {
          method: "DELETE",
          headers: headersObj
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({ message: res.statusText }));
          throw new Error(err.message ?? "Failed to delete folder");
        }
      },
      onSuccess: () => {
        reactQueryClient.invalidateQueries({ queryKey: ["mediaFolders"] });
      }
    },
    qc
  );
}
function matchesAccept(mimeType, accept) {
  if (!accept || accept.length === 0) return true;
  return accept.some((a) => {
    if (a.endsWith("/*")) return mimeType.startsWith(a.slice(0, -1));
    return mimeType === a;
  });
}
function isImage(mimeType) {
  return mimeType.startsWith("image/");
}
function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
function AssetPreviewButton({
  asset,
  className
}) {
  const [open, setOpen] = useState(false);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        title: "Preview",
        "aria-label": `Preview ${asset.originalName}`,
        onClick: (event) => {
          event.stopPropagation();
          setOpen(true);
        },
        className,
        children: /* @__PURE__ */ jsx(Eye, { className: "size-3" })
      }
    ),
    /* @__PURE__ */ jsx(Dialog, { open, onOpenChange: setOpen, children: /* @__PURE__ */ jsxs(
      DialogContent,
      {
        showCloseButton: false,
        className: "h-screen w-screen max-w-none border-0 bg-black/95 p-4 shadow-none sm:max-w-none sm:rounded-none sm:p-6",
        children: [
          /* @__PURE__ */ jsx(DialogHeader, { className: "sr-only", children: /* @__PURE__ */ jsx(DialogTitle, { children: asset.alt || asset.originalName }) }),
          /* @__PURE__ */ jsx(
            DialogClose,
            {
              className: "absolute right-4 top-4 z-10 rounded bg-black/60 p-2 text-white transition hover:bg-black/80",
              "aria-label": "Close preview",
              children: /* @__PURE__ */ jsx(X, { className: "size-4" })
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "h-full w-full overflow-auto", children: /* @__PURE__ */ jsx("div", { className: "flex min-h-full w-full items-start justify-center", children: /* @__PURE__ */ jsx(
            "img",
            {
              src: asset.url,
              alt: asset.alt || asset.originalName,
              className: "block h-auto w-auto max-w-none"
            }
          ) }) })
        ]
      }
    ) })
  ] });
}
function AssetCard({
  asset,
  onToggle,
  selected = false,
  onDelete,
  apiBaseURL
}) {
  const { mutateAsync: deleteAsset } = useDeleteAsset();
  const { Image: ImageComponent } = usePluginOverrides("media", {});
  const imageAsset = isImage(asset.mimeType);
  const selectable = typeof onToggle === "function";
  const copyUrl = () => {
    let fullUrl;
    try {
      fullUrl = new URL(asset.url, apiBaseURL).href;
    } catch {
      fullUrl = asset.url;
    }
    navigator.clipboard.writeText(fullUrl).then(() => toast.success("URL copied"));
  };
  const handleDelete = () => {
    if (onDelete) {
      return onDelete(asset.id);
    }
    if (confirm(`Delete "${asset.originalName}"?`)) {
      return deleteAsset(asset.id).catch(console.error);
    }
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      role: selectable ? "button" : void 0,
      tabIndex: selectable ? 0 : void 0,
      "data-testid": "media-asset-item",
      onClick: onToggle,
      onKeyDown: (e) => {
        if (selectable && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onToggle();
        }
      },
      className: cn$1(
        "group relative cursor-pointer rounded-md border bg-muted/30 p-1 transition-all hover:border-ring hover:shadow-sm",
        !selectable && "cursor-default",
        selected && "border-ring ring-1 ring-ring"
      ),
      children: [
        /* @__PURE__ */ jsx("div", { className: "flex h-28 items-center justify-center overflow-hidden rounded bg-muted", children: imageAsset ? ImageComponent ? /* @__PURE__ */ jsx(
          ImageComponent,
          {
            src: asset.url,
            alt: asset.alt || asset.originalName,
            className: "h-full w-full object-cover",
            width: 160,
            height: 80
          }
        ) : /* @__PURE__ */ jsx(
          "img",
          {
            src: asset.url,
            alt: asset.alt || asset.originalName,
            className: "h-full w-full object-cover",
            loading: "lazy"
          }
        ) : /* @__PURE__ */ jsx(File$1, { className: "size-8 text-muted-foreground" }) }),
        /* @__PURE__ */ jsxs("div", { className: "mt-1 px-0.5", children: [
          /* @__PURE__ */ jsx(
            "p",
            {
              className: "truncate text-xs font-medium leading-tight",
              title: asset.originalName,
              children: asset.originalName
            }
          ),
          /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground", children: formatBytes(asset.size) })
        ] }),
        selected && /* @__PURE__ */ jsx("div", { className: "absolute right-1 top-1 rounded-full bg-primary p-0.5 text-primary-foreground", children: /* @__PURE__ */ jsx(Check, { className: "size-3" }) }),
        /* @__PURE__ */ jsxs("div", { className: "absolute right-1 top-1 hidden gap-1 group-hover:flex", children: [
          apiBaseURL ? /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              title: "Copy URL",
              onClick: (e) => {
                e.stopPropagation();
                copyUrl();
              },
              className: "rounded bg-background/80 p-0.5 shadow hover:bg-background",
              children: /* @__PURE__ */ jsx(Copy, { className: "size-3" })
            }
          ) : null,
          imageAsset ? /* @__PURE__ */ jsx(
            AssetPreviewButton,
            {
              asset,
              className: "rounded bg-background/80 p-0.5 shadow hover:bg-background"
            }
          ) : null,
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              title: "Delete",
              onClick: (e) => {
                e.stopPropagation();
                void handleDelete();
              },
              className: "rounded bg-destructive/80 p-0.5 text-white hover:bg-destructive",
              children: /* @__PURE__ */ jsx(Trash2, { className: "size-3" })
            }
          )
        ] })
      ]
    }
  );
}
function BrowseTab({
  folderId,
  selected = [],
  accept,
  onToggle,
  onDelete,
  apiBaseURL,
  emptyMessage = "No files found"
}) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const debounceRef = useRef(null);
  const selectable = typeof onToggle === "function";
  const handleSearch = (v) => {
    setSearch(v);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedSearch(v), 300);
  };
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useAssets({
    folderId: folderId ?? void 0,
    query: debouncedSearch || void 0,
    limit: 40
  });
  const allAssets = data?.pages.flatMap((p) => p.items) ?? [];
  const filtered = accept ? allAssets.filter((a) => matchesAccept(a.mimeType, accept)) : allAssets;
  return /* @__PURE__ */ jsxs("div", { className: "flex h-full min-h-0 flex-col gap-2", children: [
    /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsx(Search, { className: "absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" }),
      /* @__PURE__ */ jsx(
        Input,
        {
          value: search,
          onChange: (e) => handleSearch(e.target.value),
          placeholder: "Search files…",
          className: "h-8 pl-7 text-sm"
        }
      ),
      search && /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => {
            setSearch("");
            setDebouncedSearch("");
          },
          className: "absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground",
          children: /* @__PURE__ */ jsx(X, { className: "size-3.5" })
        }
      )
    ] }),
    isLoading ? /* @__PURE__ */ jsx("div", { className: "flex flex-1 items-center justify-center", children: /* @__PURE__ */ jsx(LoaderCircle, { className: "size-6 animate-spin text-muted-foreground" }) }) : filtered.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "flex flex-1 flex-col items-center justify-center gap-2 text-sm text-muted-foreground", children: [
      /* @__PURE__ */ jsx(Image$1, { className: "size-8" }),
      /* @__PURE__ */ jsx("p", { children: emptyMessage })
    ] }) : /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-y-auto overscroll-contain", children: [
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-2 pb-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5", children: filtered.map((asset) => /* @__PURE__ */ jsx(
        AssetCard,
        {
          asset,
          selected: selected.some((s) => s.id === asset.id),
          onToggle: selectable ? () => onToggle(asset) : void 0,
          onDelete,
          apiBaseURL
        },
        asset.id
      )) }),
      hasNextPage && /* @__PURE__ */ jsx("div", { className: "flex justify-center py-2", children: /* @__PURE__ */ jsxs(
        Button,
        {
          variant: "ghost",
          size: "sm",
          onClick: () => fetchNextPage(),
          disabled: isFetchingNextPage,
          children: [
            isFetchingNextPage ? /* @__PURE__ */ jsx(LoaderCircle, { className: "mr-1 size-3 animate-spin" }) : null,
            "Load more"
          ]
        }
      ) })
    ] })
  ] });
}
function FolderTree({
  selectedId,
  onSelect
}) {
  const { data: rootFoldersRaw = [] } = useFolders(null);
  const rootFolders = rootFoldersRaw;
  const [newFolderName, setNewFolderName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const { mutateAsync: createFolder } = useCreateFolder();
  const { mutateAsync: deleteFolder } = useDeleteFolder();
  const handleCreateFolder = async () => {
    const name = newFolderName.trim();
    if (!name) return;
    try {
      await createFolder({ name, parentId: selectedId ?? void 0 });
      setNewFolderName("");
      setIsCreating(false);
    } catch (err) {
      console.error("[btst/media] Failed to create folder", err);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex h-full min-h-0 flex-col", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-2 py-2", children: [
      /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: "Folders" }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          title: "New folder",
          onClick: () => setIsCreating((v) => !v),
          className: "rounded p-0.5 hover:bg-muted",
          children: /* @__PURE__ */ jsx(FolderPlus, { className: "size-3.5 text-muted-foreground" })
        }
      )
    ] }),
    isCreating && /* @__PURE__ */ jsxs("div", { className: "flex gap-1 px-2 pb-1", children: [
      /* @__PURE__ */ jsx(
        Input,
        {
          autoFocus: true,
          value: newFolderName,
          onChange: (e) => setNewFolderName(e.target.value),
          placeholder: "Folder name",
          className: "h-6 text-xs",
          onKeyDown: (e) => {
            if (e.key === "Enter") void handleCreateFolder();
            if (e.key === "Escape") setIsCreating(false);
          }
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: handleCreateFolder,
          className: "rounded px-1 py-0.5 text-xs hover:bg-muted",
          children: /* @__PURE__ */ jsx(Check, { className: "size-3" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-y-auto overscroll-contain", children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          onClick: () => onSelect(null),
          className: cn$1(
            "flex w-full items-center gap-1.5 rounded px-2 py-1 text-left text-sm hover:bg-muted",
            selectedId === null && "bg-muted font-medium"
          ),
          children: [
            /* @__PURE__ */ jsx("span", { className: "size-3" }),
            /* @__PURE__ */ jsx(Folder, { className: "size-3.5 shrink-0 text-muted-foreground" }),
            /* @__PURE__ */ jsx("span", { className: "truncate", children: "All files" })
          ]
        }
      ),
      rootFolders.map((folder) => /* @__PURE__ */ jsx(
        FolderTreeItem,
        {
          folder,
          selectedId,
          onSelect
        },
        folder.id
      ))
    ] }),
    selectedId && /* @__PURE__ */ jsx("div", { className: "border-t px-2 py-1", children: /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        onClick: async () => {
          if (confirm("Delete this folder? Assets inside will be unaffected.")) {
            try {
              await deleteFolder(selectedId);
              onSelect(null);
            } catch (err) {
              console.error("[btst/media] Failed to delete folder", err);
            }
          }
        },
        className: "flex items-center gap-1 text-xs text-destructive hover:underline",
        children: [
          /* @__PURE__ */ jsx(Trash2, { className: "size-3" }),
          "Delete folder"
        ]
      }
    ) })
  ] });
}
function FolderTreeItem({
  folder,
  selectedId,
  onSelect,
  depth = 0
}) {
  const [expanded, setExpanded] = useState(false);
  const { data: children = [] } = useFolders(folder.id);
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        onClick: () => {
          onSelect(folder.id);
          setExpanded((v) => !v);
        },
        className: cn$1(
          "flex w-full items-center gap-1.5 rounded px-2 py-1 text-left text-sm hover:bg-muted",
          selectedId === folder.id && "bg-muted font-medium"
        ),
        style: { paddingLeft: `${8 + depth * 12}px` },
        children: [
          children.length > 0 ? /* @__PURE__ */ jsx(
            ChevronRight,
            {
              className: cn$1(
                "size-3 shrink-0 transition-transform",
                expanded && "rotate-90"
              )
            }
          ) : /* @__PURE__ */ jsx("span", { className: "size-3" }),
          expanded ? /* @__PURE__ */ jsx(FolderOpen, { className: "size-3.5 shrink-0 text-amber-500" }) : /* @__PURE__ */ jsx(Folder, { className: "size-3.5 shrink-0 text-amber-500" }),
          /* @__PURE__ */ jsx("span", { className: "truncate", children: folder.name })
        ]
      }
    ),
    expanded && children.map((child) => /* @__PURE__ */ jsx(
      FolderTreeItem,
      {
        folder: child,
        selectedId,
        onSelect,
        depth: depth + 1
      },
      child.id
    ))
  ] });
}
function LibraryPage() {
  const overrides = usePluginOverrides("media", {});
  useRouteLifecycle({
    routeName: "library",
    context: {
      path: "/media",
      isSSR: typeof window === "undefined"
    },
    overrides,
    beforeRenderHook: (overrides2, context) => {
      if (overrides2.onBeforeLibraryPageRendered) {
        return overrides2.onBeforeLibraryPageRendered(context);
      }
      return true;
    }
  });
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef(null);
  const { mutateAsync: uploadAsset2, isPending: isUploading } = useUploadAsset();
  const { mutateAsync: deleteAsset } = useDeleteAsset();
  const { apiBaseURL = "" } = overrides;
  const handleUpload = useCallback(
    async (files) => {
      const arr = Array.from(files);
      for (const file of arr) {
        try {
          await uploadAsset2({ file, folderId: selectedFolder ?? void 0 });
          toast.success(`Uploaded ${file.name}`);
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Upload failed");
        }
      }
    },
    [selectedFolder, uploadAsset2]
  );
  const handleDelete = async (id) => {
    if (!confirm("Delete this asset?")) return;
    try {
      await deleteAsset(id);
      toast.success("Deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex h-[calc(100dvh-4rem)] flex-col overflow-hidden md:flex-row", children: [
    /* @__PURE__ */ jsx("div", { className: "max-h-48 shrink-0 overflow-hidden border-b bg-muted/20 md:h-full md:max-h-none md:w-52 md:border-b-0 md:border-r", children: /* @__PURE__ */ jsx(FolderTree, { selectedId: selectedFolder, onSelect: setSelectedFolder }) }),
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: cn$1(
          "relative flex flex-1 flex-col overflow-hidden border-t md:border-t-0",
          dragging && "ring-2 ring-inset ring-ring"
        ),
        onDragOver: (e) => {
          e.preventDefault();
          setDragging(true);
        },
        onDragLeave: () => setDragging(false),
        onDrop: (e) => {
          e.preventDefault();
          setDragging(false);
          void handleUpload(e.dataTransfer.files);
        },
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 border-b px-4 py-3 sm:flex-row sm:items-center sm:justify-end", children: [
            /* @__PURE__ */ jsxs(
              Button,
              {
                size: "sm",
                onClick: () => fileInputRef.current?.click(),
                disabled: isUploading,
                className: "w-full sm:w-auto",
                children: [
                  isUploading ? /* @__PURE__ */ jsx(LoaderCircle, { className: "mr-2 size-3.5 animate-spin" }) : /* @__PURE__ */ jsx(Upload, { className: "mr-2 size-3.5" }),
                  "Upload"
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              "input",
              {
                ref: fileInputRef,
                type: "file",
                multiple: true,
                className: "hidden",
                onChange: (e) => e.target.files && handleUpload(e.target.files)
              }
            )
          ] }),
          dragging && /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-background/80", children: /* @__PURE__ */ jsxs("div", { className: "rounded-lg border-2 border-dashed border-ring p-8 text-center", children: [
            /* @__PURE__ */ jsx(Upload, { className: "mx-auto mb-2 size-10 text-ring" }),
            /* @__PURE__ */ jsx("p", { className: "font-medium", children: "Drop files to upload" })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "flex-1 min-h-0 p-3 sm:p-4", children: /* @__PURE__ */ jsx(
            BrowseTab,
            {
              folderId: selectedFolder,
              onDelete: handleDelete,
              apiBaseURL,
              emptyMessage: "No files yet. Drag & drop or click Upload."
            }
          ) })
        ]
      }
    )
  ] });
}
export {
  LibraryPage
};
