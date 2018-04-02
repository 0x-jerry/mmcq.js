import Color from "./Color"
import ColorBox from './ColorBox'

/**
 *
 * @param {Array.<Color>} colors
 * @param {string} primaryColor one of [r, g, b]
 */
function sortColorByPrimaryColor(colors, primaryColor) {
  colors.sort((a, b) => a[primaryColor] > b[primaryColor])
}

/**
 * @param {Array.<Color>} colors
 * @returns {string}
 */
function findPrimaryColor(colors) {
  const minColor = new Color(255, 255, 255)
  const maxColor = new Color(0, 0, 0)
  const primarys = ['r', 'g', 'b']

  colors.forEach(color => {
    primarys.forEach(pc => {
      minColor[pc] = color[pc] < minColor[pc] ? color[pc] : minColor[pc]
      maxColor[pc] = color[pc] > maxColor[pc] ? color[pc] : maxColor[pc]
    })
  })

  const deltaColor = Color.minus(maxColor, minColor)
  const max = Math.max(deltaColor.r, deltaColor.g, deltaColor.b)

  let primary = null
  primarys.forEach(pc => {
    if(deltaColor[pc] === max) primary = pc
  })

  return primary
}

/**
 *
 * @param {Array.<Color>} colors
 * @param {number} count
 */
function MMCQ(colors, count){
  let regions = [colors]

  while(regions.length < count) {
    let newRegion = []

    regions.forEach(colors => {
      const pc = findPrimaryColor(colors)
      sortColorByPrimaryColor(colors, pc)

      let middle = colors.length / 2
      newRegion.push(colors.slice(0, middle))
      newRegion.push(colors.slice(middle, colors.length))
    })

    regions = newRegion
  }

  return regions.map(region => new ColorBox(region)).map(cBox => cBox.avg())
}

function MMCQSync(colors, count) {
  return new Promise((resolve, reject) => {
    try {
      const startTime = (new Date()).getTime()

      let cs = MMCQ(colors, count)
      console.log((new Date()).getTime() - startTime);

      resolve(cs)
    } catch (error) {
      console.log(error);
      reject(error)
    }
  })
}

export {
  MMCQ,
  MMCQSync,
  findPrimaryColor,
  sortColorByPrimaryColor,
}
