<script setup lang="ts">

import { useRulesStore } from '@/stores/rules'
import { RuleGrid } from "./../../../../ParametricGrid"
import { type ColorInfo } from "./ParametricGridVC.vue"
import SVGGrid from './SVGGrid.vue';
import LabelledInput from './LabelledInput.vue';
import RuleSelect from './RuleSelect.vue';
import { ref } from 'vue'

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
    id: string,
    priority: number
}>()

let ruleGrid = new RuleGrid<any>(props.width, props.height, props.defaultValue);
let viewBox = `0 0 ${props.width} ${props.height}`;

setRule(props.id, ruleGrid)
const toRule = ref("")
</script>

<template>
    <LabelledInput v-model:inputValue="ruleGrid.priority" id="rule-grid-priority" inputType="text"
    placeholder="Enter priority for rule" componentName="Rule Priority" size="3" labelClass="medium"/>
    <span>id: {{ props.id }}</span>
    <SVGGrid :screenWidth="props.screenWidth" :screenHeight="props.screenHeight"
      :width="props.width" :height="props.height" :vizFn="props.vizFn" :defaultValue="0"
      :onClickValue="props.onClickValue" :programaticallyCreated="true" :conversionFn="props.conversionFn"
       :id="props.id" :prGrid="ruleGrid"/>
       <RuleSelect v-model:selectedRule="toRule" :fromRuleId="props.id"/>
       <LabelledInput v-model:inputValue="ruleOffset" id="rule-offset" inputType="text"
      placeholder="Enter offset as a comma-delimited string" componentName="Offset String" size="4"/>
</template>

<script lang="ts">

const zeroVec: Vec2d = [0, 0]
let zeroMutableVec: Vec2d = [0, 0]
const ruleOffsetVec = ref(zeroMutableVec)

function stringToVec(s: string): Vec2d | null {
  const coordinates: string[] = s.split(',');
  if (coordinates.length < 2) return zeroVec;
  let v: Vec2d = [parseInt(coordinates[0]), parseInt(coordinates[1])];
  if (Number.isNaN(v[0]) || Number.isNaN(v[1])) return zeroVec
  return v;
}

function linkRules() {
  //ruleGrid = getRule(fromRule.value)
  let toRuleLocal = getRule(toRule.value)
  if (ruleGrid instanceof RuleGrid && toRuleLocal instanceof RuleGrid && ruleOffsetVec.value.length > 1) {
    console.log("Current Offset:", ruleOffsetVec.value)
    let sr = new SuccessionRule(ruleGrid, toRuleLocal, ruleOffsetVec.value)
    console.log("New SR created: ", sr)
  }
}


export default {
  data() {
    return {     
      ruleOffset: ''
    }
  },
  watch: {
    ruleOffset(value) {
      let v = stringToVec(value)
      if (v == null) return null;
      ruleOffsetVec.value = v;
      let fromRule = getRule(props.id);
      if (fromRule) fromRule.successorOffset = v
      //ruleGrid.successorOffset = v;
      console.log("New value for ruleOffset: ", v)
    }
  }
}

</script>