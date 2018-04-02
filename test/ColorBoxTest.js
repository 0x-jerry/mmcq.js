import { should } from 'chai'
import Color from '../js/Color'
import ColorBox from '../js/ColorBox'
should()

describe('ColorBox class test', () => {
  describe('avg function test', () => {
    let colors = []
    /**
     * @type {ColorBox}
     */
    let CBox = null
    beforeEach(() => {
      colors.push(new Color(1, 1, 1))
      colors.push(new Color(10, 10, 10))
      colors.push(new Color(25, 25, 25))
      colors.push(new Color(28, 20, 29))
      colors.push(new Color(40, 40, 40))
      colors.push(new Color(50, 50, 50))
      CBox = new ColorBox(new Color(0, 0, 0), new Color(255, 255, 255), colors)
    })

    it('should return average when given a array of color', () => {
      let avgColor = CBox.avg()
      avgColor.valueOf().should.be.deep.equal([25, 25, 25])
    })

  })

})

