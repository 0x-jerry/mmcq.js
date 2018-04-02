import { should } from 'chai'
import Color from '../js/Color'
should()

describe('Color class test' , () => {
  describe('constructor test', () => {
    it('should return [0, 255, 234] when given [-123, 345, 234]', () => {
      let color = new Color(-123, 345, 234)
      color.valueOf().should.be.deep.equal([0, 255, 234])
    })
  })

  describe('add function test', () => {
    it('should be return [50, 56, 35] when given [25, 16, 13] & [25, 40, 22]', () => {
      let color1 = new Color(25, 16, 13)
      let color2 = new Color(25, 40, 22)
      let color = Color.add(color1,color2)
      color.valueOf().should.be.deep.equal([50, 56, 35])
    })

    it('should be return [255, 56, 35] when given [255, 16, 13] & [25, 40, 22]', () => {
      let color1 = new Color(255, 16, 13)
      let color2 = new Color(25, 40, 22)
      let color = Color.add(color1,color2)
      color.valueOf().should.be.deep.equal([255, 56, 35])
    })
  })

  describe('minus function test', () => {
    it('should be return [25, 56, 35] when given [255, 96, 57] & [230, 40, 22]', () => {
      let color1 = new Color(255, 96, 57)
      let color2 = new Color(230, 40, 22)
      let color = Color.minus(color1,color2)
      color.valueOf().should.be.deep.equal([25, 56, 35])
    })

    it('should be return [0, 56, 35] when given [35, 96, 57] & [225, 40, 22]', () => {
      let color1 = new Color(35, 96, 57)
      let color2 = new Color(225, 40, 22)
      let color = Color.minus(color1,color2)
      color.valueOf().should.be.deep.equal([0, 56, 35])
    })
  })

  describe('equal function test', () => {
    it('should be return true when given [234, 234, 33] & [234, 234, 33]', () => {
      let color1 = new Color(234, 234, 33)
      let color2 = new Color(234, 234, 33)
      let result = Color.equal(color1, color2)
      result.should.be.equal(true)
    })

    it('should be return false when given [233, 234, 33] & [234, 234, 33]', () => {
      let color1 = new Color(233, 234, 33)
      let color2 = new Color(234, 234, 33)
      let result = Color.equal(color1, color2)
      result.should.be.equal(false)
    })
  })

  describe('norm function test', () => {
    it('should be return 8.66 when given [5, 5, 5]', () => {
      let color = new Color(5, 5, 5)
      color.norm().should.be.equal(8.66)
    })
  })
})
