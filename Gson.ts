
//import process from "process";

function JsonClass(target: Function, context: any) {
  //const original = target.prototype.addFuel;
  target.prototype.class = target.name


  target.prototype.toJSON = function () {
    return {

      class: this.class,
      //parameterType: typeof (this._grid[0][0])
    }
  }
}

@JsonClass
class Rocket {
  fuel: number = 11;
  name: string;
  addFuel(amount: number) {
    this.fuel += amount;
    console.log(`Rocket now has ${this.fuel} fuel`)
    let json = JSON.stringify(this)
    console.log("JSON:", json)
  }

  constructor(name: string) {
    this.name = name
  }

}


class Gson {
  public serialize(obj: any): Object {
    let jsonObj = Object()
    Object.keys(obj).forEach(key => {
      if (obj[key] instanceof Map) {
        console.log("Map found at key = ", key);
        let mapObj = Object.fromEntries(obj[key]);
        jsonObj[key] = mapObj;
      }
      else {
        jsonObj[key] = obj[key];
      }
    });

    // const obj = Object.fromEntries(this._ruleGridMap);
    return jsonObj;
  }

  public deserialize(jsonText: string) {

  }
}

//=== 2nd attempt below this line

export interface TraversalFlags {
  isValue: boolean,
  printTypes: boolean
}

enum GsonTypes {
  STRING = 1,
  NUMBER = 2,
  BOOLEAN = 3,
  NULL = 4,
  UNDEFINED = 5,
  UNKNOWN = 6,
  SYMBOL = 7,
  ARRAY = 11,
  SET = 12,
  MAP = 13,
  OBJECT = 14
}

class GsonClass {
  protected __gsonClassName = "GsonClass"
  protected __useJSONForKeys = new Set()
  protected __excludeKeys = new Set()
  public toJSON() {
    return {
      __gsonClassName: this.__gsonClassName
    }
  }

  public static printTypes: boolean = false;

  private static __logBuffer: string = ""

  public static log(text: string) {
    this.__logBuffer += text;
  }

  public static lognl(text: string = "") {
    this.__logBuffer += text + "\n";
  }

  public static clear() {
    this.__logBuffer = "";
  }

  public static print() {
    console.log(this.__logBuffer);
  }

  public get useJSONForKeys() {
    return this.__useJSONForKeys;
  }

  public get excludeKeys() {
    return this.__excludeKeys;
  }


  public static distinguishType(obj: any) {
    if (obj === null) {
      return GsonTypes.NULL;
    }
    else if (obj === undefined) {
      return GsonTypes.UNDEFINED;
    }
    else if (obj.constructor === undefined) {
      return GsonTypes.UNKNOWN;
    }
    else {
      let objType = "";
      switch (obj.constructor) {
        case Boolean:
          return GsonTypes.BOOLEAN;
        case Number:
          return GsonTypes.NUMBER;
        case String:
          return GsonTypes.STRING;
        case Set:
          return GsonTypes.SET;
        case Array:
          return GsonTypes.ARRAY;
        case Map:
          return GsonTypes.MAP;
        case Symbol:
          return GsonTypes.SYMBOL;
        default:
          return GsonTypes.OBJECT;
      }
    }
  }

