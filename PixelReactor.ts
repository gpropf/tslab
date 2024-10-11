import { main } from "ts-node/dist/bin";

import { GsonClass } from "./Gson"

export const DEBUG_LEVEL = 2;

export function dbg(message: string, debugLevel: number = 0, ...args: any) {
  if (debugLevel < DEBUG_LEVEL) {
    console.log(message, args);
  }
}

export type RawGridString = string;

export type LocationString = string;

export type Vec2d = [x: number, y: number]

export function addVec(v1: Vec2d, v2: Vec2d): Vec2d {
  return [v1[0] + v2[0], v1[1] + v2[1]];
}

export type Pixel<T> = [x: number, y: number, value: T]



export const zeroVec: Vec2d = [0, 0];

export class AnnotatedRawGrid<T> {

  public width: number;
  public height: number;

  public grid: T[][]
  constructor(rawGrid: T[][]) {
    this.height = rawGrid.length;
    this.width = rawGrid[0].length;
    this.grid = rawGrid;
  }
}

export class LocationSet extends Set {
  has(loc: Vec2d) {
    let [locX, locY] = loc;
    let locations = Array.from(this);
    for (let setLoc of locations) {
      let [x, y] = setLoc;
      if (locX == x && locY == y) return true;
    }
    return false
  }
  add(loc: Vec2d) {
    if (!this.has(loc)) {
      super.add(loc);
    }
    return this;
  }
}

// export interface MatchLocations<T> {
//   matches: Vec2d[],
//   priority: number,
//   successor: ParametricGrid<T>
// }

function pushVal<K, V>(map: Map<K, V[]>, key: K, newval: V): Map<K, V[]> {
  let stack: V[] | undefined = map.get(key);
  if (stack === undefined) {
    map.set(key, [newval]);
  }
  else {
    stack.push(newval);
    map.set(key, stack);
  }
  return map;
}

// function foo() {
//   console.log("TICK!") 
// }

export class PixelReactor<T> {
  private _ruleGridMap: Map<string, RuleGrid<T>>;

  //public static readonly transformToPriorityOffsetMap = new Map<string, number>([["r0", 0], ["r90", 0], ["r180", 0], ["r270", 0]]);
  public static readonly transformToPriorityOffsetMap = new Map<string, number>([["r0", 0], ["r90", 2], ["r180", 4], ["r270", 6]]);

  private _currentRuleIndex: number = 1;

  private _updateStacks: Map<LocationString, [T, number][]>;

  private _iterationCount: number = 0;

  public get updateStacks() {
    return this._updateStacks;
  }

  private _updateView: boolean = true;

  public set updateView(b: boolean) {
    this._updateView = b;
    let mainGrid = this.getRule("MAIN");
    if (mainGrid) mainGrid.updateView = b;
  }

  public get updateView(): boolean {
    return this._updateView;
  }

  public toggleView() {
    this.updateView = !this.updateView;
  }

  private _running: boolean = false;

  private _runMethodId: any = 0;

  public set running(b: boolean) {
    this._running = b;
    if (!this._running) clearInterval(this._runMethodId);
  }

  public get running() {
    return this._running;
  }

  public toggleRun() {
    this.running = !this.running;
    if (this._running) {
      this._runMethodId = setInterval(() => this.iterate(), 10);
      //this.iterate();
    }
    // else {
    //   clearInterval(this._runMethodId);
    // }
  }

