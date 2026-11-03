import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    setupFiles: ["dotenv/config", "./test/setupEnv.ts"],
    testTimeout: 15000,
    // Jest ran every file under __tests__; Vitest's default *.test.ts glob would skip models/films.ts.
    include: ["__tests__/**/*.ts"],
    exclude: ["client/**", "node_modules/**"],
  },
});
