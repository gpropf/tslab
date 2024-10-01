
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



class GsonClass {
  protected __gsonClassName = "GsonClass"
  protected __useJSONForKeys = new Set()
  protected __excludeKeys = new Set()
  public toJSON() {
    return {
      __gsonClassName: this.__gsonClassName
    }
  }

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

  public static traverseObject(obj: any, depth: number = 0, maxDepth: number = 6,
    useJSON: boolean = false, suppressInitialTabs: boolean = false) {
    let tabs: string = ""
    //if (!suppressTabs) {
      let tab: string = "\t"
      for (let i = 0; i < depth; i++) {
        tabs += tab;
      }
    //}
    // if (obj.__useJSONForKeys) {
    //   GsonClass.log(`obj.__useJSONForKeys EXISTS!!!!: ${obj.__useJSONForKeys}`)
    // }
    if (useJSON) {
      GsonClass.lognl(`${tabs}${JSON.stringify(obj)}`)
    } else if (obj !== null && obj.constructor !== undefined) {
      switch (obj.constructor) {
        case Boolean:
          GsonClass.lognl(`${tabs}"${obj}"`)
          break;
        case String:
          GsonClass.lognl(`${tabs}"${obj}"`)
          break;
        case Number:
          GsonClass.lognl(`${tabs}"${obj}"`);
          break;
        case Map:
          // if (suppressInitialTabs) {
          //   GsonClass.lognl(`{`);
          // }
          // else {
            GsonClass.lognl(`${tabs}{`);
          //}          
          obj.forEach((value: any, key: any) => {
            GsonClass.log(`${tabs}"${key}" : `)
            GsonClass.traverseObject(value, depth + 1, maxDepth, false, false);
            //GsonClass.lognl()
          })
          GsonClass.lognl(`${tabs}}`);
          break;
        case Set:
          if (suppressInitialTabs) {
            GsonClass.lognl(`{`)
          }
          else {
            GsonClass.lognl(`${tabs}{`)
          }
          
          obj.forEach(function (value: any) {
            GsonClass.traverseObject(value, depth + 1, maxDepth);
          });
          GsonClass.lognl(`${tabs}}`);
          break;
        case Array:          
          if (suppressInitialTabs) {
            GsonClass.lognl(`[`);
          }
          else {
            GsonClass.lognl(`${tabs}[`);
          }
          for (let key of obj) {
            //GsonClass.log(`${tabs}ITEM: ${key}`);
            this.traverseObject(key, depth + 1, maxDepth);
          }
          GsonClass.lognl(`${tabs}]`)
          break;
        default: // Object of some type
          //GsonClass.lognl(`${tabs}{{`);
          //if (suppressInitialTabs) {
          //  GsonClass.lognl(`{{`);
          //}
          //else {
            GsonClass.lognl(`${tabs}{{`);
          //}
          for (const [key, value] of Object.entries(obj)) {
            if (obj.__excludeKeys && obj.__excludeKeys.has(key)) {
              continue;
            }
            try { GsonClass.log(`${tabs}"${key}" :`); }
            catch (e: unknown) { // <-- note `e` has explicit `unknown` type
              (e as Error).message // errors
              if (typeof e === "string") {
                e.toUpperCase() // works, `e` narrowed to string
              } else if (e instanceof Error) {
                e.message // works, `e` narrowed to Error
              }
              // ... handle other error types 
            }
            if (obj.__useJSONForKeys) {
              //GsonClass.log("Key __useJSONForKeys EXISTS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
              if (depth <= maxDepth)
                this.traverseObject(value, depth + 1, maxDepth, obj.__useJSONForKeys.has(key), true);
            }
            else {
              if (depth <= maxDepth)
                this.traverseObject(value, depth + 1, maxDepth, false, true);
            }

          }
          GsonClass.lognl(`${tabs}}}`);

      }
    }
    else {
      // obj has no constructor so we just stringify it.
      GsonClass.lognl(`${tabs}${JSON.stringify(obj)}`)
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

  public static fromJSON(jsonString: string) {
    let parsedObj = JSON.parse(jsonString)
    let restoredObj = this.makeTypedObjectFromGenericObject(parsedObj);
    return restoredObj;
  }
}


class GsonFoo extends GsonClass {
  public s: string;
  public myMap: Map<string, number>;

  constructor() {
    super();
    this.s = "I'm a FOO!"
    this.myMap = new Map();
    this.myMap.set("Foo", 7);
  }
}


class GSTestClass extends GsonClass {

  private _innerObjects: GSTestClass[];

  public singleGSTestObj: GsonFoo;
  public _id: string;
  public myMap: Map<string, number>;

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

