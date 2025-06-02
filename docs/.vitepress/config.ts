import { defineConfig } from "vitepress";
import { optimizeCssModules } from "vite-plugin-optimize-css-modules";
import eslintPlugin from "vite-plugin-eslint";
import { fileURLToPath } from "url";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Three-WFC",
  head: [
    // Favicon
    ["link", { rel: "icon", type: "image/svg+xml", href: "/three-wfc.svg" }],

    // Primary Meta Tags
    ["meta", { name: "title", content: "Your Site Title" }],
    ["meta", { name: "description", content: "Your site description" }],

    // Open Graph / Facebook
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:url", content: "https://yoursite.com/" }],
    ["meta", { property: "og:title", content: "Your Site Title" }],
    ["meta", { property: "og:description", content: "Your site description" }],
    [
      "meta",
      {
        property: "og:image",
        content: "https://yoursite.com/social-preview.png",
      },
    ],

    // Twitter
    ["meta", { property: "twitter:card", content: "summary_large_image" }],
    ["meta", { property: "twitter:url", content: "https://yoursite.com/" }],
    ["meta", { property: "twitter:title", content: "Your Site Title" }],
    [
      "meta",
      { property: "twitter:description", content: "Your site description" },
    ],
    [
      "meta",
      {
        property: "twitter:image",
        content: "https://yoursite.com/social-preview.png",
      },
    ],
  ],
  description:
    "A blazing fast ⚡ Wave Function Collapse engine for three.js, built for real-time 2D, Isometric 2.5D, and 3D procedural world generation at scale.",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: "/three-wfc.svg",

    nav: [
      { text: "Home", link: "/" },
      { text: "Examples", link: "/markdown-examples" },
      { text: "Editor", link: "/editor" },
    ],

    sidebar: [
      {
        text: "Examples",
        items: [
          { text: "Markdown Examples", link: "/markdown-examples" },
          { text: "Runtime API Examples", link: "/api-examples" },
        ],
      },
      {
        text: "Editors",
        items: [{ text: "Editor", link: "/editor" }],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" },
      { icon: "x", link: "https://x.com/_Fennec_XYZ" },
    ],
  },
  vite: {
    plugins: [
      eslintPlugin({
        include: ["./theme/**/*.{js,ts,vue}"],
        cache: false,
        // lintOnStart: true,
        emitWarning: true,
        emitError: true,
        // failOnError: false,
      }),
      // @ts-ignore
      optimizeCssModules(),
    ],
    server: {
      open: true,
    },
  },
});
