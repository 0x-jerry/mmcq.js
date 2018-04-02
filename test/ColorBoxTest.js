import { should } from 'chai'
import Color from '../js/Color'
import ColorBox from '../js/ColorBox'
should()

describe('ColorBox class test', () => {
  /**
   * @type {ColorBox}
   */
  let CBox = null
  beforeEach(() => {
    let colors = []
    colors.push(new Color(1, 1, 1))
    colors.push(new Color(10, 10, 10))
    colors.push(new Color(25, 25, 25))
    colors.push(new Color(28, 20, 29))
    colors.push(new Color(40, 40, 40))
    colors.push(new Color(50, 50, 90))
    CBox = new ColorBox(colors)
  })

  describe('nearColor function test', () => {
    it('should return [25, 25, 25] when given [24, 23, 22]', () => {
      let color = CBox.nearColor(new Color(24, 23, 22))
      color.valueOf().should.be.deep.equal([25, 25, 25])
    })

    it('should return [50, 50, 90] when given [55, 40, 80]', () => {
      let color = CBox.nearColor(new Color(55, 40, 80))
      color.valueOf().should.be.deep.equal([50, 50, 90])
    })
  })

  describe('avg function test', () => {

    it('should return average when given a array of color', () => {
      let avgColor = CBox.avg()
      avgColor.valueOf().should.be.deep.equal([28, 20, 29])
    })
  })
})

