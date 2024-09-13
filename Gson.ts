
// function WithFuel(target: typeof Rocket, context): typeof Rocket {
//   if (context.kind === "class") {
//     target.prototype.fuel = 50
//     target.prototype.isEmpty = (): boolean => {
//       return this.fuel == 0
//     }
//   }
// }

//import { stringify } from "querystring";

function logFuel(target: Function, context) {
    const original = target.prototype.addFuel;
    target.prototype.addFuel = function (message: string) {
      console.log(`Before adding fuel, total fuel: ${this.fuel}`);
      original.apply(this, arguments);
      console.log(`After adding fuel, total fuel: ${this.fuel}`);
    };
  }
  
  function JsonClass(target: Function, context) {
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
    public serialize(obj: any): string {
        let jsonObj = {}
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

  
  export { Rocket, JsonClass, Gson }
  //console.log(`Is the rocket empty? ${(rocket as any).isEmpty()}`)
  
  