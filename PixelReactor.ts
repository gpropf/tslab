//import { main } from "ts-node/dist/bin";

import { GsonClass, Gson } from "./Gson"

import { dbg } from "./Util"

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

export class PixelReactor<T> extends GsonClass {

  private _patternMap: Map<RawGridString, [string, string][]>
  private _ruleGridMap: Map<string, RuleGrid<T>>;

  //public static readonly transformToPriorityOffsetMap = new Map<string, number>([["r0", 0], ["r90", 0], ["r180", 0], ["r270", 0]]);
  public static readonly transformToPriorityOffsetMap = new Map<string, number>([["r0", 0], ["r90", 2], ["r180", 4], ["r270", 6]]);

  private _currentRuleIndex: number = 0;

  private _updateStacks: Map<LocationString, [T, number][]>;

  private _iterationCount: number = 0;

  private _iterationDelay: number = 0;

  private _msPerIter: number = -1;

  private _msPerIters: number[] = [];

  private _mainGridWidth: number = 60;

  private _mainGridHeight: number = 40;

  private _mainGridKey: number = 0;

  public set mainGridKey(v: number) {
    this._mainGridKey = v;
  }

  public static readonly __ignoredPixelVal: number = 6;

  public get mainGridKey(): number {
    return this._mainGridKey;
  }

  public get mainGridWidth(): number {
    return this._mainGridWidth;
  }

  public set mainGridWidth(v: number) {
    this._mainGridWidth = v;
  }

  public get mainGridHeight(): number {
    return this._mainGridHeight;
  }

  public set mainGridHeight(v: number) {
    this._mainGridHeight = v;
  }

  public get iterationDelay(): number {
    return this._iterationDelay;
  }

  public set iterationDelay(v: number) {
    this._iterationDelay = v;
    //dbg(`Iteration delay set to ${v}.`, 0);
  }

  public get msPerIter() {
    return this._msPerIter;
  }

  public set iterationCount(count: number) {
    this._iterationCount = count;
  }

  public get iterationCount() {
    return this._iterationCount;
  }

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

  private _useTieBreaker: boolean = true;

  public set useTieBreaker(b: boolean) {
    this._useTieBreaker = b;
    dbg(`Tie Breaker Enabled: ${this._useTieBreaker}`, 0)
  }

  public get useTieBreaker() {
    return this._useTieBreaker;
  }

  private _colorAsc: number = 0;

  public set colorAsc(i: number | string) {
    if (typeof (i) === 'number') {
      this._colorAsc = i;
    }
    else {
      this._colorAsc = parseInt(i);
    }
    dbg(`Color Ascending: ${this._colorAsc}`, 0)
  }

  public get colorAsc(): number {
    return this._colorAsc;
  }

  private _priorityAsc: number = 0;

  public set priorityAsc(i: number | string) {
    if (typeof (i) === 'number') {
      this._priorityAsc = i;
    }
    else {
      this._priorityAsc = parseInt(i);
    }
    dbg(`Priority Ascending: ${this._priorityAsc}`, 0)
  }

  public get priorityAsc(): number {
    return this._priorityAsc;
  }

  public toggleView() {
    this.updateView = !this.updateView;
  }

  private _running: boolean = false;

  private _runMethodId: any = 0;

  private _elapsedTime: number = 0;

  private _recordingEnabled: boolean = false;

  public set recordingEnabled(b: boolean) {
    this._recordingEnabled = b;
    dbg(`Recording Enabled: ${this._recordingEnabled}`, 0)
  }

  public get recordingEnabled() {
    return this._recordingEnabled;
  }

  public set running(b: boolean) {
    this._running = b;
    if (!this._running) clearInterval(this._runMethodId);
  }

  public get running() {
    return this._running;
  }

  private _paletteMap = new Map<number, string>();

  public get paletteMap() {
    return this._paletteMap;
  }

  public set paletteMap(pm: Map<number, string>) {
    this._paletteMap = pm;
  }

  private _recordingStartFrame: number;

  private _recordingEndFrame: number;

  public get recordingStartFrame(): number {
    return this._recordingStartFrame;
  }

  public set recordingStartFrame(v: number) {
    this._recordingStartFrame = v;
    dbg(`recordingStartFrame: ${this.recordingStartFrame}`, 0)
  }

  public get recordingEndFrame(): number {
    return this._recordingEndFrame;

  }

