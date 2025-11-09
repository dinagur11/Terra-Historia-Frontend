import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true, 
  },
  resolve: {
    alias: {
      // optional: shorter imports if you like
      "@": "/src",
    },
  },
  optimizeDeps: {
    include: ["maplibre-gl"], // pre-bundle common deps for faster startup
  },
  build: {
    target: "esnext",
    outDir: "dist",
  },
});
