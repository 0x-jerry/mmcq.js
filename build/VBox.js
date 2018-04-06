'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Histo = require('./Histo');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var VBox = function () {
  _createClass(VBox, null, [{
    key: 'vboxFromPixels',
    value: function vboxFromPixels(pixels, histo) {
      var rmin = 1000000,
          rmax = 0,
          gmin = 1000000,
          gmax = 0,
          bmin = 1000000,
          bmax = 0,
          rval = void 0,
          gval = void 0,
          bval = void 0;

      // find min/max
      pixels.forEach(function (pixel) {
        rval = pixel[0] >> _Histo.rshift;
        gval = pixel[1] >> _Histo.rshift;
        bval = pixel[2] >> _Histo.rshift;

        rmin = rval < rmin ? rval : rmin;
        gmin = gval < gmin ? gval : gmin;
        bmin = bval < bmin ? bval : bmin;

        rmax = rval > rmax ? rval : rmax;
        gmax = gval > gmax ? gval : gmax;
        bmax = bval > bmax ? bval : bmax;
      });

      return new VBox(rmin, rmax, gmin, gmax, bmin, bmax, histo);
    }
  }]);

  function VBox(r1, r2, g1, g2, b1, b2, histo) {
    _classCallCheck(this, VBox);

    this.r1 = r1;
    this.r2 = r2;
    this.g1 = g1;
    this.g2 = g2;
    this.b1 = b1;
    this.b2 = b2;
    this.histo = histo;
  }

  _createClass(VBox, [{
    key: 'volume',
    value: function volume(force) {
      if (!this._volume || force) {
        this._volume = (this.r2 - this.r1 + 1) * (this.g2 - this.g1 + 1) * (this.b2 - this.b1 + 1);
      }
      return this._volume;
    }
  }, {
    key: 'count',
    value: function count(force) {
      var index = 0,
          npix = 0;

      if (!this._count_set || force) {
        for (var i = this.r1; i <= this.r2; i++) {
          for (var j = this.g1; j <= this.g2; j++) {
            for (var k = this.b1; k <= this.b2; k++) {
              index = (0, _Histo.getColorIndex)(i, j, k);
              npix += this.histo[index] || 0;
            }
          }
        }
        this._count = npix;
        this._count_set = true;
      }

      return this._count;
    }
  }, {
    key: 'copy',
    value: function copy() {
      return new VBox(this.r1, this.r2, this.g1, this.g2, this.b1, this.b2, this.histo);
    }
  }, {
    key: 'avg',
    value: function avg(force) {
      if (!this._avg || force) {
        var mult = 1 << 8 - _Histo.sigbits;

        var ntot = 0,
            hval = 0,
            rsum = 0,
            gsum = 0,
            bsum = 0,
            histoindex = void 0;

        for (var i = this.r1; i <= this.r2; i++) {
          for (var j = this.g1; j <= this.g2; j++) {
            for (var k = this.b1; k <= this.b2; k++) {
              histoindex = (0, _Histo.getColorIndex)(i, j, k);
              hval = this.histo[histoindex] || 0;
              ntot += hval;
              rsum += hval * (i + 0.5) * mult;
              gsum += hval * (j + 0.5) * mult;
              bsum += hval * (k + 0.5) * mult;
            }
          }
        }

        if (ntot) {
          this._avg = [~~(rsum / ntot), ~~(gsum / ntot), ~~(bsum / ntot)];
        } else {
          // console.log('empty box')

          this._avg = [~~(mult * (this.r1 + this.r2 + 1) / 2), ~~(mult * (this.g1 + this.g2 + 1) / 2), ~~(mult * (this.b1 + this.b2 + 1) / 2)];
        }
      }

      return this._avg;
    }
  }, {
    key: 'contains',
    value: function contains(pixel) {
      var rval = pixel[0] >> _Histo.rshift;
      var gval = pixel[1] >> _Histo.rshift;
      var bval = pixel[2] >> _Histo.rshift;

      return rval >= this.r1 && rval <= this.r2 && gval >= this.g1 && gval <= this.g2 && bval >= this.b1 && bval <= this.b2;
    }
  }]);

  return VBox;
}();

exports.default = VBox;