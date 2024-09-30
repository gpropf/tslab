
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

  public get useJSONForKeys() {
    return this.__useJSONForKeys;
  }

  public get excludeKeys() {
    return this.__excludeKeys;
  }

  public static traverseObject(obj: any, depth: number = 0, maxDepth: number = 6, useJSON: boolean = false) {
    let tabs: string = ""
    let tab: string = "\t"
    for (let i = 0; i < depth; i++) {
      tabs += tab;
    }
    // if (obj.__useJSONForKeys) {
    //   console.log(`obj.__useJSONForKeys EXISTS!!!!: ${obj.__useJSONForKeys}`)
    // }
    if (useJSON) {
      console.log(`${tabs}${JSON.stringify(obj)}`)
    } else if (obj !== null && obj.constructor !== undefined) {
      switch (obj.constructor) {
        case Boolean:
          console.log(`${tabs}"${obj}"`)
          break;
        case String:
          console.log(`${tabs}"${obj}"`)
          break;
        case Number:
          console.log(`${tabs}"${obj}"`);
          break;
        case Map:
          console.log(`${tabs}{`);
          obj.forEach((value: any, key: any) => {
            console.log(`${tabs}"${key}" : `)
            GsonClass.traverseObject(value, depth + 1, maxDepth);
          })
          console.log(`${tabs}}`);
          break;
        case Set:
          console.log(`${tabs}{`)
          obj.forEach(function (value: any) {
            GsonClass.traverseObject(value, depth + 1, maxDepth);
          });
          console.log(`${tabs}}`);
          break;
        case Array:
          console.log(`${tabs}[`);
          for (let key of obj) {
            //console.log(`${tabs}ITEM: ${key}`);
            this.traverseObject(key, depth + 1, maxDepth);
          }
          console.log(`${tabs}]`)
          break;
        default: // Object of some type
          console.log(`${tabs}{{`);
          for (const [key, value] of Object.entries(obj)) {
            if (obj.__excludeKeys && obj.__excludeKeys.has(key)) {
              continue;
            }
            try { console.log(`${tabs}"${key}" :`); }
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
              //console.log("Key __useJSONForKeys EXISTS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
              if (depth <= maxDepth)
                this.traverseObject(value, depth + 1, maxDepth, obj.__useJSONForKeys.has(key));
            }
            else {
              if (depth <= maxDepth)
                this.traverseObject(value, depth + 1, maxDepth);
            }

          }
          console.log(`${tabs}}}`);

      }
    }
    else {
      console.log(`${tabs}${JSON.stringify(obj)}`)
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

