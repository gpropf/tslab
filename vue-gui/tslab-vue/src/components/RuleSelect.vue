<script setup lang="ts">
import { computed, ref } from 'vue';


import { useRulesStore } from '@/stores/rules';
const rules = useRulesStore();
const { ruleGridMap, setRule, getRule, serialize, getMouseLocation, setMouseLocation, getAllRuleIds } = rules;

const ruleIds: string[] = getAllRuleIds();

const ruleOptions = computed(() => {
    let optionString = "";
    for (let id of ruleIds) {
        optionString += `<option>${id}</option>`;
    }
    return optionString;
    // let options: [] = ruleIds.forEach((id) => { `<option>${id}</option>` });
    // return options;
})
</script>

<template>
    <select>
    {{ ruleOptions }}   
    </select>

</template>