  public iterate() {
    console.log("ITER: ", this._iterationCount);
    this._updateStacks.clear();
    let prMatches = this.buildMatchMap();
    dbg("prMatches: ", 4, prMatches)
    let pattternHistograms = this.buildPatternHistograms(prMatches);
    dbg('PH: ', 2, pattternHistograms);
    let mainGrid = this.getRule("MAIN");
    if (mainGrid) {
      if (mainGrid.newPixels.length == 0) {
        this.running = false;
        return
      }
      this._iterationCount++;
      let pixelsToCheck = this.buildListOfPixelsToCheckForEachNewPixel(pattternHistograms, mainGrid);
      dbg('Pixels2Check: ', 2, pixelsToCheck)
      let matchesByRuleAndTransformID = this.matchUniquePatternsForNewPixels(pixelsToCheck, prMatches)
      dbg("matchesByRuleAndTransformID: ", 2, matchesByRuleAndTransformID)
      let rawGridStringToSuccessorMap = this.buildRawGridStringToSuccessorMap(prMatches)
      dbg("buildRawGridStringToSuccessorMap:", 2, rawGridStringToSuccessorMap);

      let updateStacks = this.updateStacksWithMatchSuccessors(rawGridStringToSuccessorMap,
        matchesByRuleAndTransformID);
      dbg("updateStacks: ", 2, updateStacks)
      this.sortUpdateStacks();
      dbg("updateStacks (after sort): ", 2, updateStacks)
      this.writeUpdatePixels()
    }
  }

  public buildMatchMap(): Map<RawGridString, [string, string][]> {
    let matchMap: Map<RawGridString, [string, string][]> = new Map<RawGridString, [string, string][]>();
    this._ruleGridMap.forEach((rule, id) => {
      if (rule.successor) {
        rule.rotatedGrids.forEach((rotatedGrid, transform) => {
          //if (true || transform == "r0") {
          dbg(`${[rule.id, transform]}`, 3);
          let stringifiedGrid: RawGridString = JSON.stringify(rotatedGrid.grid);
          let matchingPatterns = matchMap.get(stringifiedGrid);
          //let priorityOffset = PixelReactor.transformToPriorityOffsetMap.get(transform);
          //if (priorityOffset === undefined) priorityOffset = 0;
          //priorityOffset += rule.priority;
          if (matchingPatterns) {
            matchingPatterns.push([rule.id, transform]);
            matchMap.set(stringifiedGrid, matchingPatterns);
          }
          else {
            matchMap.set(stringifiedGrid, [[rule.id, transform]]);
          }
          //}
        })
        dbg(`Rule ${id} has a successor ${rule.successor.id}`, 3);
      }
    })

    return matchMap;
  }

  public createHistogramForAnnotatedRawGrid(annotatedRawGrid: AnnotatedRawGrid<T>): Map<T, Vec2d[]> {
    let valueHistogram = new Map<T, Vec2d[]>()
    for (let y: number = 0; y < annotatedRawGrid.height; y++) {
      for (let x: number = 0; x < annotatedRawGrid.width; x++) {
        let v = annotatedRawGrid.grid[y][x];
        let pixelList = valueHistogram.get(v);
        if (pixelList) {
          pixelList.push([x, y]);
          valueHistogram.set(v, pixelList);
        }
        else {
          valueHistogram.set(v, [[x, y]]);
        }
      }
    }
    return valueHistogram;
  }

  public buildListOfPixelsToCheckForEachNewPixel(patternHistograms: Map<RawGridString, Map<T, Vec2d[]>>,
    mainGrid: ParametricGrid<T>): Map<RawGridString, Vec2d[]> {
    let pixelsToCheckByPattern = new Map<RawGridString, Vec2d[]>()
    patternHistograms.forEach((histogram: Map<T, Vec2d[]>, patternString: RawGridString) => {
      let pixelsToCheck: Vec2d[] = [];
      let rawGrid = JSON.parse(patternString)
      let annotatedRawGrid = new AnnotatedRawGrid(rawGrid);
      mainGrid.newPixels.forEach(pixel => {
        let [x, y, v] = pixel;
        let locationsOfPixelsByValue = histogram.get(v);
        if (locationsOfPixelsByValue) {
          for (let patternPixel of locationsOfPixelsByValue) {
            let [px, py] = patternPixel;
            let pixelToCheckX = x - px;
            let pixelToCheckY = y - py;
            let pixelToCheck = mainGrid.wrapCoordinates([pixelToCheckX, pixelToCheckY])
            pixelsToCheck.push(pixelToCheck)
          }
        }
      })
      pixelsToCheckByPattern.set(patternString, pixelsToCheck)
    })
    return pixelsToCheckByPattern;
  }

