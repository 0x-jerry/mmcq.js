const canvas = document.createElement('canvas')
canvas.style.display = 'none'

document.body.append(canvas)

function getImageData(
  image: HTMLImageElement,
  imageQuality: number,
): Uint8ClampedArray {
  canvas.width = image.naturalWidth * imageQuality
  canvas.height = image.naturalHeight * imageQuality
  canvas.style.width = canvas.width + 'px'
  canvas.style.height = canvas.height + 'px'

  const ctx = canvas.getContext('2d')

  if (!ctx) {
    return [] as any
  }

  ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height)

  return data.data
}

export { getImageData }
