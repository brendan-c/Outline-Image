// Breaks up array into rows
module.exports = (array, size) => {
    let result = []
    for (let i = 0; i < array.length; i += size) {
      let chunk = array.slice(i, i + size)
      result.push(chunk)
    }
    return result
  }