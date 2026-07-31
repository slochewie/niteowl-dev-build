import { jsx, jsxs } from "react/jsx-runtime";
import { B as Badge } from "./badge-CGoI1f31.mjs";
import { l as usePluginOverrides, A as BLOG_LOCALIZATION, D as useBasePath, v as Card, x as CardHeader, y as CardTitle, w as CardContent } from "./router-qu_5GP1h.mjs";
import { f as format } from "../_libs/date-fns.mjs";
import { b as Calendar } from "../_libs/lucide-react.mjs";
const DefaultLink = (props) => {
  return /* @__PURE__ */ jsx("a", { ...props });
};
const DefaultImage = (props) => {
  return /* @__PURE__ */ jsx("img", { ...props });
};
const GRADIENT_PALETTES = [
  {
    from: "from-purple-500",
    via: "via-pink-500",
    to: "to-orange-500",
    overlay: "from-blue-600/50"
  },
  {
    from: "from-blue-500",
    via: "via-cyan-500",
    to: "to-teal-500",
    overlay: "from-indigo-600/50"
  },
  {
    from: "from-pink-500",
    via: "via-rose-500",
    to: "to-orange-500",
    overlay: "from-purple-600/50"
  },
  {
    from: "from-green-500",
    via: "via-emerald-500",
    to: "to-teal-500",
    overlay: "from-cyan-600/50"
  },
  {
    from: "from-indigo-500",
    via: "via-purple-500",
    to: "to-pink-500",
    overlay: "from-violet-600/50"
  },
  {
    from: "from-orange-500",
    via: "via-amber-500",
    to: "to-yellow-500",
    overlay: "from-orange-600/50"
  },
  {
    from: "from-cyan-500",
    via: "via-blue-500",
    to: "to-indigo-500",
    overlay: "from-purple-600/50"
  },
  {
    from: "from-violet-500",
    via: "via-purple-500",
    to: "to-fuchsia-500",
    overlay: "from-pink-600/50"
  },
  {
    from: "from-emerald-500",
    via: "via-green-500",
    to: "to-lime-500",
    overlay: "from-teal-600/50"
  },
  {
    from: "from-rose-500",
    via: "via-pink-500",
    to: "to-fuchsia-500",
    overlay: "from-purple-600/50"
  },
  {
    from: "from-sky-500",
    via: "via-blue-500",
    to: "to-indigo-600",
    overlay: "from-purple-700/40"
  },
  {
    from: "from-fuchsia-600",
    via: "via-purple-600",
    to: "to-indigo-600",
    overlay: "from-pink-700/40"
  },
  {
    from: "from-teal-500",
    via: "via-emerald-500",
    to: "to-green-600",
    overlay: "from-cyan-700/40"
  },
  {
    from: "from-amber-500",
    via: "via-orange-500",
    to: "to-pink-500",
    overlay: "from-yellow-600/40"
  },
  {
    from: "from-indigo-600",
    via: "via-blue-600",
    to: "to-purple-600",
    overlay: "from-violet-700/40"
  },
  {
    from: "from-pink-600",
    via: "via-rose-600",
    to: "to-orange-600",
    overlay: "from-fuchsia-700/40"
  },
  {
    from: "from-cyan-600",
    via: "via-teal-600",
    to: "to-emerald-600",
    overlay: "from-blue-700/40"
  },
  {
    from: "from-purple-600",
    via: "via-fuchsia-600",
    to: "to-pink-600",
    overlay: "from-violet-700/40"
  },
  {
    from: "from-blue-600",
    via: "via-indigo-600",
    to: "to-purple-600",
    overlay: "from-cyan-700/40"
  },
  {
    from: "from-green-600",
    via: "via-emerald-600",
    to: "to-teal-600",
    overlay: "from-lime-700/40"
  },
  {
    from: "from-rose-600",
    via: "via-pink-600",
    to: "to-fuchsia-600",
    overlay: "from-pink-700/40"
  },
  {
    from: "from-orange-600",
    via: "via-pink-600",
    to: "to-rose-600",
    overlay: "from-amber-700/40"
  },
  {
    from: "from-violet-600",
    via: "via-purple-600",
    to: "to-fuchsia-600",
    overlay: "from-indigo-700/40"
  },
  {
    from: "from-teal-600",
    via: "via-cyan-600",
    to: "to-blue-600",
    overlay: "from-emerald-700/40"
  },
  {
    from: "from-emerald-600",
    via: "via-teal-600",
    to: "to-cyan-600",
    overlay: "from-green-700/40"
  },
  {
    from: "from-indigo-700",
    via: "via-purple-700",
    to: "to-pink-700",
    overlay: "from-violet-800/30"
  },
  {
    from: "from-blue-700",
    via: "via-cyan-700",
    to: "to-teal-700",
    overlay: "from-indigo-800/30"
  },
  {
    from: "from-purple-700",
    via: "via-fuchsia-700",
    to: "to-pink-700",
    overlay: "from-violet-800/30"
  },
  {
    from: "from-pink-700",
    via: "via-rose-700",
    to: "to-orange-700",
    overlay: "from-fuchsia-800/30"
  },
  {
    from: "from-cyan-700",
    via: "via-blue-700",
    to: "to-indigo-700",
    overlay: "from-teal-800/30"
  }
];
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}
function getGradientFromTitle(title) {
  const hash = hashString(title);
  const palette = GRADIENT_PALETTES[hash % GRADIENT_PALETTES.length];
  return palette;
}
function PostCard({ post }) {
  const { Link, Image } = usePluginOverrides("blog", {
    Link: DefaultLink,
    Image: DefaultImage
  });
  const { localization } = usePluginOverrides("blog", {
    localization: BLOG_LOCALIZATION
  });
  const basePath = useBasePath();
  const blogPath = `${basePath}/blog/${post.slug}`;
  const postDate = format(
    post.publishedAt || post.createdAt,
    "MMMM d, yyyy"
  );
  const gradient = post.image ? null : getGradientFromTitle(post.title);
  return /* @__PURE__ */ jsxs(Card, { className: "group relative flex h-full flex-col gap-4 pt-0! pb-4! transition-shadow duration-200 hover:shadow-lg", children: [
    /* @__PURE__ */ jsx(
      Link,
      {
        href: blogPath,
        className: "relative block h-48 w-full overflow-hidden rounded-t-xl bg-muted",
        "aria-label": post.title,
        children: post.image ? /* @__PURE__ */ jsx(
          Image,
          {
            src: post.image,
            alt: post.title,
            className: "h-full w-full object-cover transition-transform duration-200 group-hover:scale-105",
            width: 500,
            height: 300
          }
        ) : /* @__PURE__ */ jsxs("div", { className: "relative h-full w-full overflow-hidden transition-transform duration-200 group-hover:scale-105", children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: `absolute inset-0 bg-linear-to-br ${gradient.from} ${gradient.via} ${gradient.to}`
            }
          ),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: `absolute inset-0 bg-linear-to-tr ${gradient.overlay} via-transparent to-transparent`
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "relative z-10 flex h-full w-full items-center justify-center p-6", children: /* @__PURE__ */ jsx("h3", { className: "text-center text-xl font-bold leading-tight text-white drop-shadow-lg line-clamp-3", children: post.title }) })
        ] })
      }
    ),
    !post.published && /* @__PURE__ */ jsx(Badge, { variant: "destructive", className: "absolute top-2 left-2 text-xs", children: localization.BLOG_CARD_DRAFT_BADGE }),
    /* @__PURE__ */ jsxs(
      Link,
      {
        href: blogPath,
        "aria-label": `${post.title}`,
        className: "block focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 grow",
        children: [
          /* @__PURE__ */ jsx(CardHeader, { className: "flex-1", children: /* @__PURE__ */ jsx(CardTitle, { className: "line-clamp-3 text-lg leading-tight transition-colors group-hover:underline", children: post.title }) }),
          /* @__PURE__ */ jsx(CardContent, { className: "flex flex-1 flex-col gap-2", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-muted-foreground text-xs", children: [
              /* @__PURE__ */ jsx(Calendar, { className: "h-3 w-3" }),
              /* @__PURE__ */ jsx("time", { dateTime: postDate, children: postDate })
            ] }),
            post.tags && post.tags.length > 0 && post.tags.map((tag) => /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-xs", children: tag.name }, tag.id))
          ] }) })
        ]
      }
    )
  ] });
}
export {
  DefaultLink as D,
  PostCard as P,
  DefaultImage as a
};
