// const assert = require('assert')
const myModule = require('..')

console.log(myModule.Color)
const color = new myModule.Color(1, 1, 1)
console.log(color)
console.log('dimension', +myModule.ColorDimension.b)

// const r = myModule.getPalette(new ArrayBuffer(10), 4, 1)

// console.log('1111', r)
