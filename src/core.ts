class Color {
  r: number;
  g: number;
  b: number;
  a: number;

  static bit: number = 3;

  static compose(color: Color): number {
    return (color.r << (2 * Color.bit)) + (color.g << Color.bit) + color.b;
  }

  constructor(r: number = 0, g: number = 0, b: number = 0, a: number = 255) {
    this.r = Math.round(r);
    this.g = Math.round(g);
    this.b = Math.round(b);
    this.a = Math.round(a);
  }

  get hex(): String {
    return '#' + this.toString(true);
  }

  get rgb(): String {
    return `rgb(${this.r}, ${this.g}, ${this.b})`;
  }

  get rgba(): String {
    return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
  }

  toString(alpha: Boolean = false): String {
    return (
      this.r.toString(16) +
      this.g.toString(16) +
      this.b.toString(16) +
      (alpha ? this.a.toString(16) : '')
    );
  }

  get compose(): number {
    return Color.compose(this);
  }
}

class ColorVolume {
  colors: Color[] = null;

  constructor(colors: Color[]) {
    this.colors = colors.filter(color => {
      if (color.a < 125) {
        return false;
      }

      return true;
    });
  }

  get length() {
    return this.colors.length;
  }

  get color(): Color {
    const avg = new Color();
    this.colors.forEach(color => {
      avg.r += color.r;
      avg.g += color.g;
      avg.b += color.b;
    });

    avg.r = avg.r / this.length;
    avg.g = avg.g / this.length;
    avg.b = avg.b / this.length;
    return avg;
  }

  private deltaDimension() {
    let dimension = '';
    const max: Color = new Color(0, 0, 0);
    const min: Color = new Color(255, 255, 255);

    const dimensions = ['r', 'g', 'b'];

    this.colors.forEach(color => {
      dimensions.forEach(d => {
        max[d] = Math.max(max[d], color[d]);
        min[d] = Math.min(min[d], color[d]);
      });
    });

    const delta: Color = new Color();
    delta.r = max.r - min.r;
    delta.g = max.g - min.g;
    delta.b = max.b - min.b;

    const maxVal = Math.max(delta.r, delta.g, delta.b);
    dimension = maxVal === delta.r ? 'r' : maxVal === delta.g ? 'g' : 'b';

    return {
      dimension,
      value: max[dimension] - min[dimension],
      max,
      min
    };
  }

  cutWidthDimension() {
    const { dimension, value } = this.deltaDimension();
    const left: Color[] = [];
    const right: Color[] = [];
    const middle = value / 2;

    this.colors.forEach(color => {
      if (color[dimension] > middle) {
        right.push(color);
      } else {
        left.push(color);
      }
    });

    return {
      right: new ColorVolume(right),
      left: new ColorVolume(left)
    };
  }
}

class MMCQ {
  colors: Color[] = null;
  volumes: ColorVolume[] = [];
  volume: ColorVolume = null;

  constructor(colors: Color[]) {
    this.colors = colors;
    this.volume = new ColorVolume(colors);
    this.volumes = [this.volume];
  }

  getPalette(length): Color[] {
    while (this.volumes.length < length) {
      const newVolumes: ColorVolume[] = [];

      this.volumes.forEach(volume => {
        const { left, right } = volume.cutWidthDimension();
        if (left.length !== 0) newVolumes.push(left);
        if (right.length !== 0) newVolumes.push(right);
      });

      this.volumes = newVolumes.sort((a, b) => b.length - a.length);
    }

    return this.volumes.map(v => v.color).slice(0, length);
  }
}

export default MMCQ;
