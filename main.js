import $ from 'jquery'
import ExtImgColor from './index'

const a = require('./build/index')

$(window).ready(() => {
  window.a = a
  let extImgColor = new ExtImgColor()

  $('img').click((e) => {
    const color = extImgColor.getColor(e.currentTarget, 5)
    const colors = extImgColor.getPalette(e.currentTarget, 4, 5)

    $('.js-color').each((index, target) => {
      if(index < colors.length){
        $(target).css({
          backgroundColor: `rgb(${colors[index].join(',')})`
        })
      }
    })

    $('.js-domainColor').css({
      backgroundColor: `rgb(${color.join(',')})`
    })
  })
})
