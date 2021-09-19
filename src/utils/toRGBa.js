module.exports = (hexString) => {
    let hex
  
    if (hexString.charAt(0) === '#') {
      hex = hexString.slice(1)
    } else {
      hex = hexString
    }
  
    if (hex.length != 6) {
      throw 'Only six-digit hex colors are allowed'
    }
  
    var aRgbHex = hex.match(/.{1,2}/g)
    var aRgb = [
      parseInt(aRgbHex[0], 16),
      parseInt(aRgbHex[1], 16),
      parseInt(aRgbHex[2], 16),
      255,
    ]
    return aRgb
  }