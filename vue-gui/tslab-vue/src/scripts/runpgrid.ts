import { ParametricGrid, pgFactory } from "./ParametricGrid";

var pgrid: ParametricGrid<number> = new ParametricGrid(10, 8, 42);
var pgrid2: ParametricGrid<number> = new ParametricGrid(10, 8, 41, [[1, 2, 3],[4,5,6]]);
pgrid.setLocation(8,4,100);
let s1 = JSON.stringify(pgrid);
console.log(s1)
let pgridR = pgFactory(s1)
console.log(pgridR)
//console.log(pgrid2);