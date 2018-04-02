export default class Color {
  /**
   *
   * @param {Color} color1
   * @param {Color} color2
   * @returns {Color}
   */
  static add(color1, color2) {
    let r = (color1.r + color2.r);
    let g = (color1.g + color2.g);
    let b = (color1.b + color2.b);
    r = r > 255 ? 255 : r;
    g = g > 255 ? 255 : g;
    b = b > 255 ? 255 : b;
    return new Color(r, g, b);
  }

  /**
   *
   * @param {Color} color1
   * @param {Color} color2
   * @returns {Color}
   */
  static minus(color1, color2) {
    let r = color1.r - color2.r;
    let g = color1.g - color2.g;
    let b = color1.b - color2.b;
    r = r < 0 ? 0 : r;
    g = g < 0 ? 0 : g;
    b = b < 0 ? 0 : b;
    return new Color(r, g, b);
  }

  /**
   *
   * @param {Color} color1
   * @param {Color} color2
   * @returns {boolean}
   */
  static equal(color1, color2) {
    return color1.r === color2.r && color1.g === color2.g && color1.b === color2.b
  }

  /**
   *
   * @param {number} r
   * @param {number} g
   * @param {number} b
   */
  constructor(r, g, b) {
    this.r = r < 0 ? 0 : r > 255 ? 255 : r;
    this.g = g < 0 ? 0 : g > 255 ? 255 : g;
    this.b = b < 0 ? 0 : b > 255 ? 255 : b;
  }

  /**
   *
   * @returns {number}
   */
  norm() {
    return +Math.sqrt(
      Math.pow(this.r, 2) + Math.pow(this.g, 2) + Math.pow(this.b, 2)
    ).toFixed(2)
  }

  /**
   * @returns {Array.<number>}
   */
  valueOf() {
    return [this.r, this.g, this.b]
  }

  /**
   * @returns {string}
   */
  toString() {
    return `${this.r}, ${this.g}, ${this.b}`
  }
}
