// const assert = require('assert')
const sharp = require('sharp')
const m = require('..')
const path = require('path')

const len = 2

async function main() {
  const imgData = await getImgData(path.join(__dirname, './1.jpg'))
  console.log(imgData.info)

  const ptr = m.__pin(m.__newArrayBuffer(imgData.data))
  const r = m.getPalette(ptr, len, 1)

  m.__unpin(ptr)

  const arr = m.__getUint32Array(r)

  console.log(
    Array.from(arr)
      .slice(0, len)
      .map((n) => n.toString(16)),
  )
}

main()

function getImgData(src) {
  return sharp(src).raw().ensureAlpha().toBuffer({ resolveWithObject: true })
}
