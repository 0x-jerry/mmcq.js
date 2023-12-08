import { defineConfig } from 'tsup'
import wasmPlugin from './build/wasm'

export default defineConfig({
  entry: ['core/index.ts'],
  format: ['cjs', 'esm', 'iife'],
  dts: true,
  clean: true,
  globalName: 'MMCQJS',
  esbuildPlugins: [wasmPlugin()],
  define: {
    __VITE__: JSON.stringify(false),
  },
  treeshake: 'recommended',
})
