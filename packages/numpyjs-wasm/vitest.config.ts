import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      include: ['src/index.ts'],
      reporter: ['text', 'json-summary'],
      all: true,
      reportOnFailure: true,
    },
  },
});
