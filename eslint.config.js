import js from '@eslint/js'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
import tseslint from 'typescript-eslint'

const common = [
  { group: ['../../*', '../../**'], message: 'Між модулями імпортуйте через @/…' },
  { group: ['@/features/*/*'], message: 'Імпортуйте фічу лише через її index.ts' },
  { group: ['mgrs', '@turf/*'], message: 'Гео-бібліотеки — лише в shared/geo' },
]
const restrict = (...extra) => ({
  'no-restricted-imports': ['error', { patterns: [...common, ...extra] }],
})

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2023,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
  { files: ['src/**/*.{ts,tsx}'], rules: restrict() },
  {
    files: ['src/features/fields/**'],
    rules: restrict({ group: ['@/features/points', '@/features/map'], message: 'fields не залежить від points/map' }),
  },
  {
    files: ['src/features/points/**'],
    rules: restrict({ group: ['@/features/fields', '@/features/map'], message: 'points не залежить від fields/map' }),
  },
  {
    files: ['src/shared/**'],
    rules: restrict({ group: ['@/features/*', '@/app/*', 'leaflet', 'react-leaflet'], message: 'shared не залежить від фіч і карти' }),
  },
  {
    files: ['src/shared/geo/**'],
    rules: { 'no-restricted-imports': 'off' },
  },
)
