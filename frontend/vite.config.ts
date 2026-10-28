import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Frontend snakker med egen backend. Browseren ser aldri gatewayen.
      "/api": "http://localhost:3001",
    },
  },
});
