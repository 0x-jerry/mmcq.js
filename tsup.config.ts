import { defineConfig } from 'tsup'
import importBin from 'unplugin-import-bin/esbuild'

export default defineConfig({
  entry: ['core/index.ts'],
  format: ['cjs', 'esm', 'iife'],
  dts: true,
  clean: true,
  globalName: 'MMCQJS',
  esbuildPlugins: [importBin()],
  treeshake: 'recommended',
})
