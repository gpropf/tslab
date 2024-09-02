<script setup lang="ts">


import { useRulesStore } from '@/stores/rules'
import { ParametricGrid, RuleGrid, SuccessionRule, type Vec2d } from "./../../../ParametricGrid"

/// <reference path="./../../../ParametricGrid.ts"/>

import RuleGridVC from './components/RuleGridVC.vue';
import { type ColorInfo } from './components/ParametricGridVC.vue';
import { createApp } from 'vue';

import { provide, ref } from 'vue'
//import {  } from 'vue'
import LabelledInput from './components/LabelledInput.vue';
import ParametricGridVC from './components/ParametricGridVC.vue';

import RuleSelect from './components/RuleSelect.vue';

// const mouseLocation = ref([0,0]);

// function updateMouseLocation(newLoc) {
//   mouseLocation.value = newLoc;
// }

// provide('mouseLocation', {
//   mouseLocation,
//   updateMouseLocation
// });

const rules = useRulesStore();
const { ruleGridMap, setRule, getRule, serialize, getMouseLocation, setMouseLocation } = rules;

const numberToColorMap = new Map();
numberToColorMap.set(0, "#000000");
numberToColorMap.set(1, "#00FF00");
numberToColorMap.set(2, "#00AA00");
numberToColorMap.set(3, "#FF00FF");
numberToColorMap.set(4, "#AA00AA");
numberToColorMap.set(5, "#00AAFF");
const numColors = numberToColorMap.size;
let rgm: Map<string, string> = new Map<string, string>();

function vizFn(cellval: number) {
  let hexColor = numberToColorMap.get(cellval % numColors);
  let colorInfo: ColorInfo = { fillRGB: `${hexColor}` }; return colorInfo;
}

function conversionFn(v: string) {
  return parseInt(v);
}

function testFindAllMatches(ruleName: string) {
  let mainGrid = getRule("MAIN");
  if (mainGrid === undefined) return;
  let ruleGrid = getRule(ruleName);
  if (ruleGrid === undefined) return;
  mainGrid.simpleMatchAllTransforms(ruleGrid as RuleGrid<any>);
}

function createRuleGrid(inwidth: string, inheight: string) {
  let existingRule = getRule(newRuleId.value);
  if (existingRule != undefined) {
    alert(`Rule id '${newRuleId.value}' is in use. Choose another id.`);
    return;
  }
  let ruleGridVC = createApp(RuleGridVC, {
    width: parseInt(inwidth), height: parseInt(inheight),
    vizFn: vizFn, defaultValue: 0, onClickValue: onClickValue, programaticallyCreated: true, conversionFn: conversionFn,
    screenWidth: 150, screenHeight: 100, id: newRuleId.value, priority: 50
  })

  const wrapper = document.getElementById("dynamic_content")
  if (wrapper) {
    const newDiv = document.createElement("div")
    newDiv.className = "rule"
    ruleGridVC.mount(newDiv)
    wrapper.appendChild(newDiv)
  }
}

const newRuleId = ref("newrule")
const onClickValue = ref("1")
const mainGridName = ref("MAIN")
const mainGridKey = ref(0);
const mainGridWidth = ref("60");
const mainGridHeight = ref("40");
const screenWidth = ref(600);
const screenHeight = ref(400);
const fromRule = ref("");
const toRule = ref("");


let mouseLocation = getMouseLocation();

function formatVector(v: Vec2d) {
  return `< ${v[0]},${v[1]} >`
}

function serializeWorkspace() {
  let workspaceString = serialize();
  console.log(workspaceString)
}

function linkRules() {
  let fromRuleLocal = getRule(fromRule.value)
  let toRuleLocal = getRule(toRule.value)
  if (fromRuleLocal instanceof RuleGrid && toRuleLocal instanceof RuleGrid && ruleOffsetVec.value.length > 1) {
    console.log("Current Offset:", ruleOffsetVec.value)
    let sr = new SuccessionRule(fromRuleLocal, toRuleLocal, ruleOffsetVec.value)
    console.log("New SR created: ", sr)
  }
}



</script>


