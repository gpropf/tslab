<script setup lang="ts">

import { useCounterStore } from '@/stores/counter'

//import { ref } from 'vue'
import { ParametricGrid, Rocket } from "./../../../ParametricGrid"
//import { inject } from "vue";

export interface ColorInfo {
    fillRGB: string;
}

const store = useCounterStore();
const { count, doubleCount, ruleGridMap, increment, setRule, getRule } = store;

type ObjectVisualizationFn = (a: any) => ColorInfo
type ConversionFn = (a: any) => any

//const count = ref(10)

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
//parametricGrid.setLocation(2, 1, 120)
//console.log(parametricGrid);
var viewBox = `0 0 ${props.width} ${props.height}`;

//const newTask = inject<number>("newTask", 75);
let rckt = new Rocket();
rckt.addFuel(10);

increment();
//addRule(parametricGrid)
setRule(props.id, parametricGrid)

//addRule(parametricGrid);

</script>

<template>
    <div v-if="programaticallyCreated">
        <div>This PG was created dynamically!</div>
        <svg :viewBox="viewBox" :width="props.screenWidth" :height="props.screenHeight"
            xmlns="http://www.w3.org/2000/svg">
            <svg :key="y" v-for="(row, y) in parametricGrid.grid" xmlns="http://www.w3.org/2000/svg">
                <svg :key="x" v-for="(cellval, x) in row">
                    <rect
                        @click="parametricGrid.setLocation(x, y, conversionFn(onClickValue.value)); console.log(getRule(props.id)); console.log(vizFn(conversionFn(onClickValue.value))); $forceUpdate()"
                        :x="x" :y="y" width="1" height="1" :fill="vizFn(cellval).fillRGB" />
                </svg>
            </svg>
        </svg>
    </div>
    <div v-else>
        <div>This PG was NOT created dynamically!</div>
        <svg :viewBox="viewBox" :width="props.screenWidth" :height="props.screenHeight"
            xmlns="http://www.w3.org/2000/svg">
            <svg :key="y" v-for="(row, y) in parametricGrid.grid" xmlns="http://www.w3.org/2000/svg">
                <svg :key="x" v-for="(cellval, x) in row">
                    <rect
                        @click="parametricGrid.setLocation(x, y, conversionFn(onClickValue)); console.log(getRule(props.id)); console.log(vizFn(conversionFn(onClickValue))); $forceUpdate()"
                        :x="x" :y="y" width="1" height="1" :fill="vizFn(cellval).fillRGB" />
                </svg>
            </svg>
        </svg>
    </div>
</template>
