import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// DuckDB-WASM requires SharedArrayBuffer → COOP + COEP headers
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['@duckdb/duckdb-wasm'],
  },
  server: {
    port: 9041,
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
    proxy: {
      '/v1': { target: 'http://localhost:9042', changeOrigin: true },
      '/ws': { target: 'ws://localhost:9042', ws: true },
    },
  },
})
