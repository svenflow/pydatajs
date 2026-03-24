# numpyjs (TypeScript NumPy)

High-performance NumPy-like library for TypeScript, with pure JS and WebGPU backends.

## Philosophy: 1:1 NumPy Parity

**This package mirrors numpy's API exactly.** If it exists in numpy, it should exist here. If it doesn't exist in numpy, it doesn't belong here.

### What BELONGS in numpyjs:

- Array creation: zeros, ones, arange, linspace, eye, etc.
- Math operations: sin, cos, exp, log, sqrt, etc.
- Linear algebra: matmul, dot, transpose, inv, etc.
- Reductions: sum, mean, std, min, max, argmax, etc.
- Manipulation: reshape, flatten, concatenate, stack, etc.
- Random: random, randn, randint, shuffle, etc.

### What does NOT belong in numpyjs:

- Neural network layers (Conv2d, Dense, etc.) - not in numpy
- Activation functions (relu, sigmoid, softmax) - not in numpy
- Pooling operations (maxpool, avgpool) - not in numpy
- Batch normalization - not in numpy

These ML-specific operations belong in **scikitlearnjs** under `sklearn.neural_network`.

## Backends

### JS Backend: Pure TypeScript/JavaScript (CPU)

- Reference implementation, works everywhere (Node.js, Bun, browsers)
- Located in `tests/js-backend.ts` (~4K lines)
- All math implemented in plain JS using typed arrays

### WebGPU Backend: 100% GPU Shaders

**ZERO CPU fallbacks for math operations.**

- ALL math operations MUST have WGSL compute shaders
- `tests/webgpu-backend.ts` contains shader orchestration code (~13K lines)
- Sync methods can block on GPU readback, but computation is ALWAYS on GPU
- If a shader doesn't exist, WRITE ONE - never fall back to CPU

```typescript
// WRONG - CPU fallback
sin(arr: IFaceNDArray): IFaceNDArray {
  const result = new Float64Array(arr.data.length);
  for (let i = 0; i < arr.data.length; i++) {
    result[i] = Math.sin(arr.data[i]);
  }
  return this.array(Array.from(result), arr.shape);
}

// CORRECT - GPU shader
sin(arr: IFaceNDArray): IFaceNDArray {
  return this.runElementwiseShader('sin', arr);
}
```

### Adding New Operations

1. Add method signature to `Backend` interface in `types.ts`
2. TypeScript compiler errors show what's missing in each backend
3. **JS**: Implement in `tests/js-backend.ts`
4. **WebGPU**: Add WGSL shader to `tests/webgpu-backend.ts`
5. Add test to appropriate test file (runs against ALL backends)
6. **NEVER** implement math in a separate wrapper layer

## Test Parameterization

Tests MUST run against ALL backends with identical expectations:

```typescript
// CORRECT - parameterized test
describe.each(backends)('$name backend', B => {
  it('computes sin', async () => {
    const arr = B.array([0, Math.PI / 2, Math.PI], [3]);
    const result = B.sin(arr);
    expect(await getData(result, B)).toEqual([0, 1, 0]);
  });
});

// WRONG - backend-specific test
describe('js backend', () => {
  it('computes sin', () => {
    /* js-specific */
  });
});
describe('webgpu backend', () => {
  it('computes sin', () => {
    /* different implementation */
  });
});
```

**If a backend can't pass a test, FIX THE BACKEND - don't skip the test.**

## Development

**Always use `pnpm` from monorepo root:**

```bash
# From monorepo root
pnpm install
pnpm build
pnpm test
```

## Build Commands

```bash
# Build TypeScript (from packages/numpyjs)
pnpm build

# Run TypeScript tests
pnpm test

# Typecheck
pnpm typecheck
```

## Architecture

```
packages/numpyjs/
├── src/                    # Published TypeScript source
│   ├── index.ts            # Main entry point (createBackend factory)
│   └── types.ts            # NDArray, Backend interfaces
├── tests/                  # Development tests + backend implementations
│   ├── test-utils.ts       # Backend interface (185 methods)
│   ├── js-backend.ts       # Pure JS reference backend (~4K lines)
│   ├── webgpu-backend.ts   # WebGPU shader orchestration (~13K lines)
│   └── *.test.ts           # Parameterized tests
└── dist/                   # Built output
```

## WebGPU Performance

Beats tfjs-webgpu at all matrix sizes (up to 2.56x faster at 4096x4096).

Key insights:

- Store A as vec4 along K dimension (not M)
- B-value register caching for ILP
- Autotune selects optimal shader per size

**CRITICAL: Test WebGPU in native Chrome, NOT Playwright (adds ~15-20% overhead)**

## Checklist Before Committing

- [ ] `pnpm test` passes with 0 failures
- [ ] No CPU loops over array data in webgpu-backend.ts math methods
- [ ] All new ops added to Backend interface in types.ts
- [ ] Tests are parameterized across all backends
- [ ] `pnpm lint` passes
- [ ] `pnpm typecheck` passes
