/*global ExtImgColor */

$(window).ready(() => {
  const extImgColor = new ExtImgColor.default()
  $('img').click((e) => {
    const colors = extImgColor.getPalette(e.currentTarget, 7, 6)
    $('.js-color').each((index, target) => {
      if (index < colors.length) {
        $(target).css({
          backgroundColor: `rgb(${colors[index].join(',')})`
        })
      }
    })
  })
})
