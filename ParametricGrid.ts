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

  public setLocation(x: number, y: number, v: T) {
    this._grid[y][x] = v;
    console.log("Location: ", x, ":", y)
  }

  public set grid(g: T[][]) {
    this._grid = g;
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