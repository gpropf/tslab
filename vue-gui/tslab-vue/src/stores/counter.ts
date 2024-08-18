import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { ParametricGrid } from "../../../../ParametricGrid"

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const ruleCount = ref(0)
  const ruleGrids: ParametricGrid[] = ref([])
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
  

  return { count, doubleCount, increment, addRule }
})
