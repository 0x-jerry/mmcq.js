import MMCQ, { Color } from './src/core';

let AlgorithmQuality = 5;
let ImageQuality = 0.3;

const elements = document.querySelectorAll('.img');
elements.forEach((element) => {
  element.addEventListener('click', () => {
    const start = new Date().getTime();
    Color.bit = AlgorithmQuality;
    delWidthImage(element.children[0] as HTMLImageElement, ImageQuality);
    const end = new Date().getTime();
    document.getElementById('time').innerText = end - start + ' ms';
  });
});

document.getElementById('algorithm-quality').addEventListener('change', (e) => {
  const Q = (e.target as HTMLInputElement).value;
  AlgorithmQuality = parseInt(Q);
  document.getElementById('algorithm-value').innerText = Q;
});

document.getElementById('image-quality').addEventListener('change', (e) => {
  const Q = (e.target as HTMLInputElement).value;
  ImageQuality = parseFloat(Q);

  document.getElementById('image-value').innerText = Q;
});

const canvas: HTMLCanvasElement = document.createElement('canvas');
canvas.style.display = 'none';

document.body.append(canvas);

function delWidthImage(img: HTMLImageElement, quality: number = 1) {
  const ctx = canvas.getContext('2d');

  canvas.width = img.naturalWidth * quality;
  canvas.height = img.naturalHeight * quality;

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

  const pixels: Color[] = [];

  for (let i = 0, max = data.length; i < max; i += 4) {
    const color = new Color(data[i + 0], data[i + 1], data[i + 2]);
    pixels.push(color);
  }

  const mmcq = new MMCQ(pixels);
  window['mmcq'] = mmcq;

  const colors = mmcq.getPalette(8);

  document.querySelectorAll('.js-color').forEach((el, i) => {
    if (colors[i]) (el as HTMLDivElement).style.backgroundColor = colors[i].rgb;
  });
}
