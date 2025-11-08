import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  entry: [
    'app/**/*.{ts,tsx}',
    'src/**/*.{ts,tsx}',
    'scripts/**/*.{ts,js}',
    'middleware.ts',
    'next.config.ts',
    'vite.config.ts',
    'tailwind.config.ts',
    'postcss.config.js',
    'eslint.config.js',
  ],
  project: [
    'app/**/*.{ts,tsx}',
    'src/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    'lib/**/*.{ts,tsx}',
    'packages/**/*.{ts,tsx}',
    'scripts/**/*.{ts,js}',
    'ai/**/*.{ts,mjs}',
    'ops/**/*.{ts}',
    'watchers/**/*.{ts}',
    'guardian/**/*.{ts}',
    'hooks/**/*.{ts}',
    'middleware.ts',
  ],
  ignore: [
    '**/*.test.{ts,tsx}',
    '**/*.spec.{ts,tsx}',
    '**/__tests__/**',
    '**/__mocks__/**',
    '**/node_modules/**',
    '.next/**',
    'dist/**',
    'build/**',
    'coverage/**',
    '**/*.d.ts',
    'next-env.d.ts',
  ],
  ignoreDependencies: [
    // Build tools
    '@types/*',
    'eslint-*',
    'prettier-*',
    'typescript',
    'typescript-eslint',
    // Testing
    '@playwright/test',
    '@axe-core/*',
    'axe-playwright',
    'pa11y-ci',
    'vitest',
    '@testing-library/*',
    'jsdom',
    // CI/CD
    'lighthouse-ci',
    '@lhci/cli',
    'wait-on',
    'license-checker',
    // Dev tools
    'husky',
    'lint-staged',
    'tsx',
    'commander',
    // Build plugins
    'rollup-plugin-visualizer',
    'vite-plugin-pwa',
    '@vitejs/*',
    'terser',
    // Runtime (may be used dynamically)
    'stripe',
  ],
  ignoreBinaries: ['next', 'tsx', 'tsc', 'eslint', 'prettier'],
};

export default config;
