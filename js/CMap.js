import PQueue from './PQueue'
import { pv } from './tool'

function CMap() {
  this.vboxes = new PQueue(function (a, b) {
    return pv.naturalOrder(
      a.vbox.count() * a.vbox.volume(),
      b.vbox.count() * b.vbox.volume()
    );
  });
}
CMap.prototype = {
  push: function (vbox) {
    this.vboxes.push({
      vbox: vbox,
      color: vbox.avg()
    });
  },
  palette: function () {
    return this.vboxes.map(function (vb) {
      return vb.color;
    });
  },
  size: function () {
    return this.vboxes.size();
  },
  map: function (color) {
    var vboxes = this.vboxes;
    for (var i = 0; i < vboxes.size(); i++) {
      if (vboxes.peek(i).vbox.contains(color)) {
        return vboxes.peek(i).color;
      }
    }
    return this.nearest(color);
  },
  nearest: function (color) {
    var vboxes = this.vboxes,
      d1, d2, pColor;
    for (var i = 0; i < vboxes.size(); i++) {
      d2 = Math.sqrt(
        Math.pow(color[0] - vboxes.peek(i).color[0], 2) +
        Math.pow(color[1] - vboxes.peek(i).color[1], 2) +
        Math.pow(color[2] - vboxes.peek(i).color[2], 2)
      );
      if (d2 < d1 || d1 === undefined) {
        d1 = d2;
        pColor = vboxes.peek(i).color;
      }
    }
    return pColor;
  },
  forcebw: function () {
    // XXX: won't  work yet
    var vboxes = this.vboxes;
    vboxes.sort(function (a, b) {
      return pv.naturalOrder(pv.sum(a.color), pv.sum(b.color));
    });

    // force darkest color to black if everything < 5
    var lowest = vboxes[0].color;
    if (lowest[0] < 5 && lowest[1] < 5 && lowest[2] < 5)
      vboxes[0].color = [0, 0, 0];

    // force lightest color to white if everything > 251
    var idx = vboxes.length - 1,
      highest = vboxes[idx].color;
    if (highest[0] > 251 && highest[1] > 251 && highest[2] > 251)
      vboxes[idx].color = [255, 255, 255];
  }
};

module.exports = CMap
