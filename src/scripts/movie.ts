import * as fs from 'fs';
//import process from 'process';
import { ParametricGrid, PixelReactor } from "../../PixelReactor";
import { makePNG } from './pngjs-example';

let args = process.argv.slice(2);

class ExportableGrid<T> extends ParametricGrid<T> {

    private _paletteMap = new Map<T, number[]>([
        [0 as T, [0, 0, 0, 255]],
        [1 as T, [0, 255, 0, 255]],
        [2 as T, [0, 170, 0, 255]]
    ]);

    constructor(pixelReactor: PixelReactor<T> | null, width: number, height: number, initialValue: T, id: string, grid?: T[][]) {
        super(null, width, height, 0 as T, "MAIN");
    }

    public _scaleX: number = 3;
    public _scaleY: number = 3;

    public exportGrid() {
        let scaledWidth = this._width * this._scaleX;
        let scaledHeight = this._height * this._scaleY;
        let data: number[] = new Array(scaledWidth * scaledHeight * 4)
        for (let y: number = 0; y < scaledHeight; y++) {
            for (let x: number = 0; x < scaledWidth; x++) {
                let idx = (this._width * y + x) << 2
                let v: T = this.getLocation(Math.round(x / this._scaleX), Math.round(y / this._scaleY));
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

//let frameGrid = new ExportableGrid<number>(null, 800, 600, 0, "foo")
//console.log(args);



let jsonText = fs.readFileSync(args[0], 'utf8');
let jsonObj = JSON.parse(jsonText);

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
            let frameNum = frame["_frameNumber"];
            console.log(`frame: ${frameNum} has ${newDifferencePixels.length} pixels.`);
            let data: number[] = [];
            if (mainGrid) {
                for (let pixel of newDifferencePixels) {
                    let [x, y, v] = pixel;
                    mainGrid.setLocation(x, y, v);
                }
                //data = mainGrid.exportGrid();
                //makePNG(`foo-${frameNum}.png`, data, mainGrid.width, mainGrid.height, mainGrid._scaleX, mainGrid._scaleY);
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