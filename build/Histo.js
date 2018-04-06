"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var sigbits = 5;
var rshift = 8 - sigbits;

// get reduced-space color index for a pixel
function getColorIndex(r, g, b) {
  return (r << 2 * sigbits) + (g << sigbits) + b;
}

// histo (1-d array, giving the number of pixels in
// each quantized region of color space), or null on error
function getHisto(pixels) {
  var histosize = 1 << 3 * sigbits;

  var histo = new Array(histosize),
      index = void 0,
      rval = void 0,
      gval = void 0,
      bval = void 0;

  pixels.forEach(function (pixel) {
    rval = pixel[0] >> rshift;
    gval = pixel[1] >> rshift;
    bval = pixel[2] >> rshift;
    index = getColorIndex(rval, gval, bval);
    histo[index] = (histo[index] || 0) + 1;
  });

  return histo;
}

exports.sigbits = sigbits;
exports.rshift = rshift;
exports.getHisto = getHisto;
exports.getColorIndex = getColorIndex;