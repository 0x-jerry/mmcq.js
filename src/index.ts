import getPalette from './lib/core'

let AlgorithmQuality = 5
let ImageQuality = 0.3

const elements = document.querySelectorAll('.img')
elements.forEach(element => {
  element.addEventListener('click', () => {
    const start = new Date().getTime()
    delWidthImage(element.children[0] as HTMLImageElement)
    const end = new Date().getTime()
    document.getElementById('time').innerText = end - start + ' ms'
  })
})

document.getElementById('algorithm-quality').addEventListener('change', e => {
  const Q = (e.target as HTMLInputElement).value
  AlgorithmQuality = parseInt(Q)
  document.getElementById('algorithm-value').innerText = Q
})

document.getElementById('image-quality').addEventListener('change', e => {
  const Q = (e.target as HTMLInputElement).value
  ImageQuality = parseFloat(Q)

  document.getElementById('image-value').innerText = Q
})

function delWidthImage (img: HTMLImageElement) {
  const colors = getPalette(img, 8, {
    image: ImageQuality,
    algorithm: AlgorithmQuality
  })

  document.querySelectorAll('.js-color').forEach((el, i) => {
    if (colors[i]) (el as HTMLDivElement).style.backgroundColor = colors[i].rgb
  })
}
