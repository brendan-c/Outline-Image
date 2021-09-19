#! /usr/bin/env node

const outline = require('../src/outline-image.js')
const args = process.argv.slice(2, process.argv.length)

String.prototype.toRGBa = function(){

    let hex

    if(this.charAt(0) === '#'){
        hex = this.slice(1)
    } else {
        hex = this
    }

    if(hex.length != 6){
        throw "Only six-digit hex colors are allowed";
    }

    var aRgbHex = hex.match(/.{1,2}/g);
    var aRgb = [
        parseInt(aRgbHex[0], 16),
        parseInt(aRgbHex[1], 16),
        parseInt(aRgbHex[2], 16),
        255
    ];
    return aRgb;
}

const inputImage = args[0],
    outputImage = args[1],
    outlineColor = args[2].toRGBa(),
    trim = args[3] ? args[3] === 'trim' ? true : false : false



outline(inputImage, outputImage, outlineColor, trim)
