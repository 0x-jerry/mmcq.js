// const assert = require('assert')
const sharp = require('sharp')
const m = require('..')
const path = require('path')

async function main() {
  const imgData = await getImgData(path.join(__dirname, './1.jpg'))
  const len = 8
  console.log(imgData.info, imgData.data.at(0))

  const t = Date.now()

  const ptr = m.__pin(m.__newArrayBuffer(imgData.data))
  const r = m.getPalette(ptr, len, 8)
  m.__unpin(ptr)

  const arr = m.__getUint32Array(r)

  console.log(
    Array.from(arr)
      .slice(0, len)
      .map((n) => '#' + n.toString(16).padStart(6, '0')),
  )

  console.log('duration:', Date.now() - t)
}

main()

function getImgData(src) {
  return sharp(src).raw().ensureAlpha().toBuffer({ resolveWithObject: true })
}
