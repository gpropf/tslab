<script setup lang="ts">
import { computed, ref } from 'vue';


import { useRulesStore } from '@/stores/rules';
const rules = useRulesStore();
const { ruleGridMap, setRule, getRule, serialize, getMouseLocation, setMouseLocation, getAllRuleIds } = rules;

const ruleIds: string[] = getAllRuleIds();
const props = defineProps<{
    fromRuleId: string
}>()
//ruleGridMap.keys().filter((id) => {return id != props.fromRuleId})
const selectedRule = defineModel('selectedRule')

const filteredKeys = computed(() => {
  let keys = Array.from(ruleGridMap.keys());
  keys.unshift("Select Successor");
  return keys.filter(id => id != props.fromRuleId && id != "MAIN");
}) 

function changeSelectedRule(event) {
  selectedRule.value = event.target.value;
  let thisRule = getRule(props.fromRuleId)
  console.log("New Selection: ", selectedRule.value, " @ offset: ",  thisRule.successorOffset);
}

</script>

<template>
    <select @change="changeSelectedRule($event)">
    <option v-for="key in filteredKeys" :key="key">
      {{ key }}    
    </option>
    </select>

</template>