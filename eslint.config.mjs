import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // allow `any` freely
      "@typescript-eslint/no-explicit-any": "off",
      // don’t require explicit return types everywhere
      "@typescript-eslint/explicit-module-boundary-types": "off",
      // just warn instead of error for unused vars
      "@typescript-eslint/no-unused-vars": ["warn"],
    },
  },
];

export default eslintConfig;

