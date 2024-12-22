import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import jsconfigPaths from "vite-jsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), jsconfigPaths()],
  test: {
    globals: true,
    enviroment: "jsdom",
    setupFiles: "./src/testing/setup-tests.js",
  },
});
