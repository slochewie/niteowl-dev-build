import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import * as React from "react";
import { memo, useMemo, useState, useId, useCallback, useEffect } from "react";
import { User, GripVertical, MoreVertical, Pencil, Plus, Trash2, ChevronDownIcon, CheckIcon, ArrowLeft, Settings } from "lucide-react";
import { toast } from "sonner";
import { q as cn, ao as getPriorityConfig, B as Button, l as usePluginOverrides, ap as PRIORITY_OPTIONS } from "./router-DU5jczZR.js";
import { D as DropdownMenu, a as DropdownMenuTrigger, b as DropdownMenuContent, c as DropdownMenuItem, d as DropdownMenuSeparator } from "./dropdown-menu-DwfP37wf.js";
import { D as Dialog, d as DialogContent, a as DialogHeader, b as DialogTitle, c as DialogDescription } from "./dialog-Chz0Zs_g.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-CEYtu72k.js";
import { b as useResolveUser, c as useColumnMutations, d as useTaskMutations, e as useSearchUsers, f as useSuspenseBoard, a as useBoardMutations, P as PageWrapper } from "./page-wrapper-Dq5Sql4Y.js";
import { k as useSensors, l as useSensor, m as KeyboardSensor, T as TouchSensor, M as MouseSensor, n as closestCenter, p as pointerWithin, r as rectIntersection, g as getFirstCollision, D as DndContext, o as MeasuringStrategy, q as DragOverlay, K as KeyboardCode, c as closestCorners, t as defaultDropAnimationSideEffects, C as CSS } from "./core.esm-Bjw07ll7.js";
import { v as verticalListSortingStrategy, a as arrayMove, S as SortableContext, h as horizontalListSortingStrategy, u as useSortable, d as defaultAnimateLayoutChanges } from "./sortable.esm-Cz_svvTh.js";
import { Slot } from "@radix-ui/react-slot";
import * as ReactDOM from "react-dom";
import { B as Badge } from "./badge-DFvO9DkX.js";
import { format } from "date-fns";
import { A as Avatar, b as AvatarFallback, a as AvatarImage } from "./avatar-DyL-BTAC.js";
import { I as Input } from "./input-Db1DsNBl.js";
import { L as Label } from "./label-BdRDX7M-.js";
import { B as BoardForm } from "./board-form-DgkYpgTT.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-B_yf4oCD.js";
import { M as MinimalTiptapEditor } from "./minimal-tiptap-2ESukVs0.js";
import { P as Popover, a as PopoverTrigger, C as Content2 } from "./popover-DQgN5wJE.js";
import { a as Command, e as CommandInput, b as CommandList, f as CommandEmpty, c as CommandGroup, C as CommandItem } from "./command-5HTd1Hbk.js";
import { E as EmptyState } from "./empty-state-JVMtvHrl.js";
import "@tanstack/react-router";
import "@tanstack/react-router-ssr-query";
import "@btst/yar";
import "better-call/client";
import "zod";
import "react-error-boundary";
import "@lukemorales/query-key-factory";
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
import "./index-S7rpP7KI.js";
import "./index-rdulpQ7P.js";
import "./index-KZ0RSJRl.js";
import "./index-BUGN0YTJ.js";
import "./Combination-C2ce2hnQ.js";
import "./index-BI_-Kgeu.js";
import "./index-x6nDyT23.js";
import "@radix-ui/react-dialog";
import "./useQuery-CQBkpW0a.js";
import "./useBaseQuery-z1wQ1YES.js";
import "./QueryClientProvider-BNL98aJf.js";
import "./useSuspenseQuery--TKlWsW-.js";
import "./useMutation-wDhDrN3q.js";
import "./index-CpOdxbMb.js";
import "./index3-B51lEsWR.js";
import "@radix-ui/react-label";
import "./textarea-DS3tfP2l.js";
import "./index-IXOTxK3N.js";
import "./index-CshadhlS.js";
import "./separator-2KKe-9Ln.js";
import "./switch-WrObWEGq.js";
import "@radix-ui/react-switch";
import "highlight.js/lib/core";
import "highlight.js/lib/languages/arduino";
import "highlight.js/lib/languages/bash";
import "highlight.js/lib/languages/c";
import "highlight.js/lib/languages/cpp";
import "highlight.js/lib/languages/csharp";
import "highlight.js/lib/languages/css";
import "highlight.js/lib/languages/diff";
import "highlight.js/lib/languages/go";
import "highlight.js/lib/languages/graphql";
import "highlight.js/lib/languages/ini";
import "highlight.js/lib/languages/java";
import "highlight.js/lib/languages/javascript";
import "highlight.js/lib/languages/json";
import "highlight.js/lib/languages/kotlin";
import "highlight.js/lib/languages/less";
import "highlight.js/lib/languages/lua";
import "highlight.js/lib/languages/makefile";
import "highlight.js/lib/languages/markdown";
import "highlight.js/lib/languages/objectivec";
import "highlight.js/lib/languages/perl";
import "highlight.js/lib/languages/php";
import "highlight.js/lib/languages/php-template";
import "highlight.js/lib/languages/plaintext";
import "highlight.js/lib/languages/python";
import "highlight.js/lib/languages/python-repl";
import "highlight.js/lib/languages/r";
import "highlight.js/lib/languages/ruby";
import "highlight.js/lib/languages/rust";
import "highlight.js/lib/languages/scss";
import "highlight.js/lib/languages/shell";
import "highlight.js/lib/languages/sql";
import "highlight.js/lib/languages/swift";
import "highlight.js/lib/languages/typescript";
import "highlight.js/lib/languages/vbnet";
import "highlight.js/lib/languages/wasm";
import "highlight.js/lib/languages/xml";
import "highlight.js/lib/languages/yaml";
import "cmdk";
function setRef(ref, value) {
  if (typeof ref === "function") {
    return ref(value);
  }
  if (ref !== null && ref !== void 0) {
    ref.current = value;
  }
}
function composeRefs(...refs) {
  return (node) => {
    let hasCleanup = false;
    const cleanups = refs.map((ref) => {
      const cleanup = setRef(ref, node);
      if (!hasCleanup && typeof cleanup === "function") {
        hasCleanup = true;
      }
      return cleanup;
    });
    if (hasCleanup) {
      return () => {
        for (let i = 0; i < cleanups.length; i++) {
          const cleanup = cleanups[i];
          if (typeof cleanup === "function") {
            cleanup();
          } else {
            setRef(refs[i], null);
          }
        }
      };
    }
  };
}
function useComposedRefs(...refs) {
  return React.useCallback(composeRefs(...refs), refs);
}
const directions = [
  KeyboardCode.Down,
  KeyboardCode.Right,
  KeyboardCode.Up,
  KeyboardCode.Left
];
const coordinateGetter = (event, { context }) => {
  const { active, droppableRects, droppableContainers, collisionRect } = context;
  if (directions.includes(event.code)) {
    event.preventDefault();
    if (!active || !collisionRect) return;
    const filteredContainers = [];
    for (const entry of droppableContainers.getEnabled()) {
      if (!entry || entry?.disabled) return;
      const rect = droppableRects.get(entry.id);
      if (!rect) return;
      const data = entry.data.current;
      if (data) {
        const { type, children } = data;
        if (type === "container" && children?.length > 0) {
          if (active.data.current?.type !== "container") {
            return;
          }
        }
      }
      switch (event.code) {
        case KeyboardCode.Down:
          if (collisionRect.top < rect.top) {
            filteredContainers.push(entry);
          }
          break;
        case KeyboardCode.Up:
          if (collisionRect.top > rect.top) {
            filteredContainers.push(entry);
          }
          break;
        case KeyboardCode.Left:
          if (collisionRect.left >= rect.left + rect.width) {
            filteredContainers.push(entry);
          }
          break;
        case KeyboardCode.Right:
          if (collisionRect.left + collisionRect.width <= rect.left) {
            filteredContainers.push(entry);
          }
          break;
      }
    }
    const collisions = closestCorners({
      collisionRect,
      droppableRects,
      droppableContainers: filteredContainers
    });
    const closestId = getFirstCollision(collisions, "id");
    if (closestId != null) {
      const newDroppable = droppableContainers.get(closestId);
      const newNode = newDroppable?.node.current;
      const newRect = newDroppable?.rect.current;
      if (newNode && newRect) {
        if (newDroppable.id === "placeholder") {
          return {
            x: newRect.left + (newRect.width - collisionRect.width) / 2,
            y: newRect.top + (newRect.height - collisionRect.height) / 2
          };
        }
        if (newDroppable.data.current?.type === "container") {
          return {
            x: newRect.left + 20,
            y: newRect.top + 74
          };
        }
        return {
          x: newRect.left,
          y: newRect.top
        };
      }
    }
  }
  return void 0;
};
const ROOT_NAME = "Kanban";
const BOARD_NAME = "KanbanBoard";
const COLUMN_NAME = "KanbanColumn";
const COLUMN_HANDLE_NAME = "KanbanColumnHandle";
const ITEM_NAME = "KanbanItem";
const ITEM_HANDLE_NAME = "KanbanItemHandle";
const OVERLAY_NAME = "KanbanOverlay";
const KanbanContext = React.createContext(
  null
);
KanbanContext.displayName = ROOT_NAME;
function useKanbanContext(consumerName) {
  const context = React.useContext(KanbanContext);
  if (!context) {
    throw new Error(`\`${consumerName}\` must be used within \`${ROOT_NAME}\``);
  }
  return context;
}
function KanbanRoot(props) {
  const {
    value,
    onValueChange,
    modifiers,
    strategy = verticalListSortingStrategy,
    orientation = "horizontal",
    onMove,
    getItemValue: getItemValueProp,
    accessibility,
    flatCursor = false,
    ...kanbanProps
  } = props;
  const id = React.useId();
  const [activeId, setActiveId] = React.useState(null);
  const lastOverIdRef = React.useRef(null);
  const hasMovedRef = React.useRef(false);
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter
    })
  );
  const getItemValue = React.useCallback(
    (item) => {
      if (typeof item === "object" && !getItemValueProp) {
        throw new Error("getItemValue is required when using array of objects");
      }
      return getItemValueProp ? getItemValueProp(item) : item;
    },
    [getItemValueProp]
  );
  const getColumn = React.useCallback(
    (id2) => {
      if (id2 in value) return id2;
      for (const [columnId, items] of Object.entries(value)) {
        if (items.some((item) => getItemValue(item) === id2)) {
          return columnId;
        }
      }
      return null;
    },
    [value, getItemValue]
  );
  const collisionDetection = React.useCallback(
    (args) => {
      if (activeId && activeId in value) {
        return closestCenter({
          ...args,
          droppableContainers: args.droppableContainers.filter(
            (container) => container.id in value
          )
        });
      }
      const pointerIntersections = pointerWithin(args);
      const intersections = pointerIntersections.length > 0 ? pointerIntersections : rectIntersection(args);
      let overId = getFirstCollision(intersections, "id");
      if (!overId) {
        if (hasMovedRef.current) {
          lastOverIdRef.current = activeId;
        }
        return lastOverIdRef.current ? [{ id: lastOverIdRef.current }] : [];
      }
      if (overId in value) {
        const containerItems = value[overId];
        if (containerItems && containerItems.length > 0) {
          const closestItem = closestCenter({
            ...args,
            droppableContainers: args.droppableContainers.filter(
              (container) => container.id !== overId && containerItems.some(
                (item) => getItemValue(item) === container.id
              )
            )
          });
          if (closestItem.length > 0) {
            overId = closestItem[0]?.id ?? overId;
          }
        }
      }
      lastOverIdRef.current = overId;
      return [{ id: overId }];
    },
    [activeId, value, getItemValue]
  );
  const onDragStart = React.useCallback(
    (event) => {
      kanbanProps.onDragStart?.(event);
      if (event.activatorEvent.defaultPrevented) return;
      setActiveId(event.active.id);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [kanbanProps.onDragStart]
  );
  const onDragOver = React.useCallback(
    (event) => {
      kanbanProps.onDragOver?.(event);
      if (event.activatorEvent.defaultPrevented) return;
      const { active, over } = event;
      if (!over) return;
      const activeColumn = getColumn(active.id);
      const overColumn = getColumn(over.id);
      if (!activeColumn || !overColumn) return;
      if (activeColumn === overColumn) {
        const items = value[activeColumn];
        if (!items) return;
        const activeIndex = items.findIndex(
          (item) => getItemValue(item) === active.id
        );
        const overIndex = items.findIndex(
          (item) => getItemValue(item) === over.id
        );
        if (activeIndex !== overIndex) {
          const newColumns = { ...value };
          newColumns[activeColumn] = arrayMove(items, activeIndex, overIndex);
          onValueChange?.(newColumns);
        }
      } else {
        const activeItems = value[activeColumn];
        const overItems = value[overColumn];
        if (!activeItems || !overItems) return;
        const activeIndex = activeItems.findIndex(
          (item) => getItemValue(item) === active.id
        );
        if (activeIndex === -1) return;
        const activeItem = activeItems[activeIndex];
        if (!activeItem) return;
        const updatedItems = {
          ...value,
          [activeColumn]: activeItems.filter(
            (item) => getItemValue(item) !== active.id
          ),
          [overColumn]: [...overItems, activeItem]
        };
        onValueChange?.(updatedItems);
        hasMovedRef.current = true;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [value, getColumn, getItemValue, onValueChange, kanbanProps.onDragOver]
  );
  const onDragEnd = React.useCallback(
    (event) => {
      kanbanProps.onDragEnd?.(event);
      if (event.activatorEvent.defaultPrevented) return;
      const { active, over } = event;
      if (!over) {
        setActiveId(null);
        return;
      }
      if (active.id in value && over.id in value) {
        const activeIndex = Object.keys(value).indexOf(active.id);
        const overIndex = Object.keys(value).indexOf(over.id);
        if (activeIndex !== overIndex) {
          const orderedColumns = Object.keys(value);
          const newOrder = arrayMove(orderedColumns, activeIndex, overIndex);
          const newColumns = {};
          for (const key of newOrder) {
            const items = value[key];
            if (items) {
              newColumns[key] = items;
            }
          }
          if (onMove) {
            onMove({ ...event, activeIndex, overIndex });
          } else {
            onValueChange?.(newColumns);
          }
        }
      } else {
        const activeColumn = getColumn(active.id);
        const overColumn = getColumn(over.id);
        if (!activeColumn || !overColumn) {
          setActiveId(null);
          return;
        }
        if (activeColumn === overColumn) {
          const items = value[activeColumn];
          if (!items) {
            setActiveId(null);
            return;
          }
          const activeIndex = items.findIndex(
            (item) => getItemValue(item) === active.id
          );
          const overIndex = items.findIndex(
            (item) => getItemValue(item) === over.id
          );
          if (activeIndex !== overIndex) {
            const newColumns = { ...value };
            newColumns[activeColumn] = arrayMove(items, activeIndex, overIndex);
            if (onMove) {
              onMove({
                ...event,
                activeIndex,
                overIndex
              });
            } else {
              onValueChange?.(newColumns);
            }
          }
        }
      }
      setActiveId(null);
      hasMovedRef.current = false;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      value,
      getColumn,
      getItemValue,
      onValueChange,
      onMove,
      kanbanProps.onDragEnd
    ]
  );
  const onDragCancel = React.useCallback(
    (event) => {
      kanbanProps.onDragCancel?.(event);
      if (event.activatorEvent.defaultPrevented) return;
      setActiveId(null);
      hasMovedRef.current = false;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [kanbanProps.onDragCancel]
  );
  const announcements = React.useMemo(
    () => ({
      onDragStart({ active }) {
        const isColumn = active.id in value;
        const itemType = isColumn ? "column" : "item";
        const position = isColumn ? Object.keys(value).indexOf(active.id) + 1 : (() => {
          const column = getColumn(active.id);
          if (!column || !value[column]) return 1;
          return value[column].findIndex(
            (item) => getItemValue(item) === active.id
          ) + 1;
        })();
        const total = isColumn ? Object.keys(value).length : (() => {
          const column = getColumn(active.id);
          return column ? value[column]?.length ?? 0 : 0;
        })();
        return `Picked up ${itemType} at position ${position} of ${total}`;
      },
      onDragOver({ active, over }) {
        if (!over) return;
        const isColumn = active.id in value;
        const itemType = isColumn ? "column" : "item";
        const position = isColumn ? Object.keys(value).indexOf(over.id) + 1 : (() => {
          const column = getColumn(over.id);
          if (!column || !value[column]) return 1;
          return value[column].findIndex(
            (item) => getItemValue(item) === over.id
          ) + 1;
        })();
        const total = isColumn ? Object.keys(value).length : (() => {
          const column = getColumn(over.id);
          return column ? value[column]?.length ?? 0 : 0;
        })();
        const overColumn = getColumn(over.id);
        const activeColumn = getColumn(active.id);
        if (isColumn) {
          return `${itemType} is now at position ${position} of ${total}`;
        }
        if (activeColumn !== overColumn) {
          return `${itemType} is now at position ${position} of ${total} in ${overColumn}`;
        }
        return `${itemType} is now at position ${position} of ${total}`;
      },
      onDragEnd({ active, over }) {
        if (!over) return;
        const isColumn = active.id in value;
        const itemType = isColumn ? "column" : "item";
        const position = isColumn ? Object.keys(value).indexOf(over.id) + 1 : (() => {
          const column = getColumn(over.id);
          if (!column || !value[column]) return 1;
          return value[column].findIndex(
            (item) => getItemValue(item) === over.id
          ) + 1;
        })();
        const total = isColumn ? Object.keys(value).length : (() => {
          const column = getColumn(over.id);
          return column ? value[column]?.length ?? 0 : 0;
        })();
        const overColumn = getColumn(over.id);
        const activeColumn = getColumn(active.id);
        if (isColumn) {
          return `${itemType} was dropped at position ${position} of ${total}`;
        }
        if (activeColumn !== overColumn) {
          return `${itemType} was dropped at position ${position} of ${total} in ${overColumn}`;
        }
        return `${itemType} was dropped at position ${position} of ${total}`;
      },
      onDragCancel({ active }) {
        const isColumn = active.id in value;
        const itemType = isColumn ? "column" : "item";
        return `Dragging was cancelled. ${itemType} was dropped.`;
      }
    }),
    [value, getColumn, getItemValue]
  );
  const contextValue = React.useMemo(
    () => ({
      id,
      items: value,
      modifiers,
      strategy,
      orientation,
      activeId,
      setActiveId,
      getItemValue,
      flatCursor
    }),
    [
      id,
      value,
      activeId,
      modifiers,
      strategy,
      orientation,
      getItemValue,
      flatCursor
    ]
  );
  return /* @__PURE__ */ jsx(KanbanContext.Provider, { value: contextValue, children: /* @__PURE__ */ jsx(
    DndContext,
    {
      collisionDetection,
      modifiers,
      sensors,
      ...kanbanProps,
      id,
      measuring: {
        droppable: {
          strategy: MeasuringStrategy.Always
        }
      },
      onDragStart,
      onDragOver,
      onDragEnd,
      onDragCancel,
      accessibility: {
        announcements,
        screenReaderInstructions: {
          draggable: `
            To pick up a kanban item or column, press space or enter.
            While dragging, use the arrow keys to move the item.
            Press space or enter again to drop the item in its new position, or press escape to cancel.
          `
        },
        ...accessibility
      }
    }
  ) });
}
const KanbanBoardContext = React.createContext(false);
KanbanBoardContext.displayName = BOARD_NAME;
const KanbanBoard$1 = React.forwardRef(
  (props, forwardedRef) => {
    const { asChild, className, ...boardProps } = props;
    const context = useKanbanContext(BOARD_NAME);
    const columns = React.useMemo(() => {
      return Object.keys(context.items);
    }, [context.items]);
    const BoardPrimitive = asChild ? Slot : "div";
    return /* @__PURE__ */ jsx(KanbanBoardContext.Provider, { value: true, children: /* @__PURE__ */ jsx(
      SortableContext,
      {
        items: columns,
        strategy: context.orientation === "horizontal" ? horizontalListSortingStrategy : verticalListSortingStrategy,
        children: /* @__PURE__ */ jsx(
          BoardPrimitive,
          {
            "aria-orientation": context.orientation,
            "data-orientation": context.orientation,
            "data-slot": "kanban-board",
            ...boardProps,
            ref: forwardedRef,
            className: cn(
              "flex size-full gap-4",
              context.orientation === "horizontal" ? "flex-row" : "flex-col",
              className
            )
          }
        )
      }
    ) });
  }
);
KanbanBoard$1.displayName = BOARD_NAME;
const KanbanColumnContext = React.createContext(null);
KanbanColumnContext.displayName = COLUMN_NAME;
function useKanbanColumnContext(consumerName) {
  const context = React.useContext(KanbanColumnContext);
  if (!context) {
    throw new Error(
      `\`${consumerName}\` must be used within \`${COLUMN_NAME}\``
    );
  }
  return context;
}
const animateLayoutChanges = (args) => defaultAnimateLayoutChanges({ ...args, wasDragging: true });
const KanbanColumn = React.forwardRef(
  (props, forwardedRef) => {
    const {
      value,
      asChild,
      asHandle,
      disabled,
      className,
      style,
      ...columnProps
    } = props;
    const id = React.useId();
    const context = useKanbanContext(COLUMN_NAME);
    const inBoard = React.useContext(KanbanBoardContext);
    const inOverlay = React.useContext(KanbanOverlayContext);
    if (!inBoard && !inOverlay) {
      throw new Error(
        `\`${COLUMN_NAME}\` must be used within \`${BOARD_NAME}\` or \`${OVERLAY_NAME}\``
      );
    }
    if (value === "") {
      throw new Error(`\`${COLUMN_NAME}\` value cannot be an empty string`);
    }
    const {
      attributes,
      listeners,
      setNodeRef,
      setActivatorNodeRef,
      transform,
      transition,
      isDragging
    } = useSortable({
      id: value,
      disabled,
      animateLayoutChanges
    });
    const composedRef = useComposedRefs(forwardedRef, (node) => {
      if (disabled) return;
      setNodeRef(node);
    });
    const composedStyle = React.useMemo(() => {
      return {
        transform: CSS.Transform.toString(transform),
        transition,
        ...style
      };
    }, [transform, transition, style]);
    const items = React.useMemo(() => {
      const items2 = context.items[value] ?? [];
      return items2.map((item) => context.getItemValue(item));
    }, [context.items, value, context.getItemValue]);
    const columnContext = React.useMemo(
      () => ({
        id,
        attributes,
        listeners,
        setActivatorNodeRef,
        isDragging,
        disabled
      }),
      [id, attributes, listeners, setActivatorNodeRef, isDragging, disabled]
    );
    const ColumnPrimitive = asChild ? Slot : "div";
    return /* @__PURE__ */ jsx(KanbanColumnContext.Provider, { value: columnContext, children: /* @__PURE__ */ jsx(
      SortableContext,
      {
        items,
        strategy: context.orientation === "horizontal" ? horizontalListSortingStrategy : verticalListSortingStrategy,
        children: /* @__PURE__ */ jsx(
          ColumnPrimitive,
          {
            id,
            "data-disabled": disabled,
            "data-dragging": isDragging ? "" : void 0,
            "data-slot": "kanban-column",
            ...columnProps,
            ...asHandle && !disabled ? attributes : {},
            ...asHandle && !disabled ? listeners : {},
            ref: composedRef,
            style: composedStyle,
            className: cn(
              "flex size-full min-w-0 flex-col gap-2 rounded-lg border bg-zinc-100 p-2.5 aria-disabled:pointer-events-none aria-disabled:opacity-50 dark:bg-zinc-900",
              {
                "touch-none select-none": asHandle,
                "cursor-default": context.flatCursor,
                "data-dragging:cursor-grabbing": !context.flatCursor,
                "cursor-grab": !isDragging && asHandle && !context.flatCursor,
                "opacity-50": isDragging,
                "pointer-events-none opacity-50": disabled
              },
              className
            )
          }
        )
      }
    ) });
  }
);
KanbanColumn.displayName = COLUMN_NAME;
const KanbanColumnHandle = React.forwardRef((props, forwardedRef) => {
  const { asChild, disabled, className, ...columnHandleProps } = props;
  const context = useKanbanContext(COLUMN_NAME);
  const columnContext = useKanbanColumnContext(COLUMN_HANDLE_NAME);
  const isDisabled = disabled ?? columnContext.disabled;
  const composedRef = useComposedRefs(forwardedRef, (node) => {
    if (isDisabled) return;
    columnContext.setActivatorNodeRef(node);
  });
  const HandlePrimitive = asChild ? Slot : "button";
  return /* @__PURE__ */ jsx(
    HandlePrimitive,
    {
      type: "button",
      "aria-controls": columnContext.id,
      "data-disabled": isDisabled,
      "data-dragging": columnContext.isDragging ? "" : void 0,
      "data-slot": "kanban-column-handle",
      ...columnHandleProps,
      ...isDisabled ? {} : columnContext.attributes,
      ...isDisabled ? {} : columnContext.listeners,
      ref: composedRef,
      className: cn(
        "select-none disabled:pointer-events-none disabled:opacity-50",
        context.flatCursor ? "cursor-default" : "cursor-grab data-dragging:cursor-grabbing",
        className
      ),
      disabled: isDisabled
    }
  );
});
KanbanColumnHandle.displayName = COLUMN_HANDLE_NAME;
const KanbanItemContext = React.createContext(
  null
);
KanbanItemContext.displayName = ITEM_NAME;
function useKanbanItemContext(consumerName) {
  const context = React.useContext(KanbanItemContext);
  if (!context) {
    throw new Error(`\`${consumerName}\` must be used within \`${ITEM_NAME}\``);
  }
  return context;
}
const KanbanItem = React.forwardRef(
  (props, forwardedRef) => {
    const {
      value,
      style,
      asHandle,
      asChild,
      disabled,
      className,
      ...itemProps
    } = props;
    const id = React.useId();
    const context = useKanbanContext(ITEM_NAME);
    const inBoard = React.useContext(KanbanBoardContext);
    const inOverlay = React.useContext(KanbanOverlayContext);
    if (!inBoard && !inOverlay) {
      throw new Error(`\`${ITEM_NAME}\` must be used within \`${BOARD_NAME}\``);
    }
    const {
      attributes,
      listeners,
      setNodeRef,
      setActivatorNodeRef,
      transform,
      transition,
      isDragging
    } = useSortable({ id: value, disabled });
    if (value === "") {
      throw new Error(`\`${ITEM_NAME}\` value cannot be an empty string`);
    }
    const composedRef = useComposedRefs(forwardedRef, (node) => {
      if (disabled) return;
      setNodeRef(node);
    });
    const composedStyle = React.useMemo(() => {
      return {
        transform: CSS.Transform.toString(transform),
        transition,
        ...style
      };
    }, [transform, transition, style]);
    const itemContext = React.useMemo(
      () => ({
        id,
        attributes,
        listeners,
        setActivatorNodeRef,
        isDragging,
        disabled
      }),
      [id, attributes, listeners, setActivatorNodeRef, isDragging, disabled]
    );
    const ItemPrimitive = asChild ? Slot : "div";
    return /* @__PURE__ */ jsx(KanbanItemContext.Provider, { value: itemContext, children: /* @__PURE__ */ jsx(
      ItemPrimitive,
      {
        id,
        "data-disabled": disabled,
        "data-dragging": isDragging ? "" : void 0,
        "data-slot": "kanban-item",
        ...itemProps,
        ...asHandle && !disabled ? attributes : {},
        ...asHandle && !disabled ? listeners : {},
        ref: composedRef,
        style: composedStyle,
        className: cn(
          "focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1",
          {
            "touch-none select-none": asHandle,
            "cursor-default": context.flatCursor,
            "data-dragging:cursor-grabbing": !context.flatCursor,
            "cursor-grab": !isDragging && asHandle && !context.flatCursor,
            "opacity-50": isDragging,
            "pointer-events-none opacity-50": disabled
          },
          className
        )
      }
    ) });
  }
);
KanbanItem.displayName = ITEM_NAME;
const KanbanItemHandle = React.forwardRef((props, forwardedRef) => {
  const { asChild, disabled, className, ...itemHandleProps } = props;
  const context = useKanbanContext(ITEM_HANDLE_NAME);
  const itemContext = useKanbanItemContext(ITEM_HANDLE_NAME);
  const isDisabled = disabled ?? itemContext.disabled;
  const composedRef = useComposedRefs(forwardedRef, (node) => {
    if (isDisabled) return;
    itemContext.setActivatorNodeRef(node);
  });
  const HandlePrimitive = asChild ? Slot : "button";
  return /* @__PURE__ */ jsx(
    HandlePrimitive,
    {
      type: "button",
      "aria-controls": itemContext.id,
      "data-disabled": isDisabled,
      "data-dragging": itemContext.isDragging ? "" : void 0,
      "data-slot": "kanban-item-handle",
      ...itemHandleProps,
      ...isDisabled ? {} : itemContext.attributes,
      ...isDisabled ? {} : itemContext.listeners,
      ref: composedRef,
      className: cn(
        "select-none disabled:pointer-events-none disabled:opacity-50",
        context.flatCursor ? "cursor-default" : "cursor-grab data-dragging:cursor-grabbing",
        className
      ),
      disabled: isDisabled
    }
  );
});
KanbanItemHandle.displayName = ITEM_HANDLE_NAME;
const KanbanOverlayContext = React.createContext(false);
KanbanOverlayContext.displayName = OVERLAY_NAME;
const dropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: "0.4"
      }
    }
  })
};
function KanbanOverlay(props) {
  const { container: containerProp, children, ...overlayProps } = props;
  const context = useKanbanContext(OVERLAY_NAME);
  const [mounted, setMounted] = React.useState(false);
  React.useLayoutEffect(() => setMounted(true), []);
  const container = containerProp ?? (mounted ? globalThis.document?.body : null);
  if (!container) return null;
  const variant = context.activeId && context.activeId in context.items ? "column" : "item";
  return ReactDOM.createPortal(
    /* @__PURE__ */ jsx(
      DragOverlay,
      {
        dropAnimation,
        modifiers: context.modifiers,
        className: cn(!context.flatCursor && "cursor-grabbing"),
        ...overlayProps,
        children: /* @__PURE__ */ jsx(KanbanOverlayContext.Provider, { value: true, children: context.activeId && children ? typeof children === "function" ? children({
          value: context.activeId,
          variant
        }) : children : null })
      }
    ),
    container
  );
}
function getInitials(name) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0]?.charAt(0).toUpperCase() || "";
  }
  return ((parts[0]?.charAt(0) || "") + (parts[parts.length - 1]?.charAt(0) || "")).toUpperCase();
}
function UserAvatarComponent({
  user,
  size = "sm",
  className
}) {
  if (!user) {
    return /* @__PURE__ */ jsx(Avatar, { size, className, title: "Unassigned", children: /* @__PURE__ */ jsx(AvatarFallback, { children: /* @__PURE__ */ jsx(User, { className: "size-3 group-data-[size=default]/avatar:size-4 group-data-[size=lg]/avatar:size-5" }) }) });
  }
  const initials = getInitials(user.name);
  return /* @__PURE__ */ jsxs(Avatar, { size, className, title: user.name, children: [
    user.avatarUrl && /* @__PURE__ */ jsx(AvatarImage, { src: user.avatarUrl, alt: user.name }),
    /* @__PURE__ */ jsx(AvatarFallback, { className: "bg-primary/10 text-primary font-medium", children: initials })
  ] });
}
const UserAvatar = memo(UserAvatarComponent);
function TaskCardComponent({ task, onClick }) {
  const priorityConfig = getPriorityConfig(task.priority);
  const { data: assignee } = useResolveUser(task.assigneeId);
  return /* @__PURE__ */ jsx(KanbanItem, { value: task.id, asChild: true, children: /* @__PURE__ */ jsx(
    "div",
    {
      className: "rounded-md border bg-card p-3 shadow-xs cursor-pointer hover:shadow-md transition-shadow",
      onClick,
      children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(KanbanItemHandle, { asChild: true, children: /* @__PURE__ */ jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              className: "h-6 w-6",
              onClick: (e) => e.stopPropagation(),
              children: /* @__PURE__ */ jsx(GripVertical, { className: "h-3 w-3" })
            }
          ) }),
          /* @__PURE__ */ jsx(
            "span",
            {
              className: "line-clamp-1 font-medium text-base flex-1 text-left cursor-pointer hover:text-primary",
              title: task.title,
              children: task.title
            }
          ),
          /* @__PURE__ */ jsx(
            Badge,
            {
              variant: priorityConfig.variant,
              className: `pointer-events-none h-5 rounded-sm px-1.5 text-[11px] capitalize ${priorityConfig.className}`,
              children: priorityConfig.label
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-muted-foreground text-xs", children: [
          task.assigneeId ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsx(UserAvatar, { user: assignee ?? null, size: "sm" }),
            /* @__PURE__ */ jsx("span", { className: "line-clamp-1", children: assignee?.name || "Assigned" })
          ] }) : /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsx(UserAvatar, { user: null, size: "sm" }),
            /* @__PURE__ */ jsx("span", { className: "line-clamp-1", children: "Unassigned" })
          ] }),
          /* @__PURE__ */ jsx("time", { className: "tabular-nums", children: format(new Date(task.createdAt), "MMM d") })
        ] })
      ] })
    }
  ) });
}
const TaskCard = memo(TaskCardComponent);
function ColumnContentComponent({
  column,
  onAddTask,
  onEditTask,
  onEditColumn,
  onDeleteColumn
}) {
  const hasTasks = column.tasks && column.tasks.length > 0;
  return /* @__PURE__ */ jsxs(KanbanColumn, { value: column.id, children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
      /* @__PURE__ */ jsx(KanbanColumnHandle, { asChild: true, children: /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", children: /* @__PURE__ */ jsx(GripVertical, { className: "h-4 w-4" }) }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-1", children: [
        /* @__PURE__ */ jsx("span", { className: "font-bold text-lg line-clamp-1 flex-1 text-left", children: column.title }),
        /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "pointer-events-none rounded-sm", children: column.tasks?.length || 0 })
      ] }),
      /* @__PURE__ */ jsxs(DropdownMenu, { children: [
        /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", children: /* @__PURE__ */ jsx(MoreVertical, { className: "h-4 w-4" }) }) }),
        /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", children: [
          /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: onEditColumn, children: [
            /* @__PURE__ */ jsx(Pencil, { className: "mr-2 h-4 w-4" }),
            "Edit Column"
          ] }),
          /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: onAddTask, children: [
            /* @__PURE__ */ jsx(Plus, { className: "mr-2 h-4 w-4" }),
            "Add Task"
          ] }),
          /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
          /* @__PURE__ */ jsxs(
            DropdownMenuItem,
            {
              onClick: onDeleteColumn,
              className: "text-red-600 focus:text-red-600",
              children: [
                /* @__PURE__ */ jsx(Trash2, { className: "mr-2 h-4 w-4" }),
                "Delete Column"
              ]
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "p-0.5 space-y-2", children: hasTasks ? column.tasks.map((task) => /* @__PURE__ */ jsx(
      TaskCard,
      {
        task,
        onClick: () => onEditTask(task.id)
      },
      task.id
    )) : /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-1 md:py-8 text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "rounded-full bg-muted p-4 mb-3 hidden md:block", children: /* @__PURE__ */ jsx(Plus, { className: "h-5 w-5 text-muted-foreground" }) }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-1 mb-2 md:space-y-2 md:mb-4", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "No tasks yet" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Add a task to get started" })
      ] }),
      /* @__PURE__ */ jsxs(Button, { onClick: onAddTask, size: "sm", children: [
        /* @__PURE__ */ jsx(Plus, { className: "mr-2 h-4 w-4" }),
        "Add Task"
      ] })
    ] }) })
  ] }, column.id);
}
const ColumnContent = memo(ColumnContentComponent);
function KanbanBoardComponent({
  columns,
  kanbanState,
  onKanbanChange,
  onAddTask,
  onEditTask,
  onEditColumn,
  onDeleteColumn
}) {
  const orderedColumns = useMemo(() => {
    const columnMap = new Map(columns.map((c) => [c.id, c]));
    return Object.keys(kanbanState).map((columnId) => {
      const column = columnMap.get(columnId);
      if (!column) return null;
      return {
        ...column,
        tasks: kanbanState[columnId] || []
      };
    }).filter(
      (c) => c !== null
    );
  }, [columns, kanbanState]);
  const mdClass = useMemo(() => {
    const gridClassMap = {
      1: "md:grid-cols-1",
      2: "md:grid-cols-2",
      3: "md:grid-cols-3",
      4: "md:grid-cols-4",
      5: "md:grid-cols-5",
      6: "md:grid-cols-6"
    };
    return gridClassMap[orderedColumns.length] || "md:grid-cols-6";
  }, [orderedColumns.length]);
  return /* @__PURE__ */ jsxs(
    KanbanRoot,
    {
      orientation: "horizontal",
      value: kanbanState,
      onValueChange: onKanbanChange,
      getItemValue: (item) => item.id,
      children: [
        /* @__PURE__ */ jsx(
          KanbanBoard$1,
          {
            className: cn(
              "flex flex-col gap-4 md:auto-rows-fr md:grid-cols-1 md:grid min-h-[400px]",
              mdClass
            ),
            children: orderedColumns.map((column) => /* @__PURE__ */ jsx(
              ColumnContent,
              {
                column,
                onAddTask: () => onAddTask(column.id),
                onEditTask: (taskId) => onEditTask(column.id, taskId),
                onEditColumn: () => onEditColumn(column.id),
                onDeleteColumn: () => onDeleteColumn(column.id)
              },
              column.id
            ))
          }
        ),
        /* @__PURE__ */ jsx(KanbanOverlay, { children: /* @__PURE__ */ jsx("div", { className: "size-full rounded-md bg-primary/10" }) })
      ]
    }
  );
}
const KanbanBoard = memo(KanbanBoardComponent);
function ColumnForm({
  boardId,
  columnId,
  column,
  onClose,
  onSuccess
}) {
  const isEditing = !!columnId;
  const { createColumn, updateColumn, isCreating, isUpdating } = useColumnMutations();
  const [title, setTitle] = useState(column?.title || "");
  const [error, setError] = useState(null);
  const isPending = isCreating || isUpdating;
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    try {
      if (isEditing && columnId) {
        await updateColumn(columnId, { title });
      } else {
        await createColumn({ title, boardId });
      }
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };
  return /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsx(Label, { htmlFor: "title", children: "Title *" }),
      /* @__PURE__ */ jsx(
        Input,
        {
          id: "title",
          value: title,
          onChange: (e) => setTitle(e.target.value),
          placeholder: "e.g., To Do",
          disabled: isPending
        }
      )
    ] }),
    error && /* @__PURE__ */ jsx("div", { className: "p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md", children: error }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-2 pt-2", children: [
      /* @__PURE__ */ jsx(Button, { type: "submit", disabled: isPending, children: isPending ? isEditing ? "Updating..." : "Creating..." : isEditing ? "Update Column" : "Create Column" }),
      /* @__PURE__ */ jsx(
        Button,
        {
          type: "button",
          variant: "outline",
          onClick: onClose,
          disabled: isPending,
          children: "Cancel"
        }
      )
    ] })
  ] });
}
function SearchSelect({
  options,
  value,
  onChange,
  placeholder = "Select option",
  emptyMessage = "No option found."
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  return /* @__PURE__ */ jsxs(Popover, { open, onOpenChange: setOpen, modal: false, children: [
    /* @__PURE__ */ jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(
      Button,
      {
        id,
        variant: "outline",
        role: "combobox",
        "aria-expanded": open,
        className: "bg-background hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]",
        children: [
          /* @__PURE__ */ jsx("span", { className: cn("truncate", !value && "text-muted-foreground"), children: value ? options.find((option) => option.value === value)?.label : placeholder }),
          /* @__PURE__ */ jsx(
            ChevronDownIcon,
            {
              size: 16,
              className: "text-muted-foreground/80 shrink-0",
              "aria-hidden": "true"
            }
          )
        ]
      }
    ) }),
    /* @__PURE__ */ jsx(
      Content2,
      {
        align: "start",
        sideOffset: 4,
        className: cn(
          "border-input bg-popover text-popover-foreground pointer-events-auto",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
          "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          "z-50 w-full min-w-[var(--radix-popper-anchor-width)] origin-(--radix-popover-content-transform-origin)",
          "rounded-md border p-0 shadow-md outline-hidden"
        ),
        children: /* @__PURE__ */ jsxs(Command, { children: [
          /* @__PURE__ */ jsx(CommandInput, { placeholder: "Search options..." }),
          /* @__PURE__ */ jsxs(CommandList, { children: [
            /* @__PURE__ */ jsx(CommandEmpty, { children: emptyMessage }),
            /* @__PURE__ */ jsx(CommandGroup, { children: options.map((option) => /* @__PURE__ */ jsxs(
              CommandItem,
              {
                value: option.value,
                onSelect: (currentValue) => {
                  onChange(currentValue === value ? "" : currentValue);
                  setOpen(false);
                },
                children: [
                  option.label,
                  value === option.value && /* @__PURE__ */ jsx(CheckIcon, { size: 16, className: "ml-auto" })
                ]
              },
              option.value
            )) })
          ] })
        ] })
      }
    )
  ] });
}
function TaskForm({
  columnId,
  boardId,
  taskId,
  task,
  columns,
  onClose,
  onSuccess,
  onDelete
}) {
  const isEditing = !!taskId;
  const { uploadImage, imagePicker: imagePickerTrigger } = usePluginOverrides("kanban");
  const {
    createTask,
    updateTask,
    moveTask,
    isCreating,
    isUpdating,
    isDeleting,
    isMoving
  } = useTaskMutations();
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [priority, setPriority] = useState(
    task?.priority || "MEDIUM"
  );
  const [selectedColumnId, setSelectedColumnId] = useState(
    task?.columnId || columnId
  );
  const [assigneeId, setAssigneeId] = useState(task?.assigneeId || "");
  const [error, setError] = useState(null);
  const { data: users = [] } = useSearchUsers("", boardId);
  const userOptions = [
    { value: "", label: "Unassigned" },
    ...users.map((user) => ({ value: user.id, label: user.name }))
  ];
  const isPending = isCreating || isUpdating || isDeleting || isMoving;
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    try {
      if (isEditing && taskId) {
        const isColumnChanging = task?.columnId && selectedColumnId !== task.columnId;
        if (isColumnChanging) {
          await updateTask(taskId, {
            title,
            description,
            priority,
            assigneeId: assigneeId || null
          });
          try {
            const targetColumn = columns.find((c) => c.id === selectedColumnId);
            const targetTasks = targetColumn?.tasks || [];
            const targetOrder = targetTasks.length > 0 ? Math.max(...targetTasks.map((t) => t.order)) + 1 : 0;
            await moveTask(taskId, selectedColumnId, targetOrder);
          } catch (moveErr) {
            const moveErrorMsg = moveErr instanceof Error ? moveErr.message : "Unknown error";
            setError(
              `Task properties were saved, but moving to the new column failed: ${moveErrorMsg}. You can try dragging the task to the desired column.`
            );
            return;
          }
        } else {
          await updateTask(taskId, {
            title,
            description,
            priority,
            columnId: selectedColumnId,
            assigneeId: assigneeId || null
          });
        }
      } else {
        await createTask({
          title,
          description,
          priority,
          columnId: selectedColumnId,
          assigneeId: assigneeId || void 0
        });
      }
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };
  return /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 overflow-x-hidden", children: [
    /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsx(Label, { htmlFor: "title", children: "Title *" }),
      /* @__PURE__ */ jsx(
        Input,
        {
          id: "title",
          value: title,
          onChange: (e) => setTitle(e.target.value),
          placeholder: "e.g., Fix login bug",
          disabled: isPending
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "priority", children: "Priority" }),
        /* @__PURE__ */ jsxs(
          Select,
          {
            value: priority,
            onValueChange: (v) => setPriority(v),
            children: [
              /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select priority" }) }),
              /* @__PURE__ */ jsx(SelectContent, { children: PRIORITY_OPTIONS.map((option) => /* @__PURE__ */ jsx(SelectItem, { value: option.value, children: option.label }, option.value)) })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "column", children: "Column" }),
        /* @__PURE__ */ jsxs(Select, { value: selectedColumnId, onValueChange: setSelectedColumnId, children: [
          /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select column" }) }),
          /* @__PURE__ */ jsx(SelectContent, { children: columns.map((col) => /* @__PURE__ */ jsx(SelectItem, { value: col.id, children: col.title }, col.id)) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsx(Label, { htmlFor: "assignee", children: "Assignee" }),
      /* @__PURE__ */ jsx(
        SearchSelect,
        {
          options: userOptions,
          value: assigneeId,
          onChange: setAssigneeId,
          placeholder: "Select assignee",
          emptyMessage: "No users found"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsx(Label, { children: "Description" }),
      /* @__PURE__ */ jsx(
        MinimalTiptapEditor,
        {
          value: description,
          onChange: (value) => setDescription(typeof value === "string" ? value : ""),
          output: "markdown",
          placeholder: "Describe the task...",
          className: "min-h-[150px]",
          uploader: uploadImage,
          imagePickerTrigger
        }
      )
    ] }),
    error && /* @__PURE__ */ jsx("div", { className: "p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md", children: error }),
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between pt-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsx(Button, { type: "submit", disabled: isPending, children: isPending ? isEditing ? "Updating..." : "Creating..." : isEditing ? "Update Task" : "Create Task" }),
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            onClick: onClose,
            disabled: isPending,
            children: "Cancel"
          }
        )
      ] }),
      isEditing && onDelete && /* @__PURE__ */ jsxs(
        Button,
        {
          type: "button",
          variant: "destructive",
          onClick: onDelete,
          disabled: isPending,
          children: [
            /* @__PURE__ */ jsx(Trash2, { className: "mr-2 h-4 w-4" }),
            "Delete"
          ]
        }
      )
    ] })
  ] });
}
function BoardPage({ boardId }) {
  const { data: board, error, refetch, isFetching } = useSuspenseBoard(boardId);
  if (error && !isFetching) {
    throw error;
  }
  const {
    Link: OverrideLink,
    navigate: overrideNavigate,
    taskDetailBottomSlot
  } = usePluginOverrides("kanban");
  const navigate = overrideNavigate || ((path) => {
    window.location.href = path;
  });
  const Link = OverrideLink || "a";
  const { deleteBoard, isDeleting } = useBoardMutations();
  const { deleteColumn, reorderColumns } = useColumnMutations();
  const { deleteTask, moveTask, reorderTasks } = useTaskMutations();
  const [modalState, setModalState] = useState({ type: "none" });
  const computeKanbanData = useCallback(
    (columns) => {
      if (!columns) return {};
      return columns.reduce(
        (acc, column) => {
          acc[column.id] = column.tasks || [];
          return acc;
        },
        {}
      );
    },
    []
  );
  const [kanbanState, setKanbanState] = useState(() => computeKanbanData(board?.columns));
  const serverKanbanData = useMemo(
    () => computeKanbanData(board?.columns),
    [board?.columns, computeKanbanData]
  );
  useEffect(() => {
    setKanbanState(serverKanbanData);
  }, [serverKanbanData]);
  const closeModal = useCallback(() => {
    setModalState({ type: "none" });
  }, []);
  const handleDeleteBoard = useCallback(async () => {
    try {
      await deleteBoard(boardId);
      closeModal();
      navigate("/pages/kanban");
      if (typeof window !== "undefined") {
        setTimeout(() => {
          if (window.location.pathname.includes(boardId)) {
            window.location.href = "/pages/kanban";
          }
        }, 100);
      }
    } catch (error2) {
      const message = error2 instanceof Error ? error2.message : "Failed to delete board";
      toast.error(message);
    }
  }, [deleteBoard, boardId, navigate, closeModal]);
  const handleKanbanChange = useCallback(
    async (newData) => {
      if (!board) return;
      let previousState = {};
      setKanbanState((current) => {
        previousState = current;
        return newData;
      });
      try {
        const oldKeys = Object.keys(previousState);
        const newKeys = Object.keys(newData);
        const isColumnMove = oldKeys.length === newKeys.length && oldKeys.join("") !== newKeys.join("");
        if (isColumnMove) {
          await reorderColumns(board.id, newKeys);
        } else {
          const crossColumnMoves = [];
          const columnsToReorder = /* @__PURE__ */ new Map();
          const targetColumnsOfCrossMove = /* @__PURE__ */ new Set();
          for (const [columnId, tasks] of Object.entries(newData)) {
            const oldTasks = previousState[columnId] || [];
            let hasOrderChanges = false;
            for (let i = 0; i < tasks.length; i++) {
              const task = tasks[i];
              if (!task) continue;
              if (task.columnId !== columnId) {
                crossColumnMoves.push({
                  taskId: task.id,
                  targetColumnId: columnId,
                  targetOrder: i
                });
                targetColumnsOfCrossMove.add(columnId);
              } else if (task.order !== i) {
                hasOrderChanges = true;
              }
            }
            const newTaskIds = new Set(tasks.map((t) => t.id));
            const tasksRemoved = oldTasks.some((t) => !newTaskIds.has(t.id));
            if (hasOrderChanges && !targetColumnsOfCrossMove.has(columnId) && !tasksRemoved) {
              columnsToReorder.set(
                columnId,
                tasks.map((t) => t.id)
              );
            }
          }
          for (const move of crossColumnMoves) {
            await moveTask(move.taskId, move.targetColumnId, move.targetOrder);
          }
          for (const [columnId, taskIds] of columnsToReorder) {
            await reorderTasks(columnId, taskIds);
          }
          for (const targetColumnId of targetColumnsOfCrossMove) {
            const tasks = newData[targetColumnId];
            if (tasks) {
              await reorderTasks(
                targetColumnId,
                tasks.map((t) => t.id)
              );
            }
          }
        }
        refetch();
      } catch (error2) {
        refetch();
        throw error2;
      }
    },
    [board, reorderColumns, moveTask, reorderTasks, refetch]
  );
  const orderedColumns = useMemo(() => {
    if (!board?.columns) return [];
    const columnMap = new Map(board.columns.map((c) => [c.id, c]));
    return Object.keys(kanbanState).map((columnId) => {
      const column = columnMap.get(columnId);
      if (!column) return null;
      return {
        ...column,
        tasks: kanbanState[columnId] || []
      };
    }).filter(
      (c) => c !== null
    );
  }, [board?.columns, kanbanState]);
  if (!board) {
    return /* @__PURE__ */ jsx(
      EmptyState,
      {
        title: "Board not found",
        description: "The board you're looking for doesn't exist or you don't have access to it.",
        action: /* @__PURE__ */ jsxs(Button, { onClick: () => navigate("/pages/kanban"), children: [
          /* @__PURE__ */ jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }),
          "Back to Boards"
        ] })
      }
    );
  }
  return /* @__PURE__ */ jsxs(
    PageWrapper,
    {
      "data-testid": "board-page",
      className: "flex flex-col items-center",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "w-full flex items-center justify-between mb-8", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsx(
              Link,
              {
                href: "/pages/kanban",
                className: "text-muted-foreground hover:text-foreground",
                children: /* @__PURE__ */ jsx(ArrowLeft, { className: "h-5 w-5" })
              }
            ),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold", "data-testid": "page-header", children: board.name }),
              board.description && /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mt-1", children: board.description })
            ] })
          ] }),
          /* @__PURE__ */ jsxs(DropdownMenu, { children: [
            /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { variant: "outline", children: [
              /* @__PURE__ */ jsx(Settings, { className: "mr-2 h-4 w-4" }),
              "Actions"
            ] }) }),
            /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", children: [
              /* @__PURE__ */ jsxs(
                DropdownMenuItem,
                {
                  onClick: () => setModalState({ type: "addColumn" }),
                  children: [
                    /* @__PURE__ */ jsx(Plus, { className: "mr-2 h-4 w-4" }),
                    "Add Column"
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                DropdownMenuItem,
                {
                  onClick: () => setModalState({ type: "editBoard" }),
                  children: [
                    /* @__PURE__ */ jsx(Pencil, { className: "mr-2 h-4 w-4" }),
                    "Edit Board"
                  ]
                }
              ),
              /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
              /* @__PURE__ */ jsxs(
                DropdownMenuItem,
                {
                  onClick: () => setModalState({ type: "deleteBoard" }),
                  className: "text-red-600 focus:text-red-600",
                  children: [
                    /* @__PURE__ */ jsx(Trash2, { className: "mr-2 h-4 w-4" }),
                    "Delete Board"
                  ]
                }
              )
            ] })
          ] })
        ] }),
        orderedColumns.length > 0 ? /* @__PURE__ */ jsx(
          KanbanBoard,
          {
            columns: orderedColumns,
            kanbanState,
            onKanbanChange: handleKanbanChange,
            onAddTask: (columnId) => setModalState({ type: "addTask", columnId }),
            onEditTask: (columnId, taskId) => setModalState({ type: "editTask", columnId, taskId }),
            onEditColumn: (columnId) => setModalState({ type: "editColumn", columnId }),
            onDeleteColumn: (columnId) => setModalState({ type: "deleteColumn", columnId })
          }
        ) : /* @__PURE__ */ jsx(
          EmptyState,
          {
            title: "No columns yet",
            description: "Create your first column to start organizing tasks.",
            action: /* @__PURE__ */ jsxs(Button, { onClick: () => setModalState({ type: "addColumn" }), children: [
              /* @__PURE__ */ jsx(Plus, { className: "mr-2 h-4 w-4" }),
              "Add Column"
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          Dialog,
          {
            open: modalState.type === "addColumn",
            onOpenChange: (open) => !open && closeModal(),
            children: /* @__PURE__ */ jsxs(DialogContent, { children: [
              /* @__PURE__ */ jsxs(DialogHeader, { children: [
                /* @__PURE__ */ jsx(DialogTitle, { children: "Add Column" }),
                /* @__PURE__ */ jsx(DialogDescription, { children: "Add a new column to this board." })
              ] }),
              /* @__PURE__ */ jsx(
                ColumnForm,
                {
                  boardId,
                  onClose: closeModal,
                  onSuccess: () => {
                    closeModal();
                    refetch();
                  }
                }
              )
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          Dialog,
          {
            open: modalState.type === "editColumn",
            onOpenChange: (open) => !open && closeModal(),
            children: /* @__PURE__ */ jsxs(DialogContent, { children: [
              /* @__PURE__ */ jsxs(DialogHeader, { children: [
                /* @__PURE__ */ jsx(DialogTitle, { children: "Edit Column" }),
                /* @__PURE__ */ jsx(DialogDescription, { children: "Update the column details." })
              ] }),
              modalState.type === "editColumn" && /* @__PURE__ */ jsx(
                ColumnForm,
                {
                  boardId,
                  columnId: modalState.columnId,
                  column: board.columns?.find((c) => c.id === modalState.columnId),
                  onClose: closeModal,
                  onSuccess: () => {
                    closeModal();
                    refetch();
                  }
                }
              )
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          AlertDialog,
          {
            open: modalState.type === "deleteColumn",
            onOpenChange: (open) => !open && closeModal(),
            children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
              /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
                /* @__PURE__ */ jsx(AlertDialogTitle, { children: "Delete Column" }),
                /* @__PURE__ */ jsx(AlertDialogDescription, { children: "Are you sure you want to delete this column? All tasks in this column will be permanently removed." })
              ] }),
              /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
                /* @__PURE__ */ jsx(AlertDialogCancel, { children: "Cancel" }),
                /* @__PURE__ */ jsx(
                  AlertDialogAction,
                  {
                    onClick: async () => {
                      if (modalState.type === "deleteColumn") {
                        try {
                          await deleteColumn(modalState.columnId);
                          closeModal();
                          refetch();
                        } catch (error2) {
                          const message = error2 instanceof Error ? error2.message : "Failed to delete column";
                          toast.error(message);
                        }
                      }
                    },
                    className: "bg-red-600 hover:bg-red-700",
                    children: "Delete"
                  }
                )
              ] })
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          Dialog,
          {
            open: modalState.type === "editBoard",
            onOpenChange: (open) => !open && closeModal(),
            children: /* @__PURE__ */ jsxs(DialogContent, { children: [
              /* @__PURE__ */ jsxs(DialogHeader, { children: [
                /* @__PURE__ */ jsx(DialogTitle, { children: "Edit Board" }),
                /* @__PURE__ */ jsx(DialogDescription, { children: "Update board details." })
              ] }),
              /* @__PURE__ */ jsx(
                BoardForm,
                {
                  board,
                  onClose: closeModal,
                  onSuccess: () => {
                    closeModal();
                    refetch();
                  }
                }
              )
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          AlertDialog,
          {
            open: modalState.type === "deleteBoard",
            onOpenChange: (open) => !open && closeModal(),
            children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
              /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
                /* @__PURE__ */ jsx(AlertDialogTitle, { children: "Delete Board" }),
                /* @__PURE__ */ jsx(AlertDialogDescription, { children: "Are you sure you want to delete this board? This action cannot be undone. All columns and tasks will be permanently removed." })
              ] }),
              /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
                /* @__PURE__ */ jsx(AlertDialogCancel, { children: "Cancel" }),
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    onClick: handleDeleteBoard,
                    disabled: isDeleting,
                    className: "bg-red-600 hover:bg-red-700",
                    children: isDeleting ? "Deleting..." : "Delete"
                  }
                )
              ] })
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          Dialog,
          {
            open: modalState.type === "addTask",
            onOpenChange: (open) => !open && closeModal(),
            children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-3xl! max-h-screen overflow-y-auto", children: [
              /* @__PURE__ */ jsxs(DialogHeader, { children: [
                /* @__PURE__ */ jsx(DialogTitle, { children: "Add Task" }),
                /* @__PURE__ */ jsx(DialogDescription, { children: "Create a new task." })
              ] }),
              modalState.type === "addTask" && /* @__PURE__ */ jsx(
                TaskForm,
                {
                  columnId: modalState.columnId,
                  boardId,
                  columns: board.columns || [],
                  onClose: closeModal,
                  onSuccess: () => {
                    closeModal();
                    refetch();
                  }
                }
              )
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          Dialog,
          {
            open: modalState.type === "editTask",
            onOpenChange: (open) => !open && closeModal(),
            children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-3xl! max-h-screen overflow-y-auto", children: [
              /* @__PURE__ */ jsxs(DialogHeader, { children: [
                /* @__PURE__ */ jsx(DialogTitle, { children: "Edit Task" }),
                /* @__PURE__ */ jsx(DialogDescription, { children: "Update task details." })
              ] }),
              modalState.type === "editTask" && /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(
                  TaskForm,
                  {
                    columnId: modalState.columnId,
                    boardId,
                    taskId: modalState.taskId,
                    task: board.columns?.find((c) => c.id === modalState.columnId)?.tasks?.find((t) => t.id === modalState.taskId),
                    columns: board.columns || [],
                    onClose: closeModal,
                    onSuccess: () => {
                      closeModal();
                      refetch();
                    },
                    onDelete: async () => {
                      try {
                        await deleteTask(modalState.taskId);
                        closeModal();
                        refetch();
                      } catch (error2) {
                        const message = error2 instanceof Error ? error2.message : "Failed to delete task";
                        toast.error(message);
                      }
                    }
                  }
                ),
                taskDetailBottomSlot && (() => {
                  const task = board.columns?.find((c) => c.id === modalState.columnId)?.tasks?.find((t) => t.id === modalState.taskId);
                  return task ? /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: "mt-4 pt-4 border-t",
                      "data-testid": "task-detail-bottom-slot",
                      children: taskDetailBottomSlot(task)
                    }
                  ) : null;
                })()
              ] })
            ] })
          }
        )
      ]
    }
  );
}
export {
  BoardPage
};
