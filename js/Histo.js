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


export {
  sigbits,
  rshift,
  getHisto,
  getColorIndex,
}
