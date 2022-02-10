import { MMCQOption } from './index'
import init, { mmcq } from '../assembly-rust/pkg/mmcq'

const p = init()

export async function mmcqjs(
  imgData: Uint8ClampedArray,
  opt: MMCQOption,
): Promise<number[]> {
  await p

  const res = await mmcq(imgData, opt.count, opt.algorithm)

  return res
}
