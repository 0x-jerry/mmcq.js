import { Color } from './Color'
import { ColorVolume } from './ColorVolume'

export class MMCQ {
  private volumes: ColorVolume[] = []
  private pixels: Color[] = []

  /**
   *
   * @param img
   * @param imageQuality 0.1 - 1
   */
  constructor(data: Uint8ClampedArray) {
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
  getPalette(length: number, quality: number = 5): Color[] {
    Color.bit = quality

    while (this.volumes.length < length) {
      const newVolumes: ColorVolume[] = []

      for (let i = 0, max = this.volumes.length; i < max; i++) {
        const volume = this.volumes[i]
        const { left, right } = volume.cutWithDimension()

        if (left.size !== 0) newVolumes.push(left)
        if (right.size !== 0) newVolumes.push(right)
      }

      if (newVolumes.length === this.volumes.length) {
        console.warn('too small pixels')
        break
      }

      this.volumes = newVolumes.sort((a, b) => b.size - a.size)
    }

    const avgColors = this.volumes.slice(0, length).map((v) => v.mainColor())

    return this.getSimilarPalette(avgColors)
  }

  getSimilarPalette(avgColors: Color[]): Color[] {
    const colorNumber = avgColors.length

    interface IMainColor {
      delta: number
      color: Color
    }

    const colors: IMainColor[] = new Array(colorNumber)

    for (let i = 0; i < colorNumber; i++) {
      colors[i] = {
        delta: 255 * 3,
        color: new Color(),
      }
    }

    this.pixels.forEach((pixel) => {
      for (let i = 0; i < colorNumber; i++) {
        const mainColor = colors[i]
        const delta = Color.delta(pixel, avgColors[i])

        if (delta < mainColor.delta) {
          mainColor.delta = delta
          mainColor.color = pixel
        }
      }
    })
    return colors.map((c) => c.color)
  }
}
