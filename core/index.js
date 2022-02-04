const fs = require('fs')
const loader = require('@assemblyscript/loader')
const imports = {
  /* imports go here */
  index: {
    log: (value) =>
      console.log('as log:', wasmModule.exports.__getString(value)),
  },
  core: {
    warn: (value) =>
      console.warn('as warn:', wasmModule.exports.__getString(value)),
  },
}

const wasmModule = loader.instantiateSync(
  // fs.readFileSync(__dirname + '/build/untouched.wasm'),
  fs.readFileSync(__dirname + '/build/optimized.wasm'),
  imports,
)

module.exports = wasmModule.exports
