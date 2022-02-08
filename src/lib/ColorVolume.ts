import { Color, ColorDimension } from './Color'

export interface PixelCount {
  num: number
  color: Color
}

export class ColorVolume {
  #pixels: Map<number, PixelCount> = new Map()
  #size: number = 0
  #bit: number

  constructor(bit: number, pixels?: Map<number, PixelCount>, count = 0) {
    this.#bit = bit

    if (!pixels) return

    this.#pixels = pixels
    this.#size = count
  }

  /**
   *
   * @param colors
   * @param bit 1 - 8
   * @returns
   */
  static fromColors(colors: Color[], bit: number): ColorVolume {
    if (!colors) return new ColorVolume(bit)

    const pixels: Map<number, PixelCount> = new Map()

    colors.forEach((color) => {
      const index = color.compose(bit)

      if (pixels.has(index)) {
        const pixel = pixels.get(index)!
        pixel.num += 1
      } else {
        pixels.set(index, {
          num: 1,
          color,
        })
      }
    })

    return new ColorVolume(bit, pixels, colors.length)
  }

  get size() {
    return this.#size
  }

  mainColor(): Color {
    const avg = { r: 0, g: 0, b: 0 }

    for (const pixel of this.#pixels.values()) {
      avg.r += pixel.num * pixel.color.r
      avg.g += pixel.num * pixel.color.g
      avg.b += pixel.num * pixel.color.b
    }

    avg.r = avg.r / this.size
    avg.g = avg.g / this.size
    avg.b = avg.b / this.size

    return new Color(avg.r, avg.g, avg.b)
  }

  private deltaDimension() {
    let dimension: ColorDimension = 'b'
    const max: Color = new Color(0, 0, 0)
    const min: Color = new Color(255, 255, 255)

    const dimensions = ['r', 'g', 'b'] as const

    for (const pixel of this.#pixels.values()) {
      dimensions.forEach((d) => {
        max[d] = Math.max(max[d], pixel.color[d])
        min[d] = Math.min(min[d], pixel.color[d])
      })
    }

    const delta: Color = new Color()
    delta.r = max.r - min.r
    delta.g = max.g - min.g
    delta.b = max.b - min.b

    const maxVal = Math.max(delta.r, delta.g, delta.b)
    dimension = maxVal === delta.r ? 'r' : maxVal === delta.g ? 'g' : 'b'

    return {
      dimension,
      middle: (max[dimension] + min[dimension]) / 2,
    }
  }

  cutWithDimension() {
    interface IPixelCount {
      size: number
      pixels: Map<number, PixelCount>
    }

    const { dimension, middle } = this.deltaDimension()
    const left: IPixelCount = { size: 0, pixels: new Map() }
    const right: IPixelCount = { size: 0, pixels: new Map() }

    for (const pixel of this.#pixels.values()) {
      let idx = pixel.color.compose(this.#bit)

      let next = pixel.color[dimension] > middle ? right : left

      next.size += pixel.num

      if (next.pixels.has(idx)) {
        let x = next.pixels.get(idx)!
        x.num += pixel.num
      } else {
        next.pixels.set(idx, pixel)
      }
    }

    return {
      right: new ColorVolume(this.#bit, right.pixels, right.size),
      left: new ColorVolume(this.#bit, left.pixels, left.size),
    }
  }
}
