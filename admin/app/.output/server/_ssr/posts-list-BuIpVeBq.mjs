import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { l as usePluginOverrides, A as BLOG_LOCALIZATION, B as Button, D as useBasePath, a4 as stripMarkdown, a5 as stripHtml } from "./router-qu_5GP1h.mjs";
import { E as EmptyList, b as usePostSearch, c as useDebounce } from "./blog-hooks-gv3MttsW.mjs";
import * as React from "react";
import { C as CommandDialog, a as CommandInput, b as CommandList, c as CommandEmpty } from "./command-8DCQ5FSU.mjs";
import { P as PostCard } from "./post-card-BBIV2tCO.mjs";
import { S as Search } from "../_libs/lucide-react.mjs";
function HighlightText({
  text,
  searchQuery,
  className,
  maxLength = 150
}) {
  if (!searchQuery.trim()) {
    const truncated = maxLength && text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
    return /* @__PURE__ */ jsx("span", { className, children: truncated });
  }
  const query = searchQuery.toLowerCase();
  const lowerText = text.toLowerCase();
  const matchIndex = lowerText.indexOf(query);
  if (matchIndex === -1) {
    const truncated = maxLength && text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
    return /* @__PURE__ */ jsx("span", { className, children: truncated });
  }
  let startIndex = 0;
  let endIndex = text.length;
  if (maxLength && text.length > maxLength) {
    const snippetStart = Math.max(0, matchIndex - Math.floor(maxLength / 2));
    const snippetEnd = Math.min(text.length, snippetStart + maxLength);
    startIndex = snippetStart;
    endIndex = snippetEnd;
  }
  const snippet = text.substring(startIndex, endIndex);
  const adjustedMatchIndex = matchIndex - startIndex;
  if (adjustedMatchIndex < 0 || adjustedMatchIndex >= snippet.length) {
    const truncated = snippet + (endIndex < text.length ? "..." : "");
    return /* @__PURE__ */ jsx("span", { className, children: startIndex > 0 ? `...${truncated}` : truncated });
  }
  const beforeMatch = snippet.substring(0, adjustedMatchIndex);
  const match = snippet.substring(
    adjustedMatchIndex,
    adjustedMatchIndex + query.length
  );
  const afterMatch = snippet.substring(adjustedMatchIndex + query.length);
  const prefix = startIndex > 0 ? "..." : "";
  const suffix = endIndex < text.length ? "..." : "";
  return /* @__PURE__ */ jsxs("span", { className, children: [
    prefix,
    beforeMatch,
    /* @__PURE__ */ jsx("mark", { className: "rounded-sm bg-yellow-200 font-medium text-foreground dark:bg-yellow-800", children: match }),
    afterMatch,
    suffix
  ] });
}
function SearchModal({
  placeholder = "Type to search...",
  emptyMessage = "No results found.",
  buttonText = "Search",
  keyboardShortcut = "⌘K",
  searchFn,
  renderResult,
  results: externalResults,
  isLoading = false,
  className,
  triggerClassName
}) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState([]);
  const shouldDebounce = externalResults === void 0;
  const debouncedQuery = useDebounce(query, shouldDebounce ? 300 : 0);
  React.useEffect(() => {
    const down = (e) => {
      const cleanShortcut = keyboardShortcut.replace("⌘", "").replace("⇧", "").toLowerCase();
      if (e.key === cleanShortcut && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open2) => !open2);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [keyboardShortcut]);
  React.useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
      return;
    }
  }, [open]);
  React.useEffect(() => {
    if (!open) return;
    const searchResults = searchFn(debouncedQuery);
    if (externalResults !== void 0) {
      setResults(externalResults);
    } else {
      setResults(searchResults);
    }
  }, [debouncedQuery, open, searchFn, externalResults]);
  const buttonClasses = [
    "border-input bg-background text-foreground",
    "placeholder:text-muted-foreground",
    "focus-visible:border-ring focus-visible:ring-ring/50",
    "inline-flex h-9 w-fit rounded-md border px-3 py-2 text-sm",
    "shadow-xs transition-[color,box-shadow] outline-none",
    "focus-visible:ring-[3px]",
    triggerClassName
  ].filter(Boolean).join(" ");
  const showEmpty = debouncedQuery && !isLoading && results.length === 0;
  const currentEmptyMessage = isLoading ? "Searching..." : emptyMessage;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        "data-testid": "search-button",
        type: "button",
        className: buttonClasses,
        onClick: () => setOpen(true),
        children: [
          /* @__PURE__ */ jsxs("span", { className: "flex grow items-center", children: [
            /* @__PURE__ */ jsx(
              Search,
              {
                className: "-ms-1 me-3 text-muted-foreground",
                size: 16,
                "aria-hidden": "true"
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "font-normal text-muted-foreground", children: buttonText })
          ] }),
          keyboardShortcut && /* @__PURE__ */ jsx("kbd", { className: "-me-1 ms-12 inline-flex h-5 max-h-full items-center rounded border bg-background px-1 font-[inherit] font-medium text-[0.625rem] text-muted-foreground", children: keyboardShortcut })
        ]
      }
    ),
    /* @__PURE__ */ jsxs(
      CommandDialog,
      {
        "data-testid": "search-modal",
        open,
        onOpenChange: setOpen,
        className,
        children: [
          /* @__PURE__ */ jsx(
            CommandInput,
            {
              "data-testid": "search-input",
              placeholder,
              value: query,
              onValueChange: setQuery
            }
          ),
          /* @__PURE__ */ jsxs(CommandList, { className: "max-h-[400px]", children: [
            showEmpty && /* @__PURE__ */ jsx(CommandEmpty, { children: currentEmptyMessage }),
            results.length > 0 && results.map(
              (item, index) => renderResult(item, index, debouncedQuery)
            )
          ] })
        ]
      }
    )
  ] });
}
const renderBlogResult = (item, index, query) => {
  const q = (query || "").toLowerCase();
  const excerptMatches = item.processedExcerpt ? item.processedExcerpt.toLowerCase().includes(q) : false;
  const contentMatches = item.processedContent ? item.processedContent.toLowerCase().includes(q) : false;
  return /* @__PURE__ */ jsxs(
    "button",
    {
      "data-testid": "search-result",
      type: "button",
      className: "flex w-full cursor-pointer flex-col gap-2 rounded-sm border-border border-b px-4 py-3 text-left transition-colors hover:bg-accent",
      onClick: () => item.onClick?.(),
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-2", children: [
          /* @__PURE__ */ jsx(
            HighlightText,
            {
              text: item.title,
              searchQuery: query,
              className: "flex-1 font-medium text-sm leading-5"
            }
          ),
          item.publishedAt && /* @__PURE__ */ jsx("span", { className: "whitespace-nowrap text-muted-foreground text-xs", children: new Date(item.publishedAt).toLocaleDateString() })
        ] }),
        excerptMatches && /* @__PURE__ */ jsx(
          HighlightText,
          {
            text: item.processedExcerpt || "",
            searchQuery: query,
            className: "text-muted-foreground text-xs leading-4",
            maxLength: 120
          }
        ),
        contentMatches && /* @__PURE__ */ jsx(
          HighlightText,
          {
            text: item.processedContent,
            searchQuery: query,
            className: "text-muted-foreground text-xs leading-4",
            maxLength: 120
          }
        ),
        !excerptMatches && !contentMatches && /* @__PURE__ */ jsx(
          HighlightText,
          {
            text: item.processedExcerpt || item.processedContent,
            searchQuery: query,
            className: "text-muted-foreground text-xs leading-4",
            maxLength: 120
          }
        )
      ]
    },
    item.id
  );
};
function SearchInput({
  className,
  triggerClassName,
  placeholder,
  buttonText,
  emptyMessage
}) {
  const { navigate } = usePluginOverrides("blog");
  const basePath = useBasePath();
  const [currentQuery, setCurrentQuery] = React.useState("");
  const { data: searchResults = [], isLoading } = usePostSearch({
    query: currentQuery,
    enabled: currentQuery.trim().length > 0,
    debounceMs: 300,
    published: true
  });
  const formattedResults = React.useMemo(() => {
    return searchResults.map((post) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      publishedAt: post.publishedAt,
      authorName: "",
      processedContent: stripMarkdown(stripHtml(post.content || "")),
      processedExcerpt: stripMarkdown(stripHtml(post.excerpt || "")),
      onClick: () => navigate(`${basePath}/blog/${post.slug}`)
    }));
  }, [searchResults, navigate, basePath]);
  const handleSearch = React.useCallback(
    (query) => {
      setCurrentQuery(query);
      return [];
    },
    []
  );
  return /* @__PURE__ */ jsx(
    SearchModal,
    {
      placeholder,
      buttonText,
      emptyMessage,
      searchFn: handleSearch,
      renderResult: renderBlogResult,
      results: formattedResults,
      isLoading,
      className,
      triggerClassName,
      keyboardShortcut: "⌘K"
    }
  );
}
function PostsList({
  posts,
  onLoadMore,
  hasMore,
  isLoadingMore
}) {
  const { localization } = usePluginOverrides("blog", {
    localization: BLOG_LOCALIZATION
  });
  const { PostCard: PostCard$1 } = usePluginOverrides("blog");
  const PostCardComponent = PostCard$1 || PostCard;
  if (posts.length === 0) {
    return /* @__PURE__ */ jsx(EmptyList, { message: localization.BLOG_LIST_EMPTY });
  }
  return /* @__PURE__ */ jsxs("div", { className: "w-full space-y-6", children: [
    /* @__PURE__ */ jsx("div", { className: "flex justify-center pb-6", children: /* @__PURE__ */ jsx(
      SearchInput,
      {
        placeholder: localization.BLOG_LIST_SEARCH_PLACEHOLDER,
        buttonText: localization.BLOG_LIST_SEARCH_BUTTON,
        emptyMessage: localization.BLOG_LIST_SEARCH_EMPTY
      }
    ) }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3", children: posts.map((post) => /* @__PURE__ */ jsx(PostCardComponent, { post }, post.id)) }),
    onLoadMore && hasMore && /* @__PURE__ */ jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsx(
      Button,
      {
        onClick: onLoadMore,
        disabled: isLoadingMore,
        variant: "outline",
        size: "lg",
        children: isLoadingMore ? localization.BLOG_LIST_LOADING_MORE : localization.BLOG_LIST_LOAD_MORE
      }
    ) })
  ] });
}
export {
  PostsList as P
};
