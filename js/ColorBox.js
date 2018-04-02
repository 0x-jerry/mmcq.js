import Color from './Color'

export default class ColorBox {
  /**
   *
   * @param {Array.<Color>} colors
   */
  constructor(colors) {
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

    return this.nearColor(avgColor)
  }

  /**
   *
   * @returns {Color} color
   */
  nearColor(Tcolor) {
    let nearColor = this.colors.find(color => Color.equal(color, Tcolor))
    if (nearColor) return nearColor

    let normMin = Math.pow(255, 3), norm = normMin
    let deltaColor = null

    this.colors.forEach(color => {
      deltaColor = new Color(
        Math.abs(color.r - Tcolor.r),
        Math.abs(color.g - Tcolor.g),
        Math.abs(color.b - Tcolor.b)
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
