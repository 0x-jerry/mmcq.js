export enum ColorDimension {
  r = 0,
  g = 1,
  b = 2,
}

export class Color {
  data: u8[] = []

  static bit: u8 = 5

  static compose(color: Color): u32 {
    const r: u32 = color.r
    const g: u32 = color.g
    const b: u32 = color.b

    return (r << (2 * Color.bit)) + (g << Color.bit) + b
  }

  static delta(c1: Color, c2: Color): u32 {
    return <u32>(
      (Math.abs(c1.r - c1.r) + Math.abs(c1.g - c2.g) + Math.abs(c1.b - c2.b))
    )
  }

  constructor(r: u8 = 0, g: u8 = 0, b: u8 = 0) {
    this.data = [r, g, b]
  }

  get r(): u8 {
    return this.get(ColorDimension.r)
  }

  get g(): u8 {
    return this.get(ColorDimension.g)
  }

  get b(): u8 {
    return this.get(ColorDimension.b)
  }

  /**
   *
   * @param dimension 0 | 1 | 2
   * @returns
   */
  get(dimension: ColorDimension): u8 {
    return this.data[dimension]
  }

  set(dimension: ColorDimension, value: u8): void {
    this.data[dimension] = value
  }

  get hex(): u32 {
    const r: u32 = this.r
    const g: u32 = this.g
    const b: u32 = this.b
    const bit = 8

    return (r << (2 * bit)) + (g << bit) + b
  }

  get rgb(): string {
    return `rgb(${this.r}, ${this.g}, ${this.b})`
  }

  toString(): string {
    return this.r.toString(16) + this.g.toString(16) + this.b.toString(16)
  }

  delta(color: Color): u32 {
    return Color.delta(this, color)
  }

  get compose(): u32 {
    return Color.compose(this)
  }
}
