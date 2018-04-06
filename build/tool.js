"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
function naturalOrder(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

exports.naturalOrder = naturalOrder;