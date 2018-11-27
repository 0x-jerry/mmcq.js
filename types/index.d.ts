import { Color, IQuality } from '../src/core';

declare function getPalette(
  img: HTMLImageElement,
  length: number,
  quality: IQuality,
): Color[];

export default getPalette;
