const jimp = require('jimp')

module.exports = async (path) => {
  try {
    let img = await jimp.read(path)

    // Array of pixels represented as [red, green, blue, alpha]
    let pixels = []

    // Iterates through input image pixel by pixel
    img.scan(0, 0, img.bitmap.width, img.bitmap.height, function (x, y, index) {
      let data = this.bitmap.data
      // Red, Green, Blue, Alpha
      let [r, g, b, a] = [
        data[index + 0],
        data[index + 1],
        data[index + 2],
        data[index + 3],
      ]
      pixels.push([r, g, b, a])
    })

    return {
      data: {
        pixels: pixels,
        width: img.bitmap.width,
        height: img.bitmap.height,
      },
    }
  } catch (err) {
    console.log(err)
  }
}
