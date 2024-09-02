<script setup lang="ts">

import { useRulesStore } from '@/stores/rules'
import { RuleGrid } from "./../../../../ParametricGrid"
import { type ColorInfo } from "./ParametricGridVC.vue"
import SVGGrid from './SVGGrid.vue';
import LabelledInput from './LabelledInput.vue';

const rules = useRulesStore();
const { ruleGridMap, setRule, getRule } = rules;

type ObjectVisualizationFn = (a: any) => ColorInfo
type ConversionFn = (a: any) => any


const props = defineProps<{
    width: number,
    height: number,
    screenWidth: number,
    screenHeight: number,
    vizFn: ObjectVisualizationFn,
    defaultValue: any,
    onClickValue: any,
    programaticallyCreated: boolean
    conversionFn: ConversionFn,
    id: string,
    priority: number
}>()

let ruleGrid = new RuleGrid<any>(props.width, props.height, props.defaultValue);
let viewBox = `0 0 ${props.width} ${props.height}`;

setRule(props.id, ruleGrid)

</script>

<template>
    <LabelledInput v-model:inputValue="ruleGrid.priority" id="rule-grid-priority" inputType="text"
    placeholder="Enter priority for rule" componentName="Rule Priority" size="3" labelClass="medium"/>
    <span>id: {{ props.id }}</span>
    <SVGGrid :screenWidth="props.screenWidth" :screenHeight="props.screenHeight"
      :width="props.width" :height="props.height" :vizFn="props.vizFn" :defaultValue="0"
      :onClickValue="props.onClickValue" :programaticallyCreated="true" :conversionFn="props.conversionFn"
       :id="props.id" :prGrid="ruleGrid"/>
</template>
