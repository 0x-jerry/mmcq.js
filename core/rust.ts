import { MMCQOption } from './index'
import init, { mmcq } from '../assembly-rust/pkg/mmcq'

let p: ReturnType<typeof init> | null

export async function preloadWasm() {
  if (__VITE__) {
    const mod = await import('../assembly-rust/pkg/mmcq_bg.wasm?url')
    p = init(mod.default)
  } else {
    const resp: string = (await import('../assembly-rust/pkg/mmcq_bg.wasm?url'))
      .default as any

    const buffer = Uint8Array.from(globalThis.window.atob(resp), (c) =>
      c.charCodeAt(0),
    )

    p = init(buffer)
  }

  return p
}

export async function mmcqjs(
  imgData: Uint8ClampedArray,
  opt: MMCQOption,
): Promise<number[]> {
  if (opt.useWebAssembly && !p) {
    p = await preloadWasm()
  }

  const res = await mmcq(imgData, opt.count, opt.colorDepth)

  return res
}
