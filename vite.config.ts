import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    plugins: [react()],
    base: './',
    build: {
      outDir: 'docs',
    },
    define: {
      __VITE__: JSON.stringify(true),
    },
  }
})
