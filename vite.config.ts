import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [react(), vue(), tailwindcss()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        product: resolve(__dirname, "product/index.html"),
      },
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/three")) return "vendor-three";
          if (id.includes("node_modules/vue") || id.includes("node_modules/@vue")) return "vendor-vue";
          if (id.includes("node_modules/react") || id.includes("node_modules/react-dom")) return "vendor-react";
        },
      },
    },
  },
});
