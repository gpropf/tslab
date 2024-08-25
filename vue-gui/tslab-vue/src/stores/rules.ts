import { ref } from 'vue'
import { defineStore } from 'pinia'
import { RuleGrid } from "../../../../ParametricGrid"

export const useRulesStore = defineStore('rules', () => {
  //const count = ref(0)
  //const ruleCount = ref(0)
  //const ruleGrids = ref([])
  const ruleGridMap = ref(new Map<string, RuleGrid<any>>);
  //const doubleCount = computed(() => count.value * 2)
  // function increment() {
  //   count.value++
  // }
  // function addRule(ruleGrid) {
  //   ruleGrids.value.push(ruleGrid)
  //   ruleCount.value++
  //   console.log("Adding Rule with PG: ", ruleGrid)
  //   console.log("There are now", ruleCount.value, "rules.")
  // }
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
