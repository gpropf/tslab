import * as fs from 'fs';
//import process from 'process';

let args = process.argv.slice(2);

//console.log(args);


let jsonText = fs.readFileSync(args[0],'utf8');
let jsonObj = JSON.parse(jsonText);

console.log(jsonObj);