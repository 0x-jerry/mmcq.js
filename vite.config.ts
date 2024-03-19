import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import ImportBin from 'unplugin-import-bin/vite'

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    plugins: [react(), ImportBin()],
    base: './',
    build: {
      outDir: 'docs',
    },
  }
})