  public set recordingEndFrame(v: number) {
    this._recordingEndFrame = v;
    dbg(`recordingEndFrame: ${this.recordingEndFrame}`, 0)
  }

  private _recordedFrames: Frame<T>[];

  public get recordedFrames(): Frame<T>[] {
    return this._recordedFrames;
  }

  public set recordedFrames(v: Frame<T>[]) {
    this._recordedFrames = v;
    dbg(`_recordedFrames: `, 0, this.recordedFrames)
  }
  // Main methods follow -=-=-=-=-

  public framesToJson() {
    let framesObj = {
      "frames": this.recordedFrames,
      "palette": Gson.objectifyMap(this._paletteMap)
    }
    return JSON.stringify(framesObj);
  }

  public makeAllNonZeroPixelsNew() {
    let mainGrid = this.getRule("MAIN");
    if (mainGrid) {
      mainGrid.newPixels = []
      mainGrid.newDifferencePixels = []

      for (let y: number = 0; y < mainGrid.height; y++) {
        for (let x: number = 0; x < mainGrid.width; x++) {
          let v: T = mainGrid.getLocation(x, y);
          if (v as number != 0) {
            let p: Pixel<T> = [x, y, v];
            mainGrid.newDifferencePixels.push(p);
            mainGrid.newPixels.push(p);
          }
        }
      }
      dbg(`Main grid has ${mainGrid.newDifferencePixels.length} pixels.`)
    }
  }


  public static pixelReactorFactory(genericObj: any) {
    let objKeys = new Set(Object.keys(genericObj));
    try {
      // pixelReactor: PixelReactor<T>, width: number, height: number, initialValue: T, id: string, grid?: T[][]
      let pr = new PixelReactor<number>();
      return pr;
    }
    catch (e) {
      let result = (e as Error).message;
      dbg(`Error during PixelReactor factory function: ${result}`, 0)
    }

  };


  public createRuleIdFromIndex(i: number): string {
    return `rule-${i}`
  }

  /**
   * Creates a new rule grid and fails if you try to reuse an id.
   * @param inwidth 
   * @param inheight 
   * @param ruleId 
   * @returns 
   */
  public createRuleGrid(inwidth: string, inheight: string, ruleId: string = "") {
    if (ruleId === "") {
      let i: number = this.getNewRuleIndex();
      ruleId = this.createRuleIdFromIndex(i);
    }

    let existingRule = this.getRule(ruleId);
    if (existingRule != undefined) {
      alert(`Rule id '${ruleId}' is in use. Choose another id.`);
      return;
    }

    let newRule = new RuleGrid(this, parseInt(inwidth), parseInt(inheight), (0 as T), ruleId);
    this.setRule(ruleId, newRule);

    return ruleId;
  }

  public loadPalette(jsonStr: string) {
    let paletteObj = JSON.parse(jsonStr);
    this.paletteMap = Gson.mapifyObject(paletteObj, true);
  }

  public restoreFromJSON(jsonStr: string, resizeOnly: boolean = false) {
    let genericObj = JSON.parse(jsonStr);
    console.log('PR in fromJSON: ', genericObj);
    let mainGrid = this.getRule("MAIN");
    let otherMainGrid = genericObj["_ruleGridMap"]["MAIN"];


    this.mainGridWidth = otherMainGrid.width;
    this.mainGridHeight = otherMainGrid.height;
    this.paletteMap = Gson.mapifyObject(genericObj["_paletteMap"], true);

    if (resizeOnly) {
      this.mainGridKey++;
      return;
    }
    //this.mainGridKey++;

    //mainGrid = this.getRule("MAIN");


    if (mainGrid && otherMainGrid) {
      // if (mainGrid.width != otherMainGrid.width || mainGrid.height != otherMainGrid.height) {
      //   this.mainGridKey++;
      //   mainGrid = this.getRule("MAIN");
      // }
      // if (mainGrid)
      mainGrid.copyOtherGridIntoThis(otherMainGrid);
      console.log("Restored Main Grid: ", mainGrid)
    }
    this.iterationCount = genericObj["_iterationCount"];
    this.colorAsc = genericObj["_colorAsc"];
    this.priorityAsc = genericObj["_priorityAsc"];
    this.useTieBreaker = genericObj["_useTieBreaker"];
    let rulesFromJSON = genericObj["_ruleGridMap"];
    let ruleKeys = this.getAllRuleIds2(rulesFromJSON);

    //dbg("Rulenames found: ", 0, ruleKeys);
    ruleKeys.forEach((key) => {
      let ruleFromJSON = rulesFromJSON[key];
      this.createRuleGrid(`${ruleFromJSON["width"]}`, `${ruleFromJSON["height"]}`, key);
    });
    ruleKeys.forEach((key) => {
      let rule: RuleGrid<T> | undefined = this.getRule(key);

      if (rule) {
        let ruleFromJSON = rulesFromJSON[key];
        rule.copyOtherGridIntoThis(ruleFromJSON);

        let ruleFromJSONSuccessorId: string = ruleFromJSON["successor"];
        if (ruleFromJSONSuccessorId) {

          let successor = this.getRule(ruleFromJSONSuccessorId);
          if (successor) {
            rule.successor = successor;
            rule.successorOffset = ruleFromJSON["successorOffset"];
            rule.priority = ruleFromJSON["priority"];
            //rule.copyOtherGridIntoThis(ruleFromJSON);
          }

        }
      }

    });
  }


