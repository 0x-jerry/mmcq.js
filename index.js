import $ from 'jquery'
import ColorThief from './js/ColorThief'

$(window).ready(() => {
  let colorThief = new ColorThief()

  $('img').click((e) => {
    const colors = colorThief.getPalette(e.currentTarget, 10)

    $('.color').each((index, target) => {
      if(index < colors.length){
        $(target).css({
          backgroundColor: `rgb(${colors[index].join(',')})`
        })
      }
    })
  })
})
