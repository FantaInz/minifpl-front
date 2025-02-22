import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.{js,mjs,cjs,jsx}"] },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  { ignores: ["src/components/ui/"] },
  {
    ...pluginReact.configs.flat.recommended,
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  pluginJs.configs.recommended,
];
