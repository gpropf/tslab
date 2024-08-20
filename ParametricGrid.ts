// function logArray<T>(arr: T[]): void {
//     arr.forEach(element => console.log(element));
// }

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

export type Vec2d = [number, number]

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

  public simpleMatchAt(otherGrid: ParametricGrid<T>, offsetX: number, offsetY: number): boolean {
    let rawGrid = otherGrid.grid;
    for (let y in rawGrid) {
      let thisY = y + offsetY;
      for (let x in rawGrid[y]) {
        let otherVal = rawGrid[y][x];
        let thisX = x + offsetX;
        let thisVec: Vec2d = [thisX, thisY];
        thisVec = this.wrapCoordinates(thisVec);
        let [wx, wy] = thisVec
        let thisVal = this._grid[wy][wx];
        if (thisVal != otherVal) return false;
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

export { Rocket }
// var pgrid: ParametricGrid<number> = new ParametricGrid(10, 8, 555);
// pgrid.setLocation(8,4,100);
// console.log(pgrid);