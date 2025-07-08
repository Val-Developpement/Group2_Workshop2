import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.config({
    extends: ['next'],
    settings: {
      next: {
        rootDir: 'src',
      },
    },
    rules: {
      'react-hooks/exhaustive-deps': 'off',
      '@next/next/no-async-client-component': 'error',
      'react/no-unescaped-entities': 0,
    },
    // ignorePatterns: ['**/ui/**'],
  }),
];

export default eslintConfig;
