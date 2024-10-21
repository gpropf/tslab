<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';


import { useRulesStore } from '@/stores/rules';
const rules = useRulesStore();
const { getMouseLocation, setMouseLocation, setPixelReactor, getPixelReactor } = rules;

let prRef = getPixelReactor();
//prRef.value.setRule(props.id, ruleGrid)

//const ruleIds: string[] = prRef.value.getAllRuleIds();

//console.log("ruleIds: ", ruleIds)
const props = defineProps<{
  fromRuleId: string
}>()
//ruleGridMap.keys().filter((id) => {return id != props.fromRuleId})
const selectedRule = ref("")

const filteredKeys = computed(() => {
  let keys: string[] = Array.from(prRef.value.getAllRuleIds());
  keys.unshift("Select Successor");
  return keys.filter(id => id != props.fromRuleId && id != "MAIN");
})

function changeSelectedRule(event: any) {
  if (event.target === null) return
  selectedRule.value = event.target.value;
  let thisRule = prRef.value.getRule(props.fromRuleId)
  let successor = prRef.value.getRule(selectedRule.value)
  if (thisRule && successor) {
    thisRule.successor = successor
    console.log("For rule ", props.fromRuleId, ", Successor: ", selectedRule.value, " @ offset: ", thisRule.successorOffset);
  }
}

let thisRule = prRef.value.getRule(props.fromRuleId);
let successorRuleId: string = ""
if (thisRule.successor)
  successorRuleId = thisRule.successor.id;

onMounted(() => {
  console.log("RuleGridSelect mounted!!!")
  console.log(`For rule ${thisRule.id}, successor is ${successorRuleId}`);
});

// function keyIsSelected(key: string, selection: string) {
//   return (key === selection);
// }

</script>

<template>
  <select @change="changeSelectedRule($event)">
    <option v-for="key in filteredKeys" :key="key" :selected="key === successorRuleId">
      {{ key }}
    </option>
  </select>

</template>