  public static traverseObject3(obj: any, tabs: string = "", traversalFlags: TraversalFlags = { isValue: false, printTypes: true }): string {
    let traversalFlagsModified: TraversalFlags = {
      isValue: true,
      printTypes: traversalFlags.printTypes
    }

    let rstr: string = ""
    let rstrs: string[] = []
    let openBracket = ""
    let closeBracket = ""
    if (obj === null) {
      if (traversalFlags.isValue) tabs = "";
      return `${tabs}NULL "${obj}"`;
    }
    else if (obj === undefined) {
      if (traversalFlags.isValue) tabs = "";
      return `${tabs}UNDEF "${obj}"`;
    }
    else if (obj.constructor === undefined) {
      if (traversalFlags.isValue) tabs = "";
      return `${tabs}NO CONSTRUCTOR"${obj}"`;
    }
    else {
      let objType = "";
      switch (obj.constructor) {
        case Boolean:
          objType = "BOOL: ";
          if (traversalFlags.isValue) tabs = "";
          if (GsonClass.printTypes)
            return `${tabs}${objType}"${obj}"`;
          else
            return `${tabs}"${obj}"`;
          break;
        case Number:
          objType = "NUM: ";
          if (traversalFlags.isValue) tabs = "";
          if (GsonClass.printTypes)
            return `${tabs}${objType}"${obj}"`;
          else
            return `${tabs}"${obj}"`;
          break;
        case String:
          objType = "STR: ";
          if (traversalFlags.isValue) tabs = "";
          if (GsonClass.printTypes)
            return `${tabs}${objType}"${obj}"`;
          else
            return `${tabs}"${obj}"`;
          break;
        case Set:
          openBracket = "["
          closeBracket = "]"
          if (traversalFlags.isValue) tabs = "";
          obj.forEach(function (value: any) {
            rstrs.push(GsonClass.traverseObject3(value, `${tabs}\t`));
          });
          return openBracket + rstrs.join(",") + closeBracket
        case Array:
          openBracket = "["
          closeBracket = "]"
          if (traversalFlags.isValue) tabs = "";
          obj.forEach(function (value: any) {
            rstrs.push(GsonClass.traverseObject3(value, `${tabs}\t`));
          });
          return openBracket + rstrs.join(",") + closeBracket
        case Map:
          openBracket = "{\n"
          closeBracket = `\n${tabs}}\n`


          obj.forEach((value: any, key: any) => {
            let mapStr = ""
            mapStr += GsonClass.traverseObject3(key, `${tabs}\t`) + " : " + GsonClass.traverseObject3(value, `${tabs}\t`, traversalFlagsModified)
            rstrs.push(mapStr);
          });
          return openBracket + rstrs.join(",\n") + closeBracket
        default:
          openBracket = "{\n"
          closeBracket = `\n${tabs}}\n`
          //let traversalFlagsModified =  traversalFlags;

          for (const [key, value] of Object.entries(obj)) {
            let mapStr = ""
            mapStr += GsonClass.traverseObject3(key, `${tabs}\t`) + " : " + GsonClass.traverseObject3(value, `${tabs}\t`, traversalFlagsModified)
            rstrs.push(mapStr);
          }
          return openBracket + rstrs.join(",\n") + closeBracket
      }
    }

  }

  public static traverseObject2(obj: any, tabs: string = "", isValue: boolean = false): string {

    let rstr: string = ""
    let rstrs: string[] = []
    let openBracket = ""
    let closeBracket = ""
    if (obj === null) {
      if (isValue) tabs = "";
      return `${tabs}NULL "${obj}"`;
    }
    else if (obj === undefined) {
      if (isValue) tabs = "";
      return `${tabs}UNDEF "${obj}"`;
    }
    else if (obj.constructor === undefined) {
      if (isValue) tabs = "";
      return `${tabs}NO CONSTRUCTOR"${obj}"`;
    }
    else {
      let objType = "";
      switch (obj.constructor) {
        case Boolean:
          objType = "BOOL: ";
          if (isValue) tabs = "";
          return `${tabs}${objType}"${obj}"`;
          break;
        case Number:
          objType = "NUM: ";
          if (isValue) tabs = "";
          return `${tabs}${objType}"${obj}"`;
          break;
        case String:
          objType = "STR: ";
          if (isValue) tabs = "";
          return `${tabs}${objType}"${obj}"`;
          break;
        case Set:
          openBracket = "{"
          closeBracket = "}"
          if (isValue) tabs = "";
          obj.forEach(function (value: any) {
            rstrs.push(GsonClass.traverseObject2(value, `${tabs}\t`));
          });
          return openBracket + rstrs.join(",") + closeBracket
        case Array:
          openBracket = "["
          closeBracket = "]"
          if (isValue) tabs = "";
          obj.forEach(function (value: any) {
            rstrs.push(GsonClass.traverseObject2(value, `${tabs}\t`));
          });
          return openBracket + rstrs.join(",") + closeBracket
        case Map:
          openBracket = "{\n"
          closeBracket = `\n${tabs}}\n`

          obj.forEach((value: any, key: any) => {
            let mapStr = ""
            mapStr += GsonClass.traverseObject2(key, `${tabs}\t`) + " : " + GsonClass.traverseObject2(value, `${tabs}\t`, true)
            rstrs.push(mapStr);
          });
          return openBracket + rstrs.join(",\n") + closeBracket
        default:
          openBracket = "{{\n"
          closeBracket = `\n${tabs}}}\n`
          for (const [key, value] of Object.entries(obj)) {
            let mapStr = ""
            mapStr += GsonClass.traverseObject2(key, `${tabs}\t`) + " : " + GsonClass.traverseObject2(value, `${tabs}\t`, true)
            rstrs.push(mapStr);
          }
          return openBracket + rstrs.join(",\n") + closeBracket
      }
    }

  }

