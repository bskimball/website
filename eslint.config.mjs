import eslintPluginAstro from 'eslint-plugin-astro'
import tseslint from 'typescript-eslint'
import eslintConfigPrettier from 'eslint-config-prettier'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import globals from 'globals'

export default [
  {
    ignores: [
      'dist/',
      '.astro/',
      'node_modules/',
      '.github/',
      '.vercel/',
      '*.config.mjs',
      '**/*.d.ts',
    ],
  },

  // JavaScript/TypeScript defaults
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  ...tseslint.configs.recommended,

  // React
  {
    files: ['**/*.{jsx,tsx}'],
    ...reactPlugin.configs.flat.recommended,
    ...reactPlugin.configs.flat['jsx-runtime'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    rules: {
      ...reactHooksPlugin.configs.recommended.rules,
      'react/prop-types': 'off', // Not needed with TypeScript
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  // Astro
  ...eslintPluginAstro.configs.recommended,

  // Prettier must be last to override conflicting rules
  eslintConfigPrettier,
]
