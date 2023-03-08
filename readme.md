# [MMCQ.JS][mmcq]

> `MMCQ (modified median cut quantization)`, the name is from Leptonica library (http://www.leptonica.com/).

提取颜色主色调，支持 WebAssembly (Extract prominent colors from image, support WebAssembly)

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

或者(Or)

```html
<script src="https://cdn.jsdelivr.net/npm/mmcq.js@latest/dist/index.global.js"></script>
```

## 用法 (Usage)

```ts
import { mmcq } from 'mmcq.js'

main()

async function main() {
  const img = document.getElementById('img-id') as HTMLImageElement
  const data = getImageData(img, 1)

  const colors = await mmcq(data, {
    count: 8,
    algorithm: 8,
    useWebAssembly: true,
    // You maybe need to copy `/node_modules/mmcq.js/dist/mmcq_bg.wasm` to somewhere.
    wasmPath: 'path/to/mmcq_bg.wasm',
  })

  colors.forEach((color) => console.log(color.rgb))
}

// --------- utils
function getImageData(
  image: HTMLImageElement,
  /**
   * 0.1 - 1
   **/
  imageQuality: number,
): Uint8ClampedArray {
  const sharedCanvasId = 'xxxxxxx'

  const canvas = (document.getElementById(sharedCanvasId) ||
    document.createElement('canvas')) as HTMLCanvasElement

  canvas.id = sharedCanvasId
  canvas.style.display = 'none'

  document.body.append(canvas)

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

## Development

install wasm-pack: https://rustwasm.github.io/wasm-pack/installer/

1. build wasm

```sh
pnpm run wasm
```

2. start dev server

```sh
pnpm i

pnpm run dev
# or
pnpm run dev:wasm
```

[mmcq]: https://www.wikiwand.com/en/Median_cut

## Contribute

All kinds of contributions are welcome!
