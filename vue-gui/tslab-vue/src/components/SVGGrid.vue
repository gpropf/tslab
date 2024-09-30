<script setup lang="ts">

// import { useRulesStore } from '@/stores/rules'
import { ParametricGrid, RuleGrid } from "../../../../PixelReactor"
import { type ColorInfo, type ObjectVisualizationFn, type ConversionFn } from "./ParametricGridVC.vue"
import { inject, ref, onUpdated, onMounted, getCurrentInstance } from 'vue'
import { useRulesStore } from '@/stores/rules'

const rules = useRulesStore();
const { getMouseLocation, setMouseLocation, setPixelReactor, getPixelReactor } = rules;

//const { mouseLocation, updateMouseLocation } = inject('mouseLocation');

const props = defineProps<{
    width: number | undefined,
    height: number | undefined,
    screenWidth: number,
    screenHeight: number,
    vizFn: ObjectVisualizationFn,
    defaultValue: any,
    onClickValue: any,    
    conversionFn: ConversionFn,
    id: string,
    prGrid: ParametricGrid<any> | RuleGrid<any>
}>()

let viewBox = `0 0 ${props.width} ${props.height}`;

const svgGrid = ref()

onMounted(() => {
    // text content should be the same as current `count.value`
    //console.log("SVGGrid mounted!")
    const instance = getCurrentInstance();
    props.prGrid.vueComponent = instance?.proxy;
    //console.log("VC (SVGGrid): ", props.prGrid.vueComponent);

})

onUpdated(() => {
    // text content should be the same as current `count.value`
    console.log("SVGGrid updated!")
})

</script>

<template>    
    <div ref="svgGrid">
        <svg :viewBox="viewBox" :width="props.screenWidth" :height="props.screenHeight"
            xmlns="http://www.w3.org/2000/svg">
            <svg :key="y" v-for="(row, y) in props.prGrid.grid" xmlns="http://www.w3.org/2000/svg">
                <svg :key="x" v-for="(cellval, x) in row">
                    <rect
                        @click="props.prGrid.setLocation(x, y, props.conversionFn(props.onClickValue)); console.log(props.vizFn(props.conversionFn(props.onClickValue)));"
                        :x="x" :y="y" width="1" height="1" stroke-width="0.05" :stroke="props.vizFn(cellval).strokeRGB" :fill="props.vizFn(cellval).fillRGB" @mouseover="setMouseLocation([x,y])"/>
                </svg>
            </svg>
        </svg>
    </div>
</template>
