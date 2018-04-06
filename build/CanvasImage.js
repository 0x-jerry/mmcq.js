'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CanvasImage = function () {
  function CanvasImage(image) {
    _classCallCheck(this, CanvasImage);

    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');

    document.body.appendChild(this.canvas);
    this.width = this.canvas.width = image.naturalWidth;
    this.height = this.canvas.height = image.naturalHeight;

    this.context.drawImage(image, 0, 0, this.width, this.height);
  }

  _createClass(CanvasImage, [{
    key: 'clear',
    value: function clear() {
      this.context.clearRect(0, 0, this.width, this.height);
    }
  }, {
    key: 'update',
    value: function update(imageData) {
      this.context.putImageData(imageData, 0, 0);
    }
  }, {
    key: 'getPixelCount',
    value: function getPixelCount() {
      return this.width * this.height;
    }
  }, {
    key: 'getImageData',
    value: function getImageData() {
      return this.context.getImageData(0, 0, this.width, this.height);
    }
  }, {
    key: 'removeCanvas',
    value: function removeCanvas() {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }]);

  return CanvasImage;
}();

exports.default = CanvasImage;