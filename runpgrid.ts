import { ParametricGrid } from "./pgrid";

var pgrid: ParametricGrid<number> = new ParametricGrid(10, 8, 555);
pgrid.setLocation(8,4,100);
console.log(pgrid);