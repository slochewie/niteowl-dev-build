import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useEffect, useCallback, useId, useMemo } from "react";
import { l as usePluginOverrides, D as useBasePath, ar as slugify$1, B as Button, q as cn$1, _ as formSchemaToZod } from "./router-qu_5GP1h.mjs";
import { I as Input } from "./input-Ds7nu5GX.mjs";
import { L as Label } from "./label-DWXXj0lo.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-DRbaYjS4.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { u as useSensors, a as useSensor, K as KeyboardSensor, T as TouchSensor, P as PointerSensor, D as DndContext, c as closestCenter, b as DragOverlay, m as useDroppable, n as useDraggable, C as CSS, v as getEventCoordinates } from "./core.esm-Bjw07ll7.mjs";
import { s as sortableKeyboardCoordinates, a as arrayMove, S as SortableContext, v as verticalListSortingStrategy, u as useSortable } from "./sortable.esm-Cz_svvTh.mjs";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-DEFvB4cH.mjs";
import { b as buildFieldConfigFromJsonSchema, A as AutoForm, d as beautifyObjectName } from "./index-zHebWDbP.mjs";
import { D as Dialog, d as DialogContent, a as DialogHeader, b as DialogTitle, c as DialogDescription, g as DialogFooter } from "./dialog-B4u5EdHX.mjs";
import { createPortal } from "react-dom";
import { S as SteppedAutoForm } from "./stepped-auto-form-mEkHGDwr.mjs";
import { d as useSuspenseFormById, F as FORM_BUILDER_LOCALIZATION, e as useCreateForm, f as useUpdateForm } from "./index-Dsk9Dwgo.mjs";
import "../_libs/better-call.mjs";
import "../_libs/react-error-boundary.mjs";
import "../_libs/pg.mjs";
import "../_libs/slug.mjs";
import "./index-BUGN0YTJ.mjs";
import "./Combination-C2ce2hnQ.mjs";
import "./index-x6nDyT23.mjs";
import "./index-BI_-Kgeu.mjs";
import "./form-Cx2oXTTw.mjs";
import "./accordion-DJKZ9YSV.mjs";
import "./checkbox-DYzrULg_.mjs";
import "./popover-I-2hrCQX.mjs";
import "./separator-dOz0oFNG.mjs";
import "./index-CpOdxbMb.mjs";
import "./useBaseQuery-Bzp30GCu.mjs";
import "./QueryClientProvider-BNL98aJf.mjs";
import { A as ArrowLeft, Y as Save, n as FolderOpen, Z as List, G as GripVertical, P as Plus, f as Check, X, j as Pencil, k as Trash2, _ as Settings2, O as Type, $ as Mail, a0 as Hash, T as TextAlignStart, a1 as SquareCheckBig, a2 as ToggleLeft, a as ChevronDown, x as Circle, a3 as Lock, q as Globe, a4 as Phone, b as Calendar } from "../_libs/lucide-react.mjs";
import { o as object, b as boolean, s as string, n as number, e as date } from "../_libs/zod.mjs";
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
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "./index-IXOTxK3N.mjs";
import "./index-S7rpP7KI.mjs";
import "./index-rdulpQ7P.mjs";
import "./index-KZ0RSJRl.mjs";
import "./index-CshadhlS.mjs";
import "../_libs/react-hook-form.mjs";
import "../_libs/hookform__resolvers.mjs";
import "./switch-DIDzzBgm.mjs";
import "../_libs/radix-ui__react-switch.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-effect-event+[...].mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "./textarea-ClKgIhzC.mjs";
import "../_libs/date-fns.mjs";
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
import "./useQuery-bnZbjTSo.mjs";
import "./useSuspenseQuery-CxR8OJs1.mjs";
import "./useSuspenseInfiniteQuery-BNot5GKT.mjs";
import "./infiniteQueryObserver-CMC81Kyb.mjs";
import "./useMutation-C_XiO15s.mjs";
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
function PaletteItem({ component }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${component.type}`,
    data: {
      type: "palette",
      componentType: component.type
    }
  });
  const Icon = component.icon;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref: setNodeRef,
      ...listeners,
      ...attributes,
      className: cn$1(
        "flex items-center gap-3 p-3 rounded-lg border bg-card cursor-grab active:cursor-grabbing",
        "hover:bg-accent hover:border-accent-foreground/20 transition-colors",
        "touch-none select-none",
        isDragging && "opacity-50"
      ),
      children: [
        Icon && /* @__PURE__ */ jsx(Icon, { className: "h-4 w-4 text-muted-foreground shrink-0" }),
        /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: component.label })
      ]
    }
  );
}
function Palette({ components, className }) {
  return /* @__PURE__ */ jsxs("div", { className: cn$1("flex flex-col gap-2", className), "data-testid": "form-builder-palette", children: [
    /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-muted-foreground mb-2", children: "Components" }),
    /* @__PURE__ */ jsx("div", { className: "flex flex-row flex-wrap lg:flex-col gap-2", children: components.map((component) => /* @__PURE__ */ jsx(PaletteItem, { component }, component.type)) })
  ] });
}
function PaletteDragOverlay({ component }) {
  if (!component) return null;
  const Icon = component.icon;
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 p-3 rounded-lg border bg-card shadow-lg cursor-grabbing", children: [
    Icon && /* @__PURE__ */ jsx(Icon, { className: "h-4 w-4 text-muted-foreground shrink-0" }),
    /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: component.label })
  ] });
}
function SortableField({
  field,
  index,
  component,
  onEdit,
  onDelete,
  onConfigureNested
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: field.id,
    data: {
      type: "field",
      fieldId: field.id,
      index
    }
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };
  const Icon = component?.icon;
  const isContainerField = field.type === "object" || field.type === "array";
  const nestedFieldCount = field.type === "object" ? field.children?.length || 0 : field.itemTemplate?.length || 0;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref: setNodeRef,
      style,
      className: cn$1(
        "group flex items-center gap-2 p-3 rounded-lg border bg-card",
        "transition-all duration-200",
        isDragging && "opacity-50 shadow-lg z-50",
        !isDragging && "hover:border-muted-foreground/30"
      ),
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            ...attributes,
            ...listeners,
            className: cn$1(
              "flex items-center justify-center p-1 rounded cursor-grab active:cursor-grabbing",
              "hover:bg-muted touch-none",
              "min-w-[44px] min-h-[44px] -m-1"
            ),
            onClick: (e) => e.stopPropagation(),
            children: /* @__PURE__ */ jsx(GripVertical, { className: "h-4 w-4 text-muted-foreground" })
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            Icon && /* @__PURE__ */ jsx(Icon, { className: "h-4 w-4 text-muted-foreground shrink-0" }),
            /* @__PURE__ */ jsx("span", { className: "font-medium truncate", children: field.props.label }),
            field.props.required && /* @__PURE__ */ jsx("span", { className: "text-destructive text-sm", children: "*" }),
            isContainerField && /* @__PURE__ */ jsxs("span", { className: "text-xs bg-muted px-1.5 py-0.5 rounded text-muted-foreground", children: [
              nestedFieldCount,
              " ",
              nestedFieldCount === 1 ? "field" : "fields"
            ] })
          ] }),
          field.props.description && /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground truncate mt-0.5", children: field.props.description }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground/60 mt-1", children: component?.label || field.type })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
          isContainerField && onConfigureNested && /* @__PURE__ */ jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              className: cn$1(
                "h-8 w-8 text-muted-foreground hover:text-primary",
                "opacity-0 group-hover:opacity-100 transition-opacity",
                "min-w-[44px] min-h-[44px]"
              ),
              onClick: (e) => {
                e.stopPropagation();
                onConfigureNested();
              },
              title: "Configure nested fields",
              children: /* @__PURE__ */ jsx(Settings2, { className: "h-4 w-4" })
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              className: cn$1(
                "h-8 w-8 text-muted-foreground hover:text-primary",
                "opacity-0 group-hover:opacity-100 transition-opacity",
                "min-w-[44px] min-h-[44px]"
              ),
              onClick: (e) => {
                e.stopPropagation();
                onEdit();
              },
              children: /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" })
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              className: cn$1(
                "h-8 w-8 text-muted-foreground hover:text-destructive",
                "opacity-0 group-hover:opacity-100 transition-opacity",
                "min-w-[44px] min-h-[44px]"
              ),
              onClick: (e) => {
                e.stopPropagation();
                onDelete();
              },
              children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" })
            }
          )
        ] })
      ]
    }
  );
}
function FieldDragOverlay({ field, component }) {
  const Icon = component?.icon;
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 p-3 rounded-lg border bg-card shadow-lg cursor-grabbing", children: [
    /* @__PURE__ */ jsx("div", { className: "p-1", children: /* @__PURE__ */ jsx(GripVertical, { className: "h-4 w-4 text-muted-foreground" }) }),
    /* @__PURE__ */ jsx("div", { className: "flex-1 min-w-0", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      Icon && /* @__PURE__ */ jsx(Icon, { className: "h-4 w-4 text-muted-foreground shrink-0" }),
      /* @__PURE__ */ jsx("span", { className: "font-medium truncate", children: field.props.label })
    ] }) })
  ] });
}
function StepTabs({
  steps,
  activeStepIndex,
  onActiveStepChange,
  onAddStep,
  onDeleteStep,
  onRenameStep,
  className,
  hideStepControls
}) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [editValue, setEditValue] = useState("");
  const handleStartEdit = (index, currentTitle) => {
    setEditingIndex(index);
    setEditValue(currentTitle);
  };
  const handleConfirmEdit = () => {
    if (editingIndex !== null && editValue.trim()) {
      onRenameStep(editingIndex, editValue.trim());
    }
    setEditingIndex(null);
    setEditValue("");
  };
  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditValue("");
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleConfirmEdit();
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };
  if (hideStepControls) {
    return null;
  }
  if (steps.length <= 1) {
    return /* @__PURE__ */ jsxs("div", { className: cn$1("flex items-center gap-2 mb-4", className), children: [
      /* @__PURE__ */ jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: onAddStep,
          className: "gap-1",
          children: [
            /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
            "Add Step"
          ]
        }
      ),
      /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "Add a step to create a multi-step form" })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: cn$1("flex items-center gap-2 mb-4 flex-wrap", className), children: [
    steps.map((step, index) => /* @__PURE__ */ jsx(
      "div",
      {
        className: cn$1(
          "group flex items-center gap-1 px-3 py-1.5 rounded-md border transition-colors",
          activeStepIndex === index ? "bg-primary text-primary-foreground border-primary" : "bg-card hover:bg-muted border-border"
        ),
        children: editingIndex === index ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsx(
            Input,
            {
              value: editValue,
              onChange: (e) => setEditValue(e.target.value),
              onKeyDown: handleKeyDown,
              className: "h-6 w-24 text-sm px-1",
              autoFocus: true
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              className: "h-6 w-6",
              onClick: handleConfirmEdit,
              children: /* @__PURE__ */ jsx(Check, { className: "h-3 w-3" })
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              className: "h-6 w-6",
              onClick: handleCancelEdit,
              children: /* @__PURE__ */ jsx(X, { className: "h-3 w-3" })
            }
          )
        ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => onActiveStepChange(index),
              className: "text-sm font-medium",
              children: step.title
            }
          ),
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: cn$1(
                "flex items-center gap-0.5 ml-1",
                activeStepIndex === index ? "opacity-70 hover:opacity-100" : "opacity-0 group-hover:opacity-100"
              ),
              children: [
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "icon",
                    className: cn$1(
                      "h-5 w-5",
                      activeStepIndex === index ? "hover:bg-primary-foreground/20 text-primary-foreground" : "hover:bg-muted-foreground/20"
                    ),
                    onClick: (e) => {
                      e.stopPropagation();
                      handleStartEdit(index, step.title);
                    },
                    title: "Rename step",
                    children: /* @__PURE__ */ jsx(Pencil, { className: "h-3 w-3" })
                  }
                ),
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "icon",
                    className: cn$1(
                      "h-5 w-5",
                      activeStepIndex === index ? "hover:bg-destructive/20 text-primary-foreground" : "hover:bg-destructive/20 hover:text-destructive"
                    ),
                    onClick: (e) => {
                      e.stopPropagation();
                      onDeleteStep(index);
                    },
                    title: "Delete step",
                    children: /* @__PURE__ */ jsx(Trash2, { className: "h-3 w-3" })
                  }
                )
              ]
            }
          )
        ] })
      },
      step.id
    )),
    /* @__PURE__ */ jsxs(
      Button,
      {
        variant: "outline",
        size: "sm",
        onClick: onAddStep,
        className: "gap-1 h-8",
        children: [
          /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
          "Add Step"
        ]
      }
    )
  ] });
}
function DropZone({ id, isDraggingFromPalette }) {
  const { setNodeRef, isOver } = useDroppable({
    id
  });
  if (!isDraggingFromPalette) {
    return null;
  }
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref: setNodeRef,
      className: cn$1(
        "h-2 rounded-full transition-all duration-200",
        isOver ? "h-3 bg-primary animate-pulse" : "bg-muted-foreground/20"
      )
    }
  );
}
function Canvas({
  fields,
  components,
  onEditField,
  onDeleteField,
  onConfigureNested,
  isDraggingFromPalette,
  className,
  steps,
  activeStepIndex,
  onActiveStepChange,
  onAddStep,
  onDeleteStep,
  onRenameStep,
  hideStepControls
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: "canvas"
  });
  const getComponent = (type) => components.find((c) => c.type === type);
  const visibleFields = useMemo(() => {
    if (steps.length <= 1) {
      return fields;
    }
    return fields.filter((f) => (f.stepGroup ?? 0) === activeStepIndex);
  }, [fields, steps.length, activeStepIndex]);
  const sortableItems = useMemo(() => visibleFields.map((f) => f.id), [visibleFields]);
  return /* @__PURE__ */ jsxs("div", { className: cn$1("flex flex-col h-full", className), children: [
    /* @__PURE__ */ jsx(
      StepTabs,
      {
        steps,
        activeStepIndex,
        onActiveStepChange,
        onAddStep,
        onDeleteStep,
        onRenameStep,
        hideStepControls
      }
    ),
    /* @__PURE__ */ jsx(
      "div",
      {
        ref: setNodeRef,
        "data-testid": "form-builder-canvas",
        className: cn$1(
          "flex-1 p-4 rounded-lg border-2 border-dashed min-h-[400px] transition-colors",
          isOver && isDraggingFromPalette ? "border-primary bg-primary/5" : "border-muted-foreground/20"
        ),
        children: visibleFields.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center h-full text-muted-foreground", "data-testid": "canvas-drop-zone", children: [
          /* @__PURE__ */ jsx("p", { className: "text-lg font-medium", children: "Drop components here" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm", children: steps.length > 1 ? `Drag components from the palette to add to ${steps[activeStepIndex]?.title || "this step"}` : "Drag components from the palette to build your form" })
        ] }) : /* @__PURE__ */ jsx(
          SortableContext,
          {
            items: sortableItems,
            strategy: verticalListSortingStrategy,
            children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
              /* @__PURE__ */ jsx(DropZone, { id: "drop-zone-start", isDraggingFromPalette }),
              visibleFields.map((field, index) => /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
                /* @__PURE__ */ jsx(
                  SortableField,
                  {
                    field,
                    index,
                    component: getComponent(field.type),
                    onEdit: () => onEditField(field.id),
                    onDelete: () => onDeleteField(field.id),
                    onConfigureNested: onConfigureNested ? () => onConfigureNested(field.id) : void 0
                  }
                ),
                /* @__PURE__ */ jsx(DropZone, { id: `drop-zone-${field.id}`, isDraggingFromPalette })
              ] }, field.id))
            ] })
          }
        )
      }
    )
  ] });
}
function EditFieldDialog({
  open,
  onOpenChange,
  field,
  component,
  onUpdate,
  steps = [],
  allFieldIds = []
}) {
  const initialValues = useMemo(() => {
    if (!field) return { fieldName: "", props: {}, key: "" };
    const values = { ...field.props };
    if (Array.isArray(values.options)) {
      values.options = values.options.join("\n");
    }
    return { fieldName: field.id, props: values, key: `${field.id}-${open}` };
  }, [field, open]);
  const [fieldNameOverride, setFieldNameOverride] = useState(null);
  const [localPropsOverride, setLocalPropsOverride] = useState(null);
  const [stepGroupOverride, setStepGroupOverride] = useState(null);
  const fieldName = fieldNameOverride ?? initialValues.fieldName;
  const localProps = localPropsOverride ?? initialValues.props;
  const localStepGroup = stepGroupOverride ?? field?.stepGroup ?? 0;
  const isDuplicateId = useMemo(() => {
    if (!field || fieldName === field.id) return false;
    return allFieldIds.some((id) => id === fieldName && id !== field.id);
  }, [fieldName, field, allFieldIds]);
  const [prevInitial, setPrevInitial] = useState(initialValues);
  if (prevInitial !== initialValues) {
    setPrevInitial(initialValues);
    setFieldNameOverride(null);
    setLocalPropsOverride(null);
    setStepGroupOverride(null);
  }
  const formKey = initialValues.key;
  const handleValuesChange = useCallback(
    (values) => {
      setLocalPropsOverride(values);
    },
    []
  );
  const handleSave = useCallback(() => {
    if (!field) return;
    const props = { ...localProps };
    if (typeof props.options === "string") {
      props.options = props.options.split("\n").map((s) => s.trim()).filter(Boolean);
    }
    const newId = fieldName !== field.id ? fieldName : void 0;
    const stepGroup = stepGroupOverride !== null && stepGroupOverride !== field.stepGroup ? stepGroupOverride : void 0;
    onUpdate(field.id, props, newId, stepGroup);
    onOpenChange(false);
  }, [field, localProps, fieldName, onUpdate, onOpenChange, stepGroupOverride]);
  if (!field || !component) {
    return null;
  }
  const Icon = component.icon;
  const jsonSchema = component.propertiesSchema.toJSONSchema();
  const fieldConfig = buildFieldConfigFromJsonSchema(jsonSchema);
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-md max-h-[90vh] overflow-y-auto", children: [
    /* @__PURE__ */ jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
        Icon && /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5 text-muted-foreground" }),
        "Edit ",
        component.label
      ] }),
      /* @__PURE__ */ jsx(DialogDescription, { children: "Configure the properties for this field" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-4 py-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "field-name", children: "Field Name" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "field-name",
            value: fieldName,
            onChange: (e) => setFieldNameOverride(e.target.value),
            placeholder: "Enter field name",
            className: isDuplicateId ? "border-destructive focus-visible:ring-destructive" : "",
            "aria-invalid": isDuplicateId
          }
        ),
        isDuplicateId ? /* @__PURE__ */ jsx("p", { className: "text-xs text-destructive", children: "A field with this name already exists. Please choose a different name." }) : /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "This is the key used in the form data and JSON schema" })
      ] }),
      steps.length > 1 && field && /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "field-step", children: "Step" }),
        /* @__PURE__ */ jsxs(
          Select,
          {
            value: String(localStepGroup),
            onValueChange: (value) => setStepGroupOverride(parseInt(value, 10)),
            children: [
              /* @__PURE__ */ jsx(SelectTrigger, { id: "field-step", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select step" }) }),
              /* @__PURE__ */ jsx(SelectContent, { children: steps.map((step, index) => /* @__PURE__ */ jsx(SelectItem, { value: String(index), children: step.title }, step.id)) })
            ]
          }
        ),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Which step this field belongs to" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "border-t pt-4", children: /* @__PURE__ */ jsx(
        AutoForm,
        {
          formSchema: component.propertiesSchema,
          values: localProps,
          onValuesChange: handleValuesChange,
          fieldConfig,
          className: "space-y-4"
        },
        formKey
      ) })
    ] }),
    /* @__PURE__ */ jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => onOpenChange(false), children: "Cancel" }),
      /* @__PURE__ */ jsx(Button, { onClick: handleSave, disabled: isDuplicateId, children: "Save Changes" })
    ] })
  ] }) });
}
const snapCenterToCursor = (_ref) => {
  let {
    activatorEvent,
    draggingNodeRect,
    transform
  } = _ref;
  if (draggingNodeRect && activatorEvent) {
    const activatorCoordinates = getEventCoordinates(activatorEvent);
    if (!activatorCoordinates) {
      return transform;
    }
    const offsetX = activatorCoordinates.x - draggingNodeRect.left;
    const offsetY = activatorCoordinates.y - draggingNodeRect.top;
    return {
      ...transform,
      x: transform.x + offsetX - draggingNodeRect.width / 2,
      y: transform.y + offsetY - draggingNodeRect.height / 2
    };
  }
  return transform;
};
function defineComponent(def) {
  return def;
}
const baseMetaSchema = object({
  label: string().min(1).meta({ label: "Label" }),
  description: string().optional().meta({ label: "Description" }),
  required: boolean().default(false).meta({ label: "Required", fieldType: "switch" })
});
const baseMetaSchemaWithPlaceholder = baseMetaSchema.merge(
  object({
    placeholder: string().optional().meta({ label: "Placeholder" })
  })
);
const DEFAULT_VALUE_SCHEMAS = {
  string: string().optional().meta({ label: "Default Value" }),
  number: number().optional().meta({ label: "Default Value" }),
  boolean: boolean().default(false).meta({ label: "Default Value", fieldType: "switch" }),
  date: date().optional().meta({ label: "Default Date", fieldType: "date" }),
  enum: string().optional().meta({
    label: "Default Value",
    description: "Must match one of the options"
  })
};
const stringValidationSchema = object({
  minLength: number().int().min(0).optional().meta({ label: "Min Length" }),
  maxLength: number().int().min(1).optional().meta({ label: "Max Length" })
  // Note: pattern/regex is serializable but requires careful UX for input
  // Uncomment to enable:
  // pattern: z.string().optional().meta({ label: "Pattern (Regex)" }),
});
const numberValidationSchema = object({
  min: number().optional().meta({ label: "Minimum" }),
  max: number().optional().meta({ label: "Maximum" })
  // Note: multipleOf is serializable but less commonly used
  // Uncomment to enable:
  // multipleOf: z.number().optional().meta({ label: "Multiple Of" }),
});
const booleanValidationSchema = object({});
const dateValidationSchema = object({
  // Date min/max can be added when the date serialization is refined
  // minDate: z.date().optional().meta({ label: "Minimum Date", fieldType: "date" }),
  // maxDate: z.date().optional().meta({ label: "Maximum Date", fieldType: "date" }),
});
const enumOptionsSchema = object({
  options: string().meta({
    label: "Options (one per line)",
    fieldType: "textarea",
    description: "Enter each option on a new line"
  })
});
const objectValidationSchema = object({});
const arrayValidationSchema = object({
  minItems: number().int().min(0).optional().meta({ label: "Min Items" }),
  maxItems: number().int().min(1).optional().meta({ label: "Max Items" })
});
function toNumber(value) {
  if (value == null || value === "") return void 0;
  const num = Number(value);
  return isNaN(num) ? void 0 : num;
}
function buildInputProps(placeholder, inputType) {
  const props = {};
  if (placeholder) props.placeholder = placeholder;
  if (inputType) props.type = inputType;
  return Object.keys(props).length > 0 ? props : void 0;
}
function getPlaceholder(prop) {
  return prop.inputProps?.placeholder || prop.placeholder;
}
function getLabel(prop, key) {
  return prop.label || prop.title || beautifyObjectName(key);
}
const textFieldDefinition = defineComponent({
  type: "text",
  backingType: "string",
  label: "Text Input",
  icon: Type,
  defaultProps: {
    label: "Text Field",
    placeholder: "",
    required: false
  },
  propertiesSchema: baseMetaSchemaWithPlaceholder.merge(stringValidationSchema).merge(object({ defaultValue: DEFAULT_VALUE_SCHEMAS.string })),
  toJSONSchema: (props) => ({
    type: "string",
    label: props.label,
    description: props.description,
    inputProps: buildInputProps(props.placeholder),
    default: props.defaultValue,
    minLength: toNumber(props.minLength),
    maxLength: toNumber(props.maxLength)
  }),
  fromJSONSchema: (prop, key, isRequired) => {
    if (prop.type !== "string" || prop.enum || prop.fieldType || prop.inputType || prop.format || prop.inputProps?.type) {
      return null;
    }
    return {
      id: key,
      type: "text",
      props: {
        label: getLabel(prop, key),
        placeholder: getPlaceholder(prop),
        description: prop.description,
        required: isRequired,
        defaultValue: prop.default,
        minLength: prop.minLength,
        maxLength: prop.maxLength
      }
    };
  }
});
const emailFieldDefinition = defineComponent({
  type: "email",
  backingType: "string",
  label: "Email",
  icon: Mail,
  defaultProps: {
    label: "Email",
    placeholder: "email@example.com",
    required: false
  },
  propertiesSchema: baseMetaSchemaWithPlaceholder.merge(object({ defaultValue: DEFAULT_VALUE_SCHEMAS.string })),
  toJSONSchema: (props) => ({
    type: "string",
    label: props.label,
    description: props.description,
    inputProps: buildInputProps(props.placeholder, "email"),
    default: props.defaultValue,
    format: "email"
  }),
  fromJSONSchema: (prop, key, isRequired) => {
    if (prop.type !== "string" || prop.format !== "email" && prop.inputType !== "email" && prop.inputProps?.type !== "email") {
      return null;
    }
    return {
      id: key,
      type: "email",
      props: {
        label: getLabel(prop, key),
        placeholder: getPlaceholder(prop),
        description: prop.description,
        required: isRequired,
        defaultValue: prop.default
      }
    };
  }
});
const numberFieldDefinition = defineComponent({
  type: "number",
  backingType: "number",
  label: "Number",
  icon: Hash,
  defaultProps: {
    label: "Number",
    required: false
  },
  propertiesSchema: baseMetaSchemaWithPlaceholder.merge(numberValidationSchema).merge(object({ defaultValue: DEFAULT_VALUE_SCHEMAS.number })),
  toJSONSchema: (props) => ({
    type: "number",
    label: props.label,
    description: props.description,
    inputProps: buildInputProps(props.placeholder),
    default: props.defaultValue,
    // toNumber handles form input which may come as strings
    minimum: toNumber(props.min),
    maximum: toNumber(props.max)
  }),
  fromJSONSchema: (prop, key, isRequired) => {
    if (prop.type !== "number" && prop.type !== "integer") {
      return null;
    }
    return {
      id: key,
      type: "number",
      props: {
        label: getLabel(prop, key),
        placeholder: getPlaceholder(prop),
        description: prop.description,
        required: isRequired,
        defaultValue: prop.default,
        min: prop.minimum,
        max: prop.maximum
      }
    };
  }
});
const textareaFieldDefinition = defineComponent({
  type: "textarea",
  backingType: "string",
  label: "Text Area",
  icon: TextAlignStart,
  defaultProps: {
    label: "Text Area",
    placeholder: "",
    required: false
  },
  propertiesSchema: baseMetaSchemaWithPlaceholder.merge(stringValidationSchema).merge(object({ defaultValue: DEFAULT_VALUE_SCHEMAS.string })),
  toJSONSchema: (props) => ({
    type: "string",
    label: props.label,
    description: props.description,
    fieldType: "textarea",
    inputProps: buildInputProps(props.placeholder),
    default: props.defaultValue,
    minLength: toNumber(props.minLength),
    maxLength: toNumber(props.maxLength)
  }),
  fromJSONSchema: (prop, key, isRequired) => {
    if (prop.type !== "string" || prop.fieldType !== "textarea") {
      return null;
    }
    return {
      id: key,
      type: "textarea",
      props: {
        label: getLabel(prop, key),
        placeholder: getPlaceholder(prop),
        description: prop.description,
        required: isRequired,
        defaultValue: prop.default,
        minLength: prop.minLength,
        maxLength: prop.maxLength
      }
    };
  }
});
const checkboxFieldDefinition = defineComponent({
  type: "checkbox",
  backingType: "boolean",
  label: "Checkbox",
  icon: SquareCheckBig,
  defaultProps: {
    label: "Checkbox",
    required: false
  },
  propertiesSchema: baseMetaSchema.merge(booleanValidationSchema).merge(object({ defaultValue: DEFAULT_VALUE_SCHEMAS.boolean })),
  toJSONSchema: (props) => ({
    type: "boolean",
    label: props.label,
    description: props.description,
    default: props.defaultValue
  }),
  fromJSONSchema: (prop, key, isRequired) => {
    if (prop.type !== "boolean" || prop.fieldType === "switch") {
      return null;
    }
    return {
      id: key,
      type: "checkbox",
      props: {
        label: getLabel(prop, key),
        description: prop.description,
        required: isRequired,
        defaultValue: prop.default
      }
    };
  }
});
const switchFieldDefinition = defineComponent({
  type: "switch",
  backingType: "boolean",
  label: "Switch",
  icon: ToggleLeft,
  defaultProps: {
    label: "Switch",
    required: false
  },
  propertiesSchema: baseMetaSchema.merge(booleanValidationSchema).merge(object({ defaultValue: DEFAULT_VALUE_SCHEMAS.boolean })),
  toJSONSchema: (props) => ({
    type: "boolean",
    label: props.label,
    description: props.description,
    fieldType: "switch",
    default: props.defaultValue
  }),
  fromJSONSchema: (prop, key, isRequired) => {
    if (prop.type !== "boolean" || prop.fieldType !== "switch") {
      return null;
    }
    return {
      id: key,
      type: "switch",
      props: {
        label: getLabel(prop, key),
        description: prop.description,
        required: isRequired,
        defaultValue: prop.default
      }
    };
  }
});
const selectFieldDefinition = defineComponent({
  type: "select",
  backingType: "enum",
  label: "Select",
  icon: ChevronDown,
  defaultProps: {
    label: "Select Field",
    required: false,
    options: ["Option 1", "Option 2", "Option 3"]
  },
  propertiesSchema: baseMetaSchemaWithPlaceholder.merge(enumOptionsSchema).merge(object({ defaultValue: DEFAULT_VALUE_SCHEMAS.enum })),
  toJSONSchema: (props) => ({
    type: "string",
    label: props.label,
    description: props.description,
    inputProps: buildInputProps(props.placeholder),
    default: props.defaultValue,
    enum: props.options
  }),
  fromJSONSchema: (prop, key, isRequired) => {
    if (prop.type !== "string" || !prop.enum || prop.fieldType === "radio") {
      return null;
    }
    return {
      id: key,
      type: "select",
      props: {
        label: getLabel(prop, key),
        placeholder: getPlaceholder(prop),
        description: prop.description,
        required: isRequired,
        defaultValue: prop.default,
        options: prop.enum
      }
    };
  }
});
const radioFieldDefinition = defineComponent({
  type: "radio",
  backingType: "enum",
  label: "Radio Group",
  icon: Circle,
  defaultProps: {
    label: "Radio Group",
    required: false,
    options: ["Option 1", "Option 2", "Option 3"]
  },
  propertiesSchema: baseMetaSchema.merge(enumOptionsSchema).merge(object({ defaultValue: DEFAULT_VALUE_SCHEMAS.enum })),
  toJSONSchema: (props) => ({
    type: "string",
    label: props.label,
    description: props.description,
    fieldType: "radio",
    default: props.defaultValue,
    enum: props.options
  }),
  fromJSONSchema: (prop, key, isRequired) => {
    if (prop.type !== "string" || !prop.enum || prop.fieldType !== "radio") {
      return null;
    }
    return {
      id: key,
      type: "radio",
      props: {
        label: getLabel(prop, key),
        description: prop.description,
        required: isRequired,
        defaultValue: prop.default,
        options: prop.enum
      }
    };
  }
});
const passwordFieldDefinition = defineComponent({
  type: "password",
  backingType: "string",
  label: "Password",
  icon: Lock,
  defaultProps: {
    label: "Password",
    placeholder: "••••••••",
    required: false
  },
  propertiesSchema: baseMetaSchemaWithPlaceholder.merge(stringValidationSchema).merge(object({ defaultValue: DEFAULT_VALUE_SCHEMAS.string })),
  toJSONSchema: (props) => ({
    type: "string",
    label: props.label,
    description: props.description,
    inputProps: buildInputProps(props.placeholder, "password"),
    default: props.defaultValue,
    minLength: toNumber(props.minLength),
    maxLength: toNumber(props.maxLength)
  }),
  fromJSONSchema: (prop, key, isRequired) => {
    if (prop.type !== "string" || prop.inputType !== "password" && prop.inputProps?.type !== "password") {
      return null;
    }
    return {
      id: key,
      type: "password",
      props: {
        label: getLabel(prop, key),
        placeholder: getPlaceholder(prop),
        description: prop.description,
        required: isRequired,
        defaultValue: prop.default,
        minLength: prop.minLength,
        maxLength: prop.maxLength
      }
    };
  }
});
const urlFieldDefinition = defineComponent({
  type: "url",
  backingType: "string",
  label: "Website URL",
  icon: Globe,
  defaultProps: {
    label: "Website",
    placeholder: "https://example.com",
    required: false
  },
  propertiesSchema: baseMetaSchemaWithPlaceholder.merge(object({ defaultValue: DEFAULT_VALUE_SCHEMAS.string })),
  toJSONSchema: (props) => ({
    type: "string",
    label: props.label,
    description: props.description,
    inputProps: buildInputProps(props.placeholder),
    default: props.defaultValue,
    format: "uri"
  }),
  fromJSONSchema: (prop, key, isRequired) => {
    if (prop.type !== "string" || prop.format !== "uri") {
      return null;
    }
    return {
      id: key,
      type: "url",
      props: {
        label: getLabel(prop, key),
        placeholder: getPlaceholder(prop),
        description: prop.description,
        required: isRequired,
        defaultValue: prop.default
      }
    };
  }
});
const phoneFieldDefinition = defineComponent({
  type: "phone",
  backingType: "string",
  label: "Phone Number",
  icon: Phone,
  defaultProps: {
    label: "Phone Number",
    placeholder: "+1 (555) 123-4567",
    required: false
  },
  propertiesSchema: baseMetaSchemaWithPlaceholder.merge(object({ defaultValue: DEFAULT_VALUE_SCHEMAS.string })),
  toJSONSchema: (props) => ({
    type: "string",
    label: props.label,
    description: props.description,
    inputProps: buildInputProps(props.placeholder, "tel"),
    default: props.defaultValue
  }),
  fromJSONSchema: (prop, key, isRequired) => {
    if (prop.type !== "string" || prop.inputType !== "tel" && prop.inputProps?.type !== "tel") {
      return null;
    }
    return {
      id: key,
      type: "phone",
      props: {
        label: getLabel(prop, key),
        placeholder: getPlaceholder(prop),
        description: prop.description,
        required: isRequired,
        defaultValue: prop.default
      }
    };
  }
});
const dateFieldDefinition = defineComponent({
  type: "date",
  backingType: "date",
  label: "Date Picker",
  icon: Calendar,
  defaultProps: {
    label: "Date",
    required: false
  },
  propertiesSchema: baseMetaSchema.merge(dateValidationSchema),
  toJSONSchema: (props) => ({
    type: "string",
    format: "date-time",
    fieldType: "date",
    label: props.label,
    description: props.description
  }),
  fromJSONSchema: (prop, key, isRequired) => {
    if (prop.type !== "string" || prop.format !== "date-time" && prop.fieldType !== "date") {
      return null;
    }
    return {
      id: key,
      type: "date",
      props: {
        label: getLabel(prop, key),
        description: prop.description,
        required: isRequired
      }
    };
  }
});
const objectFieldDefinition = {
  type: "object",
  label: "Field Group",
  icon: FolderOpen,
  defaultProps: {
    label: "Field Group",
    required: false
  },
  propertiesSchema: baseMetaSchema.extend(objectValidationSchema.shape),
  toJSONSchema: (props) => ({
    type: "object",
    label: props.label,
    description: props.description,
    // properties will be filled in by schema-utils from field.children
    properties: {}
  }),
  fromJSONSchema: (prop, key, isRequired) => {
    if (prop.type !== "object" || !prop.properties) {
      return null;
    }
    return {
      id: key,
      type: "object",
      props: {
        label: getLabel(prop, key),
        description: prop.description,
        required: isRequired
      },
      // children will be filled in by schema-utils
      children: []
    };
  }
};
const arrayFieldDefinition = {
  type: "array",
  label: "Repeating Group",
  icon: List,
  defaultProps: {
    label: "Items",
    required: false
  },
  propertiesSchema: baseMetaSchema.extend(arrayValidationSchema.shape),
  toJSONSchema: (props) => ({
    type: "array",
    label: props.label,
    description: props.description,
    minItems: props.minItems,
    maxItems: props.maxItems,
    // items will be filled in by schema-utils from field.itemTemplate
    items: {
      type: "object",
      properties: {}
    }
  }),
  fromJSONSchema: (prop, key, isRequired) => {
    if (prop.type !== "array" || !prop.items) {
      return null;
    }
    return {
      id: key,
      type: "array",
      props: {
        label: getLabel(prop, key),
        description: prop.description,
        required: isRequired,
        minItems: prop.minItems,
        maxItems: prop.maxItems
      },
      // itemTemplate will be filled in by schema-utils
      itemTemplate: []
    };
  }
};
const defaultComponents = [
  // Container types (must be before primitives to match object/array JSON Schema)
  objectFieldDefinition,
  arrayFieldDefinition,
  // Specific types first
  emailFieldDefinition,
  passwordFieldDefinition,
  urlFieldDefinition,
  phoneFieldDefinition,
  dateFieldDefinition,
  textareaFieldDefinition,
  switchFieldDefinition,
  radioFieldDefinition,
  selectFieldDefinition,
  checkboxFieldDefinition,
  numberFieldDefinition,
  // Generic fallback last
  textFieldDefinition
];
function getComponentByType(type, components = defaultComponents) {
  return components.find((c) => c.type === type);
}
function fieldsToProperties(fields, components, includeStepGroup = false) {
  const properties = {};
  for (const field of fields) {
    const component = components.find((c) => c.type === field.type);
    if (!component) {
      console.warn(`Unknown component type: ${field.type}`);
      continue;
    }
    const isRequired = field.props.required ?? false;
    const schemaProp = component.toJSONSchema(field.props, isRequired);
    if (includeStepGroup && field.stepGroup !== void 0) {
      schemaProp.stepGroup = field.stepGroup;
    }
    if (field.type === "object" && field.children && field.children.length > 0) {
      schemaProp.properties = fieldsToProperties(field.children, components, false);
      const childRequired = field.children.filter((child) => child.props.required).map((child) => child.id);
      if (childRequired.length > 0) {
        schemaProp.required = childRequired;
      }
    }
    if (field.type === "array" && field.itemTemplate && field.itemTemplate.length > 0) {
      schemaProp.items = {
        type: "object",
        properties: fieldsToProperties(field.itemTemplate, components, false)
      };
      const itemRequired = field.itemTemplate.filter((item) => item.props.required).map((item) => item.id);
      if (itemRequired.length > 0) {
        schemaProp.items.required = itemRequired;
      }
    }
    properties[field.id] = schemaProp;
  }
  return properties;
}
function getRequiredFieldIds(fields) {
  return fields.filter((f) => f.props.required).map((f) => f.id);
}
function fieldsToJSONSchema(fields, components, steps) {
  const hasMultipleSteps = steps && steps.length > 1;
  const properties = fieldsToProperties(fields, components, hasMultipleSteps);
  const required = getRequiredFieldIds(fields);
  return {
    type: "object",
    properties,
    ...required.length > 0 ? { required } : {},
    // Only include steps if there are multiple steps
    ...hasMultipleSteps ? { steps } : {}
  };
}
function propertiesToFields(properties, requiredSet, components, stepGroupMap) {
  const fields = [];
  for (const [key, prop] of Object.entries(properties)) {
    const isRequired = requiredSet.has(key);
    let field = null;
    for (const component of components) {
      field = component.fromJSONSchema(prop, key, isRequired);
      if (field) {
        break;
      }
    }
    const resolvedStepGroup = prop.stepGroup !== void 0 ? prop.stepGroup : stepGroupMap?.[key];
    if (field) {
      if (resolvedStepGroup !== void 0) {
        field.stepGroup = resolvedStepGroup;
      }
      if (field.type === "object" && prop.properties) {
        const childRequiredSet = new Set(prop.required || []);
        field.children = propertiesToFields(prop.properties, childRequiredSet, components);
      }
      if (field.type === "array" && prop.items?.properties) {
        const itemRequiredSet = new Set(prop.items.required || []);
        field.itemTemplate = propertiesToFields(prop.items.properties, itemRequiredSet, components);
      }
      fields.push(field);
    } else {
      console.warn(`Could not parse JSON Schema property: ${key}`, prop);
      fields.push({
        id: key,
        type: "text",
        props: {
          label: prop.label || prop.title || beautifyObjectName(key),
          description: prop.description,
          placeholder: prop.placeholder,
          required: isRequired
        },
        // Include stepGroup even for fallback fields
        ...resolvedStepGroup !== void 0 ? { stepGroup: resolvedStepGroup } : {}
      });
    }
  }
  return fields;
}
function jsonSchemaToFieldsAndSteps(schema, components) {
  if (!schema || !schema.properties) {
    return { fields: [], steps: [] };
  }
  const requiredSet = new Set(schema.required || []);
  const fields = propertiesToFields(
    schema.properties,
    requiredSet,
    components,
    schema.stepGroupMap
  );
  const steps = schema.steps || [];
  return { fields, steps };
}
function generateFieldId(prefix = "field") {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
function generateStepId() {
  return `step_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
function createStep(index) {
  return {
    id: generateStepId(),
    title: `Step ${index + 1}`
  };
}
function NestedFieldEditorDialog({
  open,
  onOpenChange,
  field,
  components,
  onSave
}) {
  const dndContextId = useId();
  const initialFields = useMemo(() => {
    if (!field) return [];
    if (field.type === "object") return field.children || [];
    if (field.type === "array") return field.itemTemplate || [];
    return [];
  }, [field]);
  const [nestedFields, setNestedFields] = useState(initialFields);
  const [activeId, setActiveId] = useState(null);
  const [editDialogFieldId, setEditDialogFieldId] = useState(null);
  const [prevField, setPrevField] = useState(field);
  const [prevOpen, setPrevOpen] = useState(open);
  if (prevField !== field || open && !prevOpen) {
    setPrevField(field);
    setPrevOpen(open);
    setNestedFields(initialFields);
    setEditDialogFieldId(null);
  }
  if (prevOpen !== open) {
    setPrevOpen(open);
  }
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 }
    }),
    useSensor(TouchSensor, {
      activationConstraint: { distance: 8 }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );
  const activeDragData = useMemo(() => {
    if (!activeId) return null;
    const idStr = String(activeId);
    if (idStr.startsWith("palette-")) {
      const componentType = idStr.replace("palette-", "");
      return {
        type: "palette",
        componentType,
        component: getComponentByType(componentType, components)
      };
    }
    const nestedField = nestedFields.find((f) => f.id === idStr);
    if (nestedField) {
      return {
        type: "field",
        field: nestedField,
        component: getComponentByType(nestedField.type, components)
      };
    }
    return null;
  }, [activeId, nestedFields, components]);
  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };
  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;
    const activeData = active.data.current;
    if (activeData?.type === "palette") {
      const { componentType } = activeData;
      const component = getComponentByType(componentType, components);
      if (component) {
        const newField = {
          id: generateFieldId(componentType),
          type: componentType,
          props: {
            label: component.defaultProps.label || component.label,
            ...component.defaultProps
          }
        };
        let insertIndex = nestedFields.length;
        const overId = String(over.id);
        if (overId === "drop-zone-start") {
          insertIndex = 0;
        } else if (overId.startsWith("drop-zone-")) {
          const fieldId = overId.replace("drop-zone-", "");
          const overIndex = nestedFields.findIndex((f) => f.id === fieldId);
          if (overIndex !== -1) {
            insertIndex = overIndex + 1;
          }
        } else if (overId !== "canvas") {
          const overIndex = nestedFields.findIndex((f) => f.id === overId);
          if (overIndex !== -1) {
            insertIndex = overIndex + 1;
          }
        }
        const newFields = [...nestedFields];
        newFields.splice(insertIndex, 0, newField);
        setNestedFields(newFields);
      }
      return;
    }
    if (activeData?.type === "field" && active.id !== over.id) {
      const oldIndex = nestedFields.findIndex((f) => f.id === active.id);
      const newIndex = nestedFields.findIndex((f) => f.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        setNestedFields(arrayMove(nestedFields, oldIndex, newIndex));
      }
    }
  };
  const handleDeleteField = useCallback((id) => {
    setNestedFields((fields) => fields.filter((f) => f.id !== id));
  }, []);
  const handleEditField = useCallback((id) => {
    setEditDialogFieldId(id);
  }, []);
  const handleUpdateField = useCallback(
    (id, props, newId) => {
      if (newId && newId !== id) {
        const idExists = nestedFields.some((f) => f.id === newId && f.id !== id);
        if (idExists) {
          console.warn(`Cannot rename field "${id}" to "${newId}": a field with that ID already exists`);
          return;
        }
      }
      setNestedFields(
        (fields) => fields.map((f) => {
          if (f.id !== id) return f;
          return {
            ...f,
            id: newId || f.id,
            props: { ...f.props, ...props }
          };
        })
      );
    },
    [nestedFields]
  );
  const handleSave = useCallback(() => {
    if (!field) return;
    onSave(field.id, nestedFields);
    onOpenChange(false);
  }, [field, nestedFields, onSave, onOpenChange]);
  if (!field) return null;
  const isObjectField = field.type === "object";
  const Icon = isObjectField ? FolderOpen : List;
  const fieldTypeLabel = isObjectField ? "Field Group" : "Repeating Group";
  const nestedLabel = isObjectField ? "nested fields" : "item fields";
  const editDialogField = nestedFields.find((f) => f.id === editDialogFieldId) || null;
  const editDialogComponent = editDialogField ? getComponentByType(editDialogField.type, components) || null : null;
  return /* @__PURE__ */ jsxs(Dialog, { open, onOpenChange, children: [
    /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-6xl! max-h-[90vh] overflow-hidden flex flex-col", children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5 text-muted-foreground" }),
          "Configure ",
          fieldTypeLabel,
          ": ",
          field.props.label
        ] }),
        /* @__PURE__ */ jsxs(DialogDescription, { children: [
          "Add and arrange the ",
          nestedLabel,
          " for this ",
          fieldTypeLabel.toLowerCase(),
          ".",
          isObjectField ? " These fields will be grouped together." : " Each item in the array will have these fields."
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-hidden", children: /* @__PURE__ */ jsxs(
        DndContext,
        {
          id: dndContextId,
          sensors,
          collisionDetection: closestCenter,
          onDragStart: handleDragStart,
          onDragEnd: handleDragEnd,
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex h-[50vh] gap-4", children: [
              /* @__PURE__ */ jsx("div", { className: "w-48 overflow-auto shrink-0 border-r pr-4", children: /* @__PURE__ */ jsx(Palette, { components }) }),
              /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-auto", children: /* @__PURE__ */ jsx(
                Canvas,
                {
                  fields: nestedFields,
                  components,
                  onEditField: handleEditField,
                  onDeleteField: handleDeleteField,
                  isDraggingFromPalette: activeDragData?.type === "palette",
                  steps: [],
                  activeStepIndex: 0,
                  onActiveStepChange: () => {
                  },
                  onAddStep: () => {
                  },
                  onDeleteStep: () => {
                  },
                  onRenameStep: () => {
                  },
                  hideStepControls: true
                }
              ) })
            ] }),
            typeof document !== "undefined" && createPortal(
              /* @__PURE__ */ jsxs(DragOverlay, { dropAnimation: null, modifiers: [snapCenterToCursor], children: [
                activeDragData?.type === "palette" && activeDragData.component && /* @__PURE__ */ jsx(PaletteDragOverlay, { component: activeDragData.component }),
                activeDragData?.type === "field" && activeDragData.field && /* @__PURE__ */ jsx(
                  FieldDragOverlay,
                  {
                    field: activeDragData.field,
                    component: activeDragData.component
                  }
                )
              ] }),
              document.body
            )
          ]
        }
      ) }),
      /* @__PURE__ */ jsxs(DialogFooter, { className: "border-t pt-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground mr-auto", children: [
          nestedFields.length,
          " ",
          nestedFields.length === 1 ? "field" : "fields"
        ] }),
        /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => onOpenChange(false), children: "Cancel" }),
        /* @__PURE__ */ jsx(Button, { onClick: handleSave, children: "Save Fields" })
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      EditFieldDialog,
      {
        open: editDialogFieldId !== null,
        onOpenChange: (open2) => !open2 && setEditDialogFieldId(null),
        field: editDialogField,
        component: editDialogComponent,
        onUpdate: handleUpdateField,
        steps: [],
        allFieldIds: nestedFields.map((f) => f.id)
      }
    )
  ] });
}
function FormPreview({ schema, className, fieldComponents, defaultValues }) {
  const [submittedValues, setSubmittedValues] = useState(null);
  const zodSchema = useMemo(() => {
    try {
      if (!schema.properties || Object.keys(schema.properties).length === 0) {
        return null;
      }
      return formSchemaToZod(schema);
    } catch (error) {
      console.error("Failed to parse JSON Schema:", error);
      return null;
    }
  }, [schema]);
  const mergedFieldComponents = useMemo(() => fieldComponents ?? {}, [fieldComponents]);
  const fieldConfig = useMemo(() => {
    try {
      return buildFieldConfigFromJsonSchema(
        schema,
        mergedFieldComponents
      );
    } catch (error) {
      console.error("Failed to build field config:", error);
      return {};
    }
  }, [schema, mergedFieldComponents]);
  const handleSubmit = (values) => {
    setSubmittedValues(values);
  };
  const handleReset = () => {
    setSubmittedValues(null);
  };
  if (!zodSchema) {
    return /* @__PURE__ */ jsxs("div", { className: cn$1("p-8 text-center text-muted-foreground", className), children: [
      /* @__PURE__ */ jsx("p", { className: "text-lg font-medium mb-2", children: "No fields to preview" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm", children: "Add some fields to your form to see a preview" })
    ] });
  }
  return /* @__PURE__ */ jsx("div", { className: cn$1("p-4 md:p-6", className), children: /* @__PURE__ */ jsx("div", { className: "max-w-2xl mx-auto", children: submittedValues ? /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold", children: "Submitted Values" }),
      /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: handleReset, children: "Try Again" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "rounded-lg border bg-muted/50 p-4", children: /* @__PURE__ */ jsx("pre", { className: "text-sm overflow-auto whitespace-pre-wrap", children: JSON.stringify(submittedValues, null, 2) }) })
  ] }) : /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-6", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold", children: "Form Preview" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Test your form and see the submitted values" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "rounded-lg border bg-card p-6", children: /* @__PURE__ */ jsx(
      SteppedAutoForm,
      {
        formSchema: zodSchema,
        onSubmit: handleSubmit,
        fieldConfig,
        values: defaultValues,
        submitButtonText: "Submit"
      }
    ) })
  ] }) }) });
}
function FormBuilder({
  components = defaultComponents,
  value,
  onChange,
  className,
  fieldComponents,
  defaultValues
}) {
  const dndContextId = useId();
  const [fields, setFields] = useState(() => {
    if (!value) return [];
    const { fields: parsedFields } = jsonSchemaToFieldsAndSteps(value, components);
    return parsedFields;
  });
  const [steps, setSteps] = useState(() => {
    if (!value) return [];
    const { steps: parsedSteps } = jsonSchemaToFieldsAndSteps(value, components);
    return parsedSteps;
  });
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [editDialogFieldId, setEditDialogFieldId] = useState(null);
  const [nestedEditorFieldId, setNestedEditorFieldId] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const notifyChange = useCallback(
    (newFields, newSteps) => {
      if (onChange) {
        const schema = fieldsToJSONSchema(newFields, components, newSteps ?? steps);
        onChange(schema);
      }
    },
    [onChange, components, steps]
  );
  const currentSchema = useMemo(
    () => fieldsToJSONSchema(fields, components, steps),
    [fields, components, steps]
  );
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8
      }
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        // Use distance instead of delay for better compatibility with
        // automated testing tools and faster touch interactions
        distance: 8
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );
  const activeDragData = useMemo(() => {
    if (!activeId) return null;
    const idStr = String(activeId);
    if (idStr.startsWith("palette-")) {
      const componentType = idStr.replace("palette-", "");
      return {
        type: "palette",
        componentType,
        component: getComponentByType(componentType, components)
      };
    }
    const field = fields.find((f) => f.id === idStr);
    if (field) {
      return {
        type: "field",
        field,
        component: getComponentByType(field.type, components)
      };
    }
    return null;
  }, [activeId, fields, components]);
  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };
  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;
    const activeData = active.data.current;
    if (activeData?.type === "palette") {
      const { componentType } = activeData;
      const component = getComponentByType(componentType, components);
      if (component) {
        const newField = {
          id: generateFieldId(componentType),
          type: componentType,
          props: {
            label: component.defaultProps.label || component.label,
            ...component.defaultProps
          },
          // Assign to active step when in multi-step mode
          ...steps.length > 1 ? { stepGroup: activeStepIndex } : {}
        };
        let insertIndex = fields.length;
        const overId = String(over.id);
        if (overId === "drop-zone-start") {
          insertIndex = 0;
        } else if (overId.startsWith("drop-zone-")) {
          const fieldId = overId.replace("drop-zone-", "");
          const overIndex = fields.findIndex((f) => f.id === fieldId);
          if (overIndex !== -1) {
            insertIndex = overIndex + 1;
          }
        } else if (overId !== "canvas") {
          const overIndex = fields.findIndex((f) => f.id === overId);
          if (overIndex !== -1) {
            insertIndex = overIndex + 1;
          }
        }
        const newFields = [...fields];
        newFields.splice(insertIndex, 0, newField);
        setFields(newFields);
        notifyChange(newFields);
      }
      return;
    }
    if (activeData?.type === "field" && active.id !== over.id) {
      const oldIndex = fields.findIndex((f) => f.id === active.id);
      const newIndex = fields.findIndex((f) => f.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        const newFields = arrayMove(fields, oldIndex, newIndex);
        setFields(newFields);
        notifyChange(newFields);
      }
    }
  };
  const handleUpdateField = useCallback(
    (id, props, newId, stepGroup) => {
      if (newId && newId !== id) {
        const idExists = fields.some((f) => f.id === newId && f.id !== id);
        if (idExists) {
          console.warn(`Cannot rename field "${id}" to "${newId}": a field with that ID already exists`);
          return;
        }
      }
      const newFields = fields.map((f) => {
        if (f.id !== id) return f;
        const updated = {
          ...f,
          id: newId || f.id,
          props: { ...f.props, ...props }
        };
        if (stepGroup !== void 0) {
          updated.stepGroup = stepGroup;
        }
        return updated;
      });
      setFields(newFields);
      notifyChange(newFields);
    },
    [fields, notifyChange]
  );
  const handleEditField = useCallback((id) => {
    setEditDialogFieldId(id);
  }, []);
  const handleDeleteField = useCallback(
    (id) => {
      const newFields = fields.filter((f) => f.id !== id);
      setFields(newFields);
      notifyChange(newFields);
    },
    [fields, notifyChange]
  );
  const handleConfigureNested = useCallback((id) => {
    setNestedEditorFieldId(id);
  }, []);
  const handleSaveNestedFields = useCallback(
    (fieldId, nestedFields) => {
      const newFields = fields.map((f) => {
        if (f.id !== fieldId) return f;
        if (f.type === "object") {
          return { ...f, children: nestedFields };
        } else if (f.type === "array") {
          return { ...f, itemTemplate: nestedFields };
        }
        return f;
      });
      setFields(newFields);
      notifyChange(newFields);
    },
    [fields, notifyChange]
  );
  const handleAddStep = useCallback(() => {
    const newStep = createStep(steps.length);
    const newSteps = [...steps, newStep];
    if (steps.length === 1) {
      const updatedFields = fields.map((f) => ({ ...f, stepGroup: 0 }));
      setFields(updatedFields);
      setSteps(newSteps);
      notifyChange(updatedFields, newSteps);
    } else if (steps.length === 0) {
      const firstStep = createStep(0);
      const secondStep = createStep(1);
      const bothSteps = [firstStep, secondStep];
      const updatedFields = fields.map((f) => ({ ...f, stepGroup: 0 }));
      setFields(updatedFields);
      setSteps(bothSteps);
      notifyChange(updatedFields, bothSteps);
    } else {
      setSteps(newSteps);
      notifyChange(fields, newSteps);
    }
  }, [steps, fields, notifyChange]);
  const handleDeleteStep = useCallback(
    (index) => {
      const fieldsWithoutDeleted = fields.filter((f) => f.stepGroup !== index);
      if (steps.length <= 2) {
        const updatedFields = fieldsWithoutDeleted.map((f) => {
          const { stepGroup: _, ...rest } = f;
          return rest;
        });
        setFields(updatedFields);
        setSteps([]);
        setActiveStepIndex(0);
        notifyChange(updatedFields, []);
      } else {
        const newSteps = steps.filter((_, i) => i !== index);
        const updatedFields = fieldsWithoutDeleted.map((f) => {
          if (f.stepGroup !== void 0 && f.stepGroup > index) {
            return { ...f, stepGroup: f.stepGroup - 1 };
          }
          return f;
        });
        setFields(updatedFields);
        setSteps(newSteps);
        if (activeStepIndex >= newSteps.length) {
          setActiveStepIndex(newSteps.length - 1);
        }
        notifyChange(updatedFields, newSteps);
      }
    },
    [steps, fields, activeStepIndex, notifyChange]
  );
  const handleRenameStep = useCallback(
    (index, newTitle) => {
      const newSteps = steps.map(
        (step, i) => i === index ? { ...step, title: newTitle } : step
      );
      setSteps(newSteps);
      notifyChange(fields, newSteps);
    },
    [steps, fields, notifyChange]
  );
  const editDialogField = fields.find((f) => f.id === editDialogFieldId) || null;
  const editDialogComponent = editDialogField ? getComponentByType(editDialogField.type, components) || null : null;
  const nestedEditorField = fields.find((f) => f.id === nestedEditorFieldId) || null;
  return /* @__PURE__ */ jsxs("div", { className: cn$1("flex flex-col lg:h-full", className), children: [
    /* @__PURE__ */ jsxs(
      DndContext,
      {
        id: dndContextId,
        sensors,
        collisionDetection: closestCenter,
        onDragStart: handleDragStart,
        onDragEnd: handleDragEnd,
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col lg:flex-row lg:overflow-hidden", children: [
            /* @__PURE__ */ jsx("div", { className: "w-full lg:w-64 p-4 border-b lg:border-b-0 lg:border-r lg:overflow-auto shrink-0", children: /* @__PURE__ */ jsx(Palette, { components }) }),
            /* @__PURE__ */ jsx("div", { className: "flex-1 p-4 lg:overflow-auto min-h-[300px]", children: /* @__PURE__ */ jsx(
              Canvas,
              {
                fields,
                components,
                onEditField: handleEditField,
                onDeleteField: handleDeleteField,
                onConfigureNested: handleConfigureNested,
                isDraggingFromPalette: activeDragData?.type === "palette",
                steps,
                activeStepIndex,
                onActiveStepChange: setActiveStepIndex,
                onAddStep: handleAddStep,
                onDeleteStep: handleDeleteStep,
                onRenameStep: handleRenameStep
              }
            ) }),
            /* @__PURE__ */ jsx("div", { className: "w-full flex-1 lg:w-96 border-t lg:border-t-0 lg:border-l lg:overflow-auto min-h-[300px]", children: /* @__PURE__ */ jsxs(Tabs, { defaultValue: "preview", className: "h-full flex flex-col", children: [
              /* @__PURE__ */ jsx("div", { className: "p-4 border-b", children: /* @__PURE__ */ jsxs(TabsList, { className: "w-full", children: [
                /* @__PURE__ */ jsx(TabsTrigger, { value: "preview", className: "flex-1", children: "Preview" }),
                /* @__PURE__ */ jsx(TabsTrigger, { value: "schema", className: "flex-1", children: "JSON Schema" })
              ] }) }),
              /* @__PURE__ */ jsx(TabsContent, { value: "preview", className: "flex-1 m-0 lg:overflow-auto", children: /* @__PURE__ */ jsx(FormPreview, { schema: currentSchema, fieldComponents, defaultValues }) }),
              /* @__PURE__ */ jsx(TabsContent, { value: "schema", className: "flex-1 m-0 p-4 lg:overflow-auto", children: /* @__PURE__ */ jsx("div", { className: "rounded-lg border bg-muted/50 p-4", children: /* @__PURE__ */ jsx("pre", { className: "text-sm overflow-auto whitespace-pre-wrap", children: JSON.stringify(currentSchema, null, 2) }) }) })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxs(DragOverlay, { dropAnimation: null, children: [
            activeDragData?.type === "palette" && activeDragData.component && /* @__PURE__ */ jsx(PaletteDragOverlay, { component: activeDragData.component }),
            activeDragData?.type === "field" && activeDragData.field && /* @__PURE__ */ jsx(
              FieldDragOverlay,
              {
                field: activeDragData.field,
                component: activeDragData.component
              }
            )
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsx(
      EditFieldDialog,
      {
        open: editDialogFieldId !== null,
        onOpenChange: (open) => !open && setEditDialogFieldId(null),
        field: editDialogField,
        component: editDialogComponent,
        onUpdate: handleUpdateField,
        steps,
        allFieldIds: fields.map((f) => f.id)
      }
    ),
    /* @__PURE__ */ jsx(
      NestedFieldEditorDialog,
      {
        open: nestedEditorFieldId !== null,
        onOpenChange: (open) => !open && setNestedEditorFieldId(null),
        field: nestedEditorField,
        components,
        onSave: handleSaveNestedFields
      }
    )
  ] });
}
function FormBuilderPage({ id }) {
  if (id) {
    return /* @__PURE__ */ jsx(EditFormBuilderPage, { id });
  }
  return /* @__PURE__ */ jsx(CreateFormBuilderPage, {});
}
function EditFormBuilderPage({ id }) {
  const { form: existingForm } = useSuspenseFormById(id);
  return /* @__PURE__ */ jsx(FormBuilderPageContent, { id, existingForm });
}
function CreateFormBuilderPage() {
  return /* @__PURE__ */ jsx(FormBuilderPageContent, {});
}
function FormBuilderPageContent({
  id,
  existingForm
}) {
  const { navigate, Link, localization } = usePluginOverrides("form-builder", {
    localization: FORM_BUILDER_LOCALIZATION
  });
  const basePath = useBasePath();
  const createMutation = useCreateForm();
  const updateMutation = useUpdateForm();
  const loc = localization || FORM_BUILDER_LOCALIZATION;
  const LinkComponent = Link || "a";
  const [name, setName] = useState(existingForm?.name || "");
  const [slug, setSlug] = useState(existingForm?.slug || "");
  const [status, setStatus] = useState(
    existingForm?.status || "active"
  );
  const [schema, setSchema] = useState(() => {
    if (existingForm?.schema) {
      try {
        return JSON.parse(existingForm.schema);
      } catch {
        return void 0;
      }
    }
    return void 0;
  });
  const [autoSlug, setAutoSlug] = useState(!id);
  useEffect(() => {
    if (autoSlug && name) {
      setSlug(slugify$1(name));
    }
  }, [name, autoSlug]);
  const handleSchemaChange = useCallback((newSchema) => {
    setSchema(newSchema);
  }, []);
  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!slug.trim()) {
      toast.error("Slug is required");
      return;
    }
    if (!schema) {
      toast.error("Please add at least one field to the form");
      return;
    }
    try {
      const schemaStr = JSON.stringify(schema);
      if (id) {
        await updateMutation.mutateAsync({
          id,
          data: {
            name,
            schema: schemaStr,
            status
          }
        });
        toast.success(loc.FORM_BUILDER_TOAST_UPDATE_SUCCESS);
      } else {
        const newForm = await createMutation.mutateAsync({
          name,
          slug,
          schema: schemaStr,
          status
        });
        toast.success(loc.FORM_BUILDER_TOAST_CREATE_SUCCESS);
        navigate?.(`${basePath}/forms/${newForm.id}/edit`);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      if (message.includes("slug already exists")) {
        toast.error(loc.FORM_BUILDER_TOAST_DUPLICATE_SLUG);
      } else {
        toast.error(loc.FORM_BUILDER_TOAST_ERROR);
      }
    }
  };
  const isSaving = createMutation.isPending || updateMutation.isPending;
  return /* @__PURE__ */ jsxs("div", { className: "flex h-full flex-col", "data-testid": "form-builder-page", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 border-b p-4", children: [
      /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", asChild: true, children: /* @__PURE__ */ jsx(LinkComponent, { href: `${basePath}/forms`, children: /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }) }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "form-name", className: "text-xs text-muted-foreground", children: loc.FORM_BUILDER_LABEL_NAME }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "form-name",
            value: name,
            onChange: (e) => setName(e.target.value),
            placeholder: loc.FORM_BUILDER_EDITOR_NAME_PLACEHOLDER,
            className: "h-8 w-48"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "form-slug", className: "text-xs text-muted-foreground", children: loc.FORM_BUILDER_LABEL_SLUG }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "form-slug",
            value: slug,
            onChange: (e) => {
              setSlug(e.target.value);
              setAutoSlug(false);
            },
            placeholder: loc.FORM_BUILDER_EDITOR_SLUG_PLACEHOLDER,
            className: "h-8 w-48 font-mono text-sm",
            disabled: !!id
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
        /* @__PURE__ */ jsx(
          Label,
          {
            htmlFor: "form-status",
            className: "text-xs text-muted-foreground",
            children: loc.FORM_BUILDER_LABEL_STATUS
          }
        ),
        /* @__PURE__ */ jsxs(
          Select,
          {
            value: status,
            onValueChange: (v) => setStatus(v),
            children: [
              /* @__PURE__ */ jsx(SelectTrigger, { className: "h-8 w-28", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsx(SelectItem, { value: "active", children: loc.FORM_BUILDER_STATUS_ACTIVE }),
                /* @__PURE__ */ jsx(SelectItem, { value: "inactive", children: loc.FORM_BUILDER_STATUS_INACTIVE }),
                /* @__PURE__ */ jsx(SelectItem, { value: "archived", children: loc.FORM_BUILDER_STATUS_ARCHIVED })
              ] })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "ml-auto", children: /* @__PURE__ */ jsxs(Button, { onClick: handleSave, disabled: isSaving, children: [
        /* @__PURE__ */ jsx(Save, { className: "mr-2 h-4 w-4" }),
        isSaving ? loc.FORM_BUILDER_STATUS_SAVING : id ? loc.FORM_BUILDER_BUTTON_SAVE : loc.FORM_BUILDER_BUTTON_CREATE
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(
      FormBuilder,
      {
        value: schema,
        onChange: handleSchemaChange,
        className: "flex-1"
      }
    )
  ] });
}
export {
  FormBuilderPage
};
