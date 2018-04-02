import VBox from './VBox'

function naturalOrder(a, b) {
  return (a < b) ? -1 : ((a > b) ? 1 : 0)
}

const sigbits = 5
const rshift = 8 - sigbits

// get reduced-space color index for a pixel
function getColorIndex(r, g, b) {
  return (r << (2 * sigbits)) + (g << sigbits) + b;
}

// histo (1-d array, giving the number of pixels in
// each quantized region of color space), or null on error
function getHisto(pixels) {
  const histosize = 1 << (3 * sigbits)

  let histo = new Array(histosize),
    index, rval, gval, bval;

  pixels.forEach(pixel => {
    rval = pixel[0] >> rshift;
    gval = pixel[1] >> rshift;
    bval = pixel[2] >> rshift;
    index = getColorIndex(rval, gval, bval);
    histo[index] = (histo[index] || 0) + 1;
  })

  return histo
}

function vboxFromPixels(pixels, histo) {
  let rmin = 1000000,
      rmax = 0,
      gmin = 1000000,
      gmax = 0,
      bmin = 1000000,
      bmax = 0,
      rval, gval, bval;

  // find min/max
  pixels.forEach(pixel => {
    rval = pixel[0] >> rshift;
    gval = pixel[1] >> rshift;
    bval = pixel[2] >> rshift;

    rmin = rval < rmin ? rval : rmin
    gmin = gval < gmin ? gval : gmin
    bmin = bval < bmin ? bval : bmin

    rmax = rval > rmax ? rval : rmax
    gmax = gval > gmax ? gval : gmax
    bmax = bval > bmax ? bval : bmax
  })

  return new VBox(rmin, rmax, gmin, gmax, bmin, bmax, histo)
}


export {
  getHisto,
  naturalOrder,
  getColorIndex,
  vboxFromPixels,
}