  public buildPatternHistograms(uniquePatterns: Map<RawGridString, [string, string][]>): Map<RawGridString, Map<T, Vec2d[]>> {
    let uniquePatternKeys = Array.from(uniquePatterns.keys());
    let patternHistograms = new Map<RawGridString, Map<T, Vec2d[]>>();
    uniquePatternKeys.forEach(pattern => {
      let rawGrid = JSON.parse(pattern);
      let annotatedRawGrid = new AnnotatedRawGrid<T>(rawGrid);
      let valueHistogram = this.createHistogramForAnnotatedRawGrid(annotatedRawGrid);
      patternHistograms.set(pattern, valueHistogram);
    })
    return patternHistograms;
  }

  public putSuccessorOnUpdateStacks(mainGrid: ParametricGrid<T>, upperLeftCorner: Vec2d,
    successorOffset: Vec2d, successor: ParametricGrid<T>, priority: number) {
    if (successorOffset[0] != 0 && successorOffset[1] != 0) {
      successorOffset = [-1, -1]
    }
    let adjustedUpperLeftCorner: Vec2d = addVec(upperLeftCorner, successorOffset);
    //adjustedUpperLeftCorner = mainGrid.wrapCoordinates(adjustedUpperLeftCorner);
    //let adjustedUpperLeftCornerString: LocationString = JSON.stringify(adjustedUpperLeftCorner);
    for (let y: number = 0; y < successor.height; y++) {
      for (let x: number = 0; x < successor.width; x++) {
        let successorLocation: Vec2d = [x, y];
        let pixelVal = successor.getLocation(x, y)
        let mainGridLocation = addVec(successorLocation, adjustedUpperLeftCorner);
        mainGridLocation = mainGrid.wrapCoordinates(mainGridLocation);
        let mainGridLocationString: LocationString = JSON.stringify(mainGridLocation);
        pushVal(this._updateStacks, mainGridLocationString, [pixelVal, priority])
      }
    }

  }

  public updateStacksWithMatchSuccessors(rawGridStringToSuccessorMap: Map<RawGridString, [ParametricGrid<T>, Vec2d, number][]>,
    matchesByRuleAndTransformId: Map<RawGridString, Vec2d[]>) {
    matchesByRuleAndTransformId.forEach((matchLocations: Vec2d[], rawGridString: RawGridString) => {
      let successorMetadataList: [ParametricGrid<T>, Vec2d, number][] | undefined = rawGridStringToSuccessorMap.get(rawGridString);
      if (successorMetadataList) {
        let mainGrid = this.getRule("MAIN")
        if (mainGrid) {
          for (let successorMetadata of successorMetadataList) {
            let [successor, successorOffset, priority] = successorMetadata;
            for (let matchLocation of matchLocations) {
              this.putSuccessorOnUpdateStacks(mainGrid, matchLocation, successorOffset, successor, priority);
            }
          }
        }
      }
    })
    return this._updateStacks;

  }

  public sortUpdateStacks() {
    this._updateStacks.forEach((updatePixels: [T, number][], locationString: LocationString) => {
      updatePixels.sort((a: [T, number], b: [T, number]) => {
        if (a[1] == b[1]) {
          let anum: any = a[0]
          let bnum: any = b[0]
          return (bnum - anum);
        }
        return (a[1] - b[1])
      })
    })
  }

