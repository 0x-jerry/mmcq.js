import { MMCQOption } from './index'
import init, { mmcq } from '../assembly-rust/pkg/mmcq'

let p: ReturnType<typeof init>

export function preloadWasm(path?: string) {
  p = init(path)
  return p
}

export async function mmcqjs(
  imgData: Uint8ClampedArray,
  opt: MMCQOption,
): Promise<number[]> {
  if (!p) p = preloadWasm(opt.wasmPath)

  await p

  const res = await mmcq(imgData, opt.count, opt.algorithm)

  return res
}
