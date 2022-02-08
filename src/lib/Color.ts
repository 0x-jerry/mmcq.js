export type ColorDimension = 'r' | 'g' | 'b'

export class Color {
  r: number
  g: number
  b: number

  static compose(color: Color, bit: number): number {
    const r = color.r >> (8 - bit)
    const g = color.g >> (8 - bit)
    const b = color.b >> (8 - bit)

    return (r << (2 * bit)) + (g << bit) + b
  }

  static delta(c1: Color, c2: Color): number {
    return (
      Math.abs(c1.r - c1.r) ** 2 +
      Math.abs(c1.g - c2.g) ** 2 +
      Math.abs(c1.b - c2.b) ** 2
    )
  }

  static formHex(hex: number) {
    const c = hexToRgb(hex.toString(16).padStart(6, '0'))

    return new Color(c.r, c.g, c.b)
  }

  constructor(r: number = 0, g: number = 0, b: number = 0) {
    this.r = r
    this.g = g
    this.b = b
  }

  get hex(): string {
    return '#' + this.toString()
  }

  get rgb(): string {
    return `rgb(${this.r}, ${this.g}, ${this.b})`
  }

  toString(): string {
    return this.r.toString(16) + this.g.toString(16) + this.b.toString(16)
  }

  delta(color: Color): number {
    return Color.delta(this, color)
  }

  /**
   *
   * @param bit 1 - 8
   * @returns
   */
  compose(bit: number): number {
    return Color.compose(this, bit)
  }
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)

  return {
    r: parseInt(result?.[1] || '0', 16),
    g: parseInt(result?.[2] || '0', 16),
    b: parseInt(result?.[3] || '0', 16),
  }
}
