import MMCQ, { Color } from './src/core';

const elements = document.querySelectorAll('.img');

elements.forEach((element) => {
  element.addEventListener('click', () => {
    delWidthImage(element.children[0] as HTMLImageElement);
  });
});

const canvas: HTMLCanvasElement = document.createElement('canvas');
canvas.style.display = 'none';

document.body.append(canvas);
function delWidthImage(img: HTMLImageElement, quality: number = 1.5) {
  const ctx = canvas.getContext('2d');

  canvas.width = img.width * quality;
  canvas.height = img.height * quality;

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

  const pixels: Color[] = [];

  for (let i = 0; i < data.length; i += 4) {
    pixels.push(new Color(data[i * 4 + 0], data[i * 4 + 1], data[i * 4 + 2]));
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
