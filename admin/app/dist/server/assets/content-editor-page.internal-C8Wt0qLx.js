import { jsxs, jsx } from "react/jsx-runtime";
import * as React from "react";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Loader2, Trash2, Plus, X, ChevronDown, ChevronRight, ExternalLink, ArrowLeft } from "lucide-react";
import { I as Subscribable, N as notifyManager, J as shallowEqualObjects, al as replaceEqualDeep, O as noop, B as Button, l as usePluginOverrides, T as createApiClient, V as createCMSQueryKeys, _ as formSchemaToZod, am as slugify, D as useBasePath, v as Card, x as CardHeader, y as CardTitle, w as CardContent } from "./router-DU5jczZR.js";
import { z } from "zod";
import { S as SteppedAutoForm } from "./stepped-auto-form-CP6ms7XR.js";
import { a as AutoFormLabel, c as AutoFormTooltip, b as buildFieldConfigFromJsonSchema$1 } from "./index-BCS2IiYe.js";
import { I as Input } from "./input-Db1DsNBl.js";
import { L as Label } from "./label-BdRDX7M-.js";
import { B as Badge } from "./badge-DFvO9DkX.js";
import { c as useContent, d as useCreateContent, C as CMS_LOCALIZATION, b as useDeleteContent, u as useSuspenseContentTypes, e as useContentItem, f as useUpdateContent, E as EmptyState } from "./cms-hooks-BTUtZRnj.js";
import { toast } from "sonner";
import { F as FormItem, b as FormControl, d as FormMessage } from "./form-h3RPcnMA.js";
import { Q as QueryObserver, a as useIsRestoring, b as useQueryErrorResetBoundary, e as ensureSuspenseTimers, c as ensurePreventErrorBoundaryRetry, f as useClearResetErrorBoundary, s as shouldSuspend, g as fetchOptimistic, h as getHasError } from "./useBaseQuery-z1wQ1YES.js";
import { u as useQueryClient } from "./QueryClientProvider-BNL98aJf.js";
import { M as MultipleSelector } from "./multi-select-Dwrj6IWT.js";
import { D as Dialog, e as DialogTrigger, d as DialogContent, a as DialogHeader, b as DialogTitle } from "./dialog-Chz0Zs_g.js";
import { T as Textarea } from "./textarea-DS3tfP2l.js";
import { u as useQuery } from "./useQuery-CQBkpW0a.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-CEYtu72k.js";
import { P as PageWrapper } from "./page-wrapper-DuLRJf3n.js";
import { E as EditorSkeleton } from "./content-editor-page-CmFRCAlQ.js";
import { u as useRouteLifecycle } from "./use-route-lifecycle-CK7wPPTX.js";
import "@tanstack/react-router";
import "@tanstack/react-router-ssr-query";
import "@btst/yar";
import "better-call/client";
import "react-error-boundary";
import "@lukemorales/query-key-factory";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@btst/adapter-drizzle";
import "drizzle-orm/node-postgres";
import "pg";
import "drizzle-orm";
import "drizzle-orm/pg-core";
import "better-call";
import "@btst/db";
import "better-call/node";
import "slug";
import "./separator-2KKe-9Ln.js";
import "./index-CpOdxbMb.js";
import "react-dom";
import "react-hook-form";
import "@hookform/resolvers/zod";
import "./accordion-CYnXr6WS.js";
import "./index-S7rpP7KI.js";
import "./index-rdulpQ7P.js";
import "./index-KZ0RSJRl.js";
import "./index-BUGN0YTJ.js";
import "./index-BI_-Kgeu.js";
import "./checkbox-Ct6-tiwE.js";
import "./index-CshadhlS.js";
import "date-fns";
import "date-fns/locale";
import "./popover-DQgN5wJE.js";
import "./Combination-C2ce2hnQ.js";
import "./select-B_yf4oCD.js";
import "./index-IXOTxK3N.js";
import "./index-x6nDyT23.js";
import "./switch-WrObWEGq.js";
import "@radix-ui/react-switch";
import "@radix-ui/react-label";
import "./useSuspenseQuery--TKlWsW-.js";
import "./useSuspenseInfiniteQuery-BmxntFOE.js";
import "./infiniteQueryObserver-EXEbLXDI.js";
import "./useMutation-wDhDrN3q.js";
import "./useInfiniteQuery-DU3bok0g.js";
import "cmdk";
import "./command-5HTd1Hbk.js";
import "./use-debounce-B6NKG3k-.js";
import "@radix-ui/react-dialog";
import "./404-page-C3c0Rv4c.js";
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
        isUploading && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-background/80", children: /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) })
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
      return z.object({});
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
        setSlug(slugify(sourceValue));
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
