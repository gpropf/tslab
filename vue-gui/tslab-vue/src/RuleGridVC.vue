<script setup lang="ts">

//import { useCounterStore } from '@/stores/counter'
import { useRulesStore } from '@/stores/rules'

//import { ref } from 'vue'
import { ParametricGrid, RuleGrid, Rocket, TransformMatrix, rotationMap } from "./../../../ParametricGrid"
import { type Vec2d } from "./../../../ParametricGrid"
//import { inject } from "vue";

export interface ColorInfo {
    fillRGB: string;
}

//const store = useCounterStore();
//const { count, doubleCount, ruleGridMap, increment, setRule, getRule } = store;

const rules = useRulesStore();
const { ruleGridMap, setRule, getRule } = rules;

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
    id: string,
    isRuleGrid: boolean
}>()

let ruleGrid = new RuleGrid<any>(props.width, props.height, props.defaultValue, props.isRuleGrid);
//ruleGrid.setLocation(2, 1, 120)
//console.log(ruleGrid);
var viewBox = `0 0 ${props.width} ${props.height}`;

//const newTask = inject<number>("newTask", 75);
let rckt = new Rocket();
rckt.addFuel(10);

//increment();
//addRule(ruleGrid)
setRule(props.id, ruleGrid)

//addRule(ruleGrid);
function rotateVec(v: Vec2d) {
    let rm: TransformMatrix | undefined = rotationMap.get(90);
    if (rm) {
        let rmat = rm.multiplyByVec(v);
        return rmat;
    }
    return null;
    
}

</script>

<template>
    <div v-if="programaticallyCreated">
        <div>This PG was created dynamically!</div>
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
        <div>This PG was NOT created dynamically!</div>
        <svg :viewBox="viewBox" :width="props.screenWidth" :height="props.screenHeight"
            xmlns="http://www.w3.org/2000/svg">
            <svg :key="y" v-for="(row, y) in ruleGrid.grid" xmlns="http://www.w3.org/2000/svg">
                <svg :key="x" v-for="(cellval, x) in row">
                    <rect
                        @click="ruleGrid.setLocation(x, y, conversionFn(onClickValue)); console.log(rotateVec([x,y])); console.log(getRule(props.id)); console.log(vizFn(conversionFn(onClickValue))); $forceUpdate()"
                        :x="x" :y="y" width="1" height="1" :fill="vizFn(cellval).fillRGB" />
                </svg>
            </svg>
        </svg>
    </div>
</template>