  public writeUpdatePixels() {
    let mainGrid = this.getRule("MAIN")
    if (mainGrid === undefined) return
    mainGrid.newPixels = [];

    this._updateStacks.forEach((updatePixels: [T, number][], locationString: LocationString) => {
      let topPixel = updatePixels[updatePixels.length - 1];
      if (topPixel === undefined) return;
      let [pixelVal, _] = topPixel;
      let location = JSON.parse(locationString)
      let [x, y] = location;

      mainGrid.setLocation(x, y, pixelVal)

    })
  }

  public buildRawGridStringToSuccessorMap(uniquePatternMetadata: Map<RawGridString, [string, string][]>):
    Map<RawGridString, [ParametricGrid<T>, Vec2d, number][]> {
    let successionMap = new Map<RawGridString, [ParametricGrid<T>, Vec2d, number][]>();
    uniquePatternMetadata.forEach((matchIds: [string, string][], rawGridString: RawGridString) => {
      let successionStack: [ParametricGrid<T>, Vec2d, number][] = []
      for (let matchId of matchIds) {
        let [ruleId, transformId] = matchId;
        dbg(`${rawGridString}: IDS: ${[ruleId, transformId]}`, 2);
        let rule = this.getRule(ruleId);
        if (rule) {
          let successor = rule.successor;
          let successorOffset = rule.rotatedOffsets.get(transformId)
          let transformedSuccessor = successor?.rotatedGrids.get(transformId)
          let priorityOffset: number | undefined = PixelReactor.transformToPriorityOffsetMap.get(transformId);
          if (priorityOffset === undefined) {
            priorityOffset = 0;
          }
          priorityOffset += rule.priority;
          if (transformedSuccessor && successorOffset)
            successionStack.push([transformedSuccessor, successorOffset, priorityOffset])

        }

      }
      successionMap.set(rawGridString, successionStack)
    });

    return successionMap;
  }

  public matchUniquePatternsForNewPixels(pixelsToCheckByPattern: Map<RawGridString, Vec2d[]>,
    uniquePatternMetadata: Map<RawGridString, [string, string][]>) {
    let matchMap: Map<RawGridString, Vec2d[]> = new Map<RawGridString, Vec2d[]>();
    let mainGrid = this._ruleGridMap.get("MAIN");
    if (mainGrid == null || mainGrid == undefined) return matchMap;
    pixelsToCheckByPattern.forEach((locationList, rawGridString: RawGridString) => {
      let locationSet = new LocationSet(locationList)
      dbg(`LocationSet for ${rawGridString}: `, 3, locationSet)
      let rawGrid = JSON.parse(rawGridString);
      let rawGridWidth: number = rawGrid[0].length;
      let rawGridHeight: number = rawGrid.length;
      for (let pixel of locationSet) {
        let [x, y] = pixel;
        let match: boolean = mainGrid.simpleMatchRawGrid(rawGrid, x, y, rawGridWidth, rawGridHeight);
        if (match) {
          let matchMetadata = uniquePatternMetadata.get(rawGridString)
          if (matchMetadata) {
            dbg(`For ${rawGridString} match at: ${x},${y} for transforms: ${matchMetadata}`, 4);
            pushVal(matchMap, rawGridString, pixel);
          }
          else {
            dbg(`For ${rawGridString} match at: ${x},${y} for transforms: ERROR! This should not happen!!!`, 0)
            return matchMap;
          }
        }
      }
    })
    return matchMap;
  }

  public clearMainGrid() {
    let mainGrid = this._ruleGridMap.get("MAIN");
    if (mainGrid == null || mainGrid == undefined) return
    for (let y: number = 0; y < mainGrid.height; y++) {
      for (let x: number = 0; x < mainGrid.width; x++) {
        mainGrid.setLocation(x, y, 0 as T);
      }
    }
    mainGrid.newPixels = []
  }

  public getNewRuleIndex(): number {
    this._currentRuleIndex += 1;
    return this._currentRuleIndex;
  }
  public get currentRuleIndex() {
    return this._currentRuleIndex;
  }

  public set currentRuleIndex(newIdx: number) {
    this._currentRuleIndex = newIdx;
  }

