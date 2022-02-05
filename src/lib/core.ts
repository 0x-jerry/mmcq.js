import { Color } from './Color'
import { MMCQ } from './MMCQ'
import { getImageData } from './utils'

export interface IQuality {
  /**
   * 0.1 - 1, The bigger the better
   */
  image: number
  /**
   * 1 - 8, The bigger the better
   */
  algorithm: number
}

function getPalette(
  img: HTMLImageElement,
  length: number,
  quality: IQuality,
): Color[] {
  const data = getImageData(img, quality.image)

  const mmcq = new MMCQ(data)

  return mmcq.getPalette(length, quality.algorithm)
}

export default getPalette
