import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@utils": resolve(__dirname, "src", "utils"),
      "@pages": resolve(__dirname, "src", "pages"),
      "@stores": resolve(__dirname, "src", "stores"),
      "@assets": resolve(__dirname, "src", "assets"),
      "@services": resolve(__dirname, "src", "services"),
      "@components": resolve(__dirname, "src", "components"),
    },
  },
  plugins: [react()],
});

