import { PixelReactor, RuleGrid, type Vec2d, zeroVec } from "./PixelReactor"
export const DEBUG_LEVEL = 2;

export function leftPad(num: number, size: number) {
  let s = num + "";
  while (s.length < size) s = "0" + s;
  return s;
}

export function dbg(message: string, debugLevel: number = 0, ...args: any) {
  if (debugLevel < DEBUG_LEVEL) {
    if (args.length > 0)
      console.log(message, args);
    else
      console.log(message);
  }
}

export function stringToVec(s: string | undefined): Vec2d {
  if (s) {
    const coordinates: string[] = s.split(',');
    if (coordinates.length < 2) return zeroVec;
    let v: Vec2d = [parseInt(coordinates[0]), parseInt(coordinates[1])];
    if (Number.isNaN(v[0]) || Number.isNaN(v[1])) return zeroVec
    return v;
  }
  return zeroVec;
}