  constructor() {
    this._ruleGridMap = new Map<string, RuleGrid<T>>;
    this._updateStacks = new Map<LocationString, [T, number][]>();
  }

  public setRule(id: string, pgrid: RuleGrid<T>) {
    this._ruleGridMap.set(id, pgrid)
    //console.log(this._ruleGridMap)
  }

  public getRule(id: string) {
    let rg = this._ruleGridMap.get(id)
    //console.log(rg)
    return rg
  }

  public deleteRule(id: string) {
    this._ruleGridMap.delete(id)
  }

  // public serialize(): string {
  //   return this.serializeRules();
  // }

  // public serializeRules() {
  //   const obj = Object.fromEntries(this._ruleGridMap);
  //   return JSON.stringify(obj);
  // }

  public toJSON(): Object {
    //console.log("PR.toJSON called")
    return {
      
      foo: "bar",
      pixelReactorString: "PR Text",
      //ruleGridMap: Object.fromEntries(this._ruleGridMap),
      ruleGridMap: GsonClass.objectifyMap(this._ruleGridMap)
      
      //mainGrid: this._ruleGridMap.get("MAIN")
    }
  }

  public getAllRuleIds() {
    let ruleKeys: string[] = Array.from(this._ruleGridMap.keys());
    //ruleKeys = ruleKeys.fil
    return ruleKeys.filter(key => key != "MAIN");
  }

  public getAllMatches() {
    let ruleKeys = this.getAllRuleIds();
    let mainGrid = this._ruleGridMap.get("MAIN");
    let matchMap = new Map<string, Map<string, Vec2d[]>>();
    ruleKeys.forEach(key => {
      if (key != "MAIN" && mainGrid) {
        let rule = this._ruleGridMap.get(key)
        if (rule as RuleGrid<T>) {
          let matchesForRule = mainGrid.simpleMatchAllTransforms(rule as RuleGrid<T>)
          matchMap.set(key, matchesForRule);
        }
      }
    });
    return matchMap;
  }
}

//PixelReactor.transformToPriorityOffsetMap.set("r0", 2);





export class TransformMatrix {
  private r1c1: number = 0;
  private r1c2: number = 0;
  private r2c1: number = 0;
  private r2c2: number = 0;
  private translationX: number;
  private translationY: number;

  constructor(clockwiseRotation: number, translation: Vec2d, hardcodedValues?: number[]) {
    if (hardcodedValues) {
      [this.r1c1, this.r1c2, this.r2c1, this.r2c2] = hardcodedValues;
    }
    else {
      this.r1c1 = Math.cos(clockwiseRotation);
      this.r1c2 = Math.sin(-clockwiseRotation);
      this.r2c1 = Math.sin(clockwiseRotation);
      this.r2c1 = Math.cos(-clockwiseRotation);
    }
    [this.translationX, this.translationY] = translation;
  }

  public multiplyByVec(v: Vec2d): Vec2d {
    let vout: Vec2d =
      [
        this.r1c1 * v[0] + this.r1c2 * v[1] + this.translationX,
        this.r2c1 * v[0] + this.r2c2 * v[1] + this.translationY
      ]
    return vout;
  }
  // For left handed coordinate system we use [cos(t), sin(-t); sin(t), cos(-t)] 
  // for the rotation part.
}

export class ParametricGrid<T> extends GsonClass {

  private _newPixels: Pixel<T>[] = [];
  private readonly _id: string;
  private _width: number;
  private _height: number;
  private _grid: T[][] = [];

  private _updateView: boolean = true;

  public set updateView(b: boolean) {
    if (this.updateView == false && this._vueComponent) {
      this._vueComponent.$forceUpdate();
    }
    this._updateView = b;
    dbg(`PR view is ${this.updateView}!`, 1)
  }

  public get updateView(): boolean {
    return this._updateView;
  }

  public testSet: Set<number>;

