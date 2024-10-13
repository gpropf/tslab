<script setup lang="ts">

import { useRulesStore } from '@/stores/rules'
import { ParametricGrid, RuleGrid } from "../../../../PixelReactor"
import SVGGrid from './SVGGrid.vue';
//import { inject } from 'vue'

import { ref, onUpdated } from 'vue'

// const mouseLocation = ref([0,0]);

// provide('mouseLocation', mouseLocation);

//const mouseLocation = inject('mouseLocation');

export interface ColorInfo {
    fillRGB: string
    strokeRGB: string;
}

const rules = useRulesStore();
const { getMouseLocation, setMouseLocation, setPixelReactor, getPixelReactor } = rules;

let prRef = getPixelReactor();

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
    conversionFn: ConversionFn,
    id: string
}>()

let parametricGrid = new ParametricGrid<any>(prRef.value, props.width, props.height, props.defaultValue, props.id);
let viewBox = `0 0 ${props.width} ${props.height}`;

//setRule(props.id, parametricGrid as RuleGrid<any>)


prRef.value.setRule(props.id, parametricGrid as RuleGrid<any>);

onUpdated(() => {
    // text content should be the same as current `count.value`
    console.log("PG updated!")
})

</script>

<template>

    <SVGGrid :screenWidth="props.screenWidth" :screenHeight="props.screenHeight" :width="props.width"
        :height="props.height" :vizFn="props.vizFn" :defaultValue="0" :onClickValue="props.onClickValue"
        :conversionFn="props.conversionFn" :id="props.id" :prGrid="parametricGrid" />
</template>
