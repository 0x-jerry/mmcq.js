let $ = require('jquery')

$(window).ready(() => {
  let canvas = document.createElement('canvas')
  let context = canvas.getContext('2d')

  document.body.appendChild(canvas);

  $('img').click((e) => {
    let pixelArray = getImageData(canvas, e.currentTarget, context);
    let colors = MMCQ(pixelArray)

    $('.color').each((index, ele) => {
      $(ele).css({
        backgroundColor: `rgb(${colors[index].join(',')})`
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
        pixelArray.push([r, g, b]);
      }
    }
  }
  return pixelArray;
}

/**
 *
 * @param {Array.<Array.<number>>} pixels
 * @param {number} maxNumber
 */
function MMCQ(pixels, maxNumber = 8) {
  function sortWithMaxRow(colors) {
    let maxColor = [0, 0, 0];
    let minColor = [256, 256, 256];
    let deltaColor = [0, 0, 0];
    colors.map(pixel => {
      for (let i = 0; i < 3; i++) {
        maxColor[i] = Math.max(maxColor[i], pixel[i]);
        minColor[i] = Math.min(minColor[i], pixel[i]);
      }
    });
    for (let i = 0; i < 3; i++) {
      deltaColor[i] = maxColor[i] - minColor[i];
    }
    // sort
    let sortRow = deltaColor[0] > deltaColor[1] ? 0 : 1;
    sortRow = deltaColor[sortRow] > deltaColor[2] ? sortRow : 2;
    colors.sort((a, b) => a[sortRow] > b[sortRow]);
  }

  let regions = [pixels]
  while (regions.length < maxNumber) {
    let newRegion = []
    regions.map(region => {
      sortWithMaxRow(region)
      let middle = region.length / 2
      newRegion.push(region.slice(0, middle))
      newRegion.push(region.slice(middle, region.length))
    })
    regions = newRegion
  }

  let palette = regions.map( region => {
    let color = [0, 0, 0]
    region.map( pixel => {
      for(let i = 0; i < 3; i ++){
        color[i] += pixel[i]
      }
    })

    for(let i = 0; i < 3; i ++) {
      color[i] = Math.round(color[i] / region.length)
    }

    return color
  })

  return palette
}
