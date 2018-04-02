const sigbits = 5
const rshift = 8 - sigbits

function getColorIndex(r, g, b) {
    return (r << (2 * sigbits)) + (g << sigbits) + b;
}

// 3d color space box
function VBox(r1, r2, g1, g2, b1, b2, histo) {
  var vbox = this;
  vbox.r1 = r1;
  vbox.r2 = r2;
  vbox.g1 = g1;
  vbox.g2 = g2;
  vbox.b1 = b1;
  vbox.b2 = b2;
  vbox.histo = histo;
}

VBox.prototype = {
  volume: function (force) {
    var vbox = this;
    if (!vbox._volume || force) {
      vbox._volume = ((vbox.r2 - vbox.r1 + 1) * (vbox.g2 - vbox.g1 + 1) * (vbox.b2 - vbox.b1 + 1));
    }
    return vbox._volume;
  },
  count: function (force) {
    var vbox = this,
      histo = vbox.histo;
    if (!vbox._count_set || force) {
      var npix = 0,
        index, i, j, k;
      for (i = vbox.r1; i <= vbox.r2; i++) {
        for (j = vbox.g1; j <= vbox.g2; j++) {
          for (k = vbox.b1; k <= vbox.b2; k++) {
            index = getColorIndex(i, j, k);
            npix += (histo[index] || 0);
          }
        }
      }
      vbox._count = npix;
      vbox._count_set = true;
    }
    return vbox._count;
  },
  copy: function () {
    var vbox = this;
    return new VBox(vbox.r1, vbox.r2, vbox.g1, vbox.g2, vbox.b1, vbox.b2, vbox.histo);
  },
  avg: function (force) {
    var vbox = this,
      histo = vbox.histo;
    if (!vbox._avg || force) {
      var ntot = 0,
        mult = 1 << (8 - sigbits),
        rsum = 0,
        gsum = 0,
        bsum = 0,
        hval,
        i, j, k, histoindex;
      for (i = vbox.r1; i <= vbox.r2; i++) {
        for (j = vbox.g1; j <= vbox.g2; j++) {
          for (k = vbox.b1; k <= vbox.b2; k++) {
            histoindex = getColorIndex(i, j, k);
            hval = histo[histoindex] || 0;
            ntot += hval;
            rsum += (hval * (i + 0.5) * mult);
            gsum += (hval * (j + 0.5) * mult);
            bsum += (hval * (k + 0.5) * mult);
          }
        }
      }
      if (ntot) {
        vbox._avg = [~~(rsum / ntot), ~~(gsum / ntot), ~~(bsum / ntot)];
      } else {
        //  console.log('empty box');
        vbox._avg = [~~(mult * (vbox.r1 + vbox.r2 + 1) / 2), ~~(mult * (vbox.g1 + vbox.g2 + 1) / 2), ~~(mult * (vbox.b1 + vbox.b2 + 1) / 2)];
      }
    }
    return vbox._avg;
  },
  contains: function (pixel) {
    var vbox = this,
      rval = pixel[0] >> rshift,
      gval = pixel[1] >> rshift,
      bval = pixel[2] >> rshift;
    return (rval >= vbox.r1 && rval <= vbox.r2 &&
      gval >= vbox.g1 && gval <= vbox.g2 &&
      bval >= vbox.b1 && bval <= vbox.b2);
  }
};


module.exports = VBox
