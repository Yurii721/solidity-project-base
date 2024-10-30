// @ts-check

// // The approach for NodeJS < 20.11 or 21.2.
// import { dirname } from "node:path";
// import { fileURLToPath } from "node:url";

import eslintJS from "@eslint/js";
import eslintPrettierConfig from "eslint-config-prettier";
import eslintTS from "typescript-eslint";
import { includeIgnoreFile } from "@eslint/compat";
import globals from "globals";
import path from "path";

// const __dirname = dirname(fileURLToPath(import.meta.url));

export default eslintTS.config(
    { files: ["**/*.{ts,js,cjs}"] },
    {
        files: ["**/*.js"],
        ...eslintTS.configs.disableTypeChecked,
        languageOptions: { sourceType: "commonjs" }
    },
    {
        ignores: ["**/*.mjs", "eslint.config.mjs", ".solcover.js"]
    },
    eslintJS.configs.recommended,
    ...eslintTS.configs.strictTypeChecked,
    ...eslintTS.configs.stylisticTypeChecked,
    {
        rules: {
            quotes: ["error", "double"],
            "eol-last": ["error"],
            "max-len": ["error", { code: 120, ignoreUrls: true }],
            "no-trailing-spaces": ["error"]
        }
    },
    {
        files: ["test/**/*.ts"],
        rules: {
            "no-restricted-properties": [
                "warn",
                {
                    object: "describe",
                    property: "only",
                    message: "Please, remember to remove `.only` before committing."
                },
                {
                    object: "context",
                    property: "only",
                    message: "Please, remember to remove `.only` before committing."
                },
                {
                    object: "it",
                    property: "only",
                    message: "Please, remember to remove `.only` before committing."
                }
            ]
        }
    },
    eslintPrettierConfig,
    {
        languageOptions: {
            ecmaVersion: 2020,
            globals: {
                ...globals.es2020,
                ...globals.mocha,
                ...globals.chai,
                ...globals.node,
                artifacts: "readonly",
                contract: "readonly",
                extendEnvironment: "readonly",
                expect: "readonly"
            },
            parserOptions: {
                projectService: true,
                // tsconfigRootDir: __dirname
                tsconfigRootDir: import.meta.dirname // NodeJS 20.11+ or 21.2+.
            }
        }
    },
    includeIgnoreFile(path.resolve(import.meta.dirname, ".gitignore"))
);
