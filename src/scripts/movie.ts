import * as fs from 'fs';
//import process from 'process';
import { ParametricGrid, PixelReactor } from "../../PixelReactor";
import { leftPad } from '../../Util';
import { makePNG } from './pngjs-example';

let args = process.argv.slice(2);


function scaleGrid<T>(pGrid: ParametricGrid<T>, scaleX: number, scaleY: number) {
    const paletteMap = new Map<T, number[]>([
        [0 as T, [0, 0, 0, 255]],
        [1 as T, [0, 255, 0, 255]],
        [2 as T, [0, 170, 0, 255]]
    ]);

    let scaledWidth = pGrid.width * scaleX;
    let scaledHeight = pGrid.height * scaleY;
    let data: number[] = new Array(scaledWidth * scaledHeight * 4)
    //console.log(`scaleGrid(): data.length: ${data.length}`)
    for (let y: number = 0; y < scaledHeight; y++) {
        for (let x: number = 0; x < scaledWidth; x++) {
            let idx = (scaledWidth * y + x) << 2
            let v: T = pGrid.getLocation(Math.floor(x / scaleX), Math.floor(y / scaleY));
            let rgba = paletteMap.get(v)
            if (rgba) {
                data[idx] = rgba[0]; // Red
                data[idx + 1] = rgba[1] // Green
                data[idx + 2] = rgba[2] // Blue
                data[idx + 3] = rgba[3] // opacity
            }
        }
    }
    return data;
}


const inputFilename = args[0];

createFrames(inputFilename, "paddedframe", 5, 5, 5);

function createFrames(inputFilename: string, imageRootFilename: string, scaleX: number, scaleY: number, padLength: number = 3) {
    let jsonText = fs.readFileSync(inputFilename, 'utf8');
    let jsonObj = JSON.parse(jsonText);
    //let scaleX = 10, scaleY = 10;

    let keys = Object.keys(jsonObj);

    let mainGrid: ParametricGrid<number> | null = null;
    //pixelReactor: PixelReactor<T>, width: number, height: number, initialValue: T, id: string, grid?: T[][]

    keys.forEach(key => {
        if (key == "frames") {
            let frames = jsonObj["frames"];
            console.log(`frames: ${frames.length}`);
            let firstFrame: boolean = true;
            for (let frame of frames) {

                if (firstFrame) {
                    let width = frame["_width"];
                    let height = frame["_height"];
                    firstFrame = false;
                    mainGrid = new ParametricGrid<number>(null, width, height, 0, "MAIN");
                }
                let newDifferencePixels = frame["_newDifferencePixels"];
                let frameNum: number = frame["_frameNumber"];
                //while (frameNum.length < 6) frameNum = "0" + frameNum;
                let frameNumStr = leftPad(frameNum, padLength);
                console.log(`frame: ${frameNumStr} has ${newDifferencePixels.length} pixels.`);
                let data: number[] = [];
                if (mainGrid) {
                    for (let pixel of newDifferencePixels) {
                        let [x, y, v] = pixel;
                        mainGrid.setLocation(x, y, v);
                    }
                    data = scaleGrid<number>(mainGrid, scaleX, scaleY)
                    makePNG(`${imageRootFilename}-${frameNumStr}.png`, data, mainGrid.width, mainGrid.height, scaleX, scaleY);
                }


            }
            // frames.forEach(frame:any => {

            // })


        }

    })
    if (mainGrid) {
        console.log(JSON.stringify(mainGrid))
    }

}


//console.log(jsonObj);