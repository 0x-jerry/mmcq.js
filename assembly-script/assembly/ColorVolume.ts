import { Color, ColorDimension } from './Color'

export class PixelCount {
  num: u32
  color: Color
}

class DeltaDimensionResult {
  dimension: ColorDimension
  middle: number
}

class CutDimensionResult {
  right: ColorVolume
  left: ColorVolume
}

class IPixelVolume {
  length: number
  pixels: Map<u32, PixelCount>
}

export class ColorVolume {
  private pixels: Map<u32, PixelCount> = new Map<u32, PixelCount>()
  private _length: u32 = 0

  /**
   *
   * @param pixels
   * @param length total length for pixels
   */
  constructor(pixels: Map<u32, PixelCount>, length: u32 = 0) {
    this.pixels = pixels
    this._length = length
  }

  static fromColors(colors: Color[]): ColorVolume {
    const length = colors.length
    const pixels = new Map<u32, PixelCount>()

    for (let idx = 0; idx < colors.length; idx++) {
      const color = colors[idx]

      const index = color.compose

      if (pixels.has(index)) {
        const pixel = pixels.get(index)
        pixel.num += 1
      } else {
        pixels.set(index, { num: 1, color })
      }
    }

    return new ColorVolume(pixels, length)
  }

  get length(): u32 {
    return this._length
  }

  mainColor(): Color {
    let r: u32 = 0
    let g: u32 = 0
    let b: u32 = 0

    const pixels = this.pixels.values()

    for (let idx = 0; idx < pixels.length; idx++) {
      const pixel = pixels[idx]

      r += pixel.num * pixel.color.r
      g += pixel.num * pixel.color.g
      b += pixel.num * pixel.color.b
    }

    r = r / this.length
    g = g / this.length
    b = b / this.length

    return new Color(<u8>r, <u8>g, <u8>b)
  }

  private deltaDimension(): DeltaDimensionResult {
    let dimension: ColorDimension = ColorDimension.b

    const max: Color = new Color(0, 0, 0)
    const min: Color = new Color(255, 255, 255)

    const dimensions = [ColorDimension.r, ColorDimension.g, ColorDimension.b]

    const pixels = this.pixels.values()

    for (let idx = 0; idx < pixels.length; idx++) {
      const pixel = pixels[idx]

      for (let index = 0; index < dimensions.length; index++) {
        const d = dimensions[index]
        max.set(d, <u8>Math.max(max.get(d), pixel.color.get(d)))
        min.set(d, <u8>Math.min(min.get(d), pixel.color.get(d)))
      }
    }

    const delta: Color = new Color()
    delta.set(ColorDimension.r, max.r - min.r)
    delta.set(ColorDimension.g, max.g - min.g)
    delta.set(ColorDimension.b, max.b - min.b)

    const tempM = Math.max(delta.r, delta.g)
    const maxVal = Math.max(tempM, delta.b)
    dimension =
      maxVal === delta.r
        ? ColorDimension.r
        : maxVal === delta.g
        ? ColorDimension.g
        : ColorDimension.b

    const r: DeltaDimensionResult = {
      dimension,
      middle: (max.get(dimension) + min.get(dimension)) / 2,
    }

    return r
  }

  cutWithDimension(): CutDimensionResult {
    const delta = this.deltaDimension()

    const dimension = delta.dimension
    const middle = delta.middle

    const left: IPixelVolume = { length: 0, pixels: new Map() }
    const right: IPixelVolume = { length: 0, pixels: new Map() }

    const pixels = this.pixels.values()

    for (let idx = 0; idx < pixels.length; idx++) {
      const pixel = pixels[idx]

      if (pixel.color.get(dimension) > middle) {
        right.length += pixel.num
        right.pixels.set(pixel.color.compose, pixel)
      } else {
        left.length += pixel.num
        left.pixels.set(pixel.color.compose, pixel)
      }
    }

    const r: CutDimensionResult = {
      right: new ColorVolume(right.pixels, <u32>right.length),
      left: new ColorVolume(left.pixels, <u32>left.length),
    }

    return r
  }
}
