import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { ParametricGrid } from "../../../../ParametricGrid"

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const ruleCount = ref(0)
  const ruleGrids = ref([])
  const ruleGridMap = ref(new Map<string, ParametricGrid>());
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }
  function addRule(ruleGrid) {
    ruleGrids.value.push(ruleGrid)
    ruleCount.value++
    console.log("Adding Rule with PG: ", ruleGrid)
    console.log("There are now", ruleCount.value, "rules.")
  }
  function setRule(id, pgrid) {
    ruleGridMap.value.set(id, pgrid)
    console.log(ruleGridMap.value)
  }
  function getRule(id) {
    let rg = ruleGridMap.value.get(id)
    console.log(rg)
  }
  

  return { count, doubleCount, ruleGridMap, increment, addRule, setRule, getRule }
})
