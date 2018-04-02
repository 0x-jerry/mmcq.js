import PQueue from './PQueue'
import {
  naturalOrder
} from './tool'

class CMap {
  constructor() {
    this.vboxes = new PQueue((a, b) => naturalOrder(a.vbox.count() * a.vbox.volume(), b.vbox.count() * b.vbox.volume()));
  }

  push(vbox) {
    this.vboxes.push({
      vbox: vbox,
      color: vbox.avg()
    });
  }

  palette() {
    return this.vboxes.map(vb => vb.color)
  }

  size() {
    return this.vboxes.size();
  }

  map(color) {
    for(let i = 0, max = this.size(); i < max; i++) {
      if(this.vboxes.peek(i).vbox.contains(color)) return this.vboxes.peek(i).color
    }

    return this.nearest(color);
  }

  nearest(color) {
    let vboxes = this.vboxes
    let min = Math.pow(255, 3)
    let d2 = Math.pow(255, 3)
    let pColor = null

    for(let i = 0, max = this.size(); i < max; i++){
      d2 = Math.sqrt(
        Math.pow(color[0] - vboxes.peek(i).color[0], 2) +
        Math.pow(color[1] - vboxes.peek(i).color[1], 2) +
        Math.pow(color[2] - vboxes.peek(i).color[2], 2)
      )

      if(d2 < min) {
        min = d2
        pColor = vboxes.peek(i).color
      }
    }

    return pColor
  }

}

module.exports = CMap
