import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import topLevelAwait from 'vite-plugin-top-level-await';

export default defineConfig({
  plugins: [topLevelAwait()],
  server: {
    headers: {
      // Required for SharedArrayBuffer (needed for WebGPU multi-threaded access)
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
  test: {
    globals: true,
    include: ['index.test.ts', 'benchmark.test.ts'],
    fileParallelism: false, // Sequential test files to avoid WebGPU conflicts
    testTimeout: 120000, // 2 minute timeout for slow GPU tests
    // Use playwright browser for WebGPU tests
    browser: {
      enabled: true,
      provider: playwright({
        launch: {
          headless: true,
          args: [
            // Enable WebGPU in headless mode
            '--enable-features=Vulkan,UseSkiaRenderer',
            '--enable-unsafe-webgpu',
            '--enable-features=SharedArrayBuffer',
          ],
        },
      }),
      instances: [{ browser: 'chromium' }],
    },
  },
});