  public static fromJSON(jsonStr: string) {
    let genericObj = JSON.parse(jsonStr);
    console.log('PR in fromJSON: ', genericObj);

    let prObj = new PixelReactor<number>();
    let newPR = Gson.rectifyNewObject(genericObj, prObj);
    newPR.ruleGridMap.forEach((ruleGenObj: any, id: string) => {
      let pgrg = null;
      if (id == "MAIN") {
        pgrg = ParametricGrid.parametricGridFactory(ruleGenObj, newPR);
      }
      else {
        pgrg = RuleGrid.ruleGridFactory(ruleGenObj, newPR);
      }

      let mergedRG = Gson.rectifyNewObject(ruleGenObj, pgrg);
      newPR.ruleGridMap.set(id, mergedRG);
    });
    newPR.ruleGridMap.forEach((ruleGrid: any, id: string) => {
      if (ruleGrid.successor) {
        let rgSuccessor = newPR.ruleGridMap.get(ruleGrid.successor);
        ruleGrid.successor = rgSuccessor;
      }
    });
    return newPR;
  }


  public gatherStats() {
    //let delayFunc = () => setTimeout(delayFunc, 300);
    let mainGrid = this.getRule("MAIN");

    if (mainGrid) {
      this.clearMainGrid();
      mainGrid.setLocation(30, 20, 1 as T);
    }
    else return;
    this.toggleRun();
  }

  public gatherRepeatedStats(n: number) {
    //let sum = 0;
    //let mainGrid = this.getRule("MAIN");
    let delayFunc = (i: number) => {
      this.gatherStats();
      if (i < n) {
        dbg(`i: ${i}, n: ${n}`, 0)
        setTimeout(delayFunc, 2500, i + 1)
      }
    };
    //for (let i = 0; i < n; i++) {
    //setTimeout(delayFunc, 4000, [0]);
    delayFunc(0);

    //}
    //dbg(`Average ms/iter: ${sum / n}`, 0)
  }

  public showStats() {
    let s = this._msPerIters.reduce((a, b) => a + b, 0);
    let n = this._msPerIters.length;
    let avgTime = s / n;
    dbg(`N = ${n}, AVG Time = ${avgTime}`, 0)
  }

  public toggleRun() {
    this.running = !this.running;
    if (this._running) {
      this._runMethodId = setInterval(() => this.iterate(), this._iterationDelay);
      this._elapsedTime = window.performance.now();
      //this.iterate();
    }
    else {
      let duration: number = window.performance.now() - this._elapsedTime;
      dbg(`Elapsed time: ${duration}`, 0)
      dbg(`Total iterations: ${this.iterationCount}, ms/iter: ${duration / this.iterationCount}`, 0)
      this._msPerIter = duration / this.iterationCount;
      this._msPerIters.push(this._msPerIter);
      this.showStats();
      //this.iterationCount = 0;
    }
    // else {
    //   clearInterval(this._runMethodId);
    // }
  }

  /**
   * When any change occurs in a rule, we call this to destroy the pattern map and dirty
   * all the rules so it gets rebuilt. This is the simplest approach and is probably only
   * slightly slower than trying to figure out exactly which patterns need to be dropped.
   */
  public dumpPatternMapAndMakeAllRulesDirty() {
    this._patternMap.clear();
    this._ruleGridMap.forEach((rule, id) => {
      rule.dirty = true;
    });
  }

