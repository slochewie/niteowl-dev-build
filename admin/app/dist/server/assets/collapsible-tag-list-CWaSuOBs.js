import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { D as DefaultLink } from "./post-card-ZC-FaXC3.js";
import { B as Badge } from "./badge-DFvO9DkX.js";
import { l as usePluginOverrides, A as BLOG_LOCALIZATION, D as useBasePath } from "./router-DU5jczZR.js";
import { ChevronUp, ChevronDown } from "lucide-react";
import { useState } from "react";
const MAX_VISIBLE_TAGS = 15;
function CollapsibleTagList({
  tags,
  maxVisible = MAX_VISIBLE_TAGS
}) {
  const { Link, localization } = usePluginOverrides("blog", {
    Link: DefaultLink,
    localization: BLOG_LOCALIZATION
  });
  const basePath = useBasePath();
  const [showAll, setShowAll] = useState(false);
  if (!tags || tags.length === 0) {
    return null;
  }
  const hasMore = tags.length > maxVisible;
  const visibleTags = showAll || !hasMore ? tags : tags.slice(0, maxVisible);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    visibleTags.map((tag) => /* @__PURE__ */ jsx(Link, { href: `${basePath}/blog/tag/${tag.slug}`, children: /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-xs", children: tag.name }) }, tag.id)),
    hasMore && /* @__PURE__ */ jsx(Badge, { asChild: true, variant: "secondary", className: "text-xs cursor-pointer", children: /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: () => setShowAll((prev) => !prev),
        "aria-expanded": showAll,
        "aria-label": showAll ? localization.BLOG_TAGS_SHOW_LESS : localization.BLOG_TAGS_SHOW_ALL,
        title: showAll ? localization.BLOG_TAGS_SHOW_LESS : localization.BLOG_TAGS_SHOW_ALL,
        children: showAll ? /* @__PURE__ */ jsx(ChevronUp, { "aria-hidden": "true" }) : /* @__PURE__ */ jsx(ChevronDown, { "aria-hidden": "true" })
      }
    ) })
  ] });
}
export {
  CollapsibleTagList as C
};
