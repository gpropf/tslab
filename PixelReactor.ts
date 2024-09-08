

export type Vec2d = [x: number, y: number]

export const zeroVec: Vec2d = [0, 0];

export class PixelReactor<T> {
  private _ruleGridMap: Map<string, RuleGrid<T>>;



  constructor() {
    this._ruleGridMap = new Map<string, RuleGrid<T>>;
  }

  public setRule(id: string, pgrid: RuleGrid<T>) {
    this._ruleGridMap.set(id, pgrid)
    console.log(this._ruleGridMap)
  }

  public getRule(id: string) {
    let rg = this._ruleGridMap.get(id)
    console.log(rg)
    return rg
  }

  public serialize(): string {
    return this.serializeRules();
  }

  public serializeRules() {
    const obj = Object.fromEntries(this._ruleGridMap);
    return JSON.stringify(obj);
  }

  public deserialize(jsonText: string) {

  }

  public getAllRuleIds() {
    let ruleKeys = Array.from(this._ruleGridMap.keys());
    return ruleKeys;
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

export class ParametricGrid<T> {
  private _width: number;
  private _height: number;
  private _grid: T[][] = [];

  constructor(width: number, height: number, initialValue: T, grid?: T[][]) {
    this._width = width;
    this._height = height;
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
        let thisVal = this.grid[wy][wx];
        if (thisVal != otherVal) {
          //console.log(`thisVal: ${thisVal}, otherVal: ${otherVal}. This loc: ${thisVec}, Other loc: ${[x, y]}`)
          return false;
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

  public simpleMatchTransformedRule(otherGrid: RuleGrid<T>, offsetX: number, offsetY: number, ruleKey: string): boolean {
    let transformedGrid = otherGrid.getTransformedGrid(ruleKey);
    if (transformedGrid === undefined) return false;
    let rawGrid: T[][] | undefined = transformedGrid.grid;
    if (rawGrid === undefined) return false;
    return this.simpleMatchRawGrid(rawGrid, offsetX, offsetY, transformedGrid.width, transformedGrid.height);
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
    this._grid[y][x] = v;
    console.log("Location: ", x, ":", y)
  }

  public getLocation(x: number, y: number): T {
    let v = this._grid[y][x];
    console.log(`Location (${x},${y}) = ${v}`);
    return v;
  }

  public wrapCoordinates(inVec: Vec2d): Vec2d {
    let [x, y] = inVec;
    return [x % this._width, y % this._height]
  }

  public findMatches(otherGrid: ParametricGrid<T>): Vec2d[] {
    let matches: Vec2d[] = [];
    for (let y: number = 0; y < this._height; y++) {
      for (let x: number = 0; x < this._width; x++) {
        let match: boolean = this.simpleMatchAt(otherGrid, x, y);
        if (match) {
          let matchLoc: Vec2d = [x, y]
          matches.push(matchLoc);
        }
      }
    }
    return matches;
  }

  // public findMatches90(otherGrid: RuleGrid<T>): Vec2d[] {
  //   let matches: Vec2d[] = [];
  //   for (let y: number = 0; y < this._height; y++) {
  //     for (let x: number = 0; x < this._width; x++) {
  //       let match: boolean = this.simpleMatchTransformedRule(otherGrid, x, y, "r90")
  //       if (match) {
  //         let matchLoc: Vec2d = [x, y]
  //         matches.push(matchLoc);
  //       }
  //     }
  //   }
  //   return matches;
  // }

  public simpleMatchAt(otherGrid: ParametricGrid<T>, offsetX: number, offsetY: number): boolean {
    let rawGrid: T[][] = otherGrid.grid;
    let y: number = 0;
    for (y = 0; y < otherGrid.height; y++) {
      let thisY = y + offsetY;
      //alert(y, thisY)
      let x: number = 0;
      for (x = 0; x < otherGrid.width; x++) {
        let otherVal: T = rawGrid[y][x];
        let thisX: any = x + offsetX;
        let thisVec: Vec2d = [thisX, thisY];
        thisVec = this.wrapCoordinates(thisVec);
        let [wx, wy] = thisVec
        let thisVal = this._grid[wy][wx];
        if (thisVal != otherVal) {
          //console.log(`thisVal: ${thisVal}, otherVal: ${otherVal}. This loc: ${thisVec}, Other loc: ${[x, y]}`)
          return false;
        }
      }
    }
    return true;
  }

  public toJSON(): Object {
    return {
      width: this._width,
      height: this._height,
      grid: this._grid,
      class: "ParametricGrid",
      parameterType: typeof (this._grid[0][0])
    }
  }

  public reviver(s: string) {

  }
}

// export function pgFactory(s: string) {
//   let obj = JSON.parse(s);
//   if (obj.type == "ParametricGrid") {
//     //console.log(`obj.class: ${obj.type}`)
//     let pgrid: ParametricGrid<number> = new ParametricGrid(obj.width, obj.height, 777, obj.grid);
//     return pgrid;
//   }
// }

export const rotationMap = new Map<string, TransformMatrix>();
//rotationMap.set("r0", new TransformMatrix(0, [0, 0], [1, 0, 0, 1]));
rotationMap.set("r90", new TransformMatrix(Math.PI / 2, [0, 0], [0, -1, 1, 0]))
rotationMap.set("r180", new TransformMatrix(Math.PI, [0, 0], [-1, 0, 0, -1]))
rotationMap.set("r270", new TransformMatrix(Math.PI * 3 / 2, [0, 0], [0, 1, -1, 0]))

export class RuleGrid<T> extends ParametricGrid<T> {
  private _priority?: number = 0;
  private _rotatedOffsets: Map<string, Vec2d>;

  private _successor: RuleGrid<T>;
  private _rotatedGrids = new Map<string, ParametricGrid<T>>();

  private _successorOffset: Vec2d = [0, 0];

  public get rotatedGrids() {
    return this._rotatedGrids;
  }

  public get successorOffset() {
    return this._successorOffset;
  }

  public set successor(s) {
    this._successor = s;
    console.log("New successor: ", this._successor)
  }

  public get successor() {
    return this._successor;
  }

  public set successorOffset(offset: Vec2d) {
    this._successorOffset = offset;
    console.log("r0: ", this._successorOffset)
    let rm = rotationMap.get("r90");
    if (rm) {
      this._rotatedOffsets.set("r90", rm.multiplyByVec(offset))
      console.log("r90: ", this._rotatedOffsets.get("r90"))
    }
    rm = rotationMap.get("r180");
    if (rm) {
      this._rotatedOffsets.set("r180", rm.multiplyByVec(offset))
      console.log("r180: ", this._rotatedOffsets.get("r180"))
    }
    rm = rotationMap.get("r270");
    if (rm) {
      this._rotatedOffsets.set("r270", rm.multiplyByVec(offset))
      console.log("r270: ", this._rotatedOffsets.get("r270"))
    }
  }

  public toJSON(): Object {
    return {
      width: this.width,
      height: this.height,
      grid: this.grid,
      class: "RuleGrid",
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
      console.log("BEFORE setLocation 90")
      this._rotatedGrids.get("r90")?.setLocation(x90 + this.height - 1, y90, v)
      console.log("R90:", x90, y90);
    }

    let r180 = rotationMap.get("r180")
    if (r180) {
      let v180 = r180.multiplyByVec([x, y]);
      let [x180, y180] = v180;
      console.log("BEFORE setLocation 180")
      this._rotatedGrids.get("r180")?.setLocation(x180 + this.width - 1, y180 + this.height - 1, v);
      console.log("R180:", x180, y180)
    }

    let r270 = rotationMap.get("r270");
    if (r270) {
      let v270 = r270.multiplyByVec([x, y]);
      let [x270, y270] = v270;
      console.log("BEFORE setLocation 270")
      this._rotatedGrids.get("r270")?.setLocation(x270, y270 + this.width - 1, v)
      console.log("R270:", x270, y270)
    }

  }

  // public simpleMatch(otherGrid: RuleGrid<T>, offsetX: number, offsetY: number, ruleKey: string): boolean {
  //   let otherGridRawGrid = otherGrid.getTransformedGrid(ruleKey)

  //   return false;
  // }

  constructor(width: number, height: number, initialValue: T, grid?: T[][]) {
    super(width, height, initialValue, grid);
    this._priority = 100;
    this._rotatedOffsets = new Map<string, Vec2d>();
    this._rotatedGrids.set("r0", this as ParametricGrid<T>);
    this._rotatedGrids.set("r90", new ParametricGrid<T>(this.height, this.width, initialValue));
    this._rotatedGrids.set("r180", new ParametricGrid<T>(this.width, this.height, initialValue));
    this._rotatedGrids.set("r270", new ParametricGrid<T>(this.height, this.width, initialValue));

  }

  public getTransformedGrid(gridKey: string) {
    let transformedGrid = this._rotatedGrids.get(gridKey)
    if (transformedGrid) return transformedGrid;
    //return rawGrid;
  }

  public get priority(): number | undefined {
    return this._priority;
  }

  public set priority(p: number) {
    //console.log(`Old Priority = ${this._priority}, New Priority = ${p}`)
    this._priority = p;
  }
}
