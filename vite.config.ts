import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isBuildLib = mode === 'lib'

  return ({
    plugins: [react()],
    base: './',
    publicDir: isBuildLib ? 'none' : 'public',
    build: {
      outDir: isBuildLib ? 'dist' : 'docs',
      lib:
        isBuildLib
          ? {
              entry: path.join(__dirname, 'src', 'lib', 'core.ts'),
              formats: ['es', 'cjs']
            }
          : false
    }
  })
})
