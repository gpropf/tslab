<script setup lang="ts">

import { useRulesStore } from '@/stores/rules'
import { RuleGrid, type Vec2d, zeroVec } from "../../../../PixelReactor"
//import { type ColorInfo } from "./ParametricGridVC.vue"
import { type ColorInfo, type ObjectVisualizationFn, type ConversionFn } from "./ParametricGridVC.vue"
import SVGGrid from './SVGGrid.vue';
import LabelledInput from './LabelledInput.vue';
import RuleSelect from './RuleSelect.vue';
import { ref,onMounted } from 'vue'

const rules = useRulesStore();
const { getMouseLocation, setMouseLocation, setPixelReactor, getPixelReactor } = rules;

//type ObjectVisualizationFn = (a: any) => ColorInfo
//type ConversionFn = (a: any) => any


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

let ruleGrid = new RuleGrid<any>(props.width, props.height, props.defaultValue, props.id);
let viewBox = `0 0 ${props.width} ${props.height}`;
const ruleOffsetString = ref("")


//setRule(props.id, ruleGrid)

let prRef = getPixelReactor();
prRef.value.setRule(props.id, ruleGrid)



let zeroMutableVec: Vec2d = [0, 0]
const ruleOffsetVec = ref(zeroMutableVec)

function stringToVec(s: string): Vec2d {
  const coordinates: string[] = s.split(',');
  if (coordinates.length < 2) return zeroVec;
  let v: Vec2d = [parseInt(coordinates[0]), parseInt(coordinates[1])];
  if (Number.isNaN(v[0]) || Number.isNaN(v[1])) return zeroVec
  return v;
}

function changeOffset() {
    ruleGrid.successorOffset = stringToVec(ruleOffsetString.value)    
}

const root = ref<HTMLElement | null>(null);
//onMounted(() => console.log(root.value));

//let ruleDiv = document.getElementById(props.id)
//console.log("ruleDiv: ", ruleDiv)

</script>

<template>
  <div ref="root">
    <LabelledInput v-model:inputValue="ruleGrid.priority" id="rule-grid-priority" inputType="text"
    placeholder="Enter priority for rule" componentName="Rule Priority" size="3" labelClass="medium"/>
    <span>id: {{ props.id }}</span><button @click="prRef.deleteRule(props.id); root?.parentElement?.remove();">Delete Rule</button>
    <SVGGrid :screenWidth="props.screenWidth" :screenHeight="props.screenHeight"
      :width="props.width" :height="props.height" :vizFn="props.vizFn" :defaultValue="0"
      :onClickValue="props.onClickValue" :programaticallyCreated="true" :conversionFn="props.conversionFn"
       :id="props.id" :prGrid="ruleGrid"/>
       <RuleSelect :fromRuleId="props.id "/>
       <input type="text" v-model="ruleOffsetString" placeholder="Offset"
        @input="changeOffset">
    
       <!-- <LabelledInput v-model:inputValue="ruleOffset" id="rule-offset" inputType="text"
      placeholder="Enter offset as a comma-delimited string" componentName="Offset String" size="4"/> -->
      </div>
</template>

<script lang="ts">

// export default {
//   data() {
//     return {     
//       ruleOffset: ''
//     }
//   },
//   watch: {
//     ruleOffset(value) {
//       let v = stringToVec(value)
//       if (v == null) return null;
//       ruleOffsetVec.value = v;
//       console.log("New value for ruleOffset: ", v)
//     }
//   }
// }

</script>