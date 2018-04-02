import $ from 'jquery'
import ColorThief from './js/ColorThief'

$(window).ready(() => {
  let colorThief = new ColorThief()

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
