import $ from 'jquery'
import ExImgColor from './index'

$(window).ready(() => {
  let colorThief = new ExImgColor()

  $('img').click((e) => {
    const color = colorThief.getColor(e.currentTarget, 5)
    const colors = colorThief.getPalette(e.currentTarget, 4, 5)

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
