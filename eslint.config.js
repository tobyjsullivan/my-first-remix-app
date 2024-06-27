import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginReactRecommendedConfig from 'eslint-plugin-react/configs/recommended.js'
import pluginReactJsxRuntimeConfig from 'eslint-plugin-react/configs/jsx-runtime.js'
import pluginReactHooks from 'eslint-plugin-react-hooks'
import { fixupConfigRules } from '@eslint/compat'

export default [
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  { languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } } },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  { ignores: ['node_modules/**', 'build/**'] },
  {
    settings: {
      react: {
        version: 'detect',
      },
    },
    plugins: {
      'react-hooks': pluginReactHooks,
    },
    rules: { ...pluginReactHooks.configs.recommended.rules },
  },
  ...fixupConfigRules(pluginReactRecommendedConfig),
  ...fixupConfigRules(pluginReactJsxRuntimeConfig),
]