  // public static traverseObject(obj: any, depth: number = 0, maxDepth: number = 8,
  //   useJSON: boolean = false, suppressInitialTabs: boolean = false) {
  //   let tabs: string = ""
  //   //if (!suppressTabs) {
  //   let tab: string = "\t"
  //   for (let i = 0; i < depth; i++) {
  //     tabs += tab;
  //   }
  //   //}
  //   // if (obj.__useJSONForKeys) {
  //   //   GsonClass.log(`obj.__useJSONForKeys EXISTS!!!!: ${obj.__useJSONForKeys}`)
  //   // }
  //   if (useJSON) {
  //     if (suppressInitialTabs) {
  //       GsonClass.lognl(`${JSON.stringify(obj)}`)
  //     }
  //     else {
  //       GsonClass.lognl(`${tabs}${JSON.stringify(obj)}`)
  //     }
  //   } else if (obj !== null && obj.constructor !== undefined) {
  //     switch (obj.constructor) {
  //       case Boolean:
  //         GsonClass.lognl(`${tabs}"${obj}"`)
  //         break;
  //       case String:
  //         if (suppressInitialTabs) {
  //           GsonClass.lognl(`|STR|"${obj}"`)
  //         }
  //         else {
  //           GsonClass.lognl(`${tabs}|STR|"${obj}"`)
  //         }

  //         break;
  //       case Number:

  //         if (suppressInitialTabs) {
  //           GsonClass.lognl(`|NUM|"${obj}"`);
  //         }
  //         else {
  //           GsonClass.lognl(`${tabs}|NUM|"${obj}"`);
  //         }
  //         break;
  //       case Map:
  //         if (suppressInitialTabs) {
  //           GsonClass.lognl(`{`);
  //         }
  //         else {
  //           GsonClass.lognl(`${tabs}{`);
  //         }
  //         obj.forEach((value: any, key: any) => {
  //           GsonClass.log(`${tabs}"${key}" : `)


  //           if (obj.__useJSONForKeys) {
  //             //GsonClass.log("Key __useJSONForKeys EXISTS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
  //             if (depth <= maxDepth)
  //               this.traverseObject(value, depth + 1, maxDepth, obj.__useJSONForKeys.has(key), true);
  //             else
  //               GsonClass.lognl(`MAXDEPTH ${maxDepth} EXCEEDED`);
  //           }
  //           else {
  //             if (depth <= maxDepth)
  //               this.traverseObject(value, depth + 1, maxDepth, false, true);
  //             else
  //               GsonClass.lognl(`MAXDEPTH ${maxDepth} EXCEEDED`);
  //           }




  //           //GsonClass.traverseObject(value, depth + 1, maxDepth, false, true);
  //           //GsonClass.lognl()
  //         })
  //         GsonClass.lognl(`${tabs}}`);
  //         break;
  //       case Set:
  //         if (suppressInitialTabs) {
  //           GsonClass.lognl(`{`)
  //         }
  //         else {
  //           GsonClass.lognl(`${tabs}{`)
  //         }

  //         obj.forEach(function (value: any) {
  //           GsonClass.traverseObject(value, depth + 1, maxDepth);
  //         });
  //         GsonClass.lognl(`${tabs}}`);
  //         break;
  //       case Array:
  //         if (suppressInitialTabs) {
  //           GsonClass.lognl(`[`);
  //         }
  //         else {
  //           GsonClass.lognl(`${tabs}[`);
  //         }
  //         for (let key of obj) {
  //           //GsonClass.log(`${tabs}ITEM: ${key}`);
  //           this.traverseObject(key, depth + 1, maxDepth);
  //         }
  //         GsonClass.lognl(`${tabs}]`)
  //         break;
  //       default: // Object of some type
  //         //GsonClass.lognl(`${tabs}{{`);
  //         //if (suppressInitialTabs) {
  //         //  GsonClass.lognl(`{{`);
  //         //}
  //         //else {

  //         if (suppressInitialTabs) {
  //           GsonClass.lognl(`{{`);
  //         }
  //         else {
  //           GsonClass.lognl(`${tabs}{{`);
  //         }

