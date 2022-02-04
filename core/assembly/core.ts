import { Color } from './Color'
import { ColorVolume } from './ColorVolume'

declare function warn(arg0: string): void

class MainColor {
  delta: u32
  color: Color
}

export class MMCQ {
  private volumes: ColorVolume[] = []
  private pixels: Color[] = []

  /**
   * @param imgData
   */
  constructor(imgData: Uint8ClampedArray) {
    const data = imgData

    for (let i = 0, max = data.length; i < max; i += 4) {
      const color = new Color(data[i + 0], data[i + 1], data[i + 2])
      this.pixels.push(color)
    }

    const volume = ColorVolume.fromColors(this.pixels)
    this.volumes = [volume]
  }

  /**
   *
   * @param length 1 - 254
   * @param quality 1 - 8
   */
  getPalette(length: u8, quality: u8 = 5): Color[] {
    Color.bit = quality

    let lastLength = 0

    while (this.volumes.length < <i32>length) {
      const newVolumes: ColorVolume[] = []

      for (let i = 0, max = this.volumes.length; i < max; i++) {
        const volume = this.volumes[i]
        const cut = volume.cutWithDimension()
        const left = cut.left
        const right = cut.right

        if (left.length !== 0) newVolumes.push(left)
        if (right.length !== 0) newVolumes.push(right)
      }

      this.volumes = newVolumes.sort((a, b) => b.length - a.length)

      if (lastLength === this.volumes.length) {
        warn('too small pixels')

        break
      } else {
        lastLength = this.volumes.length
      }
    }

    const volumes = this.volumes.slice(0, length)

    const avgColors = new Array<Color>()
    for (let idx = 0; idx < volumes.length; idx++) {
      const volume = volumes[idx]
      avgColors.push(volume.mainColor())
    }

    return this.getSimilarPalette(avgColors)
  }

  getSimilarPalette(avgColors: Color[]): Color[] {
    const colorNumber = avgColors.length

    const colors: MainColor[] = new Array<MainColor>(colorNumber)

    for (let i = 0; i < colorNumber; i++) {
      colors[i] = {
        delta: 255 * 3,
        color: new Color(),
      }
    }

    for (let idx = 0; idx < this.pixels.length; idx++) {
      const pixel = this.pixels[idx]

      for (let i = 0; i < colorNumber; i++) {
        const mainColor = colors[i]
        const delta = Color.delta(pixel, avgColors[i])

        if (delta < mainColor.delta) {
          mainColor.delta = delta
          mainColor.color = pixel
        }
      }
    }

    const mainColors = new Array<Color>()

    for (let idx = 0; idx < colors.length; idx++) {
      const c = colors[idx]
      mainColors.push(c.color)
    }

    return mainColors
  }
}
