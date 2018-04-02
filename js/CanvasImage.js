export default class CanvasImage {
  constructor(image) {
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    document.body.appendChild(this.canvas);
    this.width = this.canvas.width = image.width;
    this.height = this.canvas.height = image.height;
    this.context.drawImage(image, 0, 0, this.width, this.height);
  }
  clear() {
    this.context.clearRect(0, 0, this.width, this.height);
  }
  update(imageData) {
    this.context.putImageData(imageData, 0, 0);
  }
  getPixelCount() {
    return this.width * this.height;
  }
  getImageData() {
    return this.context.getImageData(0, 0, this.width, this.height);
  }
  removeCanvas() {
    this.canvas.parentNode.removeChild(this.canvas);
  }
}
