import js from "@eslint/js";
import globals from "globals";
import prettier from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

export default [
  {
    ignores: ["dist/**", "node_modules/**", "webpack.*.js", "webpack.*.cjs"],
  },
  js.configs.recommended,
  prettierConfig,
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: globals.browser,
      ecmaVersion: "latest",
      sourceType: "module",
    },
    plugins: {
      prettier,
    },
    rules: {
      "prettier/prettier": "error",
    },
  },
];
