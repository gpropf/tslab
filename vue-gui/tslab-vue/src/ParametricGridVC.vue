<script setup lang="ts">
import { ref } from 'vue'
import { ParametricGrid } from "./../../../pgrid"
import { inject } from "vue";

export interface ColorInfo {
    fillRGB: string;
}

type ObjectVisualizationFn = (a: any) => ColorInfo
type ConversionFn = (a: any) => any

const count = ref(10)

const props = defineProps<{
    width: number,
    height: number,
    vizFn: ObjectVisualizationFn,
    defaultValue: any,
    onClickValue: any,
    programaticallyCreated: boolean
    conversionFn: ConversionFn
}>()

let parametricGrid = new ParametricGrid<any>(props.width, props.height, props.defaultValue);
//parametricGrid.setLocation(2, 1, 120)
console.log(parametricGrid);
var viewBox = `0 0 ${props.width} ${props.height}`;

const newTask = inject<number>("newTask", 75);

</script>

<template>
    <!-- <button @click="count++; parametricGrid.setLocation(3, 2, count * 5)">You clicked me {{ count }} times.></button>
    <div>WIDTH: {{ parametricGrid.width }}</div>
    <div>HEIGHT: {{ parametricGrid.height }}</div>
    <div>Click val: {{ onClickValue }}</div>
    <div>Provide/inject test val: {{ newTask }}</div> -->

    <div v-if="programaticallyCreated"><div>This PG was created dynamically!</div>
        <svg :viewBox="viewBox" width="320" height="200" xmlns="http://www.w3.org/2000/svg">
            <svg v-for="(row, y) in parametricGrid.grid" xmlns="http://www.w3.org/2000/svg">
                <svg v-for="(cellval, x) in row">
                    <rect
                        @click="parametricGrid.setLocation(x, y, conversionFn(onClickValue.value)); console.log(parametricGrid); console.log(vizFn(conversionFn(onClickValue.value))); $forceUpdate()"
                        :x="x" :y="y" width="1" height="1" :fill="vizFn(cellval).fillRGB" />
                </svg>
            </svg>
        </svg>
    </div>
    <div v-else="programaticallyCreated"><div>This PG was NOT created dynamically!</div>
        <svg :viewBox="viewBox" width="320" height="200" xmlns="http://www.w3.org/2000/svg">
            <svg v-for="(row, y) in parametricGrid.grid" xmlns="http://www.w3.org/2000/svg">
                <svg v-for="(cellval, x) in row">
                    <rect
                        @click="parametricGrid.setLocation(x, y, conversionFn(onClickValue)); console.log(parametricGrid); console.log(vizFn(conversionFn(onClickValue))); $forceUpdate()"
                        :x="x" :y="y" width="1" height="1" :fill="vizFn(cellval).fillRGB" />
                </svg>
            </svg>
        </svg>
    </div>
</template>
