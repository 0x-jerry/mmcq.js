# Color Palette

提取颜色主色调，仅支持浏览器

Extract image main color, only support browser

[例子 | See Demo](https://cwxyz007.github.io/img-color-palette/index.html)

## 安装 (Install)

```sh
yarn add img-color-palette

# or

npm install img-color-palette
```

## 用法 (Usage)

```js
import getPalette from 'img-color-palette';
const img = document.getElementById('img-id');

const colors = getPalette(img, 8, {
  image: 0.2,     // 0.1 - 1
  algorithm: 8,   // 1 - 8
});

colors.forEach(color => console.log(color));
```
