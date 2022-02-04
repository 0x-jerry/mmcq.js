import loader, { ASUtil } from '@assemblyscript/loader'

let m: (ASUtil & Record<string, any>) | null

const imports = {
  index: {
    log: (value: number) => console.log('as log:', m?.__getString(value)),
  },
  core: {
    warn: (value: number) => console.warn('as warn:', m?.__getString(value)),
  },
}

async function load() {
  const { exports } = await loader.instantiate(
    fetch('/optimized.wasm'),
    imports,
  )

  m = exports
}

export async function getImagePalette(
  imgData: Uint8ClampedArray,
  len = 8,
  algorithm = 8,
) {
  if (!m) {
    await load()
  }

  if (!m) return

  const ptr = m.__pin(m.__newArrayBuffer(imgData.buffer))
  const r = m.getPalette(ptr, len, algorithm)
  m.__unpin(ptr)

  const arr = m.__getUint32Array(r)

  return Array.from(arr).slice(0, len)
}
