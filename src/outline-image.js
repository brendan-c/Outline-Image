const jimp = require('jimp')
const loadImage = require('./utils/load-image')
const chunkArray = require('./utils/chunk-array')
const getNeighbors = require('./utils/get-neighbors')
const drawOutline = require('./utils/draw-outline')

module.exports = async (imagePath, outputPath, outlineColor, trim = true) => {
  try {
    //load image
    const img = await loadImage(imagePath)

    // Break up array of pixels into rows
    let pixels = chunkArray(img.data.pixels, img.data.width)

    // Create transparent border to ensure full outline
    pixels = pixels.map((row) => [[0, 0, 0, 0], ...row, [0, 0, 0, 0]])
    pixels.unshift(Array(pixels[0].length).fill([0, 0, 0, 0]))
    pixels.push(Array(pixels[0].length).fill([0, 0, 0, 0]))

    // New height/width with added transparent border
    const height = pixels.length
    const width = pixels[0].length

    // Resulting array of pixels including the outline
    let result = []

    // Iterate through input image pixel by pixel to get neighboring pixels
    pixels.forEach((row, rowIndex) => {
      row.forEach((pixel, colIndex) => {
        // Get neighboring pixels. If the pixel is on outer border,
        // the non-existing neighbor gets value of False
        let neighbors = getNeighbors(rowIndex, colIndex, pixels, height, width)

        result.push(...drawOutline(pixel, neighbors, outlineColor))
      })
    })
    
    return new Promise(function (resolve, reject) {
      // Creates a new image with empty pixels based on input image dimensions
      new jimp(width, height, function (err, image) {
        if (err) return reject(err)
        // Counter, used to sync with the result array of pixels
        let i = 0

        // Iterates through new empty image pixel by pixel to color each pixel
        // according to the previously built result
        image.scan(
          0,
          0,
          image.bitmap.width,
          image.bitmap.height,
          function (x, y, index) {
            // Red
            this.bitmap.data[index + 0] = result[i][0]
            // Green
            this.bitmap.data[index + 1] = result[i][1]
            // Blue
            this.bitmap.data[index + 2] = result[i][2]
            // Alpha
            this.bitmap.data[index + 3] = result[i][3]
            i += 1
          }
        )

        if (trim) {
          image.autocrop({ cropOnlyFrames: false })
        }

        image.write(outputPath)

        return resolve(null)
      })
    })
  } catch (err) {
    console.log(err)
  }
}

// // test
// const white = [255, 250, 226, 255]

// loadImage('./test/input1.png').then((img) =>
//   outlineImage(img, './test/output1.png', white)
// )

// loadImage('./test/input2.png').then((img) =>
//   outlineImage(img, './test/output2.png', white)
// )

// loadImage('./test/input3.png').then((img) =>
//   outlineImage(img, './test/output3.png', white)
// )
