// The entry file of your WebAssembly module.
// import { Color } from './Color'
// import { MMCQ } from './core'

// export function getPalette(
//   imgData: Uint8ClampedArray,
//   length: u8,
//   quality: u8,
// ): Color[] {
//   const mmcq = new MMCQ(imgData)
//   return mmcq.getPalette(length, quality)
// }

export { Color, ColorDimension } from './Color'
export { ColorVolume } from './ColorVolume'
