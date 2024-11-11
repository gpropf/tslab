<script setup lang="ts">

import { useRulesStore } from '@/stores/rules'
import { PixelReactor, RuleGrid, type Vec2d, zeroVec } from "../../../../PixelReactor"

import { ref, onMounted, computed } from 'vue'

const rules = useRulesStore();
const { getMouseLocation, setMouseLocation, setPixelReactor, getPixelReactor } = rules;

const inputValue = defineModel<string>('inputValue')


const props = defineProps<{
  rule: RuleGrid<any>
}>()

inputValue.value = `${props.rule.successorOffset}`

//let prRef = getPixelReactor();
//let ruleIds = props.pixelReactor.getAllRuleIds();
const ruleroot = ref<HTMLElement | null>(null);

function stringToVec(s: string | undefined): Vec2d {
  if (s) {
    const coordinates: string[] = s.split(',');
    if (coordinates.length < 2) return zeroVec;
    let v: Vec2d = [parseInt(coordinates[0]), parseInt(coordinates[1])];
    if (Number.isNaN(v[0]) || Number.isNaN(v[1])) return zeroVec
    return v;
  }
  return zeroVec;
}

//let prRef = getPixelReactor();

const ruleOffsetString = ref("")

function changeOffset() {
  props.rule.successorOffset = stringToVec(inputValue.value)
}

</script>

<template>
  <input type="text" v-model="inputValue" placeholder="Offset" size="3" @input="changeOffset"></input>
</template>

<script lang="ts">
</script>