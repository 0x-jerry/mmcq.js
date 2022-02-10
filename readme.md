# [MMCQ.JS][mmcq]

> `MMCQ (modified median cut quantization)`, the name is from Leptonica library (http://www.leptonica.com/).

提取颜色主色调 (Extract prominent colors from image)

仅 300 行不到的代码，且零依赖。(< 300 lines source code, zero dependency)

[例子 | See Demo](https://0x-jerry.github.io/mmcq.js)

## 安装 (Install)

```sh
pnpm i mmcq.js
# or
yarn add mmcq.js
# or
npm install mmcq.js
```

## 用法 (Usage)

```ts
import { mmcq } from 'mmcq.js'
const img = document.getElementById('img-id')

const data = getImageData(img, 1)

const colors = getPalette(data, {
  count: 8,
  algorithm: 8,
})

colors.forEach((color) => console.log(color))

function getImageData(
  image: HTMLImageElement,
  /**
   * 0.1 - 1
   **/
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
```

[mmcq]: https://www.wikiwand.com/en/Median_cut
