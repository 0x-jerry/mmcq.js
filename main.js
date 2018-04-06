import $ from 'jquery'
import ExtImgColor from './js/ExtImgColor'

$(window).ready(() => {
  const extImgColor = new ExtImgColor()

  $('img').click((e) => {
    extImgColor
      .getPaletteAsync(e.currentTarget, 7, 6)
      .then((colors) => {
        $('.js-color').each((index, target) => {
          if(index < colors.length){
            $(target).css({
              backgroundColor: `rgb(${colors[index].join(',')})`
            })
          }
        })
      })

    extImgColor
      .getColorAsync(e.currentTarget, 5)
      .then((color) => {
        $('.js-domainColor').css({
          backgroundColor: `rgb(${color.join(',')})`
        })
      })
  })
})
