/**
 * Test utilities for numpyjs
 *
 * Re-exports types from src/types.ts (canonical source of truth)
 * and provides test-specific helpers.
 */

// Re-export canonical types from src/
export type { NDArray, Backend } from '../src/types.js';
import type { NDArray, Backend } from '../src/types.js';

/** Check if two f64 values are approximately equal */
export function approxEq(a: number, b: number, tol: number): boolean {
  if (Number.isNaN(a) && Number.isNaN(b)) return true;
  if (!Number.isFinite(a) && !Number.isFinite(b)) {
    return Math.sign(a) === Math.sign(b);
  }
  return Math.abs(a - b) < tol;
}

/** Check if two arrays are approximately equal */
export function arraysApproxEq(
  a: Float64Array | number[],
  b: Float64Array | number[],
  tol: number
): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (!approxEq(a[i], b[i], tol)) return false;
  }
  return true;
}

/** Default tolerance for floating point comparisons (f64) */
export const DEFAULT_TOL = 1e-10;

/** Relaxed tolerance for operations with accumulated error */
export const RELAXED_TOL = 1e-6;

/** WebGPU tolerance - f32 has ~6-7 decimal digits of precision */
export const WEBGPU_TOL = 1e-5;

/** SVD tolerance - power iteration SVD has limited precision */
export const SVD_TOL = 1e-4;

/** Get tolerance appropriate for backend precision */
export function getTol(backend: Backend, relaxed: boolean = false): number {
  if (backend.name === 'webgpu') {
    // WebGPU uses f32 which has ~6-7 decimal digits precision
    return relaxed ? 1e-4 : WEBGPU_TOL;
  }
  return relaxed ? RELAXED_TOL : DEFAULT_TOL;
}

/**
 * Get array data, materializing GPU tensors if needed.
 * For non-GPU backends, returns data immediately.
 */
export async function getData(arr: NDArray, backend: Backend): Promise<number[]> {
  if (backend.materializeAll) {
    await backend.materializeAll();
  }
  return arr.toArray();
}

/**
 * Same as getData but for multiple arrays at once (more efficient for GPU)
 */
export async function getDataMany(arrays: NDArray[], backend: Backend): Promise<number[][]> {
  if (backend.materializeAll) {
    await backend.materializeAll();
  }
  return arrays.map(arr => arr.toArray());
}
