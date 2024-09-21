<script setup lang="ts">

import { useRulesStore } from '@/stores/rules'
import { RuleGrid, type Vec2d, zeroVec } from "../../../../PixelReactor"
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
  <div>
    <div v-for="id in props.pixelReactor.getAllRuleIds()">      
      <RuleGridVC  v-if="id !='MAIN'" :screenWidth="props.screenWidth" :screenHeight="props.screenHeight"
        :width="props.pixelReactor.getRule(id).width" :height="props.pixelReactor.getRule(id).height"
        :vizFn="props.vizFn" :defaultValue="0" :onClickValue="props.onClickValue" :programaticallyCreated="true"
        :conversionFn="props.conversionFn" :id="id" :priority="props.pixelReactor.getRule(id).priority"/>
      <button @click="$forceUpdate()">placeholder Button</button>
    </div>

  </div>
</template>

<script lang="ts">
</script>