  //         for (const [key, value] of Object.entries(obj)) {
  //           if (obj.__excludeKeys && obj.__excludeKeys.has(key)) {
  //             continue;
  //           }
  //           GsonClass.log(`${tabs}"${key}" :`);
  //           if (obj.__useJSONForKeys) {
  //             //GsonClass.log("Key __useJSONForKeys EXISTS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
  //             if (depth <= maxDepth)
  //               this.traverseObject(value, depth + 1, maxDepth, obj.__useJSONForKeys.has(key), true);
  //             else
  //               GsonClass.lognl(`MAXDEPTH ${maxDepth} EXCEEDED`);
  //           }
  //           else {
  //             if (depth <= maxDepth)
  //               this.traverseObject(value, depth + 1, maxDepth, false, true);
  //             else
  //               GsonClass.lognl(`MAXDEPTH ${maxDepth} EXCEEDED`);
  //           }

  //         }
  //         GsonClass.lognl(`${tabs}}}`);

  //     }
  //   }
  //   else {
  //     // obj has no constructor so we just stringify it.
  //     GsonClass.lognl(`${tabs}${JSON.stringify(obj)}`)
  //   }


  // }

  public static makeTypedObjectFromGenericObject(genObj: any) {
    let objKeys = Object.keys(genObj)
    if (objKeys.find(keyName => keyName == "__gsonClassName")) {
      console.log("Object is GsonClass!!!!!!!!!!!!!!!!!!!!!!!!")
      let ObjClass = genObj["__gsonClassName"];


      let specificObject = eval(`new ${ObjClass}()`);

      let objKeys = Object.keys(genObj)
      objKeys.forEach(key => {

        let keyObj = genObj[key];
        console.log(`${genObj.__gsonClassName} key: ${key} -- val: ${keyObj}`)
        if (typeof (keyObj) == "object") {
          if (keyObj.constructor === Map) {
            console.log("Key object is Map!!!!!!!!!!!!!!!!!!!!!!!!")
          }

          if (Array.isArray(keyObj)) {
            console.log(`${key} is Array!!!`)
            let arr = keyObj as Array<any>
            let newArr: any = []
            arr.forEach(item => {
              newArr.push(this.makeTypedObjectFromGenericObject(item))
            })
            keyObj = arr;
          }
          else {
            keyObj = this.makeTypedObjectFromGenericObject(keyObj);
          }
        }
        specificObject[key] = keyObj;
      })
      return specificObject;
    }
    return genObj;
  }

  public static fromJSON(jsonString: string) {
    let parsedObj = JSON.parse(jsonString)
    let restoredObj = this.makeTypedObjectFromGenericObject(parsedObj);
    return restoredObj;
  }
}


class GsonFoo extends GsonClass {
  public s: string;

  public fooFlag: boolean;
  public myMap: Map<string, number>;

  constructor() {
    super();
    this.fooFlag = true;
    this.s = "I'm a FOO!"
    this.myMap = new Map();
    this.myMap.set("Foo", 7);
    //this.myMap.set("mapFlag", true);
  }
}


class GSTestClass extends GsonClass {

  private _innerObjects: GSTestClass[];

  public singleGSTestObj: GsonFoo;
  public _id: string;
  public myMap: Map<string, number>;

  public testSet: Set<string>;

  public get id() {
    return this._id;
  }

  public set id(id) {
    this._id = id;
  }

  constructor(id: string = "", level: number = 0) {
    super();
    this._id = id;
    this._innerObjects = []
    this.__gsonClassName = "GSTestClass"
    this.singleGSTestObj = new GsonFoo()
    this.myMap = new Map();
    this.testSet = new Set(["fee", "fii", "foo", "fum", "fee"]);
    this.myMap.set("Foo", 1);
    this.__useJSONForKeys.add("_innerObjects")
    if (level < 1) {
      for (let i = 0; i < 5; i++) {
        let obj = new GSTestClass(`${id}-${i}`, ++level);
        this._innerObjects.push(obj)
      }
    }


  }

  public toJSON() {
    let jsonObj: any = super.toJSON();
    jsonObj['_innerObjects'] = this._innerObjects;
    jsonObj.id = this._id;
    jsonObj.myMap = this.myMap;
    return jsonObj;
  }



}

export { Rocket, JsonClass, Gson, GsonClass, GSTestClass }
//console.log(`Is the rocket empty? ${(rocket as any).isEmpty()}`)

