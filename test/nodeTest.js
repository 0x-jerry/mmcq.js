const ExtImgColor = require('../dist/ExtImgColor-node')

const extImgColor = new ExtImgColor.default();

console.log('test getPalette function', typeof extImgColor.getPalette === 'function')