  public iterate() {

    //console.log("ITER: ", this._iterationCount);
    this._updateStacks.clear();
    //this._patternMap.clear();
    this.dumpPatternMapAndMakeAllRulesDirty();
    this.buildPatternMap();
    dbg("this._patternMap: ", 4, this._patternMap)
    let pattternHistograms = this.buildPatternHistograms(this._patternMap);
    dbg('PH: ', 2, pattternHistograms);
    let mainGrid = this.getRule("MAIN");
    if (mainGrid) {
      if (this._recordingEnabled &&
        this._iterationCount == this._recordingStartFrame) {
        let thisFrame = new Frame(mainGrid.newDifferencePixels,
          mainGrid.width, mainGrid.height, this._iterationCount);
        this._recordedFrames.push(thisFrame);
      }
      if (mainGrid.newPixels.length == 0 || mainGrid.newDifferencePixels.length == 0) {
        if (this.running) this.toggleRun();
        else this.running = false;
        return
      }
      this._iterationCount++;
      //let pixelsToCheck = this.buildListOfAllPixels(pattternHistograms, mainGrid.width, mainGrid.height);
      let pixelsToCheck = this.buildListOfPixelsToCheckForEachNewPixel(pattternHistograms, mainGrid);
      dbg('Pixels2Check: ', 2, pixelsToCheck)
      let matchesByRuleAndTransformID = this.matchUniquePatternsForNewPixels(pixelsToCheck, this._patternMap)
      dbg("matchesByRuleAndTransformID: ", 2, matchesByRuleAndTransformID)
      let rawGridStringToSuccessorMap = this.buildRawGridStringToSuccessorMap(this._patternMap)
      dbg("buildRawGridStringToSuccessorMap:", 2, rawGridStringToSuccessorMap);

      let updateStacks = this.updateStacksWithMatchSuccessors(rawGridStringToSuccessorMap,
        matchesByRuleAndTransformID);
      dbg("updateStacks: ", 2, updateStacks)
      this.sortUpdateStacks();
      dbg("updateStacks (after sort): ", 2, updateStacks)
      this.writeUpdatePixels()

      if (this._recordingEnabled &&
        this._iterationCount > this._recordingStartFrame &&
        this._iterationCount <= this._recordingEndFrame) {
        let thisFrame = new Frame(mainGrid.newDifferencePixels,
          mainGrid.width, mainGrid.height, this._iterationCount);
        this._recordedFrames.push(thisFrame);

      }
    }
  }

  public buildPatternMap(): void {
    //let matchMap: Map<RawGridString, [string, string][]> = new Map<RawGridString, [string, string][]>();
    this._ruleGridMap.forEach((rule, id) => {
      if (rule.dirty && rule.successor) {
        rule.rotatedGrids.forEach((rotatedGrid, transform) => {
          //if (true || transform == "r0") {
          dbg(`${[rule.id, transform]}`, 3);
          let stringifiedGrid: RawGridString = JSON.stringify(rotatedGrid.grid);
          let matchingPatterns = this._patternMap.get(stringifiedGrid);
          //let priorityOffset = PixelReactor.transformToPriorityOffsetMap.get(transform);
          //if (priorityOffset === undefined) priorityOffset = 0;
          //priorityOffset += rule.priority;
          if (matchingPatterns) {
            matchingPatterns.push([rule.id, transform]);
            this._patternMap.set(stringifiedGrid, matchingPatterns);
          }
          else {
            this._patternMap.set(stringifiedGrid, [[rule.id, transform]]);
          }
          //}
        })
        dbg(`Rule ${id} has a successor ${rule.successor.id}`, 3);
        rule.dirty = false;
      }
    })

    //return matchMap;
  }

