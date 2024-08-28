import { ref } from 'vue'
import { defineStore } from 'pinia'
import { RuleGrid } from "../../../../ParametricGrid"

export const useRulesStore = defineStore('rules', () => {
  
  const ruleGridMap = ref(new Map<string, RuleGrid<any>>);
  
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
    let ruleStringMap = new Map<string, string>()
    ruleGridMap.value.forEach((rule, id) => {
      ruleStringMap.set(id, JSON.stringify(rule))
      //console.log(id,":", JSON.stringify(rule))
    });
    return ruleStringMap;
  }

  function deserialize(jsonText: string) {
    
  }

  return { ruleGridMap, setRule, getRule, serialize }
})
