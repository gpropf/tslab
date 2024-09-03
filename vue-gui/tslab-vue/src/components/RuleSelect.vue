<script setup lang="ts">
import { computed, ref } from 'vue';


import { useRulesStore } from '@/stores/rules';
const rules = useRulesStore();
const { ruleGridMap, setRule, getRule, serialize, getMouseLocation, setMouseLocation, getAllRuleIds } = rules;

const ruleIds: string[] = getAllRuleIds();

const props = defineProps<{
    fromRuleId: string
}>()
</script>

<template>
    <select>
    <option v-for="[key, value] in ruleGridMap" :key="key">
      Key: {{ key }}
    
    </option>
    </select>

</template>