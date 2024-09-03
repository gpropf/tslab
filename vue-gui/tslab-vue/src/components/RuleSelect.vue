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

let keys = Array.from(ruleGridMap.keys());
const filteredKeys = keys.filter(id => id != props.fromRuleId)


</script>

<template>
    <select>
    <option v-for="key in filteredKeys" :key="key">
      Key: {{ key }}
    
    </option>
    </select>

</template>