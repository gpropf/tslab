var fs = require('fs'),
  PNG = require('pngjs').PNG

export function makePNG(outfile) {
  //   fs.createReadStream(infile)
  //     .pipe(
  //       new PNG({
  //         filterType: 4
  //       })
  //     )
  var pixelNum = 0
  let png = new PNG({
    filterType: 4,
    width: 600,
    height: 400
  })

  for (var y = 0; y < png.height; y++) {
    for (var x = 0; x < png.width; x++) {
      var idx = (png.width * y + x) << 2
      pixelNum++
      pixelNum = pixelNum % 256
      // invert color
      png.data[idx] = x % 256
      png.data[idx + 1] = y % 256
      png.data[idx + 2] = 255 - pixelNum / 2

      // and reduce opacity
      png.data[idx + 3] = 255
    }
  }

  png.pack().pipe(fs.createWriteStream(outfile))
  console.log(png.data)
}
