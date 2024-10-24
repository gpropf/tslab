

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

  public static objectifyMap(m: Map<any, any>) {
    let mapObj = Object();
    m.forEach((value: any, key: any) => {
      mapObj[key] = value;
    });
    return mapObj;
  }

  public static mapifyObject(m: any) {
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

  // public static makeTypedObjectFromGenericObject(genObj: any) {
  //   let objKeys = Object.keys(genObj)
  //   if (objKeys.find(keyName => keyName == "__gsonClassName")) {
  //     console.log("Object is GsonClass!!!!!!!!!!!!!!!!!!!!!!!!")
  //     let ObjClass = genObj["__gsonClassName"];
  
  
  //     let specificObject = eval(`new ${ObjClass}()`);
  
  //     let objKeys = Object.keys(genObj)
  //     objKeys.forEach(key => {
  
  //       let keyObj = genObj[key];
  //       console.log(`${genObj.__gsonClassName} key: ${key} -- val: ${keyObj}`)
  //       if (typeof (keyObj) == "object") {
  //         if (keyObj.constructor === Map) {
  //           console.log("Key object is Map!!!!!!!!!!!!!!!!!!!!!!!!")
  //         }
  
  //         if (Array.isArray(keyObj)) {
  //           console.log(`${key} is Array!!!`)
  //           let arr = keyObj as Array<any>
  //           let newArr: any = []
  //           arr.forEach(item => {
  //             newArr.push(this.makeTypedObjectFromGenericObject(item))
  //           })
  //           keyObj = arr;
  //         }
  //         else {
  //           keyObj = this.makeTypedObjectFromGenericObject(keyObj);
  //         }
  //       }
  //       specificObject[key] = keyObj;
  //     })
  //     return specificObject;
  //   }
  //   return genObj;
  // }

  // public static makeTypedObjectFromGenericObject2(genObj: any) {
  //   let objKeys = Object.keys(genObj)
  //   if (objKeys.find(keyName => keyName == "__gsonClassName")) {
  //     console.log("Object is GsonClass!!!!!!!!!!!!!!!!!!!!!!!!")
  //     let ObjClass = genObj["__gsonClassName"];
  //     let specificObject = eval(`new ${ObjClass}()`);

  //     let objKeys = Object.keys(genObj)
  //     objKeys.forEach(key => {

  //       let keyObj = genObj[key];

  //       let keyObjType = GsonClass.distinguishType(keyObj);


  //       switch (keyObjType) {
  //         case GsonTypes.BOOLEAN:
  //         case GsonTypes.NUMBER:
  //         case GsonTypes.STRING:
  //           specificObject[key] = genObj[key]
  //           break;
  //         case GsonTypes.SET:
  //           specificObject[key] = new Set(genObj[key])
  //           break;
  //         case GsonTypes.ARRAY:
  //           specificObject[key] = genObj[key];
  //           break;
  //         case GsonTypes.MAP:
  //           return GsonTypes.MAP;
  //           break;
  //         case GsonTypes.SYMBOL:
  //           return GsonTypes.SYMBOL;
  //           break;
  //         default:
  //           specificObject[key] = GsonClass.makeTypedObjectFromGenericObject2(genObj[key]);
  //       }
  //     });
  //     return specificObject;
  //   }
  //   return null;
  // }
}

export { Gson, GsonClass }
  
  

  


  










  

 






