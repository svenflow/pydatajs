/**
 * Pure JavaScript reference backend for testing
 *
 * This implements all Backend operations in pure JS, serving as:
 * 1. A reference implementation for testing
 * 2. A fallback when WebGPU is not available
 * 3. A baseline for performance comparisons
 *
 * Extends BaseBackend which provides all the operation implementations.
 * This file only needs to provide createArray() using the shared BaseNDArray.
 */

import { Backend, NDArray, DType, AnyTypedArray } from './types.js';
import { BaseBackend, BaseNDArray } from './base-backend.js';

export class JsBackend extends BaseBackend {
  override name = 'js';

  override createArray(
    data: number[] | Float64Array | AnyTypedArray,
    shape: number[],
    dtype: DType = 'float64'
  ): NDArray {
    if (data instanceof Float64Array) {
      return new BaseNDArray(data, shape, dtype);
    }
    if (ArrayBuffer.isView(data)) {
      // It's some other typed array (Float32Array, Int32Array, etc.)
      return new BaseNDArray(data as AnyTypedArray, shape, dtype);
    }
    // It's a number[]
    return new BaseNDArray(data, shape, dtype);
  }
}

export function createJsBackend(): Backend {
  return new JsBackend();
}
