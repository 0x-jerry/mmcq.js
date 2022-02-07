// The entry file of your WebAssembly module.
import { Color } from './Color'
import { ColorVolume } from './ColorVolume'
import { MMCQ } from './core'

declare function log(arg0: string): void

export function getPalette(
  buffer: ArrayBuffer,
  length: u8,
  quality: u8,
): u32[] {
  const imgData = Uint8ClampedArray.wrap(buffer)

  log('buffer size: ' + imgData.length.toString())

  const mmcq = new MMCQ(imgData)
  const colors: Color[] = mmcq.getPalette(length, quality)

  // const colors: Color[] = [new Color(0xff, 0xff, 0xff)]

  const r = new Array<u32>(colors.length)

  for (let idx = 0; idx < colors.length; idx++) {
    const color = colors[idx]
    r[idx] = color.hex
  }

  return r
}
