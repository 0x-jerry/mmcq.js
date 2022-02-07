import init, { mmcq } from '../../assembly-rust/pkg/img_color_palette'

const p = init()

export async function getImagePalette(
  imgData: Uint8ClampedArray,
  len = 8,
  algorithm = 8,
): Promise<number[]> {
  await p

  const res = await mmcq(imgData, len, algorithm)

  return res
}
