/*!
 * Block below copied from Protovis: http://mbostock.github.com/protovis/
 * Copyright 2010 Stanford Visualization Group
 * Licensed under the BSD License: http://www.opensource.org/licenses/bsd-license.php
 * @license
 */

const pv = {
  map(array, f) {
    let o = {}
    return f ? array.map((d, i) => {
      o.index = i
      return f.call(o, d)
    }) : array.slice()
  },
  naturalOrder(a, b) {
    return (a < b) ? -1 : ((a > b) ? 1 : 0)
  },
  sum(array, f) {
    let o = {}
    return array.reduce(f ? (p, d, i) => {
        o.index = i
        return p + f.call(o, d)
      } : (p, d) => {
        return p + d
      }, 0)
  },
  max(array, f) {
    return Math.max.apply(null, f ? pv.map(array, f) : array)
  }
}

export {
  pv,
}