  private _vueComponent: any;


  public set vueComponent(vc) {
    this._vueComponent = vc;
  }

  public get vueComponent() {
    return this._vueComponent;
  }

  constructor(width: number, height: number, initialValue: T, id: string, grid?: T[][]) {
    super();
    this.testSet = new Set<number>([1,2,4,5,4,3,2,2,1]);
    this.__useJSONForKeys.add("_grid")
    this.__excludeKeys.add("_vueComponent")
    this._id = id;
    this._width = width;
    this._height = height;
    this.__gsonClassName = "ParametricGrid";
    if (grid) {
      this._grid = grid
    }
    else {
      this._grid = new Array(height).fill(undefined).map(
        () => new Array(width).fill(initialValue));
    }
  }

  public simpleMatchRawGrid(rawGrid: T[][], offsetX: number, offsetY: number,
    rawGridWidth: number, rawGridHeight: number): boolean {
    //let y: number = 0;
    for (let y = 0; y < rawGridHeight; y++) {
      let thisY = y + offsetY;
      //alert(y, thisY)
      //let x: number = 0;
      for (let x = 0; x < rawGridWidth; x++) {
        let otherVal: T = rawGrid[y][x];
        let thisX: any = x + offsetX;
        let thisVec: Vec2d = [thisX, thisY];
        thisVec = this.wrapCoordinates(thisVec);
        let [wx, wy] = thisVec;
        // if (this.grid === undefined) {
        //   console.log("ERROR!!!: grid is undefined for ", [wx, wy])
        // }
        //else {
        let thisVal = this.grid[wy][wx];
        if (thisVal != otherVal) {
          //console.log(`thisVal: ${thisVal}, otherVal: ${otherVal}. This loc: ${thisVec}, Other loc: ${[x, y]}`)
          return false;
          //}
        }
      }
    }
    return true;
  }

  public simpleMatchAllTransforms(otherGrid: RuleGrid<T>) {
    let otherGridTransformMap = otherGrid.rotatedGrids;
    let matchesByTransform = new Map<string, Vec2d[]>();
    otherGridTransformMap.forEach((transformedGrid: ParametricGrid<T>, transformKey: string) => {
      let matches = []
      let rawGrid: T[][] = transformedGrid.grid;
      for (let y: number = 0; y < this._height; y++) {
        for (let x: number = 0; x < this._width; x++) {
          let match: boolean = this.simpleMatchRawGrid(rawGrid, x, y, transformedGrid.width, transformedGrid.height)
          if (match) {
            let matchLoc: Vec2d = [x, y]
            matches.push(matchLoc);
            // console.log(`Transform: ${transformKey}: ${matches}`)
          }
        }
      }
      // console.log(`Transform: ${transformKey}: ${matches}`);
      matchesByTransform.set(transformKey, matches);
    })
    return matchesByTransform;
  }

  // public simpleMatchTransformedRule(otherGrid: RuleGrid<T>, offsetX: number, offsetY: number, ruleKey: string): boolean {
  //   let transformedGrid = otherGrid.getTransformedGrid(ruleKey);
  //   if (transformedGrid === undefined) return false;
  //   let rawGrid: T[][] | undefined = transformedGrid.grid;
  //   if (rawGrid === undefined) return false;
  //   return this.simpleMatchRawGrid(rawGrid, offsetX, offsetY, transformedGrid.width, transformedGrid.height);
  // }

  public get newPixels() {
    return this._newPixels;
  }

  public set newPixels(np) {
    this._newPixels = np;
  }

  public get id() {
    return this._id;
  }

  public get width() {
    return this._width;
  }

  public get height() {
    return this._height;
  }

  public get grid() {
    return this._grid;
  }

  public set grid(g: T[][]) {
    this._grid = g;
  }

