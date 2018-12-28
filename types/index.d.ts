export interface IQuality {
  /**
   * 0.1 - 1, The bigger the better
   */
  image: number;
  /**
   * 1 - 8, The bigger the better
   */
  algorithm: number;
}

export interface Color {
  r: number;
  g: number;
  b: number;

  readonly hex: string;

  readonly rgb: string;
}

declare function getPalette(
  img: HTMLImageElement,
  length: number,
  quality: IQuality,
): Color[];

export default getPalette;
