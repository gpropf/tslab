import * as fs from 'fs';
import { ParametricGrid, PixelReactor } from "../../PixelReactor";
import { leftPad } from '../../Util';
import { makePNG } from './pngjs-helper';
import { Gson } from '../../Gson';

let args = process.argv.slice(2);


const inputFilename = args[0];
const jsonText = fs.readFileSync(inputFilename, 'utf8');
const md = JSON.parse(jsonText);
console.log("Movie desc:", md);

createFrames(md.inputFilename, md.imageRootFilename, md.scaleX,
    md.scaleY, md.padLength, md.startFrame, md.endFrame);


// hexToRgb From: https://www.webdevtutor.net/blog/typescript-hex-to-rgb#google_vignette
function hexToRgb(hex: string, alpha = 255): [r: number, g: number, b: number, alpha: number] {
    const hexNumber = parseInt(hex.replace(/^#/, ''), 16);
    const r = (hexNumber >> 16) & 255;
    const g = (hexNumber >> 8) & 255;
    const b = hexNumber & 255;
    return [r, g, b, alpha];
}

function scaleGrid<T>(pGrid: ParametricGrid<T>, scaleX: number, scaleY: number,
    paletteMap: Map<T, number[]> = new Map<T, number[]>([
        [0 as T, [0, 0, 0, 255]],
        [1 as T, [0, 255, 0, 255]],
        [2 as T, [0, 170, 0, 255]]
    ])) {

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


function createFrames(inputFilename: string, imageRootFilename: string, scaleX: number,
    scaleY: number, padLength: number = 3, startFrame: number = 0, endFrame: number = 100) {
    let jsonText = fs.readFileSync(inputFilename, 'utf8');
    let jsonObj = JSON.parse(jsonText);
    //let scaleX = 10, scaleY = 10;

    let keys = Object.keys(jsonObj);

    let mainGrid: ParametricGrid<number> | null = null;
    let paletteMapRGB: Map<number, number[]> = new Map<number, number[]>();
    let paletteMap = Gson.mapifyObject(jsonObj["palette"], true);
    paletteMap.forEach((hexcolor: string, idx: number) => {
        let rgba = hexToRgb(hexcolor);
        console.log(`Color[${idx}] = ${rgba}`)
        paletteMapRGB.set(idx, rgba);
    });
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
        let frameNumStr = leftPad(frameNum, padLength);
        console.log(`frame: ${frameNumStr} has ${newDifferencePixels.length} pixels.`);
        let data: number[] = [];
        if (mainGrid) {
            for (let pixel of newDifferencePixels) {
                let [x, y, v] = pixel;
                mainGrid.setLocation(x, y, v);
            }
            if (frameNum >= startFrame && frameNum <= endFrame) {
                data = scaleGrid<number>(mainGrid, scaleX, scaleY, paletteMapRGB)
                makePNG(`${imageRootFilename}-${frameNumStr}.png`, data, mainGrid.width,
                    mainGrid.height, scaleX, scaleY);
            }
        }
    }
}
