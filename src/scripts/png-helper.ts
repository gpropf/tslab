// pngjs-helper: Simple JS function to actually encode and write out the PNG files.
// I made this because I don't think anyone created the TS types for PNG and associated
// functions.

import * as fs from 'node:fs';
import { PNG } from 'pngjs'
//var fs = require('fs'),
//  PNG = require('pngjs').PNG

export function makePNGts(outfile: string, data: unknown,
  width: number, height: number, scaleX: number, scaleY: number) {
  //var pixelNum = 0

  let pngts = new PNG({
    filterType: 4,
    width: width * scaleX,
    height: height * scaleY
  });

  //data as Buffer<ArrayBufferLike>
  //let abl = new Buffer<ArrayBufferLike>("foo");

  pngts.data = (data as Buffer)

  //pngts.data = data
  console.log(
    `outfile: ${outfile}: PNG.width: ${pngts.width}, PNG.height: ${pngts.height}, data length: ${pngts.data.length}`
  )

  pngts.pack().pipe(fs.createWriteStream(outfile))
  //pngts = null
  //data = null
}
