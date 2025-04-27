import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: resolve(__dirname, "live"),
  base: "./",
  resolve: {
    alias: {
      "@": resolve(__dirname, "lib"),
    },
  },
  build: {
    outDir: resolve(__dirname, "dist-live"),
    emptyOutDir: true,
    rollupOptions: {},
  },
  server: {},
});
