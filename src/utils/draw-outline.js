const isEmpty = require('./is-empty.js')

module.exports = (pixel, neighbors, outlineColor) => {
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