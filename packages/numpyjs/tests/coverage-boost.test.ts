/**
 * Coverage boost tests — targeting all uncovered functions in base-backend.ts
 *
 * Covers: Convenience aliases, comparison helpers, array construction,
 * random distributions, NaN-aware axis stats, FFT Bluestein, histogram bins,
 * and misc uncovered methods.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { Backend, RELAXED_TOL, approxEq, getData } from './test-utils';

export function coverageBoostTests(getBackend: () => Backend) {
  describe('coverage-boost', () => {
    let B: Backend;
    beforeAll(() => {
      B = getBackend();
    });

    const arr = (data: number[], shape?: number[]) => B.array(data, shape ?? [data.length]);
    const mat = (data: number[], rows: number, cols: number) => B.array(data, [rows, cols]);

    // ============================================================
    // 1. Convenience Aliases
    // ============================================================

    describe('convenience aliases', () => {
      it('product delegates to prod', async () => {
        const a = arr([2, 3, 4]);
        expect(B.product(a)).toBe(24);
      });

      it('sometrue delegates to any', () => {
        expect(B.sometrue(arr([0, 0, 1]))).toBe(true);
        expect(B.sometrue(arr([0, 0, 0]))).toBe(false);
      });

      it('alltrue delegates to all', () => {
        expect(B.alltrue(arr([1, 2, 3]))).toBe(true);
        expect(B.alltrue(arr([1, 0, 3]))).toBe(false);
      });

      it('cumproduct delegates to cumprod', async () => {
        const result = B.cumproduct(arr([1, 2, 3, 4]));
        expect(await getData(result, B)).toEqual([1, 2, 6, 24]);
      });

      it('ndim returns number of dimensions', () => {
        expect(B.ndim(arr([1, 2, 3]))).toBe(1);
        expect(B.ndim(mat([1, 2, 3, 4], 2, 2))).toBe(2);
      });

      it('shape returns shape array', () => {
        expect(B.shape(arr([1, 2, 3]))).toEqual([3]);
        expect(B.shape(mat([1, 2, 3, 4, 5, 6], 2, 3))).toEqual([2, 3]);
      });

      it('size returns total element count', () => {
        expect(B.size(arr([1, 2, 3]))).toBe(3);
        expect(B.size(mat([1, 2, 3, 4, 5, 6], 2, 3))).toBe(6);
      });

      it('msort sorts along first axis', async () => {
        const a = mat([3, 1, 2, 4], 2, 2);
        const result = B.msort(a);
        expect(await getData(result, B)).toEqual([2, 1, 3, 4]);
      });
    });

    // ============================================================
    // 2. result_type
    // ============================================================

    describe('result_type', () => {
      it('returns float64 for empty args', () => {
        expect(B.result_type()).toBe('float64');
      });

      it('promotes dtype strings', () => {
        expect(B.result_type('float32', 'float64')).toBe('float64');
      });

      it('promotes array dtypes', () => {
        const a = arr([1, 2]);
        expect(B.result_type(a, 'float64')).toBe('float64');
      });
    });

    // ============================================================
    // 3. Comparison Helpers
    // ============================================================

    describe('comparison helpers', () => {
      it('array_equiv with same shape', () => {
        expect(B.array_equiv(arr([1, 2, 3]), arr([1, 2, 3]))).toBe(true);
        expect(B.array_equiv(arr([1, 2, 3]), arr([1, 2, 4]))).toBe(false);
      });

      it('array_equiv with broadcastable shapes', () => {
        const a = B.array([5], [1]);
        const b = arr([5, 5, 5]);
        expect(B.array_equiv(a, b)).toBe(true);
      });

      it('array_equiv with incompatible shapes', () => {
        const a = arr([1, 2]);
        const b = arr([1, 2, 3]);
        expect(B.array_equiv(a, b)).toBe(false);
      });

      it('isneginf', async () => {
        const a = arr([-Infinity, 0, Infinity, -Infinity]);
        expect(await getData(B.isneginf(a), B)).toEqual([1, 0, 0, 1]);
      });

      it('isposinf', async () => {
        const a = arr([-Infinity, 0, Infinity, Infinity]);
        expect(await getData(B.isposinf(a), B)).toEqual([0, 0, 1, 1]);
      });

      it('isreal returns all 1s (all values real)', async () => {
        const a = arr([1, 2, 3]);
        expect(await getData(B.isreal(a), B)).toEqual([1, 1, 1]);
      });

      it('isscalar', () => {
        expect(B.isscalar(42)).toBe(true);
        expect(B.isscalar(arr([1]))).toBe(false);
        expect(B.isscalar('hello')).toBe(false);
      });
    });

    // ============================================================
    // 4. Vander
    // ============================================================

    describe('vander', () => {
      it('creates Vandermonde matrix (decreasing)', async () => {
        const x = arr([1, 2, 3]);
        const result = B.vander(x);
        // [1^2, 1^1, 1^0; 2^2, 2^1, 2^0; 3^2, 3^1, 3^0]
        expect(await getData(result, B)).toEqual([1, 1, 1, 4, 2, 1, 9, 3, 1]);
        expect(result.shape).toEqual([3, 3]);
      });

      it('creates Vandermonde matrix (increasing)', async () => {
        const x = arr([1, 2, 3]);
        const result = B.vander(x, 3, true);
        expect(await getData(result, B)).toEqual([1, 1, 1, 1, 2, 4, 1, 3, 9]);
      });

      it('custom number of columns', async () => {
        const x = arr([1, 2, 3]);
        const result = B.vander(x, 2);
        expect(result.shape).toEqual([3, 2]);
        expect(await getData(result, B)).toEqual([1, 1, 2, 1, 3, 1]);
      });
    });

    // ============================================================
    // 5. apply_along_axis
    // ============================================================

    describe('apply_along_axis', () => {
      it('applies scalar function along axis', async () => {
        const a = mat([1, 2, 3, 4, 5, 6], 2, 3);
        // Sum along axis 1 (each row)
        const result = B.apply_along_axis(slice => B.sum(slice) as number, 1, a);
        expect(await getData(result, B)).toEqual([6, 15]);
      });

      it('applies array function along axis', async () => {
        const a = mat([3, 1, 2, 6, 4, 5], 2, 3);
        // Sort each row
        const result = B.apply_along_axis(slice => B.sort(slice), 1, a);
        expect(await getData(result, B)).toEqual([1, 2, 3, 4, 5, 6]);
      });

      it('applies along axis 0', async () => {
        const a = mat([1, 2, 3, 4], 2, 2);
        // Sum along axis 0 (each column)
        const result = B.apply_along_axis(slice => B.sum(slice) as number, 0, a);
        expect(await getData(result, B)).toEqual([4, 6]);
      });
    });

    // ============================================================
    // 6. choose
    // ============================================================

    describe('choose', () => {
      it('raise mode (default)', async () => {
        const indices = arr([0, 1, 2, 1]);
        const choices = [arr([10, 20, 30, 40]), arr([50, 60, 70, 80]), arr([90, 100, 110, 120])];
        const result = B.choose(indices, choices);
        expect(await getData(result, B)).toEqual([10, 60, 110, 80]);
      });

      it('wrap mode', async () => {
        const indices = arr([0, 3, 1]);
        const choices = [arr([10, 20, 30]), arr([40, 50, 60])];
        const result = B.choose(indices, choices, 'wrap');
        expect(await getData(result, B)).toEqual([10, 50, 60]);
      });

      it('clip mode', async () => {
        const indices = arr([0, 5, -1]);
        const choices = [arr([10, 20, 30]), arr([40, 50, 60])];
        const result = B.choose(indices, choices, 'clip');
        // idx 0 -> choices[0][0]=10, idx 5 clipped to 1 -> choices[1][1]=50, idx -1 clipped to 0 -> choices[0][2]=30
        expect(await getData(result, B)).toEqual([10, 50, 30]);
      });

      it('raise mode throws on out of bounds', () => {
        const indices = arr([0, 5]);
        const choices = [arr([10, 20])];
        expect(() => B.choose(indices, choices, 'raise')).toThrow();
      });
    });

    // ============================================================
    // 7. piecewise
    // ============================================================

    describe('piecewise', () => {
      it('basic piecewise', async () => {
        const x = arr([-2, -1, 0, 1, 2]);
        const negCond = B.less(x, arr([0, 0, 0, 0, 0]));
        const posCond = B.greater(x, arr([0, 0, 0, 0, 0]));
        const result = B.piecewise(x, [negCond, posCond], [v => -v, v => v * 2], 0);
        expect(await getData(result, B)).toEqual([2, 1, 0, 2, 4]);
      });

      it('piecewise with default function', async () => {
        const x = arr([1, 2, 3]);
        const cond = B.greater(x, arr([2, 2, 2]));
        const result = B.piecewise(x, [cond], [v => v * 10, v => v]);
        expect(await getData(result, B)).toEqual([1, 2, 30]);
      });
    });

    // ============================================================
    // 8. vectorize
    // ============================================================

    describe('vectorize', () => {
      it('vectorizes a unary function', async () => {
        const vSquare = B.vectorize((x: number) => x * x);
        const result = vSquare(arr([1, 2, 3, 4]));
        expect(await getData(result, B)).toEqual([1, 4, 9, 16]);
      });

      it('vectorizes a binary function with broadcasting', async () => {
        const vAdd = B.vectorize((a: number, b: number) => a + b);
        const a = B.array([1, 2, 3], [3]);
        const b = B.array([10], [1]);
        const result = vAdd(a, b);
        expect(await getData(result, B)).toEqual([11, 12, 13]);
      });

      it('throws with no arguments', () => {
        const vFn = B.vectorize(() => 1);
        expect(() => vFn()).toThrow();
      });
    });

    // ============================================================
    // 9. nextafter
    // ============================================================

    describe('nextafter', () => {
      it('next float towards positive', async () => {
        const x = arr([1.0]);
        const y = arr([2.0]);
        const result = await getData(B.nextafter(x, y), B);
        expect(result[0]).toBeGreaterThan(1.0);
        expect(result[0]).toBeLessThan(1.0 + 1e-14);
      });

      it('next float towards negative', async () => {
        const x = arr([1.0]);
        const y = arr([0.0]);
        const result = await getData(B.nextafter(x, y), B);
        expect(result[0]).toBeLessThan(1.0);
        expect(result[0]).toBeGreaterThan(1.0 - 1e-14);
      });

      it('same value returns same', async () => {
        const x = arr([5.0]);
        const y = arr([5.0]);
        const result = await getData(B.nextafter(x, y), B);
        expect(result[0]).toBe(5.0);
      });

      it('NaN propagation', async () => {
        const x = arr([NaN, 1.0]);
        const y = arr([1.0, NaN]);
        const result = await getData(B.nextafter(x, y), B);
        expect(result[0]).toBeNaN();
        expect(result[1]).toBeNaN();
      });

      it('from zero towards positive and negative', async () => {
        const result1 = await getData(B.nextafter(arr([0.0]), arr([1.0])), B);
        const result2 = await getData(B.nextafter(arr([0.0]), arr([-1.0])), B);
        expect(result1[0]).toBeGreaterThan(0);
        expect(result2[0]).toBeLessThan(0);
      });

      it('negative towards more negative', async () => {
        const x = arr([-1.0]);
        const y = arr([-2.0]);
        const result = await getData(B.nextafter(x, y), B);
        expect(result[0]).toBeLessThan(-1.0);
      });

      it('negative towards zero', async () => {
        const x = arr([-1.0]);
        const y = arr([0.0]);
        const result = await getData(B.nextafter(x, y), B);
        expect(result[0]).toBeGreaterThan(-1.0);
      });
    });

    // ============================================================
    // 10. array2string
    // ============================================================

    describe('array2string', () => {
      it('1D array', () => {
        const a = arr([1, 2, 3]);
        expect(B.array2string(a)).toBe('[1, 2, 3]');
      });

      it('2D array', () => {
        const a = mat([1, 2, 3, 4], 2, 2);
        expect(B.array2string(a)).toBe('[[1, 2], [3, 4]]');
      });

      it('custom separator', () => {
        const a = arr([1, 2, 3]);
        expect(B.array2string(a, { separator: ' | ' })).toBe('[1 | 2 | 3]');
      });

      it('custom precision', () => {
        const a = arr([1.23456, 2.78901]);
        expect(B.array2string(a, { precision: 2 })).toBe('[1.23, 2.79]');
      });

      it('scalar (0D)', () => {
        const a = B.array([42], []);
        expect(B.array2string(a)).toBe('42');
      });

      it('3D array', () => {
        const a = B.array([1, 2, 3, 4, 5, 6, 7, 8], [2, 2, 2]);
        expect(B.array2string(a)).toBe('[[[1, 2], [3, 4]], [[5, 6], [7, 8]]]');
      });
    });

    // ============================================================
    // 11. Random Distributions
    // ============================================================

    describe('random distributions', () => {
      const N = 5000;

      it('standardNormal has mean~0 std~1', async () => {
        B.seed(42);
        const a = B.standardNormal([N]);
        const data = await getData(a, B);
        const mean = data.reduce((s, v) => s + v, 0) / N;
        expect(Math.abs(mean)).toBeLessThan(0.1);
      });

      it('standardCauchy produces values', async () => {
        B.seed(42);
        const a = B.standardCauchy([100]);
        expect(a.shape).toEqual([100]);
        const data = await getData(a, B);
        // Cauchy has heavy tails, just check we get finite-ish values
        expect(data.some(v => Math.abs(v) > 0)).toBe(true);
      });

      it('multinomial sums to n', async () => {
        B.seed(42);
        const result = B.multinomial(10, [0.2, 0.3, 0.5]);
        const data = await getData(result, B);
        expect(data.reduce((a, b) => a + b, 0)).toBe(10);
        expect(result.shape).toEqual([3]);
      });

      it('multinomial with size', async () => {
        B.seed(42);
        const result = B.multinomial(10, [0.5, 0.5], 3);
        expect(result.shape).toEqual([3, 2]);
      });

      it('dirichlet sums to 1', async () => {
        B.seed(42);
        const result = B.dirichlet([1, 1, 1]);
        const data = await getData(result, B);
        expect(data.length).toBe(3);
        expect(Math.abs(data.reduce((a, b) => a + b, 0) - 1)).toBeLessThan(1e-10);
      });

      it('dirichlet with size', async () => {
        B.seed(42);
        const result = B.dirichlet([2, 3], 5);
        expect(result.shape).toEqual([5, 2]);
      });

      it('random is alias for rand', async () => {
        B.seed(42);
        const a = B.random([10]);
        const data = await getData(a, B);
        expect(data.every(v => v >= 0 && v < 1)).toBe(true);
      });

      it('f-distribution is positive', async () => {
        B.seed(42);
        const a = B.f(5, 10, [N]);
        const data = await getData(a, B);
        expect(data.every(v => v > 0)).toBe(true);
        // Mean of F(d1,d2) = d2/(d2-2) for d2>2
        const mean = data.reduce((s, v) => s + v, 0) / N;
        const expected = 10 / (10 - 2); // 1.25
        expect(Math.abs(mean - expected)).toBeLessThan(0.2);
      });

      it('hypergeometric is in valid range', async () => {
        B.seed(42);
        const a = B.hypergeometric(10, 5, 3, [1000]);
        const data = await getData(a, B);
        expect(data.every(v => v >= 0 && v <= 3)).toBe(true);
        // Mean = nsample * ngood / (ngood + nbad) = 3*10/15 = 2
        const mean = data.reduce((s, v) => s + v, 0) / 1000;
        expect(Math.abs(mean - 2)).toBeLessThan(0.2);
      });

      it('negativeBinomial produces non-negative integers', async () => {
        B.seed(42);
        const a = B.negativeBinomial(5, 0.5, [1000]);
        const data = await getData(a, B);
        expect(data.every(v => v >= 0 && v === Math.floor(v))).toBe(true);
      });

      it('pareto is positive', async () => {
        B.seed(42);
        const a = B.pareto(3, [1000]);
        const data = await getData(a, B);
        expect(data.every(v => v >= 0)).toBe(true);
      });

      it('rayleigh is positive', async () => {
        B.seed(42);
        const a = B.rayleigh(1.0, [1000]);
        const data = await getData(a, B);
        expect(data.every(v => v > 0)).toBe(true);
        // Mean of Rayleigh(1) = sqrt(pi/2) ≈ 1.253
        const mean = data.reduce((s, v) => s + v, 0) / 1000;
        expect(Math.abs(mean - Math.sqrt(Math.PI / 2))).toBeLessThan(0.15);
      });

      it('triangular is in [left, right]', async () => {
        B.seed(42);
        const a = B.triangular(0, 5, 10, [1000]);
        const data = await getData(a, B);
        expect(data.every(v => v >= 0 && v <= 10)).toBe(true);
        // Mean = (left+mode+right)/3 = 5
        const mean = data.reduce((s, v) => s + v, 0) / 1000;
        expect(Math.abs(mean - 5)).toBeLessThan(0.5);
      });

      it('vonmises produces values near mu', async () => {
        B.seed(42);
        const a = B.vonmises(0, 10, [1000]); // high kappa = concentrated
        const data = await getData(a, B);
        // Should be concentrated around 0 with high kappa
        const mean = data.reduce((s, v) => s + v, 0) / 1000;
        expect(Math.abs(mean)).toBeLessThan(0.5);
      });

      it('wald produces positive values', async () => {
        B.seed(42);
        const a = B.wald(1, 1, [1000]);
        const data = await getData(a, B);
        expect(data.every(v => v > 0)).toBe(true);
      });

      it('zipf produces positive integers', async () => {
        B.seed(42);
        const a = B.zipf(2, [1000]);
        const data = await getData(a, B);
        expect(data.every(v => v >= 1 && v === Math.floor(v))).toBe(true);
      });
    });

    // ============================================================
    // 12. NaN-aware stats with axis parameter
    // ============================================================

    describe('nan-aware axis stats', () => {
      it('nanvar with axis', async () => {
        const a = mat([1, NaN, 3, 4, 5, 6], 2, 3);
        const result = B.nanvar(a, 1) as any;
        const data = await getData(result, B);
        // Row 0: [1, 3] -> var = 1, Row 1: [4, 5, 6] -> var = 2/3
        expect(approxEq(data[0], 1, RELAXED_TOL)).toBe(true);
        expect(approxEq(data[1], 2 / 3, RELAXED_TOL)).toBe(true);
      });

      it('nanvar with axis and keepdims', async () => {
        const a = mat([1, NaN, 3, 4, 5, 6], 2, 3);
        const result = B.nanvar(a, 1, 0, true) as any;
        expect(result.shape).toEqual([2, 1]);
      });

      it('nanstd with axis', async () => {
        const a = mat([1, NaN, 3, 4, 5, 6], 2, 3);
        const result = B.nanstd(a, 1) as any;
        const data = await getData(result, B);
        expect(approxEq(data[0], 1, RELAXED_TOL)).toBe(true);
        expect(approxEq(data[1], Math.sqrt(2 / 3), RELAXED_TOL)).toBe(true);
      });

      it('nanstd with axis and keepdims', async () => {
        const a = mat([1, NaN, 3, 4, 5, 6], 2, 3);
        const result = B.nanstd(a, 1, 0, true) as any;
        expect(result.shape).toEqual([2, 1]);
      });

      it('nanmin with axis', async () => {
        const a = mat([NaN, 2, 3, 4, NaN, 6], 2, 3);
        const result = B.nanmin(a, 1) as any;
        const data = await getData(result, B);
        expect(data[0]).toBe(2);
        expect(data[1]).toBe(4);
      });

      it('nanmin with axis and keepdims', async () => {
        const a = mat([NaN, 2, 3, 4, NaN, 6], 2, 3);
        const result = B.nanmin(a, 1, true) as any;
        expect(result.shape).toEqual([2, 1]);
      });

      it('nanmax with axis', async () => {
        const a = mat([NaN, 2, 3, 4, NaN, 6], 2, 3);
        const result = B.nanmax(a, 1) as any;
        const data = await getData(result, B);
        expect(data[0]).toBe(3);
        expect(data[1]).toBe(6);
      });

      it('nanmax with axis and keepdims', async () => {
        const a = mat([NaN, 2, 3, 4, NaN, 6], 2, 3);
        const result = B.nanmax(a, 1, true) as any;
        expect(result.shape).toEqual([2, 1]);
      });

      it('nanargmin with axis', async () => {
        const a = mat([NaN, 5, 2, 4, NaN, 1], 2, 3);
        const result = B.nanargmin(a, 1) as any;
        const data = await getData(result, B);
        expect(data[0]).toBe(2); // min of [NaN, 5, 2] -> idx 2
        expect(data[1]).toBe(2); // min of [4, NaN, 1] -> idx 2
      });

      it('nanargmax with axis', async () => {
        const a = mat([NaN, 5, 2, 4, NaN, 1], 2, 3);
        const result = B.nanargmax(a, 1) as any;
        const data = await getData(result, B);
        expect(data[0]).toBe(1); // max of [NaN, 5, 2] -> idx 1
        expect(data[1]).toBe(0); // max of [4, NaN, 1] -> idx 0
      });
    });

    // ============================================================
    // 13. NaN-aware quantile/median/percentile with axis
    // ============================================================

    describe('nan-aware quantile/median/percentile with axis', () => {
      it('nanmedian with axis', async () => {
        const a = mat([NaN, 2, 3, 4, NaN, 6], 2, 3);
        const result = B.nanmedian(a, 1) as any;
        const data = await getData(result, B);
        expect(data[0]).toBe(2.5); // median of [2, 3]
        expect(data[1]).toBe(5); // median of [4, 6]
      });

      it('nanmedian with keepdims', async () => {
        const a = mat([NaN, 2, 3, 4, NaN, 6], 2, 3);
        const result = B.nanmedian(a, 1, true) as any;
        expect(result.shape).toEqual([2, 1]);
      });

      it('nanpercentile with axis', async () => {
        const a = mat([NaN, 2, 4, 1, NaN, 3], 2, 3);
        const result = B.nanpercentile(a, 50, 1) as any;
        const data = await getData(result, B);
        expect(data[0]).toBe(3); // median of [2, 4]
        expect(data[1]).toBe(2); // median of [1, 3]
      });

      it('nanpercentile with keepdims', async () => {
        const a = mat([NaN, 2, 4, 1, NaN, 3], 2, 3);
        const result = B.nanpercentile(a, 50, 1, true) as any;
        expect(result.shape).toEqual([2, 1]);
      });

      it('quantile with axis', async () => {
        const a = mat([1, 2, 3, 4, 5, 6], 2, 3);
        const result = B.quantile(a, 0.5, 1) as any;
        const data = await getData(result, B);
        expect(data[0]).toBe(2); // median of [1,2,3]
        expect(data[1]).toBe(5); // median of [4,5,6]
      });

      it('quantile with keepdims', async () => {
        const a = mat([1, 2, 3, 4, 5, 6], 2, 3);
        const result = B.quantile(a, 0.5, 1, true) as any;
        expect(result.shape).toEqual([2, 1]);
      });
    });

    // ============================================================
    // 14. FFT on non-power-of-2 (Bluestein)
    // ============================================================

    describe('fft bluestein', () => {
      it('fft on length-5 array', async () => {
        // DFT of [1, 0, 0, 0, 0] should be all 1s
        const real = arr([1, 0, 0, 0, 0]);
        const imag = arr([0, 0, 0, 0, 0]);
        const result = B.fft(real, imag);
        const realData = await getData(result.real, B);
        const imagData = await getData(result.imag, B);
        for (let i = 0; i < 5; i++) {
          expect(approxEq(realData[i], 1, 1e-10)).toBe(true);
          expect(approxEq(imagData[i], 0, 1e-10)).toBe(true);
        }
      });

      it('fft on length-7 array', async () => {
        // DFT of all-ones should be [7, 0, 0, 0, 0, 0, 0]
        const real = arr([1, 1, 1, 1, 1, 1, 1]);
        const imag = arr([0, 0, 0, 0, 0, 0, 0]);
        const result = B.fft(real, imag);
        const realData = await getData(result.real, B);
        const imagData = await getData(result.imag, B);
        expect(approxEq(realData[0], 7, 1e-10)).toBe(true);
        for (let i = 1; i < 7; i++) {
          expect(approxEq(realData[i], 0, 1e-10)).toBe(true);
          expect(approxEq(imagData[i], 0, 1e-10)).toBe(true);
        }
      });

      it('ifft roundtrip on non-power-of-2', async () => {
        B.seed(42);
        const orig = arr([1, 2, 3, 4, 5]);
        const zeros = arr([0, 0, 0, 0, 0]);
        const fwd = B.fft(orig, zeros);
        const inv = B.ifft(fwd.real, fwd.imag);
        const realData = await getData(inv.real, B);
        const origData = await getData(orig, B);
        for (let i = 0; i < 5; i++) {
          expect(approxEq(realData[i], origData[i], 1e-10)).toBe(true);
        }
      });
    });

    // ============================================================
    // 15. Histogram bin strategies
    // ============================================================

    describe('histogram', () => {
      it('histogram with auto bins', async () => {
        B.seed(42);
        const a = B.randn([100]);
        const result = B.histogram(a, 'auto');
        expect(result.binEdges.shape[0]).toBeGreaterThan(0);
        expect(result.hist.shape[0]).toBe(result.binEdges.shape[0] - 1);
      });

      it('histogram with sqrt bins', async () => {
        B.seed(42);
        const a = B.randn([100]);
        const result = B.histogram(a, 'sqrt');
        expect(result.hist.shape[0]).toBe(result.binEdges.shape[0] - 1);
      });

      it('histogram with sturges bins', async () => {
        B.seed(42);
        const a = B.randn([100]);
        const result = B.histogram(a, 'sturges');
        expect(result.hist.shape[0]).toBe(result.binEdges.shape[0] - 1);
      });

      it('histogram with scott bins', async () => {
        B.seed(42);
        const a = B.randn([100]);
        const result = B.histogram(a, 'scott');
        expect(result.hist.shape[0]).toBe(result.binEdges.shape[0] - 1);
      });

      it('histogram with fd bins', async () => {
        B.seed(42);
        const a = B.randn([100]);
        const result = B.histogram(a, 'fd');
        expect(result.hist.shape[0]).toBe(result.binEdges.shape[0] - 1);
      });

      it('histogram with rice bins', async () => {
        B.seed(42);
        const a = B.randn([100]);
        const result = B.histogram(a, 'rice');
        expect(result.hist.shape[0]).toBe(result.binEdges.shape[0] - 1);
      });
    });

    // ============================================================
    // 16. NDArray properties (.T, .item())
    // ============================================================

    describe('ndarray properties', () => {
      it('.T transposes 2D', async () => {
        const a = mat([1, 2, 3, 4, 5, 6], 2, 3);
        const t = a.T;
        expect(t.shape).toEqual([3, 2]);
        expect(await getData(t, B)).toEqual([1, 4, 2, 5, 3, 6]);
      });

      it('.T on 1D is no-op', async () => {
        const a = arr([1, 2, 3]);
        const t = a.T;
        expect(t.shape).toEqual([3]);
        expect(await getData(t, B)).toEqual([1, 2, 3]);
      });

      it('.item() extracts scalar', () => {
        const a = arr([42]);
        expect(a.item()).toBe(42);
      });

      it('.ndim returns dimensionality', () => {
        expect(arr([1, 2]).ndim).toBe(1);
        expect(mat([1, 2, 3, 4], 2, 2).ndim).toBe(2);
      });

      it('.size returns total elements', () => {
        expect(arr([1, 2, 3]).size).toBe(3);
        expect(mat([1, 2, 3, 4, 5, 6], 2, 3).size).toBe(6);
      });
    });

    // ============================================================
    // 17. Misc uncovered methods
    // ============================================================

    describe('misc uncovered', () => {
      it('resize cycles data', async () => {
        const a = arr([1, 2, 3]);
        const result = B.resize(a, [5]);
        expect(await getData(result, B)).toEqual([1, 2, 3, 1, 2]);
      });

      it('resize to 2D', async () => {
        const a = arr([1, 2, 3]);
        const result = B.resize(a, [2, 3]);
        expect(result.shape).toEqual([2, 3]);
        expect(await getData(result, B)).toEqual([1, 2, 3, 1, 2, 3]);
      });

      it('concatenate with axis=null flattens', async () => {
        const a = mat([1, 2, 3, 4], 2, 2);
        const b = mat([5, 6, 7, 8], 2, 2);
        const result = B.concatenate([a, b], null);
        expect(result.shape).toEqual([8]);
        expect(await getData(result, B)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
      });

      it('put replaces values in-place', async () => {
        const a = arr([10, 20, 30, 40, 50]);
        B.put(a, [1, 3], [99, 88]);
        expect(await getData(a, B)).toEqual([10, 99, 30, 88, 50]);
      });

      it('ix_ creates open mesh', async () => {
        const [r, c] = B.ix_(arr([0, 2]), arr([1, 3]));
        expect(r.shape).toEqual([2, 1]);
        expect(c.shape).toEqual([1, 2]);
        expect(await getData(r, B)).toEqual([0, 2]);
        expect(await getData(c, B)).toEqual([1, 3]);
      });

      it('fillDiagonal fills diagonal of 2D array', async () => {
        const a = mat([0, 0, 0, 0, 0, 0, 0, 0, 0], 3, 3);
        const result = B.fillDiagonal(a, 7);
        expect(await getData(result, B)).toEqual([7, 0, 0, 0, 7, 0, 0, 0, 7]);
      });

      it('rowStack is alias for vstack', async () => {
        const a = arr([1, 2, 3]);
        const b = arr([4, 5, 6]);
        const result = B.rowStack([a, b]);
        expect(result.shape).toEqual([2, 3]);
        expect(await getData(result, B)).toEqual([1, 2, 3, 4, 5, 6]);
      });

      it('unique with returnIndex', async () => {
        const a = arr([3, 1, 2, 1, 3]);
        const result = B.unique(a, true);
        expect(result.indices).toBeTruthy();
        const uniqueData = await getData(result.values, B);
        expect(uniqueData).toEqual([1, 2, 3]);
      });

      it('countNonzero with axis', async () => {
        const a = mat([0, 1, 2, 0, 3, 0], 2, 3);
        const result = B.countNonzero(a, 1) as any;
        const data = await getData(result, B);
        expect(data).toEqual([2, 1]);
      });

      it('roll with array shift', async () => {
        const a = mat([1, 2, 3, 4, 5, 6], 2, 3);
        const result = B.roll(a, [1, 1], [0, 1]);
        expect(result.shape).toEqual([2, 3]);
      });
    });
  });
}
