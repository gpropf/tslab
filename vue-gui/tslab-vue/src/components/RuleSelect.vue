<script setup lang="ts">
import { computed, ref } from 'vue';


import { useRulesStore } from '@/stores/rules';
const rules = useRulesStore();
const { ruleGridMap, setRule, getRule, serialize, getMouseLocation, setMouseLocation, getAllRuleIds, getAllMatches, setPixelReactor, getPixelReactor } = rules;

let prRef = getPixelReactor();
//prRef.value.setRule(props.id, ruleGrid)

const ruleIds: string[] = prRef.value.getAllRuleIds();

console.log("ruleIds: ", ruleIds)
const props = defineProps<{
  fromRuleId: string
}>()
//ruleGridMap.keys().filter((id) => {return id != props.fromRuleId})
const selectedRule = ref("")

const filteredKeys = computed(() => {
  let keys = Array.from(prRef.value.getAllRuleIds());
  keys.unshift("Select Successor");
  return keys.filter(id => id != props.fromRuleId && id != "MAIN");
})

function changeSelectedRule(event: any) {
  if (event.target === null) return
  selectedRule.value = event.target.value;
  let thisRule = prRef.value.getRule(props.fromRuleId)
  if (thisRule) {
    console.log("For rule ", props.fromRuleId, ", Successor: ", selectedRule.value, " @ offset: ", thisRule.successorOffset);
  }
}

</script>

<template>
  <select @change="changeSelectedRule($event)">
    <option v-for="key in filteredKeys" :key="key">
      {{ key }}
    </option>
  </select>

</template>