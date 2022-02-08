import { Color } from './Color'
import { MMCQ } from './MMCQ'

export function getPalette(
  data: Uint8ClampedArray,
  length: number,
  algorithm: number,
): Color[] {
  const mmcq = new MMCQ(data, algorithm)

  return mmcq.getPalette(length)
}