<template>
  <div>
    <h1>{{ title }}</h1>
    <LabelledInput v-model:inputValue="mainGridWidth" id="main-grid-width-id" inputType="text"
      placeholder="Enter Main Grid Width" componentName="Main Grid Width" size="4"/>
    <LabelledInput v-model:inputValue="mainGridHeight" id="main-grid-height-id" inputType="text"
      placeholder="Enter Main Grid Height" componentName="Main Grid Height" size="4"/>
    <!-- <h2>Grid Data Entry</h2> -->
    <LabelledInput v-model:inputValue="onClickValue" id="on-click-value-id" inputType="text"
      placeholder="Enter Color index number for grids" componentName="Color index" size="2"/>
    <LabelledInput v-model:inputValue="pgwidth" id="rule-grid-width" inputType="text"
      placeholder="Enter width for rulegrid" componentName="Rulegrid Width" size="4"/>
    <LabelledInput v-model:inputValue="pgheight" id="rule-grid-height" inputType="text"
      placeholder="Enter height for rulegrid" componentName="Rulegrid Height" size="4"/>
    <!-- <div>
      <input type="text" v-model="pgwidth" placeholder="Width of new PG">
    </div> -->
    <!-- <div>
      <input type="text" v-model="pgheight" placeholder="Height of new PG">
    </div> -->
    <div> Mouse Location: {{ formatVector(mouseLocation) }}</div>
    <button @click="createRuleGrid(pgwidth, pgheight)">New Grid</button>
    <button @click="mainGridKey++">Resize Main Grid</button>
    <button @click="testFindAllMatches('newrule')">Test Match</button>
    <!-- <button @click="rgm = serialize(); rgm.forEach((value: string, id: string) => { console.log(`${id}:${value}`) })">Test Serialization</button> -->

    <button @click="serializeWorkspace()">Test Serialization</button>
    <button @click="linkRules()">Link named rules</button>

    <LabelledInput v-model:inputValue="newRuleId" id="new-rule-id" inputType="text"
      placeholder="Enter Id string for new rule" componentName="New Rule Id" size="20"/>
    <LabelledInput v-model:inputValue="fromRule" id="from-rule-id" inputType="text"
      placeholder="Enter Id string for 'from' rule" componentName="'From' Rule Id" size="20"/>
    <LabelledInput v-model:inputValue="toRule" id="to-rule-id" inputType="text"
      placeholder="Enter Id string for 'to' rule" componentName="'To' Rule Id" size="20"/>
    <LabelledInput v-model:inputValue="ruleOffset" id="rule-offset" inputType="text"
      placeholder="Enter offset as a comma-delimited string" componentName="Offset String" size="4"/>
<RuleSelect />
    


    <ParametricGridVC :key="mainGridKey" :screenWidth="screenWidth" :screenHeight="screenHeight"
      :width="parseInt(mainGridWidth)" :height="parseInt(mainGridHeight)" :vizFn="vizFn" :defaultValue="0"
      :onClickValue="onClickValue" :programaticallyCreated="false" :conversionFn="conversionFn" :id="mainGridName" />

    <div id="dynamic_content" class="rules"></div>
  </div>
</template>

<script lang="ts">
const zeroVec: Vec2d = [0, 0]
let zeroMutableVec: Vec2d = [0, 0]
const ruleOffsetVec = ref(zeroMutableVec)
const currentSuccessionRule = ref(null)

function stringToVec(s: string): Vec2d | null {
  const coordinates: string[] = s.split(',');
  if (coordinates.length < 2) return zeroVec;
  let v: Vec2d = [parseInt(coordinates[0]), parseInt(coordinates[1])];
  if (Number.isNaN(v[0]) || Number.isNaN(v[1])) return zeroVec
  return v;
}

export default {
  data() {
    return {
      title: 'Pixel Reactor v3.0',
      pgwidth: '',
      pgheight: '',
      ruleOffset: ''
    }
  },
  watch: {
    ruleOffset(value) {
      let v = stringToVec(value)
      if (v == null) return null;
      ruleOffsetVec.value = v;
      console.log("New value for ruleOffset: ", v)
    }
  }
}
</script>


<style>
div {
  margin-bottom: 2px;
}

label {
  display: inline-block;
  width: 150px;
  text-align: right;
  margin-right: 10px;
}

.rules {
  height: 250px;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
}

.rules>* {
  flex: 1 1 300px;
}
/* Below styles are boilerplate */

header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
