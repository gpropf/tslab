
// function WithFuel(target: typeof Rocket, context): typeof Rocket {
//   if (context.kind === "class") {
//     target.prototype.fuel = 50
//     target.prototype.isEmpty = (): boolean => {
//       return this.fuel == 0
//     }
//   }
// }

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
  
  export { Rocket, JsonClass }
  //console.log(`Is the rocket empty? ${(rocket as any).isEmpty()}`)
  
  