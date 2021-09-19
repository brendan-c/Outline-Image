#! /usr/bin/env node

const outline = require('../src/outline-image')
const toRGBa = require('../src/utils/toRGBa')
const args = process.argv.slice(2, process.argv.length)



const inputImage = args[0],
  outputImage = args[1],
  outlineColor = toRGBa(args[2]),
  trim = args[3] ? (args[3] === 'trim' ? true : false) : false

outline(inputImage, outputImage, outlineColor, trim)
