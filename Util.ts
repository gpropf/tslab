
export const DEBUG_LEVEL = 2;


export function dbg(message: string, debugLevel: number = 0, ...args: any) {
    if (debugLevel < DEBUG_LEVEL) {
      console.log(message, args);
    }
  }