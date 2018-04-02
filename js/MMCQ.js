import PQueue from './PQueue'
import CMap from './CMap'
import { pv, getHisto, getColorIndex, vboxFromPixels } from './tool'

var MMCQ = (function() {
  const fractByPopulations = 0.75
  const maxIterations      = 1000

  function medianCutApply(histo, vbox) {
      if (!vbox.count()) return;

      var rw = vbox.r2 - vbox.r1 + 1,
          gw = vbox.g2 - vbox.g1 + 1,
          bw = vbox.b2 - vbox.b1 + 1,
          maxw = pv.max([rw, gw, bw]);
      // only one pixel, no split
      if (vbox.count() == 1) {
          return [vbox.copy()];
      }
      /* Find the partial sum arrays along the selected axis. */
      var total = 0,
          partialsum = [],
          lookaheadsum = [],
          i, j, k, sum, index;
      if (maxw == rw) {
          for (i = vbox.r1; i <= vbox.r2; i++) {
              sum = 0;
              for (j = vbox.g1; j <= vbox.g2; j++) {
                  for (k = vbox.b1; k <= vbox.b2; k++) {
                      index = getColorIndex(i,j,k);
                      sum += (histo[index] || 0);
                  }
              }
              total += sum;
              partialsum[i] = total;
          }
      }
      else if (maxw == gw) {
          for (i = vbox.g1; i <= vbox.g2; i++) {
              sum = 0;
              for (j = vbox.r1; j <= vbox.r2; j++) {
                  for (k = vbox.b1; k <= vbox.b2; k++) {
                      index = getColorIndex(j,i,k);
                      sum += (histo[index] || 0);
                  }
              }
              total += sum;
              partialsum[i] = total;
          }
      }
      else {  /* maxw == bw */
          for (i = vbox.b1; i <= vbox.b2; i++) {
              sum = 0;
              for (j = vbox.r1; j <= vbox.r2; j++) {
                  for (k = vbox.g1; k <= vbox.g2; k++) {
                      index = getColorIndex(j,k,i);
                      sum += (histo[index] || 0);
                  }
              }
              total += sum;
              partialsum[i] = total;
          }
      }
      partialsum.forEach(function(d,i) {
          lookaheadsum[i] = total-d;
      });
      function doCut(color) {
          var dim1 = color + '1',
              dim2 = color + '2',
              left, right, vbox1, vbox2, d2, count2=0;
          for (i = vbox[dim1]; i <= vbox[dim2]; i++) {
              if (partialsum[i] > total / 2) {
                  vbox1 = vbox.copy();
                  vbox2 = vbox.copy();
                  left = i - vbox[dim1];
                  right = vbox[dim2] - i;
                  if (left <= right)
                      d2 = Math.min(vbox[dim2] - 1, ~~(i + right / 2));
                  else d2 = Math.max(vbox[dim1], ~~(i - 1 - left / 2));
                  // avoid 0-count boxes
                  while (!partialsum[d2]) d2++;
                  count2 = lookaheadsum[d2];
                  while (!count2 && partialsum[d2-1]) count2 = lookaheadsum[--d2];
                  // set dimensions
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

  function quantize(pixels, maxcolors) {
      // short-circuit
      if (!pixels.length || maxcolors < 2 || maxcolors > 256) {
          //  console.log('wrong number of maxcolors');
          return false;
      }

      // XXX: check color content and convert to grayscale if insufficient

      var histo = getHisto(pixels);

      // check that we aren't below maxcolors already
      var nColors = 0;
      histo.forEach(function() { nColors++; });
      if (nColors <= maxcolors) {
          // XXX: generate the new colors from the histo and return
      }

      // get the beginning vbox from the colors
      var vbox = vboxFromPixels(pixels, histo),
          pq = new PQueue(function(a,b) { return pv.naturalOrder(a.count(), b.count()); });
      pq.push(vbox);

      // inner function to do the iteration
      function iter(lh, target) {
          var ncolors = 1,
              niters = 0,
              vbox;
          while (niters < maxIterations) {
              vbox = lh.pop();
              if (!vbox.count())  { /* just put it back */
                  lh.push(vbox);
                  niters++;
                  continue;
              }
              // do the cut
              var vboxes = medianCutApply(histo, vbox),
                  vbox1 = vboxes[0],
                  vbox2 = vboxes[1];

              if (!vbox1) {
                  //  console.log("vbox1 not defined; shouldn't happen!");
                  return;
              }
              lh.push(vbox1);
              if (vbox2) {  /* vbox2 can be null */
                  lh.push(vbox2);
                  ncolors++;
              }
              if (ncolors >= target) return;
              if (niters++ > maxIterations) {
                  //  console.log("infinite loop; perhaps too few pixels!");
                  return;
              }
          }
      }

      // first set of colors, sorted by population
      iter(pq, fractByPopulations * maxcolors);

      // Re-sort by the product of pixel occupancy times the size in color space.
      var pq2 = new PQueue(function(a,b) {
          return pv.naturalOrder(a.count()*a.volume(), b.count()*b.volume());
      });
      while (pq.size()) {
          pq2.push(pq.pop());
      }

      // next set - generate the median cuts using the (npix * vol) sorting.
      iter(pq2, maxcolors - pq2.size());

      // calculate the actual colors
      var cmap = new CMap();
      while (pq2.size()) {
          cmap.push(pq2.pop());
      }

      return cmap;
  }

  return {
      quantize: quantize
  };
});

module.exports = MMCQ()
