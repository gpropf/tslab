
// function WithFuel(target: typeof Rocket, context): typeof Rocket {
//   if (context.kind === "class") {
//     target.prototype.fuel = 50
//     target.prototype.isEmpty = (): boolean => {
//       return this.fuel == 0
//     }
//   }
// }

//import { stringify } from "querystring";

function logFuel(target: Function, context: any) {
  const original = target.prototype.addFuel;
  target.prototype.addFuel = function (message: string) {
    console.log(`Before adding fuel, total fuel: ${this.fuel}`);
    original.apply(this, arguments);
    console.log(`After adding fuel, total fuel: ${this.fuel}`);
  };
}

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
  public toJSON() {
    return {
      __gsonClassName: this.__gsonClassName
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
        specificObject[key] = genObj[key];
      })
      return specificObject;
    }
    return genObj;
  }

  public static fromJSON(jsonString: string) {
    let parsedObj = JSON.parse(jsonString)

    let objKeys = Object.keys(parsedObj)
    let restoredObj = null
    if (objKeys.find(keyName => keyName == "__gsonClassName")) {
      console.log("Object is GsonClass!!!!!!!!!!!!!!!!!!!!!!!!")
      let ObjClass = parsedObj["__gsonClassName"]
      restoredObj = eval(`new ${ObjClass}()`);
    }

    if (restoredObj) {
      objKeys.forEach(key => {
        console.log(`parsed object key: ${key}, type: ${typeof (parsedObj[key])}`)
        if (typeof (parsedObj[key]) == "object") {
          let specificObj = this.makeTypedObjectFromGenericObject(parsedObj[key])
          restoredObj[key] = specificObj
          console.log("KEY IS OBJECT!!!!!!!")
        }
        else {
          restoredObj[key] = parsedObj[key];
        }


      });
    }
    //console.log("restoredObj: ", restoredObj)
    return restoredObj;
  }
}

class GSTestClass extends GsonClass {

  private _innerObjects: GSTestClass[];
  public _id: string;

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
    return jsonObj;
  }



}


export { Rocket, JsonClass, Gson, GsonClass, GSTestClass }
//console.log(`Is the rocket empty? ${(rocket as any).isEmpty()}`)

