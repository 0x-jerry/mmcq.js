import { Plugin } from 'esbuild'
import fs from 'fs'
import path from 'path'

const NS = 'wasm-ns'

const wasmPlugin = (): Plugin => {
  return {
    name: 'wasm',
    setup(build) {
      build.onResolve({ filter: /\.wasm(\?url)?$/ }, (args) => {
        return {
          path: path.join(args.resolveDir, args.path.replace(/\?.+$/, '')),
          namespace: NS,
        }
      })

      build.onLoad({ filter: /.*/, namespace: NS }, (args) => {
        const code = fs.readFileSync(args.path)
        const src = code.toString('base64')

        return {
          contents: `export default '${src}';`,
          loader: 'js',
        }
      })
    },
  }
}

export default wasmPlugin
