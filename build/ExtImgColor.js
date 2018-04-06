'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _CanvasImage = require('./CanvasImage');

var _CanvasImage2 = _interopRequireDefault(_CanvasImage);

var _MMCQ = require('./MMCQ');

var _MMCQ2 = _interopRequireDefault(_MMCQ);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ExtImgColor = function () {
  function ExtImgColor() {
    _classCallCheck(this, ExtImgColor);
  }

  _createClass(ExtImgColor, [{
    key: 'getColorAsync',
    value: function getColorAsync(sourceImage, quality) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        var color = _this.getColor(sourceImage, quality);

        if (color) resolve(color);else reject(color);
      });
    }
  }, {
    key: 'getPaletteAsync',
    value: function getPaletteAsync(sourceImage, colorCount, quality) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        var palette = _this2.getPalette(sourceImage, colorCount, quality);

        if (palette) resolve(palette);else reject(palette);
      });
    }
  }, {
    key: 'getColor',
    value: function getColor(sourceImage, quality) {
      var palette = this.getPalette(sourceImage, 5, quality);
      return palette[0];
    }
  }, {
    key: 'getPalette',
    value: function getPalette(sourceImage, colorCount, quality) {
      if (typeof colorCount !== 'number' || colorCount < 2 || colorCount > 256) {
        colorCount = 10;
      }
      if (typeof quality !== 'number' || quality < 1) {
        quality = 10;
      }

      // Create custom CanvasImage object
      var image = new _CanvasImage2.default(sourceImage);
      var imageData = image.getImageData();
      var pixels = imageData.data;
      var pixelCount = image.getPixelCount();
      // Store the RGB values in an array format suitable for quantize function
      var pixelArray = [];
      for (var i = 0, offset, r, g, b, a; i < pixelCount; i = i + quality) {
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

      // Send array to quantize function which clusters values
      // using median cut algorithm
      var cmap = _MMCQ2.default.quantize(pixelArray, colorCount);
      var palette = cmap ? cmap.palette() : null;
      // Clean up
      image.removeCanvas();
      return palette;
    }
  }]);

  return ExtImgColor;
}();

exports.default = ExtImgColor;