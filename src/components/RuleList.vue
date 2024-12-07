<script setup lang="ts">

import { useRulesStore } from '@/stores/rules'
import { PixelReactor, RuleGrid, type Vec2d, zeroVec } from "../../PixelReactor"
import { type ColorInfo, type ObjectVisualizationFn, type ConversionFn } from "./ParametricGridVC.vue"
import SVGGrid from './SVGGrid.vue';

import RuleOffset from './RuleOffset.vue'
import LabelledInput from './LabelledInput.vue';
import RuleSelect from './RuleSelect.vue';
import { ref, onMounted, computed } from 'vue'

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

function stringToVec(s: string): Vec2d {
  const coordinates: string[] = s.split(',');
  if (coordinates.length < 2) return zeroVec;
  let v: Vec2d = [parseInt(coordinates[0]), parseInt(coordinates[1])];
  if (Number.isNaN(v[0]) || Number.isNaN(v[1])) return zeroVec
  return v;
}

let prRef = getPixelReactor();

const ruleOffsetString = ref("")

function changeOffset(rule: RuleGrid<any>) {
  rule.successorOffset = stringToVec(ruleOffsetString.value)
}

const ids = ref(Array.from(props.pixelReactor.ruleGridMap.keys()));

// const notMainGridIds = computed(() => {
//   return ids.value.filter((id) => id != "MAIN");
// })

// const filteredGridMap = ref(new Map<string, RuleGrid<any>>());
// ids.value.forEach((id) => {
//   if (id != "MAIN") {
//     let rule = props.pixelReactor.ruleGridMap.get(id);
//     if (rule)
//       filteredGridMap.value.set(id, rule);
//   }
// })

function filterGridMap(gridMap: Map<string, RuleGrid<any>>) {
  let filteredGridMap: Map<string, RuleGrid<any>> = new Map<string, RuleGrid<any>>();
  gridMap.forEach((rule: RuleGrid<any>, id: string) => {
    if (id != "MAIN") {
      filteredGridMap.set(id, rule);
    }
  });
  return filteredGridMap;
}

//props.pixelReactor.ruleGridMap.get()

</script>

<template>
  <div class="rules">
    <div v-for="[id, rule] in filterGridMap(props.pixelReactor.ruleGridMap)" :key="id">
      <div v-if="id != 'MAIN'" class="rule-grid">
        <!-- ID: {{ id }} -->
        <LabelledInput v-model:inputValue="rule.priority" id="rule-grid-priority" inputType="text"
          placeholder="Enter priority for rule" componentName="Rule Priority" size="3" labelClass="medium" />
        <span>{{ rule.id }}</span><button @click="prRef.deleteRule(rule.id)">Delete Rule</button>
        <SVGGrid :screenWidth="props.screenWidth" :screenHeight="props.screenHeight" :width="rule.width"
          :height="rule.height" :vizFn="props.vizFn" :defaultValue="0" :onClickValue="props.onClickValue"
          :conversionFn="props.conversionFn" :id="rule.id" :prGrid="rule" />
        <RuleSelect :fromRuleId="rule.id" />
        <RuleOffset :rule="rule" />

      </div>
    </div>
  </div>
</template>

<style>
.rule-grid {
  /* flex: 1; */
  border: 2px solid rgb(207, 163, 19);
  padding: 5px;
  margin-right: 5px;
}
</style>

<script lang="ts">
</script>