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

  constructor(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
  }

  toString() {
    return `${this.r}, ${this.g}, ${this.b}`
  }
}
