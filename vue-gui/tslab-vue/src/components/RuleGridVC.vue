<script setup lang="ts">

import { useRulesStore } from '@/stores/rules'
import { RuleGrid } from "./../../../../ParametricGrid"
import { type ColorInfo } from "./ParametricGridVC.vue"

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
    id: string
}>()

let ruleGrid = new RuleGrid<any>(props.width, props.height, props.defaultValue);
let viewBox = `0 0 ${props.width} ${props.height}`;

setRule(props.id, ruleGrid)

</script>

<template>
    <div v-if="programaticallyCreated">
        <svg :viewBox="viewBox" :width="props.screenWidth" :height="props.screenHeight"
            xmlns="http://www.w3.org/2000/svg">
            <svg :key="y" v-for="(row, y) in ruleGrid.grid" xmlns="http://www.w3.org/2000/svg">
                <svg :key="x" v-for="(cellval, x) in row">
                    <rect
                        @click="ruleGrid.setLocation(x, y, conversionFn(onClickValue.value)); console.log(getRule(props.id)); console.log(vizFn(conversionFn(onClickValue.value))); $forceUpdate()"
                        :x="x" :y="y" width="1" height="1" :fill="vizFn(cellval).fillRGB" />
                </svg>
            </svg>
        </svg>
    </div>
    <div v-else>
        <svg :viewBox="viewBox" :width="props.screenWidth" :height="props.screenHeight"
            xmlns="http://www.w3.org/2000/svg">
            <svg :key="y" v-for="(row, y) in ruleGrid.grid" xmlns="http://www.w3.org/2000/svg">
                <svg :key="x" v-for="(cellval, x) in row">
                    <rect
                        @click="ruleGrid.setLocation(x, y, conversionFn(onClickValue)); console.log(getRule(props.id)); console.log(vizFn(conversionFn(onClickValue))); $forceUpdate()"
                        :x="x" :y="y" width="1" height="1" :fill="vizFn(cellval).fillRGB" />
                </svg>
            </svg>
        </svg>
    </div>
</template>
