'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _PQueue = require('./PQueue');

var _PQueue2 = _interopRequireDefault(_PQueue);

var _tool = require('./tool');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CMap = function () {
  function CMap() {
    _classCallCheck(this, CMap);

    this.vboxes = new _PQueue2.default(function (a, b) {
      return (0, _tool.naturalOrder)(a.vbox.count() * a.vbox.volume(), b.vbox.count() * b.vbox.volume());
    });
  }

  _createClass(CMap, [{
    key: 'push',
    value: function push(vbox) {
      this.vboxes.push({
        vbox: vbox,
        color: vbox.avg()
      });
    }
  }, {
    key: 'palette',
    value: function palette() {
      return this.vboxes.map(function (vb) {
        return vb.color;
      });
    }
  }, {
    key: 'size',
    value: function size() {
      return this.vboxes.size();
    }
  }, {
    key: 'map',
    value: function map(color) {
      for (var i = 0, max = this.size(); i < max; i++) {
        if (this.vboxes.peek(i).vbox.contains(color)) return this.vboxes.peek(i).color;
      }

      return this.nearest(color);
    }
  }, {
    key: 'nearest',
    value: function nearest(color) {
      var vboxes = this.vboxes;
      var min = Math.pow(255, 3);
      var d2 = Math.pow(255, 3);
      var pColor = null;

      for (var i = 0, max = this.size(); i < max; i++) {
        d2 = Math.sqrt(Math.pow(color[0] - vboxes.peek(i).color[0], 2) + Math.pow(color[1] - vboxes.peek(i).color[1], 2) + Math.pow(color[2] - vboxes.peek(i).color[2], 2));

        if (d2 < min) {
          min = d2;
          pColor = vboxes.peek(i).color;
        }
      }

      return pColor;
    }
  }]);

  return CMap;
}();

module.exports = CMap;