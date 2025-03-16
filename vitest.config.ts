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
        "test{,s}/**",
        "**/*.d.ts",
        "**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress}.*",
        "**/.{eslint,mocha,prettier}rc.{js,cjs,yml}",
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
}); 