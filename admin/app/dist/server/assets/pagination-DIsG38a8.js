import { jsxs, jsx } from "react/jsx-runtime";
import { Inbox, ChevronRight } from "lucide-react";
import { B as Button } from "./router-DU5jczZR.js";
function EmptyState({ title, description, action }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-12 px-4 text-center", children: [
    /* @__PURE__ */ jsx("div", { className: "rounded-full bg-muted p-4 mb-4", children: /* @__PURE__ */ jsx(Inbox, { className: "h-8 w-8 text-muted-foreground" }) }),
    /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-foreground mb-2", children: title }),
    description && /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mb-4 max-w-sm", children: description }),
    action
  ] });
}
function Pagination({
  total,
  showing,
  hasMore,
  isLoadingMore,
  onLoadMore,
  labels = {}
}) {
  const {
    showing: showingLabel = "Showing {count} of {total}",
    next = "Load More"
  } = labels;
  const showingText = showingLabel.replace("{count}", String(showing)).replace("{total}", String(total));
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between py-4", children: [
    /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: showingText }),
    hasMore && /* @__PURE__ */ jsxs(
      Button,
      {
        variant: "outline",
        size: "sm",
        onClick: onLoadMore,
        disabled: isLoadingMore,
        children: [
          isLoadingMore ? "Loading..." : next,
          /* @__PURE__ */ jsx(ChevronRight, { className: "ml-2 h-4 w-4" })
        ]
      }
    )
  ] });
}
export {
  EmptyState as E,
  Pagination as P
};
