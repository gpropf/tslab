import { ref } from 'vue'
import { defineStore } from 'pinia'
import { RuleGrid, type Vec2d } from "../../../../ParametricGrid"

export const useRulesStore = defineStore('rules', () => {
  
  const ruleGridMap = ref(new Map<string, RuleGrid<any>>);
  const mouseLocation = ref([-1,-1])
  
  function setRule(id: string, pgrid: RuleGrid<any>) {
    ruleGridMap.value.set(id, pgrid)
    console.log(ruleGridMap.value)
  }

  function getRule(id: string) {
    const rg = ruleGridMap.value.get(id)
    console.log(rg)
    return rg
  }  

  function serialize(): Map<string, string> {
    let ruleStringMap = new Map<string, string>();
    ruleGridMap.value.forEach((rule, id) => {
      ruleStringMap.set(id, JSON.stringify(rule))
      //console.log(id,":", JSON.stringify(rule))
    });
    return ruleStringMap;
  }

  function deserialize(jsonText: string) {
    
  }

  function getMouseLocation() {
    return mouseLocation;
  }

  function setMouseLocation(newLoc: Vec2d) {
    mouseLocation.value = newLoc;
    //console.log(newLoc)
  }

  return { ruleGridMap, setRule, getRule, serialize, getMouseLocation, setMouseLocation }
})
