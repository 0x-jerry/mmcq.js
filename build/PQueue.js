"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PQueue = function () {
  function PQueue(comparator) {
    _classCallCheck(this, PQueue);

    this.contents = [];
    this.sorted = false;
    this.comparator = comparator;
  }

  _createClass(PQueue, [{
    key: "sort",
    value: function sort() {
      this.contents.sort(this.comparator);
      this.sorted = true;
    }
  }, {
    key: "push",
    value: function push(o) {
      this.contents.push(o);
      this.sorted = false;
    }
  }, {
    key: "peek",
    value: function peek(index) {
      if (!this.sorted) this.sort();
      if (index === undefined) index = this.contents.length - 1;
      return this.contents[index];
    }
  }, {
    key: "pop",
    value: function pop() {
      if (!this.sorted) this.sort();
      return this.contents.pop();
    }
  }, {
    key: "size",
    value: function size() {
      return this.contents.length;
    }
  }, {
    key: "map",
    value: function map(f) {
      return this.contents.map(f);
    }
  }, {
    key: "debug",
    value: function debug() {
      if (!this.sorted) this.sort();
      return this.contents;
    }
  }]);

  return PQueue;
}();

exports.default = PQueue;


module.exports = PQueue;