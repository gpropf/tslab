// function logArray<T>(arr: T[]): void {
//     arr.forEach(element => console.log(element));
// }

//let numbers = [1, 2, 3];
//logArray<number>(numbers); 

export class ParametricGrid<T> {
    private _width: number;
    private _height: number;
    private _grid: T[][] = [];

    constructor(width: number, height: number, initialValue: T) {
        this._width = width;
        this._height = height;
        //for (var i:number = 0; i++; i < width){
           // this._grid.push([]);
            // for (var j: number = 0; j < height; j++) {
                
            //     this._grid[i].push(new T())
            // }
        //}  
        this._grid = new Array(height).fill(undefined).map(
            () => new Array(width).fill(initialValue));   
      }
    
      public get width() {
        return this._width;
      }

      public get height() {
        return this._height;
      }

      public setLocation(x: number, y: number, v: T) {
        this._grid[y][x] = v;
      }
}



// var pgrid: ParametricGrid<number> = new ParametricGrid(10, 8, 555);
// pgrid.setLocation(8,4,100);
// console.log(pgrid);