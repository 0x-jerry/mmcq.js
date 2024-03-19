import { MMCQOption } from './index'
import init, { mmcq } from '../assembly-rust/pkg/mmcq'

let initializedPromise: Promise<void> | undefined

export async function preloadWasm() {
  initializedPromise = import('../assembly-rust/pkg/mmcq_bg.wasm?bin')
    .then((buffer) => init(buffer.default))
    .then(() => undefined)
}

export async function mmcqjs(
  imgData: Uint8ClampedArray,
  opt: MMCQOption,
): Promise<number[]> {
  if (!initializedPromise) preloadWasm()

  await initializedPromise

  const res = await mmcq(imgData, opt.count, opt.colorDepth)

  return res
}
