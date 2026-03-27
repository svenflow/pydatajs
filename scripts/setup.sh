#!/bin/bash
# Setup script for pydatajs development environment
set -e

echo "🔧 Setting up pydatajs development environment..."

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
  echo "❌ Node.js 20+ required. Current version: $(node -v)"
  exit 1
fi
echo "✅ Node.js $(node -v)"

# Check pnpm
if ! command -v pnpm &> /dev/null; then
  echo "📦 Installing pnpm..."
  npm install -g pnpm
fi
echo "✅ pnpm $(pnpm -v)"

# Check Rust
if ! command -v rustc &> /dev/null; then
  echo "❌ Rust not installed. Install via: curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh"
  exit 1
fi
echo "✅ Rust $(rustc --version | cut -d' ' -f2)"

# Check wasm-pack
if ! command -v wasm-pack &> /dev/null; then
  echo "📦 Installing wasm-pack..."
  curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
fi
echo "✅ wasm-pack $(wasm-pack --version | cut -d' ' -f2)"

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

echo ""
echo "🎉 Setup complete! Run 'pnpm build' to build all packages."
