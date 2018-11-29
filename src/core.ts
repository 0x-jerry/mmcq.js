import { getImageData } from './utils';

interface IColor {
  r: number;
  g: number;
  b: number;
}

interface IPixel {
  num: number;
  color: Color;
}

export class Color implements IColor {
  r: number;
  g: number;
  b: number;

  static bit: number = 5;

  static compose(color: IColor): number {
    return (color.r << (2 * Color.bit)) + (color.g << Color.bit) + color.b;
  }

  static delta(c1: IColor, c2: IColor): number {
    return (
      Math.abs(c1.r - c1.r) + Math.abs(c1.g - c2.g) + Math.abs(c1.b - c2.b)
    );
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
    return `rgb(${this.r}, ${this.g}, ${this.b})`;
  }

  toString(): string {
    return this.r.toString(16) + this.g.toString(16) + this.b.toString(16);
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

    colors.forEach(color => {
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
    Object.keys(this.pixels).forEach(key => {
      func(this.pixels[key]);
    });
  }

  get length() {
    return this._length;
  }

  mainColor(): Color {
    const avg: IColor = { r: 0, g: 0, b: 0 };

    this.iterPixels(pixel => {
      avg.r += pixel.num * pixel.color.r;
      avg.g += pixel.num * pixel.color.g;
      avg.b += pixel.num * pixel.color.b;
    });

    avg.r = avg.r / this.length;
    avg.g = avg.g / this.length;
    avg.b = avg.b / this.length;

    return new Color(avg.r, avg.g, avg.b);
  }

  private deltaDimension() {
    let dimension = '';
    const max: Color = new Color(0, 0, 0);
    const min: Color = new Color(255, 255, 255);

    const dimensions = ['r', 'g', 'b'];

    this.iterPixels(pixel => {
      dimensions.forEach(d => {
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
      middle: (max[dimension] + min[dimension]) / 2
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

    this.iterPixels(pixel => {
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
      left: new ColorVolume(left.pixels, left.length)
    };
  }
}

class MMCQ {
  private volumes: ColorVolume[] = [];
  private pixels: Color[] = [];

  /**
   *
   * @param img
   * @param imageQuality 0.1 - 1
   */
  constructor(img: HTMLImageElement, imageQuality: number = 0.5) {
    const data = getImageData(img, imageQuality);

    for (let i = 0, max = data.length; i < max; i += 4) {
      const color = new Color(data[i + 0], data[i + 1], data[i + 2]);
      this.pixels.push(color);
    }

    const volume = new ColorVolume().fromColors(this.pixels);
    this.volumes = [volume];
  }

  /**
   *
   * @param length 1 - 254
   * @param quality 1 - 8
   */
  getPalette(length: number, quality: number = 5): Color[] {
    Color.bit = quality;

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

    const avgColors = this.volumes.slice(0, length).map(v => v.mainColor());

    return this.getSimilarPalette(avgColors);
  }

  getSimilarPalette(avgColors: Color[]): Color[] {
    const colorNumber = avgColors.length;

    interface IMainColor {
      delta: number;
      color: Color;
    }

    const colors: IMainColor[] = new Array(colorNumber);

    for (let i = 0; i < colorNumber; i++) {
      colors[i] = {
        delta: 255 * 3,
        color: null
      };
    }

    this.pixels.forEach(pixel => {
      for (let i = 0; i < colorNumber; i++) {
        const mainColor = colors[i];
        const delta = Color.delta(pixel, avgColors[i]);

        if (delta < mainColor.delta) {
          mainColor.delta = delta;
          mainColor.color = pixel;
        }
      }
    });
    return colors.map(c => c.color);
  }
}

export interface IQuality {
  /**
   * 0.1 -1
   */
  image: number;
  /**
   * 0.1 -1
   */
  algorithm: number;
}

function getPalette(
  img: HTMLImageElement,
  length: number,
  quality: IQuality
): Color[] {
  const mmcq = new MMCQ(img, quality.image);
  // window['mmcq'] = mmcq;
  return mmcq.getPalette(length, quality.algorithm);
}

export default getPalette;
