import { Color, ColorDimension } from './Color'

export class Pixel {
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

class IPixelCount {
  length: number
  pixels: Pixel[]
}

export class ColorVolume {
  private pixels: Pixel[] = []
  private _length: u32 = 0

  constructor(pixels: Pixel[], length: u32 = 0) {
    this.pixels = pixels
    this._length = length
  }

  static fromColors(colors: Color[]): ColorVolume {
    const length = colors.length
    const pixels = new Array<Pixel>(length)

    for (let idx = 0; idx < colors.length; idx++) {
      const color = colors[idx]

      const index = color.compose
      const pixel = pixels[index]

      if (pixel) {
        pixel.num += 1
      } else {
        pixels[index] = { num: 1, color }
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

    for (let idx = 0; idx < this.pixels.length; idx++) {
      const pixel = this.pixels[idx]

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

    for (let idx = 0; idx < this.pixels.length; idx++) {
      const pixel = this.pixels[idx]

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

    const left: IPixelCount = { length: 0, pixels: [] }
    const right: IPixelCount = { length: 0, pixels: [] }

    for (let idx = 0; idx < this.pixels.length; idx++) {
      const pixel = this.pixels[idx]

      if (pixel.color.get(dimension) > middle) {
        right.length += pixel.num
        right.pixels.push(pixel)
      } else {
        left.length += pixel.num
        left.pixels.push(pixel)
      }
    }

    const r: CutDimensionResult = {
      right: new ColorVolume(right.pixels, <u32>right.length),
      left: new ColorVolume(left.pixels, <u32>left.length),
    }

    return r
  }
}
