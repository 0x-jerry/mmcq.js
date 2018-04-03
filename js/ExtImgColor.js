import CanvasImage from './CanvasImage'
import MMCQ from './MMCQ'

export default class ExtImgColor {
  constructor() { }

  getColor(sourceImage, quality) {
    const palette = this.getPalette(sourceImage, 5, quality);
    return palette[0];
  }

  getPalette(sourceImage, colorCount, quality) {
    if (typeof colorCount !== 'number' || colorCount < 2 || colorCount > 256) {
      colorCount = 10;
    }
    if (typeof quality !== 'number' || quality < 1) {
      quality = 10;
    }

    // Create custom CanvasImage object
    const image = new CanvasImage(sourceImage);
    const imageData = image.getImageData();
    const pixels = imageData.data;
    const pixelCount = image.getPixelCount();
    // Store the RGB values in an array format suitable for quantize function
    const pixelArray = [];
    for (let i = 0, offset, r, g, b, a; i < pixelCount; i = i + quality) {
      offset = i * 4;
      r = pixels[offset + 0];
      g = pixels[offset + 1];
      b = pixels[offset + 2];
      a = pixels[offset + 3];
      // If pixel is mostly opaque and not white
      if (a >= 125) {
        if (!(r > 250 && g > 250 && b > 250)) {
          pixelArray.push([r, g, b]);
        }
      }
    }

    // Send array to quantize function which clusters values
    // using median cut algorithm
    const cmap = MMCQ.quantize(pixelArray, colorCount);
    const palette = cmap ? cmap.palette() : null;
    // Clean up
    image.removeCanvas();
    return palette;
  }
}
