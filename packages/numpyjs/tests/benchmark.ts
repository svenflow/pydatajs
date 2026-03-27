/**
 * Performance benchmarks: rumpy-ts vs tfjs
 *
 * Run in browser via Playwright to get accurate GPU timings.
 */

import { initWebGPUBackend, createWebGPUBackend } from '../src/webgpu-backend';
import { createJsBackend } from '../src/js-backend';
import type { Backend } from './test-utils';

// Benchmark configuration
const WARMUP_RUNS = 3;
const BENCHMARK_RUNS = 10;
const MATRIX_SIZES = [128, 256, 512, 1024, 2048];

interface BenchmarkResult {
  backend: string;
  operation: string;
  size: number;
  avgMs: number;
  minMs: number;
  maxMs: number;
  stdMs: number;
  gflops?: number;
}

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function randomMatrix(backend: Backend, n: number): ReturnType<Backend['array']> {
  const data: number[] = [];
  for (let i = 0; i < n * n; i++) {
    data.push(Math.random());
  }
  return backend.array(data, [n, n]);
}

async function benchmarkMatmul(
  backend: Backend,
  backendName: string,
  size: number
): Promise<BenchmarkResult> {
  // Create random matrices
  const a = randomMatrix(backend, size);
  const b = randomMatrix(backend, size);

  // Warmup
  for (let i = 0; i < WARMUP_RUNS; i++) {
    backend.matmul(a, b);
  }

  // Wait for any async operations to complete
  await sleep(10);

  // Benchmark
  const times: number[] = [];
  for (let i = 0; i < BENCHMARK_RUNS; i++) {
    const start = performance.now();
    backend.matmul(a, b);
    const end = performance.now();
    times.push(end - start);
  }

  const avgMs = times.reduce((a, b) => a + b) / times.length;
  const minMs = Math.min(...times);
  const maxMs = Math.max(...times);
  const variance = times.reduce((acc, t) => acc + (t - avgMs) ** 2, 0) / times.length;
  const stdMs = Math.sqrt(variance);

  // GFLOPS: matmul is 2*n^3 FLOPs
  const flops = 2 * size * size * size;
  const gflops = flops / (avgMs / 1000) / 1e9;

  return {
    backend: backendName,
    operation: 'matmul',
    size,
    avgMs,
    minMs,
    maxMs,
    stdMs,
    gflops,
  };
}

async function benchmarkTfjs(size: number, backendName: string): Promise<BenchmarkResult | null> {
  // @ts-expect-error - tfjs loaded globally
  const tf = (window as unknown as Record<string, unknown>).tf;
  if (!tf) {
    console.log('TensorFlow.js not loaded');
    return null;
  }

  try {
    await tf.setBackend(backendName);
    await tf.ready();
  } catch (e) {
    console.log(`Failed to set tfjs backend ${backendName}:`, e);
    return null;
  }

  // Create random tensors
  const a = tf.randomUniform([size, size]);
  const b = tf.randomUniform([size, size]);

  // Warmup
  for (let i = 0; i < WARMUP_RUNS; i++) {
    const c = tf.matMul(a, b);
    c.dataSync(); // Force execution
    c.dispose();
  }

  await sleep(10);

  // Benchmark
  const times: number[] = [];
  for (let i = 0; i < BENCHMARK_RUNS; i++) {
    const start = performance.now();
    const c = tf.matMul(a, b);
    c.dataSync(); // Force execution
    const end = performance.now();
    times.push(end - start);
    c.dispose();
  }

  a.dispose();
  b.dispose();

  const avgMs = times.reduce((a, b) => a + b) / times.length;
  const minMs = Math.min(...times);
  const maxMs = Math.max(...times);
  const variance = times.reduce((acc, t) => acc + (t - avgMs) ** 2, 0) / times.length;
  const stdMs = Math.sqrt(variance);

  const flops = 2 * size * size * size;
  const gflops = flops / (avgMs / 1000) / 1e9;

  return {
    backend: `tfjs-${backendName}`,
    operation: 'matmul',
    size,
    avgMs,
    minMs,
    maxMs,
    stdMs,
    gflops,
  };
}

export async function runBenchmarks(): Promise<BenchmarkResult[]> {
  const results: BenchmarkResult[] = [];

  console.log('Initializing backends...');

  // Initialize backends
  const jsBackend = createJsBackend();

  await initWebGPUBackend();
  const webgpuBackend = createWebGPUBackend();

  console.log('Starting benchmarks...\n');

  for (const size of MATRIX_SIZES) {
    console.log(`\n=== Matrix size: ${size}x${size} ===\n`);

    // numpyjs JS (CPU reference)
    console.log(`  numpyjs js...`);
    const jsResult = await benchmarkMatmul(jsBackend, 'numpyjs-js', size);
    results.push(jsResult);
    console.log(`    ${jsResult.avgMs.toFixed(2)}ms (${jsResult.gflops?.toFixed(2)} GFLOPS)`);

    // numpyjs WebGPU
    console.log(`  numpyjs webgpu...`);
    const webgpuResult = await benchmarkMatmul(webgpuBackend, 'numpyjs-webgpu', size);
    results.push(webgpuResult);
    console.log(
      `    ${webgpuResult.avgMs.toFixed(2)}ms (${webgpuResult.gflops?.toFixed(2)} GFLOPS)`
    );

    // TensorFlow.js backends (for comparison)
    const tfjsBackends = ['cpu', 'webgl', 'webgpu'];
    for (const tfBackend of tfjsBackends) {
      console.log(`  tfjs-${tfBackend}...`);
      const tfResult = await benchmarkTfjs(size, tfBackend);
      if (tfResult) {
        results.push(tfResult);
        console.log(`    ${tfResult.avgMs.toFixed(2)}ms (${tfResult.gflops?.toFixed(2)} GFLOPS)`);
      } else {
        console.log(`    (unavailable)`);
      }
    }
  }

  return results;
}

// Format results as a table
export function formatResultsTable(results: BenchmarkResult[]): string {
  const lines: string[] = [];

  lines.push('');
  lines.push('MATMUL BENCHMARK RESULTS');
  lines.push('========================');
  lines.push('');

  // Group by size
  const sizes = [...new Set(results.map(r => r.size))];

  for (const size of sizes) {
    lines.push(`${size}x${size} matrices:`);
    lines.push('-'.repeat(60));
    lines.push(
      `${'Backend'.padEnd(20)} ${'Avg (ms)'.padStart(10)} ${'Min'.padStart(8)} ${'Max'.padStart(8)} ${'GFLOPS'.padStart(10)}`
    );
    lines.push('-'.repeat(60));

    const sizeResults = results.filter(r => r.size === size).sort((a, b) => a.avgMs - b.avgMs);

    for (const r of sizeResults) {
      lines.push(
        `${r.backend.padEnd(20)} ${r.avgMs.toFixed(2).padStart(10)} ${r.minMs.toFixed(2).padStart(8)} ${r.maxMs.toFixed(2).padStart(8)} ${(r.gflops?.toFixed(2) || 'N/A').padStart(10)}`
      );
    }
    lines.push('');
  }

  return lines.join('\n');
}

// Export for use in test runner
(window as unknown as Record<string, unknown>).runBenchmarks = runBenchmarks;
(window as unknown as Record<string, unknown>).formatResultsTable = formatResultsTable;
