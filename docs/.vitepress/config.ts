import { defineConfig } from "vitepress";
import { optimizeCssModules } from "vite-plugin-optimize-css-modules";
import eslintPlugin from "vite-plugin-eslint";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Three-WFC",
  description:
    "A blazing fast ⚡ Wave Function Collapse engine for three.js, built for real-time 2D, Isometric 2.5D, and 3D procedural world generation at scale.",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
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
  },
});
