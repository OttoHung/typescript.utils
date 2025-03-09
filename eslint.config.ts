import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: [
      "src/**/*.js",
      "src/**/*.ts",
    ],
    ignores: [
      "dist/",
      "node_modules/",
      "lib/",
      "jest.config.*",
      "packages/**/dist/",
      "packages/**/node_modules/",
      "packages/**/lib/",
      "packages/**/jest.config.*",
    ],
    rules: {
      semi: "error",
      "prefer-const": "error"
    },
  },
]);