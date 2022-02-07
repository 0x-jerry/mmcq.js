# [MMCQ.JS][mmcq]

提取颜色主色调，仅支持浏览器 (Extract image main color, only support browser)

仅 300 行不到的代码，且零依赖。(< 300 lines source code, zero dependency)

[例子 | See Demo](https://cwxyz007.github.io/img-color-palette/index.html)

## 安装 (Install)

```sh
yarn add img-color-palette

# or

npm install img-color-palette
```

## 用法 (Usage)

```js
import getPalette from 'img-color-palette'
const img = document.getElementById('img-id')

const colors = getPalette(img, 8, {
  image: 0.2, // 0.1 - 1
  algorithm: 8, // 1 - 8
})

colors.forEach((color) => console.log(color))
```

## 说明 (Explain)

```ts
function getPalette(
  img: HTMLImageElement, // 需要解析的图片
  length: number, // 返回的颜色的个数
  quality: {
    image: number // 图片的质量 0.1 最小， 1 最大
    algorithm: number // 算法精度 1 最差， 8 最好，整数
  },
): Color[]
```

[mmcq]: https://www.wikiwand.com/en/Median_cut
