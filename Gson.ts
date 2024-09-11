export class Serializer {
    public describeClass(instance: any): Array<string> {
        return Object.getOwnPropertyNames(instance);
    }
}

function logFuel(target: Function, context: any) {
    const original = target.prototype.addFuel;
    target.prototype.addFuel = function (message: string) {
      console.log(`Before adding fuel, total fuel: ${this.fuel}`);
      original.apply(this, arguments);
      console.log(`After adding fuel, total fuel: ${this.fuel}`);
    };
  }
  
  export function JsonClass(target: Function, context: any) {
    //const original = target.prototype.addFuel;
    target.prototype.class = target.name
    target.prototype.toJSON = function () {
        return {
        
        jsonClass: this.class,
        //parameterType: typeof (this._grid[0][0])
      }
    }
  }
  
  @JsonClass
  export class Rocket {
    fuel: number = 11;
    addFuel(amount: number) {
      this.fuel += amount;
    }
  
  }
  
//   const rocket = new Rocket()
//   console.log((rocket as any).fuel)
//   console.log((rocket as any).class)
//   rocket.addFuel(10);
  //console.log(`Is the rocket empty? ${(rocket as any).isEmpty()}`)
  
  