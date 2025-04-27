// vite.config.js
import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [dts({ insertTypesEntry: true, entryRoot: "lib/index.ts" })],
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
