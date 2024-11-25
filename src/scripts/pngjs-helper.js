// pngjs-helper: Simple JS function to actually encode and write out the PNG files.
// I made this because I don't think anyone created the TS types for PNG and associated
// functions.

var fs = require('fs'),
  PNG = require('pngjs').PNG

export function makePNG(outfile, data, width, height, scaleX, scaleY) {
  //var pixelNum = 0
  let png = new PNG({
    filterType: 4,
    width: width * scaleX,
    height: height * scaleY
  })

  png.data = data
  console.log(
    `outfile: ${outfile}: PNG.width: ${png.width}, PNG.height: ${png.height}, data length: ${png.data.length}`
  )

  png.pack().pipe(fs.createWriteStream(outfile))
  png = null
  data = null
}
