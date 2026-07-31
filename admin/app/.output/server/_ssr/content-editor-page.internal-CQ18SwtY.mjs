import { jsx, jsxs } from "react/jsx-runtime";
import * as React from "react";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { l as usePluginOverrides, D as useBasePath, B as Button, _ as formSchemaToZod, T as createApiClient, v as Card, x as CardHeader, am as slugify$2, y as CardTitle, w as CardContent, V as createCMSQueryKeys, O as noop, N as notifyManager, I as Subscribable, J as shallowEqualObjects, al as replaceEqualDeep } from "./router-qu_5GP1h.mjs";
import { S as SteppedAutoForm } from "./stepped-auto-form-mEkHGDwr.mjs";
import { b as buildFieldConfigFromJsonSchema$1, a as AutoFormLabel, c as AutoFormTooltip } from "./index-zHebWDbP.mjs";
import { I as Input } from "./input-Ds7nu5GX.mjs";
import { L as Label } from "./label-DWXXj0lo.mjs";
import { B as Badge } from "./badge-CGoI1f31.mjs";
import { u as useSuspenseContentTypes, c as useContentItem, d as useCreateContent, e as useUpdateContent, E as EmptyState, C as CMS_LOCALIZATION, b as useDeleteContent, f as useContent } from "./cms-hooks-qLe16dQu.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { b as FormItem, d as FormControl, e as FormMessage } from "./form-Cx2oXTTw.mjs";
import { a as useIsRestoring, b as useQueryErrorResetBoundary, e as ensureSuspenseTimers, c as ensurePreventErrorBoundaryRetry, f as useClearResetErrorBoundary, s as shouldSuspend, Q as QueryObserver, g as fetchOptimistic, h as getHasError } from "./useBaseQuery-Bzp30GCu.mjs";
import { u as useQueryClient } from "./QueryClientProvider-BNL98aJf.mjs";
import { M as MultipleSelector } from "./multi-select-CD_n40D7.mjs";
import { D as Dialog, e as DialogTrigger, d as DialogContent, a as DialogHeader, b as DialogTitle } from "./dialog-B4u5EdHX.mjs";
import { T as Textarea } from "./textarea-ClKgIhzC.mjs";
import { u as useQuery } from "./useQuery-bnZbjTSo.mjs";
import { A as AlertDialog, b as AlertDialogContent, c as AlertDialogHeader, d as AlertDialogTitle, e as AlertDialogDescription, f as AlertDialogFooter, g as AlertDialogCancel, h as AlertDialogAction } from "./alert-dialog-uhUcP2mH.mjs";
import { P as PageWrapper } from "./page-wrapper-Cg71u63l.mjs";
import { E as EditorSkeleton } from "./content-editor-page-Dn0N_5SS.mjs";
import { u as useRouteLifecycle } from "./use-route-lifecycle-CK7wPPTX.mjs";
import "../_libs/better-call.mjs";
import "../_libs/react-error-boundary.mjs";
import "../_libs/pg.mjs";
import "../_libs/slug.mjs";
import "./separator-dOz0oFNG.mjs";
import "./index-CpOdxbMb.mjs";
import "react-dom";
import "./accordion-DJKZ9YSV.mjs";
import "./index-BUGN0YTJ.mjs";
import "./index-BI_-Kgeu.mjs";
import "./checkbox-DYzrULg_.mjs";
import "./popover-I-2hrCQX.mjs";
import "./Combination-C2ce2hnQ.mjs";
import "./select-DRbaYjS4.mjs";
import "./index-x6nDyT23.mjs";
import { A as ArrowLeft, a as ChevronDown, d as ChevronRight, s as ExternalLink, k as Trash2, P as Plus, L as LoaderCircle, X } from "../_libs/lucide-react.mjs";
import { o as object } from "../_libs/zod.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
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
import "../_libs/react-hook-form.mjs";
import "../_libs/hookform__resolvers.mjs";
import "./index-S7rpP7KI.mjs";
import "./index-rdulpQ7P.mjs";
import "./index-KZ0RSJRl.mjs";
import "./index-CshadhlS.mjs";
import "./switch-DIDzzBgm.mjs";
import "../_libs/radix-ui__react-switch.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-effect-event+[...].mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/date-fns.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "./useSuspenseQuery-CxR8OJs1.mjs";
import "./useSuspenseInfiniteQuery-BNot5GKT.mjs";
import "./infiniteQueryObserver-CMC81Kyb.mjs";
import "./useMutation-C_XiO15s.mjs";
import "./useInfiniteQuery-BegVgW11.mjs";
import "../_libs/cmdk.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
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
import "./command-8DCQ5FSU.mjs";
import "./use-debounce-B6NKG3k-.mjs";
import "./404-page-j8_18ZSG.mjs";
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
import "./index-IXOTxK3N.mjs";
function difference(array1, array2) {
  const excludeSet = new Set(array2);
  return array1.filter((x) => !excludeSet.has(x));
}
function replaceAt(array, index, value) {
  const copy = array.slice(0);
  copy[index] = value;
  return copy;
}
var QueriesObserver = class extends Subscribable {
  #client;
  #result;
  #queries;
  #options;
  #observers;
  #combinedResult;
  #lastCombine;
  #lastResult;
  #lastQueryHashes;
  #observerMatches = [];
  constructor(client, queries, options) {
    super();
    this.#client = client;
    this.#options = options;
    this.#queries = [];
    this.#observers = [];
    this.#result = [];
    this.setQueries(queries);
  }
  onSubscribe() {
    if (this.listeners.size === 1) {
      this.#observers.forEach((observer) => {
        observer.subscribe((result) => {
          this.#onUpdate(observer, result);
        });
      });
    }
  }
  onUnsubscribe() {
    if (!this.listeners.size) {
      this.destroy();
    }
  }
  destroy() {
    this.listeners = /* @__PURE__ */ new Set();
    this.#observers.forEach((observer) => {
      observer.destroy();
    });
  }
  setQueries(queries, options) {
    this.#queries = queries;
    this.#options = options;
    notifyManager.batch(() => {
      const prevObservers = this.#observers;
      const newObserverMatches = this.#findMatchingObservers(this.#queries);
      newObserverMatches.forEach(
        (match) => match.observer.setOptions(match.defaultedQueryOptions)
      );
      const newObservers = newObserverMatches.map((match) => match.observer);
      const newResult = newObservers.map(
        (observer) => observer.getCurrentResult()
      );
      const hasLengthChange = prevObservers.length !== newObservers.length;
      const hasIndexChange = newObservers.some(
        (observer, index) => observer !== prevObservers[index]
      );
      const hasStructuralChange = hasLengthChange || hasIndexChange;
      const hasResultChange = hasStructuralChange ? true : newResult.some((result, index) => {
        const prev = this.#result[index];
        return !prev || !shallowEqualObjects(result, prev);
      });
      if (!hasStructuralChange && !hasResultChange) return;
      if (hasStructuralChange) {
        this.#observerMatches = newObserverMatches;
        this.#observers = newObservers;
      }
      this.#result = newResult;
      if (!this.hasListeners()) return;
      if (hasStructuralChange) {
        difference(prevObservers, newObservers).forEach((observer) => {
          observer.destroy();
        });
        difference(newObservers, prevObservers).forEach((observer) => {
          observer.subscribe((result) => {
            this.#onUpdate(observer, result);
          });
        });
      }
      this.#notify();
    });
  }
  getCurrentResult() {
    return this.#result;
  }
  getQueries() {
    return this.#observers.map((observer) => observer.getCurrentQuery());
  }
  getObservers() {
    return this.#observers;
  }
  getOptimisticResult(queries, combine) {
    const matches = this.#findMatchingObservers(queries);
    const result = matches.map(
      (match) => match.observer.getOptimisticResult(match.defaultedQueryOptions)
    );
    const queryHashes = matches.map(
      (match) => match.defaultedQueryOptions.queryHash
    );
    return [
      result,
      (r) => {
        return this.#combineResult(r ?? result, combine, queryHashes);
      },
      () => {
        return this.#trackResult(result, matches);
      }
    ];
  }
  #trackResult(result, matches) {
    return matches.map((match, index) => {
      const observerResult = result[index];
      return !match.defaultedQueryOptions.notifyOnChangeProps ? match.observer.trackResult(observerResult, (accessedProp) => {
        matches.forEach((m) => {
          m.observer.trackProp(accessedProp);
        });
      }) : observerResult;
    });
  }
  #combineResult(input, combine, queryHashes) {
    if (combine) {
      const lastHashes = this.#lastQueryHashes;
      const queryHashesChanged = queryHashes !== void 0 && lastHashes !== void 0 && (lastHashes.length !== queryHashes.length || queryHashes.some((hash, i) => hash !== lastHashes[i]));
      if (!this.#combinedResult || this.#result !== this.#lastResult || queryHashesChanged || combine !== this.#lastCombine) {
        this.#lastCombine = combine;
        this.#lastResult = this.#result;
        if (queryHashes !== void 0) {
          this.#lastQueryHashes = queryHashes;
        }
        this.#combinedResult = replaceEqualDeep(
          this.#combinedResult,
          combine(input)
        );
      }
      return this.#combinedResult;
    }
    return input;
  }
  #shouldSkipCombine() {
    return this.#options?.combine !== void 0 && this.#observers.some((observer, index) => {
      return observer.options.suspense && this.#result[index]?.data === void 0;
    });
  }
  #findMatchingObservers(queries) {
    const prevObserversMap = /* @__PURE__ */ new Map();
    this.#observers.forEach((observer) => {
      const key = observer.options.queryHash;
      if (!key) return;
      const previousObservers = prevObserversMap.get(key);
      if (previousObservers) {
        previousObservers.push(observer);
      } else {
        prevObserversMap.set(key, [observer]);
      }
    });
    const observers = [];
    queries.forEach((options) => {
      const defaultedOptions = this.#client.defaultQueryOptions(options);
      const match = prevObserversMap.get(defaultedOptions.queryHash)?.shift();
      const observer = match ?? new QueryObserver(this.#client, defaultedOptions);
      observers.push({
        defaultedQueryOptions: defaultedOptions,
        observer
      });
    });
    return observers;
  }
  #onUpdate(observer, result) {
    const index = this.#observers.indexOf(observer);
    if (index !== -1) {
      this.#result = replaceAt(this.#result, index, result);
      this.#notify();
    }
  }
  #notify() {
    if (this.hasListeners()) {
      const newTracked = this.#trackResult(this.#result, this.#observerMatches);
      const shouldSkipCombine = this.#shouldSkipCombine();
      const previousResult = this.#combinedResult;
      const newResult = shouldSkipCombine ? previousResult : this.#combineResult(newTracked, this.#options?.combine);
      if (shouldSkipCombine || previousResult !== newResult) {
        notifyManager.batch(() => {
          this.listeners.forEach((listener) => {
            listener(this.#result);
          });
        });
      }
    }
  }
};
function useQueries({
  queries,
  ...options
}, queryClient) {
  const client = useQueryClient(queryClient);
  const isRestoring = useIsRestoring();
  const errorResetBoundary = useQueryErrorResetBoundary();
  const defaultedQueries = React.useMemo(
    () => queries.map((opts) => {
      const defaultedOptions = client.defaultQueryOptions(
        opts
      );
      defaultedOptions._optimisticResults = isRestoring ? "isRestoring" : "optimistic";
      return defaultedOptions;
    }),
    [queries, client, isRestoring]
  );
  defaultedQueries.forEach((queryOptions) => {
    ensureSuspenseTimers(queryOptions);
    const query = client.getQueryCache().get(queryOptions.queryHash);
    ensurePreventErrorBoundaryRetry(queryOptions, errorResetBoundary, query);
  });
  useClearResetErrorBoundary(errorResetBoundary);
  const [observer] = React.useState(
    () => new QueriesObserver(
      client,
      defaultedQueries,
      options
    )
  );
  const [optimisticResult, getCombinedResult, trackResult] = observer.getOptimisticResult(
    defaultedQueries,
    options.combine
  );
  const shouldSubscribe = !isRestoring && options.subscribed !== false;
  React.useSyncExternalStore(
    React.useCallback(
      (onStoreChange) => shouldSubscribe ? observer.subscribe(notifyManager.batchCalls(onStoreChange)) : noop,
      [observer, shouldSubscribe]
    ),
    () => observer.getCurrentResult(),
    () => observer.getCurrentResult()
  );
  React.useEffect(() => {
    observer.setQueries(
      defaultedQueries,
      options
    );
  }, [defaultedQueries, options, observer]);
  const shouldAtLeastOneSuspend = optimisticResult.some(
    (result, index) => shouldSuspend(defaultedQueries[index], result)
  );
  const suspensePromises = shouldAtLeastOneSuspend ? optimisticResult.flatMap((result, index) => {
    const opts = defaultedQueries[index];
    if (opts && shouldSuspend(opts, result)) {
      const queryObserver = new QueryObserver(client, opts);
      return fetchOptimistic(opts, queryObserver, errorResetBoundary);
    }
    return [];
  }) : [];
  if (suspensePromises.length > 0) {
    throw Promise.all(suspensePromises);
  }
  const firstSingleResultWhichShouldThrow = optimisticResult.find(
    (result, index) => {
      const query = defaultedQueries[index];
      return query && getHasError({
        result,
        errorResetBoundary,
        throwOnError: query.throwOnError,
        query: client.getQueryCache().get(query.queryHash),
        suspense: query.suspense
      });
    }
  );
  if (firstSingleResultWhichShouldThrow?.error) {
    throw firstSingleResultWhichShouldThrow.error;
  }
  return getCombinedResult(trackResult());
}
function CMSFileUpload({
  label,
  isRequired,
  fieldConfigItem,
  fieldProps,
  field,
  uploadImage,
  imageInputField: ImageInputField,
  imagePicker: ImagePickerTrigger
}) {
  const {
    showLabel: _showLabel,
    value: _value,
    ...safeFieldProps
  } = fieldProps;
  const showLabel = _showLabel === void 0 ? true : _showLabel;
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(
    field.value || null
  );
  useEffect(() => {
    const normalizedValue = field.value || null;
    if (normalizedValue !== previewUrl) {
      setPreviewUrl(normalizedValue);
    }
  }, [field.value, previewUrl]);
  const handleFileChange = useCallback(
    async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }
      setIsUploading(true);
      try {
        const url = await uploadImage(file);
        setPreviewUrl(url);
        field.onChange(url);
      } catch (error) {
        console.error("Image upload failed:", error);
        toast.error("Failed to upload image");
      } finally {
        setIsUploading(false);
      }
    },
    [field, uploadImage]
  );
  const handleRemove = useCallback(() => {
    setPreviewUrl(null);
    field.onChange("");
  }, [field]);
  if (ImageInputField) {
    return /* @__PURE__ */ jsxs(FormItem, { children: [
      showLabel && /* @__PURE__ */ jsx(
        AutoFormLabel,
        {
          label: fieldConfigItem?.label || label,
          isRequired
        }
      ),
      /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
        ImageInputField,
        {
          value: field.value || "",
          onChange: field.onChange,
          isRequired
        }
      ) }),
      /* @__PURE__ */ jsx(AutoFormTooltip, { fieldConfigItem }),
      /* @__PURE__ */ jsx(FormMessage, {})
    ] });
  }
  return /* @__PURE__ */ jsxs(FormItem, { children: [
    showLabel && /* @__PURE__ */ jsx(
      AutoFormLabel,
      {
        label: fieldConfigItem?.label || label,
        isRequired
      }
    ),
    !previewUrl && /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx(
          Input,
          {
            type: "file",
            accept: "image/*",
            ...safeFieldProps,
            onChange: handleFileChange,
            disabled: isUploading,
            className: "cursor-pointer",
            "data-testid": "image-upload-input"
          }
        ),
        isUploading && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-background/80", children: /* @__PURE__ */ jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) })
      ] }),
      ImagePickerTrigger && /* @__PURE__ */ jsx("div", { "data-testid": "image-picker-trigger", children: /* @__PURE__ */ jsx(
        ImagePickerTrigger,
        {
          onSelect: (url) => {
            setPreviewUrl(url);
            field.onChange(url);
          }
        }
      ) })
    ] }) }),
    previewUrl && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx("div", { className: "relative h-20 w-20 overflow-hidden rounded-md border", children: /* @__PURE__ */ jsx(
        "img",
        {
          src: previewUrl,
          alt: "Preview",
          className: "h-full w-full object-cover",
          "data-testid": "image-preview"
        }
      ) }),
      /* @__PURE__ */ jsxs(
        Button,
        {
          type: "button",
          variant: "outline",
          size: "sm",
          onClick: handleRemove,
          className: "flex items-center gap-1",
          "data-testid": "remove-image-button",
          children: [
            /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }),
            "Remove"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx(AutoFormTooltip, { fieldConfigItem }),
    /* @__PURE__ */ jsx(FormMessage, {})
  ] });
}
const RELATION_DETAIL_QUERY_OPTS = {
  retry: false,
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  refetchOnReconnect: false,
  staleTime: 1e3 * 60 * 5,
  gcTime: 1e3 * 60 * 10
};
function RelationField({
  field,
  fieldConfigItem,
  label,
  isRequired,
  relation
}) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemDescription, setNewItemDescription] = useState("");
  const [createError, setCreateError] = useState(null);
  const { apiBaseURL, apiBasePath, headers } = usePluginOverrides("cms");
  const listClient = useMemo(
    () => createApiClient({
      baseURL: apiBaseURL,
      basePath: apiBasePath
    }),
    [apiBaseURL, apiBasePath]
  );
  const cmsQueries = useMemo(
    () => createCMSQueryKeys(listClient, headers),
    [listClient, headers]
  );
  const isSingleSelect = relation.type === "belongsTo";
  const normalizedValue = useMemo(() => {
    if (!field.value) return [];
    if (isSingleSelect) {
      const singleValue = field.value;
      if (singleValue && singleValue.id) {
        return [{ id: singleValue.id }];
      }
      return [];
    }
    return field.value || [];
  }, [field.value, isSingleSelect]);
  const { items: availableItems, isLoading } = useContent(relation.targetType, {
    limit: 500
  });
  const missingDetailIds = useMemo(() => {
    const loadedIds = new Set(availableItems.map((i) => i.id));
    return normalizedValue.map((v) => v.id).filter((id) => id.length > 0 && !loadedIds.has(id));
  }, [availableItems, normalizedValue]);
  const hydrationResult = useQueries({
    queries: missingDetailIds.map((id) => ({
      ...cmsQueries.cmsContent.detail(relation.targetType, id),
      ...RELATION_DETAIL_QUERY_OPTS,
      enabled: Boolean(relation.targetType && id)
    })),
    combine: (results) => ({
      data: results.map(
        (r) => r.data
      ),
      isHydrating: results.some((r) => r.isFetching)
    })
  });
  const isHydratingLabels = hydrationResult.isHydrating;
  const itemById = useMemo(() => {
    const m = /* @__PURE__ */ new Map();
    for (const it of availableItems) {
      m.set(it.id, it);
    }
    for (let i = 0; i < missingDetailIds.length; i++) {
      const row = hydrationResult.data[i];
      if (row?.id) {
        m.set(row.id, row);
      }
    }
    return m;
  }, [availableItems, missingDetailIds, hydrationResult.data]);
  const selectedOptions = normalizedValue.map((v) => {
    const item = itemById.get(v.id);
    if (item) {
      const displayValue = item.parsedData?.[relation.displayField] || item.slug;
      return {
        value: item.id,
        label: String(displayValue)
      };
    }
    return { value: v.id, label: `ID: ${v.id.slice(0, 8)}...` };
  });
  const options = useMemo(() => {
    const merged = [
      ...availableItems
    ];
    const seen = new Set(merged.map((x) => x.id));
    for (let i = 0; i < missingDetailIds.length; i++) {
      const row = hydrationResult.data[i];
      if (row?.id && !seen.has(row.id)) {
        merged.push(row);
        seen.add(row.id);
      }
    }
    return merged.map((item) => {
      const displayValue = item.parsedData?.[relation.displayField] || item.slug;
      return {
        value: item.id,
        label: String(displayValue)
      };
    });
  }, [
    availableItems,
    hydrationResult.data,
    missingDetailIds,
    relation.displayField
  ]);
  const createMutation = useCreateContent(relation.targetType);
  const handleChange = useCallback(
    (newOptions) => {
      if (isSingleSelect) {
        if (newOptions.length > 0) {
          field.onChange({ id: newOptions[0].value });
        } else {
          field.onChange(void 0);
        }
      } else {
        const newValue = newOptions.map((opt) => ({ id: opt.value }));
        field.onChange(newValue);
      }
    },
    [field, isSingleSelect]
  );
  const handleCreateItem = async () => {
    if (!newItemName.trim()) return;
    setCreateError(null);
    try {
      const result = await createMutation.mutateAsync({
        slug: newItemName.toLowerCase().replace(/\s+/g, "-"),
        data: {
          [relation.displayField]: newItemName,
          description: newItemDescription || void 0
        }
      });
      if (isSingleSelect) {
        field.onChange({ id: result.id });
      } else {
        const newValue = [...normalizedValue, { id: result.id }];
        field.onChange(newValue);
      }
      setNewItemName("");
      setNewItemDescription("");
      setIsCreateDialogOpen(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create item. Please try again.";
      setCreateError(message);
    }
  };
  const handleRemove = useCallback(
    (idToRemove) => {
      if (isSingleSelect) {
        field.onChange(void 0);
      } else {
        const newValue = normalizedValue.filter((v) => v.id !== idToRemove);
        field.onChange(newValue);
      }
    },
    [normalizedValue, field, isSingleSelect]
  );
  return /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsxs(Label, { children: [
      label,
      isRequired && /* @__PURE__ */ jsx("span", { className: "text-destructive ml-1", children: "*" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsx(
        MultipleSelector,
        {
          value: selectedOptions,
          onChange: handleChange,
          options,
          placeholder: isLoading || isHydratingLabels ? "Loading..." : `Select ${relation.targetType}${isSingleSelect ? "" : "(s)"}...`,
          disabled: isLoading || isHydratingLabels,
          hidePlaceholderWhenSelected: true,
          emptyIndicator: /* @__PURE__ */ jsxs("p", { className: "text-center text-sm text-muted-foreground py-4", children: [
            "No ",
            relation.targetType,
            " items found"
          ] }),
          maxSelected: isSingleSelect ? 1 : void 0,
          className: "min-h-10"
        }
      ) }),
      relation.creatable && /* @__PURE__ */ jsxs(
        Dialog,
        {
          open: isCreateDialogOpen,
          onOpenChange: setIsCreateDialogOpen,
          children: [
            /* @__PURE__ */ jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", size: "icon", children: /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }) }) }),
            /* @__PURE__ */ jsxs(DialogContent, { children: [
              /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsxs(DialogTitle, { children: [
                "Create New ",
                relation.targetType
              ] }) }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-4 py-4", children: [
                createError && /* @__PURE__ */ jsx("p", { className: "text-sm text-destructive", children: createError }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsx(Label, { htmlFor: "newItemName", children: relation.displayField.charAt(0).toUpperCase() + relation.displayField.slice(1) }),
                  /* @__PURE__ */ jsx(
                    Input,
                    {
                      id: "newItemName",
                      value: newItemName,
                      onChange: (e) => setNewItemName(e.target.value),
                      placeholder: `Enter ${relation.displayField}...`
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsx(Label, { htmlFor: "newItemDescription", children: "Description (optional)" }),
                  /* @__PURE__ */ jsx(
                    Textarea,
                    {
                      id: "newItemDescription",
                      value: newItemDescription,
                      onChange: (e) => setNewItemDescription(e.target.value),
                      placeholder: "Enter description...",
                      rows: 3
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2", children: [
                  /* @__PURE__ */ jsx(
                    Button,
                    {
                      type: "button",
                      variant: "outline",
                      onClick: () => setIsCreateDialogOpen(false),
                      children: "Cancel"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    Button,
                    {
                      type: "button",
                      onClick: handleCreateItem,
                      disabled: !newItemName.trim() || createMutation.isPending,
                      children: createMutation.isPending ? "Creating..." : "Create"
                    }
                  )
                ] })
              ] })
            ] })
          ]
        }
      )
    ] }),
    selectedOptions.length > 0 && /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1 mt-2", children: selectedOptions.map((opt) => /* @__PURE__ */ jsxs(
      "div",
      {
        className: "inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md bg-secondary text-secondary-foreground",
        children: [
          /* @__PURE__ */ jsx("span", { children: opt.label }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => handleRemove(opt.value),
              className: "hover:text-destructive",
              children: /* @__PURE__ */ jsx(X, { className: "h-3 w-3" })
            }
          )
        ]
      },
      opt.value
    )) }),
    fieldConfigItem?.description && /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: fieldConfigItem.description })
  ] });
}
function buildFieldConfigFromJsonSchema(jsonSchema, uploadImage, fieldComponents, imagePicker, imageInputField) {
  const baseConfig = buildFieldConfigFromJsonSchema$1(jsonSchema, fieldComponents);
  const properties = jsonSchema.properties;
  if (!properties) return baseConfig;
  const injectCustomFieldTypes = (props, targetConfig) => {
    for (const [key, prop] of Object.entries(props)) {
      const existing = targetConfig[key] ?? {};
      let updated = existing;
      if (prop.fieldType === "file" && !fieldComponents?.["file"]) {
        if (!uploadImage && !imageInputField) {
          updated = {
            ...updated,
            fieldType: () => /* @__PURE__ */ jsxs("div", { className: "rounded-md border border-destructive bg-destructive/10 p-3 text-sm text-destructive", children: [
              "File upload requires an ",
              /* @__PURE__ */ jsx("code", { children: "uploadImage" }),
              " or",
              " ",
              /* @__PURE__ */ jsx("code", { children: "imageInputField" }),
              " function in CMS overrides."
            ] })
          };
        } else {
          updated = {
            ...updated,
            fieldType: (componentProps) => /* @__PURE__ */ jsx(
              CMSFileUpload,
              {
                ...componentProps,
                uploadImage: uploadImage ?? (() => Promise.resolve("")),
                imageInputField,
                imagePicker
              }
            )
          };
        }
      }
      if (prop.fieldType === "relation" && prop.relation && !fieldComponents?.["relation"]) {
        const relationConfig = prop.relation;
        updated = {
          ...updated,
          fieldType: (componentProps) => /* @__PURE__ */ jsx(RelationField, { ...componentProps, relation: relationConfig })
        };
      }
      if (prop.properties) {
        injectCustomFieldTypes(
          prop.properties,
          updated
        );
      }
      const items = prop.items;
      if (items?.properties) {
        injectCustomFieldTypes(
          items.properties,
          updated
        );
      }
      if (Object.keys(updated).length > 0) {
        targetConfig[key] = updated;
      }
    }
  };
  injectCustomFieldTypes(
    properties,
    baseConfig
  );
  return baseConfig;
}
function findSlugSourceField(jsonSchema) {
  const properties = jsonSchema.properties;
  if (!properties) return null;
  const priorityFields = ["name", "title", "heading", "label"];
  for (const field of priorityFields) {
    if (properties[field]?.type === "string") {
      return field;
    }
  }
  for (const [key, value] of Object.entries(properties)) {
    if (value.type === "string") {
      return key;
    }
  }
  return null;
}
function ContentForm({
  contentType,
  initialData = {},
  initialSlug = "",
  isEditing = false,
  onSubmit,
  onCancel
}) {
  const {
    localization: customLocalization,
    uploadImage,
    imagePicker,
    imageInputField,
    fieldComponents
  } = usePluginOverrides("cms");
  const localization = { ...CMS_LOCALIZATION, ...customLocalization };
  const [slug, setSlug] = useState(initialSlug);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(isEditing);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(initialData);
  const [slugError, setSlugError] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const hasSyncedPrefillRef = useRef(false);
  useEffect(() => {
    const hasData = Object.keys(initialData).length > 0;
    const shouldSync = hasData && (isEditing || !hasSyncedPrefillRef.current);
    if (shouldSync) {
      setFormData(initialData);
      if (!isEditing) {
        hasSyncedPrefillRef.current = true;
      }
    }
  }, [initialData, isEditing]);
  useEffect(() => {
    if (isEditing && initialSlug) {
      setSlug(initialSlug);
    }
  }, [initialSlug, isEditing]);
  const jsonSchema = useMemo(() => {
    try {
      return JSON.parse(contentType.jsonSchema);
    } catch {
      return {};
    }
  }, [contentType.jsonSchema]);
  const zodSchema = useMemo(() => {
    try {
      return formSchemaToZod(jsonSchema);
    } catch {
      return object({});
    }
  }, [jsonSchema]);
  const fieldConfig = useMemo(
    () => buildFieldConfigFromJsonSchema(
      jsonSchema,
      uploadImage,
      fieldComponents,
      imagePicker,
      imageInputField
    ),
    [jsonSchema, uploadImage, fieldComponents, imagePicker, imageInputField]
  );
  const slugSourceField = useMemo(
    () => findSlugSourceField(jsonSchema),
    [jsonSchema]
  );
  const handleValuesChange = (values) => {
    setFormData(values);
    if (!isEditing && !slugManuallyEdited && slugSourceField) {
      const sourceValue = values[slugSourceField];
      if (typeof sourceValue === "string" && sourceValue.trim()) {
        setSlug(slugify$2(sourceValue));
      }
    }
  };
  const handleSubmit = async (data) => {
    setSlugError(null);
    setSubmitError(null);
    if (!slug.trim()) {
      setSlugError("Slug is required");
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmit({ slug, data });
    } catch (error) {
      const message = error instanceof Error ? error.message : localization.CMS_TOAST_ERROR;
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "slug", children: localization.CMS_LABEL_SLUG }),
        !isEditing && /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-xs", children: slugManuallyEdited ? localization.CMS_EDITOR_SLUG_MANUAL : localization.CMS_EDITOR_SLUG_AUTO })
      ] }),
      /* @__PURE__ */ jsx(
        Input,
        {
          id: "slug",
          value: slug,
          onChange: (e) => {
            setSlug(e.target.value);
            setSlugError(null);
            if (!isEditing) {
              setSlugManuallyEdited(true);
            }
          },
          disabled: isEditing,
          placeholder: slugSourceField ? `Auto-generated from ${slugSourceField}` : "Enter slug..."
        }
      ),
      slugError && /* @__PURE__ */ jsx("p", { className: "text-sm text-destructive", children: slugError }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: localization.CMS_LABEL_SLUG_DESCRIPTION })
    ] }),
    submitError && /* @__PURE__ */ jsx("div", { className: "rounded-md border border-destructive/50 bg-destructive/10 p-3", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-destructive", children: submitError }) }),
    /* @__PURE__ */ jsx(
      SteppedAutoForm,
      {
        formSchema: zodSchema,
        values: formData,
        onValuesChange: handleValuesChange,
        onSubmit: handleSubmit,
        fieldConfig,
        isSubmitting,
        submitButtonText: isSubmitting ? localization.CMS_STATUS_SAVING : localization.CMS_BUTTON_SAVE,
        children: onCancel && /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: onCancel,
            className: "px-4 py-2 text-sm text-muted-foreground hover:text-foreground",
            children: localization.CMS_BUTTON_CANCEL
          }
        )
      }
    )
  ] });
}
function InverseRelationsPanel({
  contentTypeSlug,
  itemId
}) {
  const { apiBaseURL, apiBasePath, headers, navigate, Link } = usePluginOverrides("cms");
  const basePath = useBasePath();
  const client = createApiClient({
    baseURL: apiBaseURL,
    basePath: apiBasePath
  });
  const { data: inverseRelationsData, isLoading } = useQuery({
    queryKey: ["cmsInverseRelations", contentTypeSlug, itemId],
    queryFn: async () => {
      const response = await client("/content-types/:slug/inverse-relations", {
        method: "GET",
        params: { slug: contentTypeSlug },
        query: { itemId },
        headers
      });
      return response.data?.inverseRelations ?? [];
    },
    staleTime: 1e3 * 60 * 5
  });
  if (isLoading) {
    return /* @__PURE__ */ jsx(Card, { className: "animate-pulse", children: /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx("div", { className: "h-5 w-32 bg-muted rounded" }) }) });
  }
  const inverseRelations = inverseRelationsData ?? [];
  if (inverseRelations.length === 0) {
    return null;
  }
  const sourceTypeCounts = /* @__PURE__ */ new Map();
  for (const rel of inverseRelations) {
    sourceTypeCounts.set(
      rel.sourceType,
      (sourceTypeCounts.get(rel.sourceType) ?? 0) + 1
    );
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold", children: "Related Items" }),
    inverseRelations.map((relation) => /* @__PURE__ */ jsx(
      InverseRelationSection,
      {
        relation,
        contentTypeSlug,
        itemId,
        basePath,
        navigate,
        Link,
        client,
        headers,
        ambiguous: (sourceTypeCounts.get(relation.sourceType) ?? 0) > 1
      },
      `${relation.sourceType}-${relation.fieldName}`
    ))
  ] });
}
function humanizeFieldName(fieldName) {
  const stripped = fieldName.replace(/Ids?$/, "") || fieldName;
  const words = stripped.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/[_-]+/g, " ").trim().split(/\s+/);
  return words.map((w) => w ? w[0].toUpperCase() + w.slice(1) : w).join(" ");
}
function InverseRelationSection({
  relation,
  contentTypeSlug,
  itemId,
  basePath,
  navigate,
  Link,
  client,
  headers,
  ambiguous
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const deleteContent = useDeleteContent(relation.sourceType);
  const { data: itemsData, refetch } = useQuery({
    queryKey: [
      "cmsInverseRelationItems",
      contentTypeSlug,
      relation.sourceType,
      itemId,
      relation.fieldName
    ],
    queryFn: async () => {
      const response = await client(
        "/content-types/:slug/inverse-relations/:sourceType",
        {
          method: "GET",
          params: { slug: contentTypeSlug, sourceType: relation.sourceType },
          query: { itemId, fieldName: relation.fieldName },
          headers
        }
      );
      return response.data ?? { items: [], total: 0 };
    },
    staleTime: 1e3 * 60 * 5,
    enabled: isExpanded
  });
  const items = itemsData?.items ?? [];
  const total = itemsData?.total ?? relation.count;
  const handleDelete = async () => {
    if (deleteItemId) {
      setDeleteError(null);
      try {
        await deleteContent.mutateAsync(deleteItemId);
        setDeleteItemId(null);
        refetch();
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to delete item. Please try again.";
        setDeleteError(message);
      }
    }
  };
  const handleAddNew = () => {
    const createUrl = `${basePath}/cms/${relation.sourceType}/new?prefill_${relation.fieldName}=${itemId}`;
    navigate(createUrl);
  };
  const LinkComponent = Link ?? "a";
  const fieldLabel = ambiguous ? humanizeFieldName(relation.fieldName) : null;
  return /* @__PURE__ */ jsxs(Card, { children: [
    /* @__PURE__ */ jsx(CardHeader, { className: "py-3", children: /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: () => setIsExpanded(!isExpanded),
        className: "flex items-center justify-between w-full text-left",
        children: /* @__PURE__ */ jsxs(CardTitle, { className: "text-base flex items-center gap-2", children: [
          isExpanded ? /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx("span", { children: relation.sourceTypeName }),
          fieldLabel && /* @__PURE__ */ jsxs("span", { className: "font-normal text-muted-foreground", children: [
            "· ",
            fieldLabel
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "font-normal text-muted-foreground", children: [
            "(",
            total,
            ")"
          ] })
        ] })
      }
    ) }),
    isExpanded && /* @__PURE__ */ jsxs(CardContent, { className: "pt-0", children: [
      items.length === 0 ? /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground py-2", children: [
        "No ",
        relation.sourceTypeName.toLowerCase(),
        " items yet."
      ] }) : /* @__PURE__ */ jsx("ul", { className: "space-y-2", children: items.map((item) => {
        const displayValue = getDisplayValue(item);
        const editUrl = `${basePath}/cms/${relation.sourceType}/${item.id}`;
        return /* @__PURE__ */ jsxs(
          "li",
          {
            className: "flex items-center justify-between py-2 px-3 rounded-md bg-muted/50 hover:bg-muted transition-colors",
            children: [
              /* @__PURE__ */ jsxs(
                LinkComponent,
                {
                  href: editUrl,
                  className: "flex-1 text-sm hover:underline flex items-center gap-2",
                  children: [
                    /* @__PURE__ */ jsx("span", { className: "truncate", children: displayValue }),
                    /* @__PURE__ */ jsx(ExternalLink, { className: "h-3 w-3 opacity-50" })
                  ]
                }
              ),
              /* @__PURE__ */ jsx(
                Button,
                {
                  variant: "ghost",
                  size: "icon",
                  className: "h-7 w-7 text-muted-foreground hover:text-destructive",
                  onClick: () => setDeleteItemId(item.id),
                  children: /* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5" })
                }
              )
            ]
          },
          item.id
        );
      }) }),
      /* @__PURE__ */ jsx("div", { className: "mt-3 pt-3 border-t", children: /* @__PURE__ */ jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: handleAddNew,
          className: "w-full",
          children: [
            /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4 mr-2" }),
            "Add ",
            relation.sourceTypeName,
            fieldLabel ? ` (${fieldLabel})` : ""
          ]
        }
      ) })
    ] }),
    /* @__PURE__ */ jsx(
      AlertDialog,
      {
        open: !!deleteItemId,
        onOpenChange: (open) => {
          if (!open) {
            setDeleteItemId(null);
            setDeleteError(null);
          }
        },
        children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
          /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
            /* @__PURE__ */ jsxs(AlertDialogTitle, { children: [
              "Delete ",
              relation.sourceTypeName,
              "?"
            ] }),
            /* @__PURE__ */ jsxs(AlertDialogDescription, { children: [
              "This action cannot be undone. This will permanently delete this",
              " ",
              relation.sourceTypeName.toLowerCase(),
              "."
            ] })
          ] }),
          deleteError && /* @__PURE__ */ jsx("p", { className: "text-sm text-destructive", children: deleteError }),
          /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
            /* @__PURE__ */ jsx(AlertDialogCancel, { children: "Cancel" }),
            /* @__PURE__ */ jsx(
              AlertDialogAction,
              {
                onClick: handleDelete,
                className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                children: "Delete"
              }
            )
          ] })
        ] })
      }
    )
  ] });
}
function getDisplayValue(item) {
  const data = item.parsedData;
  const displayFields = ["name", "title", "label", "content", "author", "slug"];
  for (const field of displayFields) {
    if (typeof data[field] === "string" && data[field]) {
      const value = data[field];
      return value.length > 50 ? `${value.slice(0, 50)}...` : value;
    }
  }
  return item.slug;
}
function usePrefillParams() {
  const [prefillData, setPrefillData] = useState({});
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const parseAndSetPrefillData = () => {
      const params = new URLSearchParams(window.location.search);
      const data = {};
      for (const [key, value] of params.entries()) {
        if (key.startsWith("prefill_")) {
          const fieldName = key.slice("prefill_".length);
          if (fieldName) {
            data[fieldName] = value;
          }
        }
      }
      setPrefillData(data);
    };
    parseAndSetPrefillData();
    window.addEventListener("popstate", parseAndSetPrefillData);
    return () => {
      window.removeEventListener("popstate", parseAndSetPrefillData);
    };
  }, []);
  return prefillData;
}
function convertPrefillToFormData(prefillParams, jsonSchema) {
  const properties = jsonSchema.properties;
  if (!properties) {
    return prefillParams;
  }
  const result = {};
  for (const [fieldName, value] of Object.entries(prefillParams)) {
    const fieldSchema = properties[fieldName];
    if (fieldSchema?.fieldType === "relation" && fieldSchema.relation) {
      if (fieldSchema.relation.type === "belongsTo") {
        result[fieldName] = { id: value };
      } else {
        result[fieldName] = [{ id: value }];
      }
    } else {
      result[fieldName] = value;
    }
  }
  return result;
}
function ContentEditorPage({ typeSlug, id }) {
  const overrides = usePluginOverrides("cms");
  const { navigate } = overrides;
  const localization = { ...CMS_LOCALIZATION, ...overrides.localization };
  const basePath = useBasePath();
  const prefillParams = usePrefillParams();
  useRouteLifecycle({
    routeName: "contentEditor",
    context: {
      path: id ? `/cms/${typeSlug}/${id}` : `/cms/${typeSlug}/new`,
      params: id ? { typeSlug, id } : { typeSlug },
      isSSR: typeof window === "undefined"
    },
    overrides,
    beforeRenderHook: (overrides2, context) => {
      if (overrides2.onBeforeEditorRendered) {
        return overrides2.onBeforeEditorRendered(typeSlug, id ?? null, context);
      }
      return true;
    }
  });
  const { contentTypes } = useSuspenseContentTypes();
  const contentType = contentTypes.find((ct) => ct.slug === typeSlug);
  const isEditing = !!id;
  const { item, isLoading: isLoadingItem } = useContentItem(typeSlug, id ?? "");
  const createContent = useCreateContent(typeSlug);
  const updateContent = useUpdateContent(typeSlug);
  if (!contentType) {
    return /* @__PURE__ */ jsx(PageWrapper, { testId: "cms-editor-page", children: /* @__PURE__ */ jsx("div", { className: "w-full max-w-2xl", children: /* @__PURE__ */ jsx(
      EmptyState,
      {
        title: localization.CMS_ERROR_NOT_FOUND,
        description: "Content type not found"
      }
    ) }) });
  }
  if (isEditing && isLoadingItem) {
    return /* @__PURE__ */ jsx(PageWrapper, { testId: "cms-editor-page", children: /* @__PURE__ */ jsx("div", { className: "w-full max-w-2xl", children: /* @__PURE__ */ jsx(EditorSkeleton, {}) }) });
  }
  if (isEditing && !item) {
    return /* @__PURE__ */ jsx(PageWrapper, { testId: "cms-editor-page", children: /* @__PURE__ */ jsx("div", { className: "w-full max-w-2xl", children: /* @__PURE__ */ jsx(
      EmptyState,
      {
        title: localization.CMS_ERROR_NOT_FOUND,
        description: "Content item not found"
      }
    ) }) });
  }
  const handleSubmit = async (data) => {
    if (isEditing && id) {
      await updateContent.mutateAsync({ id, data });
    } else {
      await createContent.mutateAsync(data);
    }
    navigate(`${basePath}/cms/${typeSlug}`);
  };
  const title = isEditing ? localization.CMS_EDITOR_TITLE_EDIT.replace("{typeName}", contentType.name) : localization.CMS_EDITOR_TITLE_NEW.replace("{typeName}", contentType.name);
  return /* @__PURE__ */ jsx(PageWrapper, { testId: "cms-editor-page", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-2xl space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          onClick: () => navigate(`${basePath}/cms/${typeSlug}`),
          children: /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" })
        }
      ),
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold tracking-tight", children: title })
    ] }),
    /* @__PURE__ */ jsx(
      ContentForm,
      {
        contentType,
        initialData: isEditing ? item?.parsedData ?? void 0 : Object.keys(prefillParams).length > 0 ? convertPrefillToFormData(
          prefillParams,
          JSON.parse(contentType.jsonSchema)
        ) : void 0,
        initialSlug: item?.slug,
        isEditing,
        onSubmit: handleSubmit,
        onCancel: () => navigate(`${basePath}/cms/${typeSlug}`)
      },
      isEditing ? `edit-${id}` : "create"
    ),
    isEditing && id && /* @__PURE__ */ jsx(InverseRelationsPanel, { contentTypeSlug: typeSlug, itemId: id })
  ] }) });
}
export {
  ContentEditorPage
};
