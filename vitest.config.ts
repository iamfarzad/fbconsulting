import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'jsdom',
    setupFiles: ['src/features/gemini/test/setup.ts'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['**/node_modules/**', '**/test/**']
    },
    globals: true
  }
});
