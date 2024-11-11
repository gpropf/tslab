<script setup lang="ts">

import { useRulesStore } from '@/stores/rules'
import { RuleGrid, type Vec2d, zeroVec } from "../../PixelReactor"
//import { type ColorInfo } from "./ParametricGridVC.vue"
import { type ColorInfo, type ObjectVisualizationFn, type ConversionFn } from "./ParametricGridVC.vue"
import SVGGrid from './SVGGrid.vue';
import LabelledInput from './LabelledInput.vue';
import RuleSelect from './RuleSelect.vue';
import { ref, onUpdated, onMounted } from 'vue'

const rules = useRulesStore();
const { getMouseLocation, setMouseLocation, setPixelReactor, getPixelReactor } = rules;

//type ObjectVisualizationFn = (a: any) => ColorInfo
//type ConversionFn = (a: any) => any


const props = defineProps<{
  rule: RuleGrid<any>,
  width: number | undefined,
  height: number | undefined,
  screenWidth: number,
  screenHeight: number,
  vizFn: ObjectVisualizationFn,
  defaultValue: any,
  onClickValue: any,
  conversionFn: ConversionFn,
  id: string,
  priority: number | undefined
}>()

let prRef = getPixelReactor();

//let ruleGrid = new RuleGrid<any>(props.width, props.height, props.defaultValue, props.id);
//let ruleGrid = prRef.value.getRule(props.id)
let ruleGrid = props.rule
let viewBox = `0 0 ${props.width} ${props.height}`;
const ruleOffsetString = ref("")


//setRule(props.id, ruleGrid)


//prRef.value.setRule(props.id, ruleGrid)



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

onMounted(() => {
  console.log("RuleGridVC mounted!!!")
  let [sx, sy] = ruleGrid.successorOffset;
  ruleOffsetString.value = `${sx},${sy}`;
});


onUpdated(() => {
  // text content should be the same as current `count.value`
  console.log("RG updated!")
})

</script>

<template>
  <!-- <div ref="root"> -->
  <LabelledInput v-model:inputValue="ruleGrid.priority" id="rule-grid-priority" inputType="text"
    placeholder="Enter priority for rule" componentName="Rule Priority" size="3" labelClass="medium" />
  <span>id: {{ ruleGrid.id }}</span><button @click="prRef.deleteRule(ruleGrid.id)">Delete Rule</button>
  <SVGGrid :screenWidth="props.screenWidth" :screenHeight="props.screenHeight" :width="ruleGrid.width"
    :height="ruleGrid.height" :vizFn="props.vizFn" :defaultValue="0" :onClickValue="props.onClickValue"
    :conversionFn="props.conversionFn" :id="props.id" :prGrid="ruleGrid" />
  <RuleSelect :fromRuleId="ruleGrid.id" />
  <input type="text" v-model="ruleOffsetString" placeholder="Offset" size="3" @input="changeOffset">

  <!-- <LabelledInput v-model:inputValue="ruleOffset" id="rule-offset" inputType="text"
      placeholder="Enter offset as a comma-delimited string" componentName="Offset String" size="4"/> -->
  <!-- </div> -->
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