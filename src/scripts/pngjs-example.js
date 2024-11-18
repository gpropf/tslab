var fs = require('fs'),
  PNG = require('pngjs').PNG

const paletteMap = new Map([
  [0, [0, 0, 0]],
  [1, [0, 255, 0]],
  [2, [0, 170, 0]]
])

export function makePNG(outfile, data, width, height) {
  var pixelNum = 0
  let png = new PNG({
    filterType: 4,
    width: width,
    height: height
  })
  for (var y = 0; y < png.height; y++) {
    for (var x = 0; x < png.width; x++) {
      var idx = (png.width * y + x) << 2
      pixelNum++
      pixelNum = pixelNum % 256
      png.data[idx] = x % 256 // Red
      png.data[idx + 1] = y % 256 // Green
      png.data[idx + 2] = 255 - pixelNum / 2 // Blue
      png.data[idx + 3] = 255 // opacity
    }
  }

  png.pack().pipe(fs.createWriteStream(outfile))
  console.log(png.data)
}
