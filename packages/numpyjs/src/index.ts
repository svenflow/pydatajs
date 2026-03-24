/**
 * numpyjs - NumPy-compatible array library for JavaScript
 *
 * Pure JS (CPU) and WebGPU (GPU-accelerated) backends.
 */

// Re-export types
export type { NDArray, Backend } from './types.js';

// Import Backend type for the createBackend return type
import type { Backend } from './types.js';

/**
 * Create a backend instance.
 *
 * @param type - 'js' for pure-JS CPU backend, 'webgpu' for GPU-accelerated backend
 * @returns A Backend instance ready to use
 */
export async function createBackend(type: 'js' | 'webgpu' = 'js'): Promise<Backend> {
  if (type === 'js') {
    const { createJsBackend } = await import('../tests/js-backend.js');
    return createJsBackend();
  }
  if (type === 'webgpu') {
    const { initWebGPUBackend, createWebGPUBackend } = await import('../tests/webgpu-backend.js');
    await initWebGPUBackend();
    return createWebGPUBackend();
  }
  throw new Error(`Unknown backend type: ${type}. Use 'js' or 'webgpu'.`);
}

// Version
export const version = '1.0.0';
