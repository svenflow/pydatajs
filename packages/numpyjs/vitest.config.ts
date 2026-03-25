import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      reporter: ['text', 'json', 'html'],
    },
    projects: [
      {
        test: {
          name: 'js-node',
          include: ['tests/index.test.ts'],
        },
      },
      {
        test: {
          name: 'webgpu-browser',
          include: ['tests/webgpu.test.ts'],
          browser: {
            enabled: true,
            provider: playwright({
              launchOptions: {
                args: ['--enable-unsafe-webgpu', '--enable-gpu'],
              },
            }),
            instances: [{ browser: 'chromium' }],
            headless: true,
          },
        },
      },
    ],
  },
});