  public setLocation(x: number, y: number, v: T) {
    if (this._grid[y][x] == v) return;
    this._grid[y][x] = v;
    this._newPixels.push([x, y, v]);
    if (this._vueComponent && this.updateView) this._vueComponent.$forceUpdate();
    //console.log("Location: ", x, ":", y)
    //console.log("VC: ", this._vueComponent);
  }

  public getLocation(x: number, y: number): T {
    let v = this._grid[y][x];
    //console.log(`Location (${x},${y}) = ${v}`);
    return v;
  }

  public wrapCoordinates(inVec: Vec2d): Vec2d {
    let [x, y] = inVec;
    return [(x + this._width) % this._width, (y + this._height) % this._height]
  }

  // public findMatches(otherGrid: ParametricGrid<T>): Vec2d[] {
  //   let matches: Vec2d[] = [];
  //   for (let y: number = 0; y < this._height; y++) {
  //     for (let x: number = 0; x < this._width; x++) {
  //       let match: boolean = this.simpleMatchAt(otherGrid, x, y);
  //       if (match) {
  //         let matchLoc: Vec2d = [x, y]
  //         matches.push(matchLoc);
  //       }
  //     }
  //   }
  //   return matches;
  // }


  // public simpleMatchAt(otherGrid: ParametricGrid<T>, offsetX: number, offsetY: number): boolean {
  //   let rawGrid: T[][] = otherGrid.grid;
  //   let y: number = 0;
  //   for (y = 0; y < otherGrid.height; y++) {
  //     let thisY = y + offsetY;
  //     //alert(y, thisY)
  //     let x: number = 0;
  //     for (x = 0; x < otherGrid.width; x++) {
  //       let otherVal: T = rawGrid[y][x];
  //       let thisX: any = x + offsetX;
  //       let thisVec: Vec2d = [thisX, thisY];
  //       thisVec = this.wrapCoordinates(thisVec);
  //       let [wx, wy] = thisVec
  //       let thisVal = this._grid[wy][wx];
  //       if (thisVal != otherVal) {
  //         //console.log(`thisVal: ${thisVal}, otherVal: ${otherVal}. This loc: ${thisVec}, Other loc: ${[x, y]}`)
  //         return false;
  //       }
  //     }
  //   }
  //   return true;
  // }

  public toJSON(): any {
    return {      
      width: this._width,
      height: this._height,
      grid: this._grid,
      class: "ParametricGrid",
      id: this._id,
      parameterType: typeof (this._grid[0][0])
    }
  }

  // public reviver(s: string) {

  // }
}

export const rotationMap = new Map<string, TransformMatrix>();
//rotationMap.set("r0", new TransformMatrix(0, [0, 0], [1, 0, 0, 1]));
rotationMap.set("r90", new TransformMatrix(Math.PI / 2, [0, 0], [0, -1, 1, 0]))
rotationMap.set("r180", new TransformMatrix(Math.PI, [0, 0], [-1, 0, 0, -1]))
rotationMap.set("r270", new TransformMatrix(Math.PI * 3 / 2, [0, 0], [0, 1, -1, 0]))

export class RuleGrid<T> extends ParametricGrid<T> {
  private _priority: number = 0;
  private _rotatedOffsets: Map<string, Vec2d>;

  private _successor: RuleGrid<T> | null = null;
  private _rotatedGrids = new Map<string, ParametricGrid<T>>();

  private _successorOffset: Vec2d = [0, 0];

  public get rotatedGrids() {
    return this._rotatedGrids;
  }

  public get rotatedOffsets() {
    return this._rotatedOffsets;
  }

  public get successorOffset() {
    return this._successorOffset;
  }

  public set successor(s) {
    this._successor = s;
    dbg("New successor: ", 3, this._successor)
  }

  public get successor() {
    return this._successor;
  }

