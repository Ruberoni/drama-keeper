import js from "@eslint/js";
import vitest from "@vitest/eslint-plugin";
import prettier from "eslint-config-prettier";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig(
  // The client has its own ESLint config (client/eslint.config.mjs).
  { ignores: ["dist/**", "client/**", "node_modules/**"] },
  {
    files: ["**/*.{ts,mts,js,mjs}"],
    extends: [js.configs.recommended, tseslint.configs.recommended],
    languageOptions: { globals: globals.node },
  },
  {
    files: ["__tests__/**/*.ts", "test/**/*.ts"],
    extends: [vitest.configs.recommended],
    languageOptions: { globals: vitest.environments.env.globals },
  },
  prettier,
);
