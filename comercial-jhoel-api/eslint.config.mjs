// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      "prettier/prettier": ["error", { endOfLine: "auto" }],
    },
  },
  {
    // `expect(mock.method).toHaveBeenCalledWith(...)` — jest's own standard
    // assertion shape — reads a method reference without calling it, which
    // `@typescript-eslint/unbound-method` flags as a possible `this`-binding
    // bug. That's a real risk for a plain object method, but never for a
    // jest mock function (there's no `this` to lose): `eslint-plugin-jest`'s
    // own `unbound-method` rule exists specifically to re-enable this check
    // only where it's real and turn it off for jest matchers, but this repo
    // doesn't have that plugin installed — this override achieves the same
    // outcome without adding a dependency for it.
    files: ['**/*.spec.ts'],
    rules: {
      '@typescript-eslint/unbound-method': 'off',
    },
  },
);
