import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: [
      "src/**/*.test.{ts,tsx}",
      "src/**/__tests__/**/*.{test,spec}.{ts,tsx}",
    ],
    setupFiles: ["./vitest.setup.ts"],
  },
});
