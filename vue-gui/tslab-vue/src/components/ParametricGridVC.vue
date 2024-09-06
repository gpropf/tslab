<script setup lang="ts">

import { useRulesStore } from '@/stores/rules'
import { ParametricGrid, RuleGrid } from "../../../../PixelReactor"
import SVGGrid from './SVGGrid.vue';
//import { inject } from 'vue'

import { ref } from 'vue'

// const mouseLocation = ref([0,0]);

// provide('mouseLocation', mouseLocation);

//const mouseLocation = inject('mouseLocation');

export interface ColorInfo {
    fillRGB: string;
}

const rules = useRulesStore();
const { ruleGridMap, setRule, getRule } = rules;

export type ObjectVisualizationFn = (a: any) => ColorInfo
export type ConversionFn = (a: any) => any

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
    id: string    
}>()

let parametricGrid = new ParametricGrid<any>(props.width, props.height, props.defaultValue);
let viewBox = `0 0 ${props.width} ${props.height}`;

setRule(props.id, parametricGrid as RuleGrid<any>)

</script>

<template>
    
    <SVGGrid :screenWidth="props.screenWidth" :screenHeight="props.screenHeight"
      :width="props.width" :height="props.height" :vizFn="props.vizFn" :defaultValue="0"
      :onClickValue="props.onClickValue" :programaticallyCreated="false" :conversionFn="props.conversionFn"
       :id="props.id" :prGrid="parametricGrid"/>
</template>
