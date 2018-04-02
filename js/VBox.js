const sigbits = 5
const rshift = 8 - sigbits

function getColorIndex(r, g, b) {
    return (r << (2 * sigbits)) + (g << sigbits) + b;
}

export default class VBox {
  constructor(r1, r2, g1, g2, b1, b2, histo) {
    this.r1 = r1;
    this.r2 = r2;
    this.g1 = g1;
    this.g2 = g2;
    this.b1 = b1;
    this.b2 = b2;
    this.histo = histo;
  }

  volume(force) {
    if(!this._volume || force) {
      this._volume = (this.r2 - this.r1 + 1) * (this.g2 -this.g1 + 1) * (this.b2 - this.b1 + 1)
    }
    return this._volume
  }

  count(force) {
    let index = 0, npix = 0

    if(!this._count_set || force) {
      for(let i = this.r1; i <= this.r2; i++) {
        for(let j = this.g1; j <= this.g2; j++) {
          for(let k = this.b1; k <= this.b2; k++) {
            index = getColorIndex(i, j, k)
            npix += this.histo[index] || 0
          }
        }
      }
      this._count = npix
      this._count_set = true
    }

    return this._count
  }

  copy() {
    return new VBox(this.r1, this.r2, this.g1, this.g2, this.b1, this.b2, this.histo)
  }

  avg(force) {
    if (!this._avg || force) {
      const mult = 1 << (8 - sigbits)

      let ntot = 0,
        hval = 0,
        rsum = 0,
        gsum = 0,
        bsum = 0,
        histoindex;

      for (let i = this.r1; i <= this.r2; i++) {
        for (let j = this.g1; j <= this.g2; j++) {
          for (let k = this.b1; k <= this.b2; k++) {
            histoindex = getColorIndex(i, j, k);
            hval = this.histo[histoindex] || 0;
            ntot += hval;
            rsum += (hval * (i + 0.5) * mult);
            gsum += (hval * (j + 0.5) * mult);
            bsum += (hval * (k + 0.5) * mult);
          }
        }
      }

      if (ntot) {
        this._avg = [~~(rsum / ntot), ~~(gsum / ntot), ~~(bsum / ntot)];
      } else {
         console.log('empty box')

        this._avg = [~~(mult * (this.r1 + this.r2 + 1) / 2),
                     ~~(mult * (this.g1 + this.g2 + 1) / 2),
                     ~~(mult * (this.b1 + this.b2 + 1) / 2)];
      }
    }

    return this._avg;
  }

  contains(pixel) {
    const rval = pixel[0] >> rshift
    const gval = pixel[1] >> rshift
    const bval = pixel[2] >> rshift

    return rval >= this.r1 && rval <= this.r2 &&
           gval >= this.g1 && gval <= this.g2 &&
           bval >= this.b1 && bval <= this.b2
  }
}
