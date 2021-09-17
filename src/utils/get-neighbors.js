module.exports = (row, col, sourceArray, rowCount, colCount) => {
    let above = row === 0 ? false : sourceArray[row - 1][col]
    let below = row === rowCount - 1 ? false : sourceArray[row + 1][col]
    let right = col === colCount - 1 ? false : sourceArray[row][col + 1]
    let left = col === 0 ? false : sourceArray[row][col - 1]
  
    const neighbors = [above, below, right, left]
  
    return neighbors
  }