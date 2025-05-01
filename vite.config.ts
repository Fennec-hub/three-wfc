// vite.config.js
import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import eslintPlugin from "vite-plugin-eslint";

export default defineConfig({
  plugins: [
    dts({ insertTypesEntry: true }),
    eslintPlugin({
      include: [
        "src/**/*.{js,jsx,ts,tsx,vue}",
        "docs/.vitepress/**/*.{js,ts,vue}",
      ],
      // cache: false, // Disable cache during debugging if needed
      // lintOnStart: true,
      // emitWarning: true,
      // emitError: true,
      // failOnError: false, // Don't fail build on ESLint errors
    }),
  ],
  build: {
    sourcemap: true,
    lib: {
      entry: resolve(__dirname, "lib/index.ts"),
      name: "ThreeWFC",
      fileName: (format) =>
        `three-wfc.${format === "es" ? "js" : format + ".cjs"}`,
      formats: ["es", "umd"],
    },
    rollupOptions: {
      external: ["three"],
      output: {
        globals: {
          three: "THREE",
        },
      },
    },
  },
});
