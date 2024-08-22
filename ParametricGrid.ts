// function logArray<T>(arr: T[]): void {
//     arr.forEach(element => console.log(element));
// }

//import exp from "constants";

//let numbers = [1, 2, 3];
//logArray<number>(numbers); 

function logFuel(target: Function, context: any) {
  const original = target.prototype.addFuel;
  target.prototype.addFuel = function (message: string) {
    console.log(`Before adding fuel, total fuel: ${this.fuel}`);
    original.apply(this, arguments);
    console.log(`After adding fuel, total fuel: ${this.fuel}`);
  };
}

//@logFuel
class Rocket {
  fuel: number = 11;
  addFuel(amount: number) {
    this.fuel += amount;
  }
}


export class TransformMatrix {
  private r1c1: number;
  private r1c2: number;
  private r2c1: number;
  private r2c2: number;
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
        this.r1c1 * v.x + this.r1c2 * v.y + this.translationX,
        this.r2c1 * v.x + this.r2c2 * v.y + this.translationY
      ]
    return vout;
  }
  // For left handed coordinate system we use [cos(t), sin(-t); sin(t), cos(-t)] 
  // for the rotation part.
}

export type Vec2d = [x: number, y: number]

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
      type: "ParametricGrid",
      parameterType: "number"
    }
  }

  public reviver(s: string) {

  }
}

export function pgFactory(s: string) {
  let obj = JSON.parse(s);
  if (obj.type == "ParametricGrid") {
    //console.log(`obj.type: ${obj.type}`)
    var pgrid: ParametricGrid<number> = new ParametricGrid(obj.width, obj.height, 777, obj.grid);
    return pgrid;
  }
}



export class RuleGrid<T> extends ParametricGrid<T> {
  private _priority?: number = 0;
  //public r0 = 
  public static readonly rotationMap: Map<number, TransformMatrix> = {
    0: new TransformMatrix(0, [0, 0]),
    90: new TransformMatrix(Math.PI / 2, [0, 0]),
    180: new TransformMatrix(Math.PI, [0, 0]),
    270: new TransformMatrix(Math.PI * 3 / 2, [0, 0])
  }


  constructor(width: number, height: number, initialValue: T, grid?: T[][]) {
    super(width, height, initialValue, grid);

    this._priority = 100;
  }

  public get priority(): number | undefined {
    return this._priority;
  }

  public set priority(p: number) {
    this._priority = p;
  }
}


export { Rocket }
// var pgrid: ParametricGrid<number> = new ParametricGrid(10, 8, 555);
// pgrid.setLocation(8,4,100);
// console.log(pgrid);