import MMCQ, { Color } from './src/core';

const elements = document.querySelectorAll('.img');

elements.forEach((element) => {
  element.addEventListener('click', () => {
    delWidthImage(element.children[0] as HTMLImageElement);
  });
});

const canvas: HTMLCanvasElement = document.createElement('canvas');
// canvas.style.display = 'none';

document.body.append(canvas);
function delWidthImage(img: HTMLImageElement, quality: number = 1) {
  const ctx = canvas.getContext('2d');

  canvas.width = img.width * quality;
  canvas.height = img.height * quality;

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

  const pixels: Color[] = [];

  for (let i = 0, max = data.length; i < max; i += 4) {
    const color = new Color(data[i + 0], data[i + 1], data[i + 2]);
    pixels.push(color);
  }

  const mmcq = new MMCQ(pixels);
  window['mmcq'] = mmcq;

  console.time('mmcq');
  const colors = mmcq.getPalette(8);
  console.timeEnd('mmcq');

  document.querySelectorAll('.js-color').forEach((el, i) => {
    if (colors[i]) (el as HTMLDivElement).style.backgroundColor = colors[i].rgb;
  });
}
