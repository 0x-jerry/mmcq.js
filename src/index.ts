import { Color } from './Color'
import * as rust from './rust'

export { preloadWasm } from './rust'
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
   * @deprecated Replace with the `colorDepth` option instead.
   */
  algorithm?: number

  /**
   * 1 - 8
   * @default 5
   */
  colorDepth: number

  /**
   * use WebAssembly
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
    colorDepth: 5,
    useWebAssembly: false,
  }

  const opt = Object.assign(defaultOption, option)

  opt.colorDepth = opt.algorithm || opt.colorDepth

  if (opt.useWebAssembly) {
    const colors = await rust.mmcqjs(data, opt)
    return colors.map((n) => Color.formHex(n))
  } else {
    const MMCQ = (await import('./MMCQ')).MMCQ
    return new MMCQ(data, opt.colorDepth).getPalette(opt.count)
  }
}
