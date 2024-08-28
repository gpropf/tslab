<script setup lang="ts">

// import { useRulesStore } from '@/stores/rules'
import { ParametricGrid, RuleGrid } from "./../../../../ParametricGrid"
import { type ColorInfo, type ObjectVisualizationFn, type ConversionFn } from "./ParametricGridVC.vue"
import { inject } from 'vue'

const mouseLocation = inject('mouseLocation');

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
    prGrid: ParametricGrid<any> | RuleGrid<any>
}>()

let viewBox = `0 0 ${props.width} ${props.height}`;



</script>

<template>
    <div v-if="programaticallyCreated">
        <svg :viewBox="viewBox" :width="props.screenWidth" :height="props.screenHeight"
            xmlns="http://www.w3.org/2000/svg">
            <svg :key="y" v-for="(row, y) in props.prGrid.grid" xmlns="http://www.w3.org/2000/svg">
                <svg :key="x" v-for="(cellval, x) in row">
                    <rect
                        @click="props.prGrid.setLocation(x, y, props.conversionFn(props.onClickValue.value)); console.log(props.vizFn(props.conversionFn(props.onClickValue.value))); $forceUpdate()"
                        :x="x" :y="y" width="1" height="1" :fill="props.vizFn(cellval).fillRGB" @mouseover="console.log(`MOUSE POS: ${x}, ${y}`); mouseLocation = [x,y]" />
                </svg>
            </svg>
        </svg>
    </div>
    <div v-else>
        <svg :viewBox="viewBox" :width="props.screenWidth" :height="props.screenHeight"
            xmlns="http://www.w3.org/2000/svg">
            <svg :key="y" v-for="(row, y) in props.prGrid.grid" xmlns="http://www.w3.org/2000/svg">
                <svg :key="x" v-for="(cellval, x) in row">
                    <rect
                        @click="props.prGrid.setLocation(x, y, props.conversionFn(props.onClickValue)); console.log(props.vizFn(props.conversionFn(props.onClickValue))); $forceUpdate()"
                        :x="x" :y="y" width="1" height="1" :fill="props.vizFn(cellval).fillRGB" @mouseover="console.log(`MOUSE POS: ${x}, ${y}`); mouseLocation = [`${x},${y}`]"/>
                </svg>
            </svg>
        </svg>
    </div>
</template>
