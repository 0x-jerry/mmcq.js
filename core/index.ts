import { Color } from './Color'
import { MMCQ } from './MMCQ'

export { Color }

export interface MMCQOption {
  /**
   * Color count
   * @default 8
   */
  count: number
  /**
   * 1 - 8
   * @default 5
   */
  algorithm: number
  /**
   * not support yet!
   * @default false
   */
  useWebAssembly: boolean
}

export async function mmcq(
  /**
   * image data
   */
  data: Uint8ClampedArray,
  option: Partial<MMCQOption> = {},
): Promise<Color[]> {
  const defaultOption: MMCQOption = {
    count: 8,
    algorithm: 5,
    useWebAssembly: false,
  }

  const opt = Object.assign(defaultOption, option)

  if (opt.useWebAssembly) {
    const r = await import('./rust')
    const colors = await r.mmcqjs(data, opt)
    return colors.map((n) => Color.formHex(n))
  } else {
    return new MMCQ(data, opt.algorithm).getPalette(opt.count)
  }
}
