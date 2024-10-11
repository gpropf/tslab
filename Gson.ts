
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

  //public static readonly factoryMap: Map<string, Function>;


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

  public static objectifyMap(m: Map<any, any>) {
    let mapObj = Object();
    m.forEach((value: any, key: any) => {
      mapObj[key] = value;
    });
    return mapObj;
  }

  public static mapifyObject(m: Object) {
    let map = new Map<any, any>();
    let keys = Object.keys(m)
    keys.forEach((key) => {
      map.set(key, m[key]);
    });
    return map;
  }


  public static setToArray(s: Set<any>) {
    let setArr = Array.from(s);
    return setArr;
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


  public static traverseObject3(obj: any, tabs: string = "",
    traversalFlags: TraversalFlags = { isValue: false, printTypes: true }): string {
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

  public static makeTypedObjectFromGenericObject2(genObj: any) {
    let objKeys = Object.keys(genObj)
    if (objKeys.find(keyName => keyName == "__gsonClassName")) {
      console.log("Object is GsonClass!!!!!!!!!!!!!!!!!!!!!!!!")
      let ObjClass = genObj["__gsonClassName"];
      let specificObject = eval(`new ${ObjClass}()`);

      let objKeys = Object.keys(genObj)
      objKeys.forEach(key => {

        let keyObj = genObj[key];

        let keyObjType = GsonClass.distinguishType(keyObj);


        switch (keyObjType) {
          case GsonTypes.BOOLEAN:
          case GsonTypes.NUMBER:
          case GsonTypes.STRING:
            specificObject[key] = genObj[key]
            break;
          case GsonTypes.SET:
            specificObject[key] = new Set(genObj[key])
            break;
          case GsonTypes.ARRAY:
            specificObject[key] = genObj[key];
            break;
          case GsonTypes.MAP:
            return GsonTypes.MAP;
            break;
          case GsonTypes.SYMBOL:
            return GsonTypes.SYMBOL;
            break;
          default:
            specificObject[key] = GsonClass.makeTypedObjectFromGenericObject2(genObj[key]);
        }
      });
      return specificObject;
    }
    return null;
  }


}


class GsonFoo extends GsonClass {
  public s: string;

  public fooSet: Set<number>;
  public fooFlag: boolean;
  public fooMap: Map<string, number>;

  constructor(numThings: number) {
    super();
    this.fooSet = new Set<number>();
    this.fooFlag = true;
    this.s = "I'm a FOO!"
    this.fooMap = new Map();
    this.fooMap.set("Foo", 7);
    //this.myMap.set("mapFlag", true);
    this.fooSet.add(23);
    this.fooSet.add(27);
    this.fooSet.add(29);
    this.fooSet.add(23);
  }

  toJSON() {
    let jsonObj: any = super.toJSON();
    jsonObj["fooSet"] = GsonClass.setToArray(this.fooSet);
    jsonObj["s"] = this.s;
    jsonObj["myMap"] = GsonClass.objectifyMap(this.fooMap);
    jsonObj["GsonFootoJSONWorks"] = true;
    return jsonObj;
  }
}


class GSTestClass extends GsonClass {

  private _innerObjects: GSTestClass[];

  public singleGSFooObj: GsonFoo;
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
    this.singleGSFooObj = new GsonFoo(5)
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
    jsonObj.myMap = Object();
    jsonObj.foo = this.myMap;
    jsonObj.singleGSFooObj = this.singleGSFooObj;

    for (const [key, value] of this.myMap.entries()) {
      console.log(key, value);
      jsonObj.myMap[key] = value;
    }

    jsonObj.bar = GsonClass.objectifyMap(this.myMap);
    // (this.myMap).forEach((val, key) => {
    //   jsonObj.myMap.set(key, val);
    // })
    return jsonObj;
  }



}

export { Rocket, JsonClass, Gson, GsonClass, GSTestClass }
//console.log(`Is the rocket empty? ${(rocket as any).isEmpty()}`)



  
  

  


  










  

 






