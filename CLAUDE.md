# pydatajs

**PyData ecosystem for JavaScript** - 1:1 API parity with Python's scientific computing stack.

## Philosophy

**Mirror Python exactly.** This monorepo provides JavaScript implementations of Python's data science libraries with the same APIs:

| Python Package      | JavaScript Package | Backend                   | Status      |
| ------------------- | ------------------ | ------------------------- | ----------- |
| numpy               | numpyjs            | Pure JS + WebGPU          | In progress |
| scikit-learn        | scikitlearnjs      | TypeScript (uses numpyjs) | In progress |
| torch.nn.functional | torchjs            | Rust/WASM + WebGPU        | In progress |

If a function exists in numpy, it should exist in numpyjs with the same signature. Same for sklearn.

## Repository Structure

pnpm monorepo with Turborepo orchestration:

```
pydatajs/
├── packages/
│   ├── numpyjs/              # numpy equivalent
│   │   ├── src/              # TypeScript API (types + entry point)
│   │   └── tests/            # Backend implementations + tests
│   └── scikitlearnjs/        # sklearn equivalent
│       ├── src/              # TypeScript API
│       │   ├── preprocessing/    # StandardScaler, MinMaxScaler
│       │   ├── neural_network/   # MLPClassifier, MLPRegressor
│       │   ├── metrics/          # accuracy_score, mse, etc.
│       │   ├── model_selection/  # train_test_split
│       │   ├── cluster/          # KMeans
│       │   └── linear_model/     # LinearRegression, LogisticRegression
│       └── crates/           # Rust implementation
│           └── scikitlearnjs-wasm/   # NN ops in Rust/WASM
├── docs/                 # Design docs
├── .changeset/           # Version management
├── .github/workflows/    # CI/CD
├── turbo.json           # Turborepo config
└── pnpm-workspace.yaml  # Workspace definition
```

## Packages

| Package       | Python Equivalent | Description                                |
| ------------- | ----------------- | ------------------------------------------ |
| numpyjs       | numpy             | N-dimensional arrays, math, linalg, random |
| scikitlearnjs | sklearn           | ML algorithms, preprocessing, metrics      |

## Development

### Prerequisites

- Node.js 20+
- pnpm 9+

### Commands

```bash
pnpm install          # Install dependencies
pnpm build            # Build all packages
pnpm test             # Run tests
pnpm lint             # Lint code
pnpm format:check     # Check formatting
pnpm changeset        # Add a changeset for versioning
```

## API Parity Guidelines

### numpyjs

Should match numpy API:

```typescript
// Python: np.zeros([3, 4])
backend.zeros([3, 4]);

// Python: np.matmul(a, b)
backend.matmul(a, b);

// Python: arr.reshape([2, 6])
backend.reshape(arr, [2, 6]);
```

### scikitlearnjs

Should match sklearn API:

```typescript
// Python: from sklearn.preprocessing import StandardScaler
import { preprocessing } from 'scikitlearnjs';

// Python: scaler = StandardScaler()
const scaler = new preprocessing.StandardScaler(backend);

// Python: scaler.fit_transform(X)
scaler.fitTransform(X);
```

## Architecture Pattern: Package Self-Containment

**Each package owns its own backend code.** Don't put backend code in package A if it powers package B's API.

**Rationale:**

- Each npm package should be deployable independently
- Backend ops live with the TypeScript API they power
- Clear ownership boundaries

## CRITICAL: Testing Methodology

**Tests MUST be ported from the Python library's actual test suite.**

This is extremely important. Don't make up test cases - port the actual tests from:

- `sklearn/preprocessing/tests/test_data.py` → scikitlearnjs preprocessing tests
- `torch/nn/functional/tests/` → torchjs tests
- `numpy/tests/` → numpyjs tests

### Why This Matters

The Python library's test suites encode critical domain knowledge:

- Edge cases the original authors thought of
- Numerical stability tests
- API contract guarantees
- Behavior under unusual inputs (NaN, single samples, constant features, etc.)

By copying their test inputs and expected outputs, we inherit all this knowledge. Making up our own tests means we'll miss the edge cases.

### Workflow

1. **Find the Python lib's test file** for the feature you're implementing
2. **Run their exact test cases** in Python to get expected values
3. **Copy both inputs AND expected outputs** to JS test
4. **Verify JS produces identical results**

```bash
# Example: Get sklearn StandardScaler test values
uv run python3 -c "
import numpy as np
from sklearn.preprocessing import StandardScaler

# From test_standard_scaler_1d
X = np.array([[1.0, 2.0, 3.0, 4.0, 5.0]])  # single row
scaler = StandardScaler()
scaler.fit(X)
print('mean_:', scaler.mean_.tolist())
print('scale_:', scaler.scale_.tolist())
print('transform:', scaler.transform(X).tolist())
"
```

Then in JS test:

```typescript
const X = [[1.0, 2.0, 3.0, 4.0, 5.0]];
const scaler = new StandardScaler(backend);
await scaler.fit(X);
expectArraysClose(scaler.mean, [1.0, 2.0, 3.0, 4.0, 5.0]);
expectArraysClose(scaler.scale, [1.0, 1.0, 1.0, 1.0, 1.0]);
```

### Precision

Use `toBeCloseTo(expected, 6)` for f64, `toBeCloseTo(expected, 5)` for f32.

## What Does NOT Belong

- Anything not in the Python equivalents' public API
- Cross-package dependencies for performance ops (each package owns its ops)

## Publishing

npm packages: `numpyjs`, `scikitlearnjs`
Publisher: svenflow

## License

MIT
