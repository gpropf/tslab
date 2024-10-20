<script setup lang="ts">

import { useRulesStore } from '@/stores/rules'
import { PixelReactor, RuleGrid, type Vec2d, zeroVec } from "../../../../PixelReactor"
import { type ColorInfo, type ObjectVisualizationFn, type ConversionFn } from "./ParametricGridVC.vue"
import SVGGrid from './SVGGrid.vue';
import RuleGridVC from './RuleGridVC.vue';
import LabelledInput from './LabelledInput.vue';
import RuleSelect from './RuleSelect.vue';
import { ref, onMounted } from 'vue'

const rules = useRulesStore();
const { getMouseLocation, setMouseLocation, setPixelReactor, getPixelReactor } = rules;


const props = defineProps<{
  pixelReactor: PixelReactor<any>,
  screenWidth: number,
  screenHeight: number,
  vizFn: ObjectVisualizationFn,
  defaultValue: any,
  onClickValue: any,
  conversionFn: ConversionFn
}>()

//let prRef = getPixelReactor();
//let ruleIds = props.pixelReactor.getAllRuleIds();
const ruleroot = ref<HTMLElement | null>(null);

</script>

<template>
  <div class="rules">
    <div v-for="[id, rule] in props.pixelReactor.ruleGridMap"> ID: {{ id }} Rule.id = {{ rule.id }} 
      <SVGGrid :screenWidth="props.screenWidth" :screenHeight="props.screenHeight" :width="rule.width"
    :height="rule.height" :vizFn="props.vizFn" :defaultValue="0" :onClickValue="props.onClickValue"
    :conversionFn="props.conversionFn" :id="rule.id" :prGrid="rule" />

    </div>

    <div v-for="[id, rule] in props.pixelReactor.ruleGridMap">      
      <RuleGridVC v-if="rule.id !='MAIN'" :screenWidth="props.screenWidth" :screenHeight="props.screenHeight"
        :rule="rule" :width="rule.width" :height="rule.height"
        :vizFn="props.vizFn" :defaultValue="0" :onClickValue="props.onClickValue"
        :conversionFn="props.conversionFn" :id="rule.id" :priority="rule.priority"/>
      <!-- <button @click="$forceUpdate()">placeholder Button</button> -->
    </div>

  </div>
</template>

<script lang="ts">
</script>