  public set successorOffset(offset: Vec2d) {
    this._successorOffset = offset;
    dbg("r0: ", 3, this._successorOffset)
    let rm = rotationMap.get("r90");

    this._rotatedOffsets.set("r0", this._successorOffset);

    if (rm) {
      this._rotatedOffsets.set("r90", rm.multiplyByVec(offset))
      dbg("r90: ", 3, this._rotatedOffsets.get("r90"))
    }
    rm = rotationMap.get("r180");
    if (rm) {
      this._rotatedOffsets.set("r180", rm.multiplyByVec(offset))
      dbg("r180: ", 3, this._rotatedOffsets.get("r180"))
    }
    rm = rotationMap.get("r270");
    if (rm) {
      this._rotatedOffsets.set("r270", rm.multiplyByVec(offset))
      dbg("r270: ", 3, this._rotatedOffsets.get("r270"))
    }
  }

  public toJSON(): Object {
    return {
      //testSet: GsonClass.setToArray(this.testSet),
      rotatedOffsets: GsonClass.objectifyMap(this._rotatedOffsets),
      //rotatedGrids: GsonClass.objectifyMap(this.rotatedGrids),
      width: this.width,
      height: this.height,
      grid: this.grid,
      class: "RuleGrid",
      id: this.id,
      priority: this._priority,
      successor: (this._successor) ? this._successor.id : "",
      successorOffset: this._successorOffset,
      parameterType: typeof (this.grid[0][0])
    }
  }


  public setLocation(x: number, y: number, v: T) {
    //console.log("BEFORE setLocation 0")
    super.setLocation(x, y, v);

    let r90 = rotationMap.get("r90");
    if (r90) {
      let v90 = r90.multiplyByVec([x, y])
      let [x90, y90] = v90;
      //console.log("BEFORE setLocation 90")
      this._rotatedGrids.get("r90")?.setLocation(x90 + this.height - 1, y90, v)
      //console.log("R90:", x90, y90);
    }

    let r180 = rotationMap.get("r180")
    if (r180) {
      let v180 = r180.multiplyByVec([x, y]);
      let [x180, y180] = v180;
      //console.log("BEFORE setLocation 180")
      this._rotatedGrids.get("r180")?.setLocation(x180 + this.width - 1, y180 + this.height - 1, v);
      //console.log("R180:", x180, y180)
    }

    let r270 = rotationMap.get("r270");
    if (r270) {
      let v270 = r270.multiplyByVec([x, y]);
      let [x270, y270] = v270;
      //console.log("BEFORE setLocation 270")
      this._rotatedGrids.get("r270")?.setLocation(x270, y270 + this.width - 1, v)
      //console.log("R270:", x270, y270)
    }

  }

  // public simpleMatch(otherGrid: RuleGrid<T>, offsetX: number, offsetY: number, ruleKey: string): boolean {
  //   let otherGridRawGrid = otherGrid.getTransformedGrid(ruleKey)

  //   return false;
  // }

  constructor(width: number, height: number, initialValue: T, id: string, grid?: T[][]) {
    super(width, height, initialValue, id, grid);
    this._priority = 100;
    this._rotatedOffsets = new Map<string, Vec2d>();
    this.successorOffset = [0, 0];
    this.__gsonClassName = "RuleGrid";
    this._rotatedGrids.set("r0", <ParametricGrid<T>>this);
    this._rotatedGrids.set("r90", new ParametricGrid<T>(this.height, this.width, initialValue, ""));
    this._rotatedGrids.set("r180", new ParametricGrid<T>(this.width, this.height, initialValue, ""));
    this._rotatedGrids.set("r270", new ParametricGrid<T>(this.height, this.width, initialValue, ""));

  }

  public getTransformedGrid(gridKey: string) {
    let transformedGrid = this._rotatedGrids.get(gridKey)
    if (transformedGrid) return transformedGrid;
    //return rawGrid;
  }

  public get priority(): number {
    return this._priority;
  }

  public set priority(p: number) {
    //console.log(`Old Priority = ${this._priority}, New Priority = ${p}`)
    this._priority = p;
  }
}
