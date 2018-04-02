import $ from 'jquery'
import { MMCQSync } from './js/MMCQ'
import Color from './js/Color';

$(window).ready(() => {
  let canvas = document.createElement('canvas')
  canvas.style.display = 'none'
  let context = canvas.getContext('2d')

  document.body.appendChild(canvas);

  $('img').click((e) => {
    let pixelArray = getImageData(canvas, e.currentTarget, context);
    MMCQSync(pixelArray, 8).then(colors => {
      $('.color').each((index, ele) => {
        $(ele).css({
          backgroundColor: `rgb(${colors[index].toString()})`
        })
      })
    })
  })
})

function getImageData(canvas, image, context) {
  let width = canvas.width = image.width;
  let height = canvas.height = image.height;
  context.drawImage(image, 0, 0, width, height);
  let pixels = context.getImageData(0, 0, width, height).data;
  var pixelArray = [];
  for (var i = 0, offset, r, g, b, a; i < width * height; i = i + 1) {
    offset = i * 4;
    r = pixels[offset + 0];
    g = pixels[offset + 1];
    b = pixels[offset + 2];
    a = pixels[offset + 3];
    // If pixel is mostly opaque and not white
    if (a >= 125) {
      if (!(r > 250 && g > 250 && b > 250)) {
        pixelArray.push(new Color(r, g, b));
      }
    }
  }
  return pixelArray;
}
