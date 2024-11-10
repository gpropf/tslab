import * as fs from 'fs';
//import process from 'process';
import { ParametricGrid } from "../../../../PixelReactor";

let args = process.argv.slice(2);

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
if (mainGrid) console.log(JSON.stringify(mainGrid))

//console.log(jsonObj);