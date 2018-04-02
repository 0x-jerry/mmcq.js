import VBox from './VBox'

const sigbits            = 5
const rshift             = 8 - sigbits

// fill out a couple protovis dependencies
/*!
* Block below copied from Protovis: http://mbostock.github.com/protovis/
* Copyright 2010 Stanford Visualization Group
* Licensed under the BSD License: http://www.opensource.org/licenses/bsd-license.php
* @license
*/
let pv = {
    map: function(array, f) {
      var o = {};
      return f ? array.map(function(d, i) { o.index = i; return f.call(o, d); }) : array.slice();
    },
    naturalOrder: function(a, b) {
        return (a < b) ? -1 : ((a > b) ? 1 : 0);
    },
    sum: function(array, f) {
      var o = {};
      return array.reduce(f ? function(p, d, i) { o.index = i; return p + f.call(o, d); } : function(p, d) { return p + d; }, 0);
    },
    max: function(array, f) {
      return Math.max.apply(null, f ? pv.map(array, f) : array);
    }
};
// get reduced-space color index for a pixel
function getColorIndex(r, g, b) {
    return (r << (2 * sigbits)) + (g << sigbits) + b;
}

// histo (1-d array, giving the number of pixels in
// each quantized region of color space), or null on error
function getHisto(pixels) {
    var histosize = 1 << (3 * sigbits),
        histo = new Array(histosize),
        index, rval, gval, bval;
    pixels.forEach(function(pixel) {
        rval = pixel[0] >> rshift;
        gval = pixel[1] >> rshift;
        bval = pixel[2] >> rshift;
        index = getColorIndex(rval, gval, bval);
        histo[index] = (histo[index] || 0) + 1;
    });
    return histo;
}

function vboxFromPixels(pixels, histo) {
    var rmin=1000000, rmax=0,
        gmin=1000000, gmax=0,
        bmin=1000000, bmax=0,
        rval, gval, bval;
    // find min/max
    pixels.forEach(function(pixel) {
        rval = pixel[0] >> rshift;
        gval = pixel[1] >> rshift;
        bval = pixel[2] >> rshift;
        if (rval < rmin) rmin = rval;
        else if (rval > rmax) rmax = rval;
        if (gval < gmin) gmin = gval;
        else if (gval > gmax) gmax = gval;
        if (bval < bmin) bmin = bval;
        else if (bval > bmax)  bmax = bval;
    });
    return new VBox(rmin, rmax, gmin, gmax, bmin, bmax, histo);
}

export {
  pv,
  getColorIndex,
  getHisto,
  vboxFromPixels,
}
