import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import tsParser from "@typescript-eslint/parser";
import unusedImports from "eslint-plugin-unused-imports";
import airbnbBase from "eslint-config-airbnb-base";
import airbnbBaseTypescript from "eslint-config-airbnb-base-typescript";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: {
      js,
      "@typescript-eslint": tseslint,
      "unused-imports": unusedImports,
    },
    rules: {
      ...airbnbBase.rules,
      ...airbnbBaseTypescript.rules,
      "no-unused-vars": "off",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
    extends: ["js/recommended"],
    languageOptions: {
      parser: tsParser,
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    settings: {
      "import/resolver": {
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      },
    },
  },
  tseslint.configs.recommended,
]);
