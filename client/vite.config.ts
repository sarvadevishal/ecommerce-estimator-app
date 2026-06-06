import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Tailwind is compiled via PostCSS (see postcss.config.mjs). Vite dev server
// proxies /api/* to the Express backend, so the browser only ever talks to the
// frontend origin.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:8787",
    },
  },
});
