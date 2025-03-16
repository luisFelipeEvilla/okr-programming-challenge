/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: [
      "**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
      "**/@*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"
    ],
    environment: "jsdom",
    environmentMatchGlobs: [
      // API routes and other server-side code should run in node environment
      ["**/api/**/*.test.{js,ts}", "node"],
      // Components and client-side code should run in jsdom environment
      ["**/*.test.{jsx,tsx}", "jsdom"],
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        // coverage
        "html/",
        "dist/",
        "build/",
        ".next/",
        "**/*.d.ts",
        "**/*.test.ts",
        "**/*.test.tsx",
        "**/ui/**",
        // ignore .mjs
        "**/*.mjs"
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
}); 