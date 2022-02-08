import { Color } from './Color'
import { MMCQ } from './MMCQ'

export function getPalette(
  /**
   * image data
   */
  data: Uint8ClampedArray,
  /**
   * Color count
   */
  count: number,
  /**
   *
   */
  algorithm: number,
): Color[] {
  const mmcq = new MMCQ(data, algorithm)

  return mmcq.getPalette(count)
}
