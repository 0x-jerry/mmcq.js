import { should } from 'chai'
import Color from '../js/Color';
import { findPrimaryColor, sortColorByPrimaryColor} from '../js/MMCQ'
should()

describe('MMCQ function test', () => {
  let colors = null
  beforeEach(() => {
    colors = []
    colors.push(new Color(1, 1, 1))
    colors.push(new Color(10, 10, 10))
    colors.push(new Color(30, 42, 40))
    colors.push(new Color(53, 52, 51))
    colors.push(new Color(40, 30, 30))
    colors.push(new Color(20, 20, 20))
  })

  describe('findPrimaryColor function test', () => {

    it('shoud be return "r" when given a array of color', () => {
      let result = findPrimaryColor(colors)
      result.should.be.equal('r')
    })
  })

  describe('sortColorsByPrimaryColor function test', () => {
    it('should be deep eqaul the array of color', () => {
      sortColorByPrimaryColor(colors, findPrimaryColor(colors))
      let colorValues = colors.map(color => color.valueOf())
      colorValues.should.be.deep.equal([
        [1, 1, 1,],
        [10, 10, 10],
        [20, 20, 20],
        [30, 42, 40],
        [40, 30, 30],
        [53, 52, 51]
      ])
    })
  })
})