  public createHistogramForAnnotatedRawGrid(annotatedRawGrid: AnnotatedRawGrid<T>): Map<T, Vec2d[]> {
    let valueHistogram = new Map<T, Vec2d[]>()
    for (let y: number = 0; y < annotatedRawGrid.height; y++) {
      for (let x: number = 0; x < annotatedRawGrid.width; x++) {
        let v = annotatedRawGrid.grid[y][x];
        if (v == PixelReactor.__ignoredPixelVal) continue;
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

  public buildListOfAllPixels(patternHistograms: Map<RawGridString, Map<T, Vec2d[]>>,
    width: number, height: number): Map<RawGridString, Vec2d[]> {
    let pixelsToCheck: Vec2d[] = [];
    let pixelsToCheckByPattern = new Map<RawGridString, Vec2d[]>();
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let pixel: Vec2d = [x, y];
        pixelsToCheck.push(pixel);
      }
    }
    patternHistograms.forEach((histogram: Map<T, Vec2d[]>, patternString: RawGridString) => {
      pixelsToCheckByPattern.set(patternString, pixelsToCheck);
    });
    return pixelsToCheckByPattern;
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
    // if (successorOffset[0] != 0 && successorOffset[1] != 0) {
    //   successorOffset = [-1, -1]
    // }
    let adjustedUpperLeftCorner: Vec2d = addVec(upperLeftCorner, successorOffset);
    //adjustedUpperLeftCorner = mainGrid.wrapCoordinates(adjustedUpperLeftCorner);
    //let adjustedUpperLeftCornerString: LocationString = JSON.stringify(adjustedUpperLeftCorner);
    for (let y: number = 0; y < successor.height; y++) {
      for (let x: number = 0; x < successor.width; x++) {
        let successorLocation: Vec2d = [x, y];
        let pixelVal = successor.getLocation(x, y)
        if (pixelVal == PixelReactor.__ignoredPixelVal) continue;
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

  public static prioritySortFns = [
    (a: number, b: number) => { return a - b }, (a: number, b: number) => { return b - a }
  ]

  public sortUpdateStacks() {
    this._updateStacks.forEach((updatePixels: [T, number][]) => {
      updatePixels.sort((a: [T, number], b: [T, number]) => {
        if (this.useTieBreaker && a[1] == b[1]) {
          let aclr: any = a[0]
          let bclr: any = b[0]
          return (PixelReactor.prioritySortFns[this.colorAsc](aclr, bclr));
        }
        return (PixelReactor.prioritySortFns[this.priorityAsc](a[1], b[1]))
      })
    })
  }

  public writeUpdatePixels() {
    let mainGrid = this.getRule("MAIN")
    if (mainGrid === undefined) return
    mainGrid.newPixels = [];
    mainGrid.newDifferencePixels = [];


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
          //let successorOffset = rule.rotatedOffsets.get(transformId)
          let successorOffset = rule.successorOffset;
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
    mainGrid.newPixels = [];
    mainGrid.newDifferencePixels = [];
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
    super();
    this._ruleGridMap = new Map<string, RuleGrid<T>>;
    this._updateStacks = new Map<LocationString, [T, number][]>();
    this._patternMap = new Map<RawGridString, [string, string][]>();
    this._paletteMap.set(0, "#000000");
    this._paletteMap.set(1, "#00FF00");
    this._paletteMap.set(2, "#00AA00");
    this._paletteMap.set(3, "#FF00FF");
    this._paletteMap.set(4, "#AA00AA");
    this._paletteMap.set(5, "#00AAFF");
    this._paletteMap.set(PixelReactor.__ignoredPixelVal, "#888888");
    this._recordingStartFrame = 0;
    this._recordingEndFrame = 200;
    this._recordedFrames = [];

  }

  public get ruleGridMap() {
    return this._ruleGridMap;
  }

  public set ruleGridMap(rgm) {
    this._ruleGridMap = rgm;
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

  public deleteAllRules() {
    let ruleIds = this.getAllRuleIds();
    ruleIds.forEach(id => {
      this.deleteRule(id);
    });
  }

  // public serialize(): string {
  //   return this.serializeRules();
  // }

  // public serializeRules() {
  //   const obj = Object.fromEntries(this._ruleGridMap);
  //   return JSON.stringify(obj);
  // }

  public toJSON(): any {
    //console.log("PR.toJSON called")
    return {

      //foo: "bar",
      //pixelReactorString: "PR Text",
      //ruleGridMap: Object.fromEntries(this._ruleGridMap),
      _ruleGridMap: Gson.objectifyMap(this._ruleGridMap),
      __gsonClassName: "PixelReactor",
      _currentRuleIndex: this._currentRuleIndex,
      //_patternMap: Gson.objectifyMap(this._patternMap),
      _iterationCount: this._iterationCount,
      _updateView: this._updateView,
      _colorAsc: this._colorAsc,
      _priorityAsc: this._priorityAsc,
      _useTieBreaker: this._useTieBreaker,
      _paletteMap: Gson.objectifyMap(this._paletteMap),
      _recordedFrames: this._recordedFrames
      //_updateStacks: Gson.objectifyMap(this._updateStacks)

      //mainGrid: this._ruleGridMap.get("MAIN")
    }
  }

  public getAllRuleIds() {
    let ruleKeys: string[] = Array.from(this._ruleGridMap.keys());
    //ruleKeys = ruleKeys.fil
    return ruleKeys.filter(key => key != "MAIN");
  }

  public getAllRuleIds2(ruleGridMap: any) {
    let ruleKeys: string[] = Object.keys(ruleGridMap)
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

export class Frame<T> {
  private _newDifferencePixels: Pixel<T>[];
  private _width: number;
  private _height: number;
  private _frameNumber: number;

  constructor(newDifferencePixels: Pixel<T>[], width: number, height: number, frameNumber: number) {
    this._width = width;
    this._height = height;
    this._frameNumber = frameNumber;
    this._newDifferencePixels = newDifferencePixels;
  }
}

export class ParametricGrid<T> extends GsonClass {

  private _newPixels: Pixel<T>[] = [];

  private _newDifferencePixels: Pixel<T>[] = [];
  private _id: string;
  protected _width: number;
  protected _height: number;
  protected _grid: T[][] = [];

  private _updateView: boolean = true;

  protected _dirty: boolean = false;

  protected _pixelReactor: PixelReactor<T> | null;

  public set dirty(b: boolean) {
    this._dirty = b;
  }

  public get dirty(): boolean {
    return this._dirty;
  }

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

  constructor(pixelReactor: PixelReactor<T> | null, width: number, height: number, initialValue: T, id: string, grid?: T[][]) {
    super();
    this._pixelReactor = pixelReactor;
    this.testSet = new Set<number>([1, 2, 4, 5, 4, 3, 2, 2, 1]);

    //this.__useJSONForKeys.add("_grid")
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
      //console.log("GRID IN CONSTRUCTOR: ", this._grid);
    }
  }

  public copyOtherGridIntoThis(other: ParametricGrid<T>): void {
    for (let y = 0; y < other.height; y++) {
      for (let x = 0; x < other.width; x++) {
        this.setLocation(x, y, other.grid[y][x]);
        //this._grid[y][x] = other.grid[y][x];
      }
    }
    this._newPixels = other.newPixels;
    this._newDifferencePixels = other.newDifferencePixels;
  }


  public static parametricGridFactory(genericObj: any, pixelReactor: PixelReactor<number>) {
    //let objKeys = new Set(Object.keys(genericObj));
    try {
      // pixelReactor: PixelReactor<T>, width: number, height: number, initialValue: T, id: string, grid?: T[][]
      let rg = new ParametricGrid<number>(pixelReactor, genericObj["width"],
        genericObj["height"], 0, genericObj["id"], genericObj["grid"]);
      return rg;
    }
    catch (e) {
      let result = (e as Error).message;
      dbg(`Error during factory function: ${result}`, 0)
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
        if (otherVal == PixelReactor.__ignoredPixelVal) continue;
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

  public get newDifferencePixels() {
    return this._newDifferencePixels;
  }

  public set newDifferencePixels(np) {
    this._newDifferencePixels = np;
  }

  public get id() {
    return this._id;
  }

  public set id(id: string) {
    this._id = id;
  }

  public get width() {
    return this._width;
  }

  public set width(w: number) {
    this._width = w;
  }

  public get height() {
    return this._height;
  }

  public set height(h: number) {
    this._height = h;
  }

  public get grid() {
    return this._grid;
  }

  public set grid(g: T[][]) {
    this._grid = g;
  }

  public setLocation(x: number, y: number, v: T) {
    if (this._grid[y][x] != v) {
      this._newDifferencePixels.push([x, y, v]);
    }
    if (this.id !== "MAIN" && this._pixelReactor) this._pixelReactor.dumpPatternMapAndMakeAllRulesDirty();
    //this.dirty = true;
    this._grid[y][x] = v;
    this._newPixels.push([x, y, v]);
    if (this._vueComponent && this.updateView) this._vueComponent.$forceUpdate();
    //console.log("Location: ", x, ":", y)
    //console.log("VC: ", this._vueComponent);
  }

  public getLocation(x: number, y: number): T {
    let v = this._grid[y][x];
    //console.log(`getLocation() -- Location (${x},${y}) = ${v}`);
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
      newPixels: this._newPixels,
      newDifferencePixels: this._newDifferencePixels,
      width: this._width,
      height: this._height,
      grid: this._grid,
      __gsonClassName: "ParametricGrid",
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

  public set rotatedOffsets(r) {
    this._rotatedOffsets = r;
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
    // let rm = rotationMap.get("r90");

    // this._rotatedOffsets.set("r0", this._successorOffset);

    // if (rm) {
    //   //this._rotatedOffsets.set("r90", rm.multiplyByVec(offset))
    //   this._rotatedOffsets.set("r90", this.successorOffset)
    //   dbg("r90: ", 3, this._rotatedOffsets.get("r90"))
    // }
    // rm = rotationMap.get("r180");
    // if (rm) {
    //   //this._rotatedOffsets.set("r180", rm.multiplyByVec(offset))
    //   this._rotatedOffsets.set("r180", this.successorOffset)
    //   dbg("r180: ", 3, this._rotatedOffsets.get("r180"))
    // }
    // rm = rotationMap.get("r270");
    // if (rm) {
    //   //this._rotatedOffsets.set("r270", rm.multiplyByVec(offset))
    //   this._rotatedOffsets.set("r270", this.successorOffset)
    //   dbg("r270: ", 3, this._rotatedOffsets.get("r270"))
    // }
  }

  public static ruleGridFactory(genericObj: any, pixelReactor: PixelReactor<number>) {
    let objKeys = new Set(Object.keys(genericObj));
    try {
      // pixelReactor: PixelReactor<T>, width: number, height: number, initialValue: T, id: string, grid?: T[][]
      let rg = new RuleGrid<number>(pixelReactor, genericObj["width"],
        genericObj["height"], 0, genericObj["id"], genericObj["grid"]);
      return rg;
    }
    catch (e) {
      let result = (e as Error).message;
      dbg(`Error during factory function: ${result}`, 0)
    }

  };

  public toJSON(): Object {
    //let rotatedGridsObj = Gson.objectifyMap(this._rotatedGrids);
    let pgObj = super.toJSON();
    let rgObj = {
      testSet: Gson.setToArray(this.testSet),
      rotatedOffsets: Gson.objectifyMap(this._rotatedOffsets),
      //rotatedGrids: rotatedGridsObj,
      // width: this.width,
      // height: this.height,
      // grid: this._grid,
      __gsonClassName: "RuleGrid",
      //id: this.id,
      priority: this._priority,
      successor: (this._successor) ? this._successor.id : "",
      successorOffset: this._successorOffset,
      parameterType: typeof (this._grid[0][0])
    }
    Object.assign(pgObj, rgObj);
    return pgObj;
    // {
    //   testSet: Gson.setToArray(this.testSet),
    //   rotatedOffsets: Gson.objectifyMap(this._rotatedOffsets),
    //   //rotatedGrids: rotatedGridsObj,
    //   width: this.width,
    //   height: this.height,
    //   grid: this._grid,
    //   __gsonClassName: "RuleGrid",
    //   id: this.id,
    //   priority: this._priority,
    //   successor: (this._successor) ? this._successor.id : "",
    //   successorOffset: this._successorOffset,
    //   parameterType: typeof (this._grid[0][0])
    // }
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

  constructor(pixelReactor: PixelReactor<T>, width: number, height: number, initialValue: T, id: string, grid?: T[][]) {
    super(pixelReactor, width, height, initialValue, id, grid);
    this._priority = 100;
    this._rotatedOffsets = new Map<string, Vec2d>();
    this.successorOffset = [0, 0];
    this.__gsonClassName = "RuleGrid";
    this._rotatedGrids.set("r0", <ParametricGrid<T>>this);
    this._rotatedGrids.set("r90", new ParametricGrid<T>(pixelReactor, this.height, this.width, initialValue, ""));
    this._rotatedGrids.set("r180", new ParametricGrid<T>(pixelReactor, this.width, this.height, initialValue, ""));
    this._rotatedGrids.set("r270", new ParametricGrid<T>(pixelReactor, this.height, this.width, initialValue, ""));

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
