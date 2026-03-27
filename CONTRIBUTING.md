# Contributing to pydatajs

Thank you for your interest in contributing to pydatajs!

## Prerequisites

Before you begin, make sure you have the following installed:

### Required

- **Node.js 20+**: [Download](https://nodejs.org/)
- **pnpm 9+**: Install via `npm install -g pnpm`
- **Rust**: [Install via rustup](https://rustup.rs/)
- **wasm-pack**: Required for building WASM modules

```bash
# Install wasm-pack
curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
```

### Optional

- **Chrome/Chromium**: For running WASM tests in headless browser

## Getting Started

### Quick Setup (Recommended)

```bash
git clone https://github.com/svenflow/pydatajs.git
cd pydatajs
./scripts/setup.sh
```

The setup script will check/install all dependencies and verify your environment.

### Manual Setup

1. Clone the repository:

```bash
git clone https://github.com/svenflow/pydatajs.git
cd pydatajs
```

2. Install dependencies:

```bash
pnpm install
```

3. Build all packages:

```bash
pnpm build
```

4. Run tests:

```bash
pnpm test
```

## Development Workflow

### Building

```bash
# Build all packages
pnpm build

# Build just numpyjs WASM
cd packages/numpyjs
pnpm build:wasm
```

### Testing

```bash
# Run all tests
pnpm test

# Run Rust tests only
cd packages/numpyjs
cargo test --all

# Run WASM tests in headless Chrome
cd packages/numpyjs
pnpm test:wasm
```

### Linting & Formatting

```bash
# Check formatting
pnpm format:check

# Auto-fix formatting
pnpm format

# Run linters
pnpm lint

# Type check
pnpm typecheck
```

## Adding a Changeset

When you make changes that should be included in a release, add a changeset:

```bash
pnpm changeset
```

Follow the prompts to describe your changes. This will create a markdown file in `.changeset/` that will be used to generate the changelog and bump versions.

## Code Guidelines

### TypeScript

- All TypeScript code must pass `tsc --noEmit` type checking
- Use ESLint and Prettier for code style
- Follow the project's tsconfig strict settings

### Rust

- Run `cargo fmt` before committing
- Run `cargo clippy` and fix any warnings
- All code must pass `cargo test`

### Backend Purity Rules

See `packages/numpyjs/CLAUDE.md` for critical rules about:

- WASM backend: 100% Rust implementation (no JS math)
- WebGPU backend: 100% GPU shaders (no CPU fallbacks)

## Pull Request Process

1. Create a feature branch from `main`
2. Make your changes
3. Add a changeset if applicable
4. Ensure all tests pass locally
5. Push your branch and create a PR
6. Wait for CI checks to pass
7. Request review

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
