import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  update coomment eslint
  globalIgnores([
    
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);3
export default eslintConfig;
