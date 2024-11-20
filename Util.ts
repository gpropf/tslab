
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