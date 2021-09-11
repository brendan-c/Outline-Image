const jimp = require('jimp')

async function loadImage(path) {
  let img = await jimp.read(path)

  let pixels = []

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


const colorPixel = (pixel, neighbors, outlineColor) => {
  let result = []

  const hasNeighbor = neighbors.some(
    // Has a neighbor that is not transparent
    (neighbor) => neighbor && !isEmpty(neighbor)
  )

  if (isEmpty(pixel)) {
    if (hasNeighbor) {
      result.push(outlineColor)
    } else {
      result.push(pixel)
    }
  } else {
    result.push(pixel)
  }

  return result
}

function outlineImage(img, outputPath, outlineColor = [255, 250, 226, 255]) {
  const pixels = chunkArray(img.data.pixels, img.data.width)

  let result = []

  pixels.forEach((row, i) => {
    row.forEach((pixel, col) => {
      let above = i === 0 ? false : pixels[i - 1][col]
      let below = i === img.data.width - 1 ? false : pixels[i + 1][col]
      let right = col === img.data.width - 1 ? false : pixels[i][col + 1]
      let left = col === 0 ? false : pixels[i][col - 1]

      neighbors = [above, below, right, left]

      result.push(colorPixel(pixel, neighbors, outlineColor))
    })
  })

  return new Promise(function (resolve, reject) {
    new jimp(img.data.width, img.data.height, function (err, image) {
      if (err) return reject(err)
      let i = 0
      image.scan(
        0,
        0,
        image.bitmap.width,
        image.bitmap.height,
        function (x, y, index) {
          this.bitmap.data[index + 0] = result[i][0][0]
          this.bitmap.data[index + 1] = result[i][0][1]
          this.bitmap.data[index + 2] = result[i][0][2]
          this.bitmap.data[index + 3] = result[i][0][3]
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
