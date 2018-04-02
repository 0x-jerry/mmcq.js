import PQueue from './PQueue'
import CMap from './CMap'
import VBox from './VBox'
import {
  pv
} from './tool'

const sigbits = 5
const rshift = 8 - sigbits
const fractByPopulations = 0.75
const maxIterations = 1000

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
  var rmin = 1000000,
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

class MMCQ {

  medianCutApply(histo, vbox) {
    const rw = vbox.r2 - vbox.r1 + 1,
      gw = vbox.g2 - vbox.g1 + 1,
      bw = vbox.b2 - vbox.b1 + 1,
      maxw = pv.max([rw, gw, bw]);

    // only one pixel, no split
    if (vbox.count() == 1) {
      return [vbox.copy()];
    }

    /* Find the partial sum arrays along the selected axis. */
    let total = 0,
      partialsum = [],
      lookaheadsum = [],
      i, j, k, sum, index;

    if (maxw == rw) {
      for (i = vbox.r1; i <= vbox.r2; i++) {
        sum = 0;
        for (j = vbox.g1; j <= vbox.g2; j++) {
          for (k = vbox.b1; k <= vbox.b2; k++) {
            index = getColorIndex(i, j, k);
            sum += (histo[index] || 0);
          }
        }
        total += sum;
        partialsum[i] = total;
      }
    } else if (maxw == gw) {
      for (i = vbox.g1; i <= vbox.g2; i++) {
        sum = 0;
        for (j = vbox.r1; j <= vbox.r2; j++) {
          for (k = vbox.b1; k <= vbox.b2; k++) {
            index = getColorIndex(j, i, k);
            sum += (histo[index] || 0);
          }
        }
        total += sum;
        partialsum[i] = total;
      }
    } else { /* maxw == bw */
      for (i = vbox.b1; i <= vbox.b2; i++) {
        sum = 0;
        for (j = vbox.r1; j <= vbox.r2; j++) {
          for (k = vbox.g1; k <= vbox.g2; k++) {
            index = getColorIndex(j, k, i);
            sum += (histo[index] || 0);
          }
        }
        total += sum;
        partialsum[i] = total;
      }
    }

    partialsum.forEach((d, i) => {
      lookaheadsum[i] = total - d;
    });

    function doCut(color) {
      const dim1 = color + '1',
        dim2 = color + '2';

      let left, right, vbox1, vbox2, d2, count2 = 0;

      for (i = vbox[dim1]; i <= vbox[dim2]; i++) {
        if (partialsum[i] > total / 2) {
          left = i - vbox[dim1];
          right = vbox[dim2] - i;

          d2 = left <= right ? Math.min(vbox[dim2] - 1, ~~(i + right / 2)) : Math.max(vbox[dim1], ~~(i - 1 - left / 2))

          // avoid 0-count boxes
          while (!partialsum[d2]) d2++;
          count2 = lookaheadsum[d2];
          while (!count2 && partialsum[d2 - 1]) count2 = lookaheadsum[--d2];

          // set dimensions
          vbox1 = vbox.copy();
          vbox2 = vbox.copy();

          vbox1[dim2] = d2;
          vbox2[dim1] = vbox1[dim2] + 1;

          //  console.log('vbox counts:', vbox.count(), vbox1.count(), vbox2.count());
          return [vbox1, vbox2];
        }
      }
    }

    // determine the cut planes
    return maxw == rw ? doCut('r') :
      maxw == gw ? doCut('g') :
      doCut('b');
  }

  quantize(pixels, maxcolors) {
    // short-circuit
    if (!pixels.length || maxcolors < 2 || maxcolors > 256) {
      //  console.log('wrong number of maxcolors');
      return false;
    }

    const histo = getHisto(pixels);

    // get the beginning vbox from the colors
    const vbox = vboxFromPixels(pixels, histo)
    // inner function to do the iteration
    const iter = this.iter(histo)

    const pq = new PQueue((a, b) => pv.naturalOrder(a.count(), b.count()));
    pq.push(vbox);

    // first set of colors, sorted by population
    iter(pq, fractByPopulations * maxcolors);

    // Re-sort by the product of pixel occupancy times the size in color space.
    const pq2 = new PQueue((a, b) => pv.naturalOrder(a.count() * a.volume(), b.count() * b.volume()))

    while (pq.size()) {
      pq2.push(pq.pop())
    }
    // pq2.push(vbox)

    // next set - generate the median cuts using the (npix * vol) sorting.
    iter(pq2, maxcolors - pq2.size());

    // calculate the actual colors
    const cmap = new CMap()
    while (pq2.size()) {
      cmap.push(pq2.pop())
    }

    return cmap;
  }

  iter(histo) {
    return (pQueue, target) => {
      let ncolors = 1, niters = 0
      /**
       * @type {VBox}
       */
      let vbox;

      while (niters < maxIterations) {
        vbox = pQueue.pop();

        if (!vbox.count()) {
          pQueue.push(vbox);
          niters++;
          // if(pQueue.size()) continue;
          continue
        }

        // do the cut
        const vboxes = this.medianCutApply(histo, vbox)
        const vbox1 = vboxes[0],
          vbox2 = vboxes[1];

        if (!vbox1) {
          //  console.log("vbox1 not defined; shouldn't happen!");
          return;
        }

        pQueue.push(vbox1);

        if (vbox2) {
          pQueue.push(vbox2);
          ncolors++;
        }

        if (ncolors >= target)
          return;

        if (niters++ > maxIterations) {
          //  console.log("infinite loop; perhaps too few pixels!");
          return;
        }
      }
    };
  }
}

module.exports = new MMCQ()
