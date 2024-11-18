import * as fs from 'fs';
//import process from 'process';
import { ParametricGrid } from "../../PixelReactor";
import { makePNG } from './pngjs-example';

let args = process.argv.slice(2);

class ExportableGrid<T> extends ParametricGrid<T> {

    private _paletteMap = new Map<T, number[]>([
        [0 as T, [0, 0, 0, 255]],
        [1 as T, [0, 255, 0, 255]],
        [2 as T, [0, 170, 0, 255]]
    ]);
    public exportGrid() {
        let data: number[] = new Array(this._width * this._height * 4)
        for (let y: number = 0; y < this._height; y++) {
            for (let x: number = 0; x < this._width; x++) {
                let idx = (this._width * y + x) << 2
                let v: T = this.getLocation(x, y);
                let rgba = this._paletteMap.get(v)
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
}

let frameGrid = new ExportableGrid<number>(null, 800, 600, 0, "foo")
//console.log(args);
makePNG("foo.png", [], 800, 600);


let jsonText = fs.readFileSync(args[0], 'utf8');
let jsonObj = JSON.parse(jsonText);

let keys = Object.keys(jsonObj);

let mainGrid: ExportableGrid<number> | null = null;
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
                mainGrid = new ExportableGrid<number>(null, width, height, 0, "MAIN");
            }
            let newDifferencePixels = frame["_newDifferencePixels"];
            let frameNum = frame["_frameNumber"];
            console.log(`frame: ${frameNum} has ${newDifferencePixels.length} pixels.`);
            if (mainGrid) {
                for (let pixel of newDifferencePixels) {
                    let [x, y, v] = pixel;
                    mainGrid.setLocation(x, y, v);
                }
            }
        }
        // frames.forEach(frame:any => {

        // })


    }

})
if (mainGrid) {
    console.log(JSON.stringify(mainGrid))
}

//console.log(jsonObj);