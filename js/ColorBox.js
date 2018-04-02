import Color from './Color'

export default class ColorBox {
  /**
   *
   * @param {Color} color1
   * @param {Color} color2
   * @param {Array.<Color>} colors
   */
  constructor(color1, color2, colors) {
    this.color1 = color1
    this.color2 = color2
    this.colors = colors
  }

  /**
   * @returns {Color}
   */
  avg() {
    let r = 0, g = 0, b = 0

    this.colors.forEach(color => {
      r += color.r
      g += color.g
      b += color.b
    })

    let avgColor = new Color(
      Math.round(r / this.colors.length),
      Math.round(g / this.colors.length),
      Math.round(b / this.colors.length)
    )

    let nearColor = this.colors.find(color => Color.equal(color, avgColor))
    if (nearColor) return nearColor

    let normMin = Math.pow(255, 3), norm = normMin
    let deltaColor = null

    this.colors.forEach(color => {
      deltaColor = new Color(
        Math.abs(color.r - avgColor.r),
        Math.abs(color.g - avgColor.g),
        Math.abs(color.b - avgColor.b)
      )
      norm = deltaColor.norm()
      if(norm < normMin) {
        normMin = norm
        nearColor = color
      }
    })

    return nearColor
  }
}
