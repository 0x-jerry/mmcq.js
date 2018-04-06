'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _PQueue = require('./PQueue');

var _PQueue2 = _interopRequireDefault(_PQueue);

var _CMap = require('./CMap');

var _CMap2 = _interopRequireDefault(_CMap);

var _VBox = require('./VBox');

var _VBox2 = _interopRequireDefault(_VBox);

var _tool = require('./tool');

var _Histo = require('./Histo');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MMCQ = function () {
  function MMCQ() {
    _classCallCheck(this, MMCQ);
  }

  _createClass(MMCQ, [{
    key: 'medianCutApply',
    value: function medianCutApply(histo, vbox) {
      var rw = vbox.r2 - vbox.r1 + 1,
          gw = vbox.g2 - vbox.g1 + 1,
          bw = vbox.b2 - vbox.b1 + 1,
          maxw = Math.max(rw, gw, bw);

      // only one pixel, no split
      if (vbox.count() == 1) {
        return [vbox.copy()];
      }

      /* Find the partial sum arrays along the selected axis. */
      var total = 0,
          partialsum = [],
          lookaheadsum = [],
          i = void 0,
          j = void 0,
          k = void 0,
          sum = void 0,
          index = void 0;

      if (maxw == rw) {
        for (i = vbox.r1; i <= vbox.r2; i++) {
          sum = 0;
          for (j = vbox.g1; j <= vbox.g2; j++) {
            for (k = vbox.b1; k <= vbox.b2; k++) {
              index = (0, _Histo.getColorIndex)(i, j, k);
              sum += histo[index] || 0;
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
              index = (0, _Histo.getColorIndex)(j, i, k);
              sum += histo[index] || 0;
            }
          }
          total += sum;
          partialsum[i] = total;
        }
      } else {
        /* maxw == bw */
        for (i = vbox.b1; i <= vbox.b2; i++) {
          sum = 0;
          for (j = vbox.r1; j <= vbox.r2; j++) {
            for (k = vbox.g1; k <= vbox.g2; k++) {
              index = (0, _Histo.getColorIndex)(j, k, i);
              sum += histo[index] || 0;
            }
          }
          total += sum;
          partialsum[i] = total;
        }
      }

      partialsum.forEach(function (d, i) {
        lookaheadsum[i] = total - d;
      });

      function doCut(color) {
        var dim1 = color + '1',
            dim2 = color + '2';

        var left = void 0,
            right = void 0,
            vbox1 = void 0,
            vbox2 = void 0,
            d2 = void 0,
            count2 = 0;

        for (i = vbox[dim1]; i <= vbox[dim2]; i++) {
          if (partialsum[i] > total / 2) {
            left = i - vbox[dim1];
            right = vbox[dim2] - i;

            d2 = left <= right ? Math.min(vbox[dim2] - 1, ~~(i + right / 2)) : Math.max(vbox[dim1], ~~(i - 1 - left / 2));

            // avoid 0-count boxes
            while (!partialsum[d2]) {
              d2++;
            }count2 = lookaheadsum[d2];
            while (!count2 && partialsum[d2 - 1]) {
              count2 = lookaheadsum[--d2];
            } // set dimensions
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
      return maxw == rw ? doCut('r') : maxw == gw ? doCut('g') : doCut('b');
    }
  }, {
    key: 'quantize',
    value: function quantize(pixels, maxcolors) {
      // short-circuit
      if (!pixels.length || maxcolors < 2 || maxcolors > 256) {
        //  console.log('wrong number of maxcolors');
        return false;
      }

      var histo = (0, _Histo.getHisto)(pixels);

      // get the beginning vbox from the colors
      var vbox = _VBox2.default.vboxFromPixels(pixels, histo);

      var pq = new _PQueue2.default(function (a, b) {
        return (0, _tool.naturalOrder)(a.count(), b.count());
      });
      pq.push(vbox);

      var fractByPopulations = 0.75;
      // first set of colors, sorted by population
      this.iter(histo, pq, fractByPopulations * maxcolors);

      // Re-sort by the product of pixel occupancy times the size in color space.
      var pq2 = new _PQueue2.default(function (a, b) {
        return (0, _tool.naturalOrder)(a.count() * a.volume(), b.count() * b.volume());
      });

      while (pq.size()) {
        pq2.push(pq.pop());
      }
      pq2.push(vbox);

      // next set - generate the median cuts using the (npix * vol) sorting.
      this.iter(histo, pq2, maxcolors - pq2.size());

      // calculate the actual colors
      var cmap = new _CMap2.default();
      while (pq2.size()) {
        cmap.push(pq2.pop());
      }

      return cmap;
    }
  }, {
    key: 'iter',
    value: function iter(histo, pQueue, target) {
      var maxIterations = 1000;

      var ncolors = 1,
          niters = 0;
      /**
       * @type {VBox}
       */
      var vbox = void 0;

      while (niters < maxIterations) {
        vbox = pQueue.pop();

        if (!vbox.count()) {
          pQueue.push(vbox);
          niters++;
          // if(pQueue.size()) continue;
          continue;
        }

        // do the cut
        var vboxes = this.medianCutApply(histo, vbox);
        var vbox1 = vboxes[0],
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

        if (ncolors >= target) return;

        if (niters++ > maxIterations) {
          //  console.log("infinite loop; perhaps too few pixels!");
          return;
        }
      }
    }
  }]);

  return MMCQ;
}();

module.exports = new MMCQ();