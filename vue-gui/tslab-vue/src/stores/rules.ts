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

  return { ruleGridMap, setRule, getRule }
})
