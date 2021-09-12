const jimp = require('jimp')

async function loadImage(path) {
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
}

// Breaks up array into rows
function chunkArray(array, size) {
  let result = []
  for (let i = 0; i < array.length; i += size) {
    let chunk = array.slice(i, i + size)
    result.push(chunk)
  }
  return result
}

// Checks alpha value of RGBa array
const isEmpty = (colors) => colors[3] === 0

const drawOutline = (pixel, neighbors, outlineColor) => {
  let result = []

  const hasNeighbor = neighbors.some(
    // Has a neighbor that is not transparent
    (neighbor) => neighbor && !isEmpty(neighbor)
  )

  // Is this pixel transparent?
  if (isEmpty(pixel)) {
    // Does this pixel have a non-transparent neighbor?
    if (hasNeighbor) {
      // This pixel is part of the outline
      result.push(outlineColor)
    } else {
      result.push(pixel)
    }
  } else {
    result.push(pixel)
  }

  // Resulting array of pixels including the outline
  return result
}

function outlineImage(img, outputPath, outlineColor = [255, 250, 226, 255]) {
  // Break up array of pixels into rows
  let pixels = chunkArray(img.data.pixels, img.data.width)

  // Create transparent border to ensure full outline
  pixels = pixels.map((row) => [[0, 0, 0, 0], ...row, [0, 0, 0, 0]])
  pixels.unshift(Array(pixels[0].length).fill([0, 0, 0, 0]))
  pixels.push(Array(pixels[0].length).fill([0, 0, 0, 0]))

  // New height/width with added transparent border
  let height = pixels.length
  let width = pixels[0].length

  // Resulting array of pixels including the outline
  let result = []

  // Iterate through input image pixel by pixel to get neighboring pixels
  pixels.forEach((row, i) => {
    row.forEach((pixel, col) => {
      // Get neighboring pixels. If the pixel is on outer border,
      // the non-existing neighbor gets value of False
      let above = i === 0 ? false : pixels[i - 1][col]
      let below = i === height - 1 ? false : pixels[i + 1][col]
      let right = col === width - 1 ? false : pixels[i][col + 1]
      let left = col === 0 ? false : pixels[i][col - 1]

      neighbors = [above, below, right, left]

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

      image.write(outputPath)
      return resolve(null)
    })
  })
}

loadImage('./test/input1.png').then((img) =>
  outlineImage(img, './test/output1.png')
)
loadImage('./test/input2.png').then((img) =>
  outlineImage(img, './test/output2.png')
)
loadImage('./test/input3.png').then((img) =>
  outlineImage(img, './test/output3.png')
)
