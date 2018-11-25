interface IColor {
  r: number;
  g: number;
  b: number;
}

interface IPixel {
  num: number;
  color: Color;
}

class Color implements IColor {
  private _r: number;
  private _g: number;
  private _b: number;

  static bit: number = 5;

  static compose(color: IColor): number {
    return (color.r << (2 * Color.bit)) + (color.g << Color.bit) + color.b;
  }

  static delta(c1: IColor, c2: IColor): number {
    return (
      Math.abs(c1.r - c1.r) + Math.abs(c1.g - c2.g) + Math.abs(c1.b - c2.b)
    );
  }

  public set r(v: number) {
    this._r = Math.round(v);
  }

  public set g(v: number) {
    this._g = Math.round(v);
  }

  public set b(v: number) {
    this._b = Math.round(v);
  }

  public get r(): number {
    return this._r;
  }

  public get g(): number {
    return this._g;
  }

  public get b(): number {
    return this._b;
  }

  constructor(r: number = 0, g: number = 0, b: number = 0) {
    this.r = r;
    this.g = g;
    this.b = b;
  }

  get hex(): string {
    return '#' + this.toString();
  }

  get rgb(): string {
    return `rgb(${this._r}, ${this._g}, ${this._b})`;
  }

  toString(): string {
    return this._r.toString(16) + this._g.toString(16) + this._b.toString(16);
  }

  delta(color: IColor): number {
    return Color.delta(this, color);
  }

  get compose(): number {
    return Color.compose(this);
  }
}

class ColorVolume {
  private pixels: IPixel[] = [];
  private _length: number = 0;

  constructor(pixels?: IPixel[], length?: number) {
    if (!pixels) return;

    this.pixels = pixels;
    this._length = length;
  }

  fromColors(colors: Color[]): ColorVolume {
    if (!colors) return;
    this._length = colors.length;

    colors.forEach((color) => {
      const index = color.compose;
      const pixel = this.pixels[index];

      if (pixel) {
        pixel.num += 1;
      } else {
        this.pixels[index] = { num: 1, color };
      }
    });

    return this;
  }

  private iterPixels(func: (IPixel) => void) {
    Object.keys(this.pixels).forEach((key) => {
      func(this.pixels[key]);
    });
  }

  get length() {
    return this._length;
  }

  mainColor(): Color {
    const avg: IColor = { r: 0, g: 0, b: 0 };
    const similar: Color = new Color();

    this.iterPixels((pixel) => {
      avg.r += pixel.num * pixel.color.r;
      avg.g += pixel.num * pixel.color.g;
      avg.b += pixel.num * pixel.color.b;
    });

    avg.r = avg.r / this.length;
    avg.g = avg.g / this.length;
    avg.b = avg.b / this.length;

    let delta = 255 * 3;

    this.iterPixels((pixel) => {
      const curDelta = Color.delta(avg, pixel.color);

      if (curDelta < delta) {
        similar.r = pixel.color.r;
        similar.g = pixel.color.g;
        similar.b = pixel.color.b;
        delta = curDelta;
      }
    });

    return similar;
  }

  private deltaDimension() {
    let dimension = '';
    const max: Color = new Color(0, 0, 0);
    const min: Color = new Color(255, 255, 255);

    const dimensions = ['r', 'g', 'b'];

    this.iterPixels((pixel) => {
      dimensions.forEach((d) => {
        max[d] = Math.max(max[d], pixel.color[d]);
        min[d] = Math.min(min[d], pixel.color[d]);
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
      middle: (max[dimension] + min[dimension]) / 2,
    };
  }

  cutWidthDimension() {
    interface IPixelCount {
      length: number;
      pixels: IPixel[];
    }

    const { dimension, middle } = this.deltaDimension();
    const left: IPixelCount = { length: 0, pixels: [] };
    const right: IPixelCount = { length: 0, pixels: [] };

    this.iterPixels((pixel) => {
      if (pixel.color[dimension] > middle) {
        right.length += pixel.num;
        right.pixels.push(pixel);
      } else {
        left.length += pixel.num;
        left.pixels.push(pixel);
      }
    });

    return {
      right: new ColorVolume(right.pixels, right.length),
      left: new ColorVolume(left.pixels, left.length),
    };
  }
}

class MMCQ {
  private volumes: ColorVolume[] = [];

  constructor(colors: Color[]) {
    const volume = new ColorVolume().fromColors(colors);
    this.volumes = [volume];
  }

  getPalette(length: number): Color[] {
    let lastLength = 0;

    while (this.volumes.length < length) {
      const newVolumes: ColorVolume[] = [];

      for (let i = 0, max = this.volumes.length; i < max; i++) {
        const volume = this.volumes[i];
        const { left, right } = volume.cutWidthDimension();

        if (left.length !== 0) newVolumes.push(left);
        if (right.length !== 0) newVolumes.push(right);
      }

      this.volumes = newVolumes.sort((a, b) => b.length - a.length);

      if (lastLength === this.volumes.length) {
        console.warn('too small pixels');
        break;
      } else {
        lastLength = this.volumes.length;
      }
    }

    return this.volumes.map((v) => v.mainColor()).slice(0, length);
  }
}

export { MMCQ as default, Color };
