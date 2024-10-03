<script setup lang="ts">


import { useRulesStore } from '@/stores/rules'
import { ParametricGrid, PixelReactor, RuleGrid, type Vec2d } from "../../../PixelReactor"

/// <reference path="./../../../ParametricGrid.ts"/>

import RuleGridVC from './components/RuleGridVC.vue';
import RuleList from './components/RuleList.vue';
import { type ColorInfo } from './components/ParametricGridVC.vue';
import { createApp } from 'vue';

import { provide, ref } from 'vue'
//import {  } from 'vue'
import LabelledInput from './components/LabelledInput.vue';
import ParametricGridVC from './components/ParametricGridVC.vue';
import { Gson, Rocket, GsonClass, GSTestClass } from "../../../Gson"
import test from 'node:test';



const rules = useRulesStore();
const { getMouseLocation, setMouseLocation, setPixelReactor, getPixelReactor } = rules;

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
  let colorInfo: ColorInfo = { fillRGB: `${hexColor}`, strokeRGB: "#BBAABB" }; return colorInfo;
}

function conversionFn(v: string) {
  return parseInt(v);
}



let gstest = new GSTestClass("FOO");
//gstest.useJSONForKeys.set()
console.log("Original gstest: ", gstest)
//let gstestString = JSON.stringify(gstest);
//console.log("GSTEST: ", gstestString)
GsonClass.traverseObject(gstest);
//let gstestFromJSON = GSTestClass.fromJSON(gstestString)
//console.log("Reconstituted GSTEST: ", gstestFromJSON)





const newRuleId = ref("rule-1")
const onClickValue = ref("1")
const mainGridName = ref("MAIN")
const mainGridKey = ref(0);
const mainGridWidth = ref("60");
const mainGridHeight = ref("40");
const pgwidth = ref("3");
const pgheight = ref("3")
const screenWidth = ref(600);
const screenHeight = ref(400);
//const fromRule = ref("");
//const toRule = ref("");

let pixelReactor = new PixelReactor<number>();


setPixelReactor(pixelReactor);

let prRef = getPixelReactor();

let mouseLocation = getMouseLocation();

function formatVector(v: Vec2d) {
  return `< ${v[0]},${v[1]} >`
}

function serializeWorkspace() {
  let workspaceString = prRef.value.serialize();
  console.log(workspaceString)
}

let gson = new Gson()

let prMatches: Map<string, [string, string][]> = new Map<string, [string, string][]>()
let pattternHistograms = new Map<string, Map<number, Vec2d[]>>()


function createRuleGrid(inwidth: string, inheight: string) {
  let existingRule = prRef.value.getRule(newRuleId.value);
  if (existingRule != undefined) {
    alert(`Rule id '${newRuleId.value}' is in use. Choose another id.`);
    return;
  }

  let newRule = new RuleGrid(parseInt(inwidth), parseInt(inheight), 0, newRuleId.value);
  prRef.value.setRule(newRuleId.value, newRule)

  let newRuleIndex = prRef.value.getNewRuleIndex();
  newRuleId.value = `rule-${newRuleIndex}`

}

function checkPixels() {
  prRef.value.iterate();  
}

function createTestRules() {
  createRuleGrid("3", "3");
  createRuleGrid("3", "3");
  createRuleGrid("5", "5");
  let rule1 = prRef.value.getRule("rule-1");
  let rule2 = prRef.value.getRule("rule-2");
  let rule3 = prRef.value.getRule("rule-3");
  let mainGrid = prRef.value.getRule("MAIN");
  if (rule1 && rule2 && rule3 && mainGrid) {
    //rule1.setLocation(0, 1, 1);
    rule1.priority = 10;
    rule2.priority = 10;
    rule1.setLocation(1, 1, 1);
    rule2.setLocation(0, 1, 1);
    rule2.setLocation(2, 1, 1);
    rule2.setLocation(1, 0, 1);
    rule2.setLocation(1, 2, 1);

    rule3.setLocation(1, 2, 1);
    rule3.setLocation(3, 2, 1);
    rule3.setLocation(2, 1, 1);
    rule3.setLocation(2, 3, 1);
    rule3.setLocation(2, 2, 1);
    rule3.setLocation(0, 0, 1);
    rule3.setLocation(4, 0, 1);
    rule3.setLocation(0, 4, 1);
    rule3.setLocation(4, 4, 1);
    rule2.successorOffset = [-1, -1];
    //rule1.setLocation(2, 1, 1);
    rule1.successor = rule2;
    rule2.successor = rule3;
    // mainGrid.setLocation(10, 12, 1);
    // mainGrid.setLocation(11, 12, 1);
    // mainGrid.setLocation(12, 12, 1);
    // mainGrid.setLocation(30, 15, 1);
    // mainGrid.setLocation(30, 16, 1);
    // mainGrid.setLocation(30, 17, 1);
    mainGrid.setLocation(30, 20, 1);

  }
}

function createTestRules2() {
  createRuleGrid("3", "3");
  createRuleGrid("3", "3");
  createRuleGrid("5", "5");
  createRuleGrid("3", "1");
  createRuleGrid("3", "1");
  createRuleGrid("3", "3");
  createRuleGrid("3", "3");
  let rule1 = prRef.value.getRule("rule-1");
  let rule2 = prRef.value.getRule("rule-2");
  let rule3 = prRef.value.getRule("rule-3");
  let rule4 = prRef.value.getRule("rule-4");
  let rule5 = prRef.value.getRule("rule-5");
  let rule6 = prRef.value.getRule("rule-6");
  let rule7 = prRef.value.getRule("rule-7");
  let mainGrid = prRef.value.getRule("MAIN");
  if (rule1 && rule2 && rule3 && rule4 && rule5 && rule6 && rule7 && mainGrid) {

    rule1.priority = 10;
    rule2.priority = 20;
    rule1.setLocation(1, 1, 1);
    rule2.setLocation(0, 1, 1);
    rule2.setLocation(2, 1, 1);
    rule2.setLocation(1, 1, 1);
    rule2.setLocation(1, 0, 1);
    rule2.setLocation(1, 2, 1);

    rule3.setLocation(1, 2, 1);
    rule3.setLocation(3, 2, 1);
    rule3.setLocation(2, 1, 1);
    rule3.setLocation(2, 3, 1);
    rule3.setLocation(2, 2, 1);
    //rule3.setLocation(0, 0, 1);
    rule3.setLocation(2, 0, 2);
    rule3.setLocation(4, 2, 2);
    rule3.setLocation(0, 2, 2);
    rule3.setLocation(2, 4, 2);

    rule4.setLocation(0, 0, 1);
    rule4.setLocation(1, 0, 2);

    rule5.setLocation(1, 0, 1);
    rule5.setLocation(2, 0, 2);

    rule2.successorOffset = [-1, -1];

    rule1.successor = rule2;
    rule2.successor = rule3;
    rule4.successor = rule5;
    rule4.priority = 67;

    rule6.setLocation(2, 0, 1);
    rule6.setLocation(2, 2, 1);
    rule6.setLocation(0, 2, 1);

    rule6.successor = rule7;

    rule7.setLocation(0, 0, 1);
    rule7.setLocation(2, 0, 1);
    rule7.setLocation(2, 2, 1);
    rule7.setLocation(0, 2, 1);

    rule6.priority = 60;
    //rule6.setLocation(2, 4, 2);

    mainGrid.setLocation(45, 30, 1);
  }
}

let objStr = ""
let testMap = new Map();
testMap.set("Foo", 7);
testMap.set("Bar", 8);
testMap.set("Baz", 10);

//PixelReactor.initClass();
//console.log("transformToPriorityOffsetMap: ", PixelReactor.transformToPriorityOffsetMap)

const mainGridRef = ref<InstanceType<typeof ParametricGridVC>>()

</script>

<template>
  <div>
    <h1>{{ title }}</h1>
    <LabelledInput v-model:inputValue="mainGridWidth" id="main-grid-width-id" inputType="text"
      placeholder="Enter Main Grid Width" componentName="Main Grid Width" size="4" />
    <LabelledInput v-model:inputValue="mainGridHeight" id="main-grid-height-id" inputType="text"
      placeholder="Enter Main Grid Height" componentName="Main Grid Height" size="4" />
    <LabelledInput v-model:inputValue="onClickValue" id="on-click-value-id" inputType="text"
      placeholder="Enter Color index number for grids" componentName="Color index" size="2" />
    <LabelledInput v-model:inputValue="pgwidth" id="rule-grid-width" inputType="text"
      placeholder="Enter width for rulegrid" componentName="Rulegrid Width" size="4" />
    <LabelledInput v-model:inputValue="pgheight" id="rule-grid-height" inputType="text"
      placeholder="Enter height for rulegrid" componentName="Rulegrid Height" size="4" />

    <div> Mouse Location: {{ formatVector(mouseLocation) }}</div>
    <button @click="createRuleGrid(pgwidth, pgheight)">New Grid</button>
    <button @click="mainGridKey++">Resize Main Grid</button>
    <button @click="serializeWorkspace()">Test Serialization</button>
    <button @click="createTestRules()">Create Test Rules</button>
    <button @click="createTestRules2()">Create Test Rules 2</button>
    <!-- <button @click="checkPixels(); mainGridRef?.$forceUpdate()">Build Match Map</button> -->
    <button @click="prRef.iterate()">Build Match Map</button>
    <button @click="prRef.toggleRun()">Toggle Run</button>
    <button @click="console.log('PR Ids: ', prRef.getAllRuleIds())">Print PR rule IDs</button>
    <button @click="console.log('Gson(PR): ', JSON.stringify(gson.serialize(prRef)))">Gson Serialize</button>
    <button @click="console.log('stringify PR: ', JSON.stringify(prRef))">stringify PR</button>
    <button @click="GsonClass.clear(); objStr =  GsonClass.traverseObject2(gstest, '', false); console.log(objStr)">traverseObject(PR)"</button>
    <button @click="console.log('Clearing Main Grid'); prRef.clearMainGrid()">Clear Main Grid</button>

    <LabelledInput v-model:inputValue="newRuleId" id="new-rule-id" inputType="text"
      placeholder="Enter Id string for new rule" componentName="New Rule Id" size="20" />

    <ParametricGridVC :key="mainGridKey" :screenWidth="screenWidth" :screenHeight="screenHeight"
      :width="parseInt(mainGridWidth)" :height="parseInt(mainGridHeight)" :vizFn="vizFn" :defaultValue="0"
      :onClickValue="onClickValue" :conversionFn="conversionFn" :id="mainGridName" ref="mainGridRef" />

    <RuleList :pixelReactor="prRef" :screenWidth="150" :screenHeight="100" :vizFn="vizFn" :defaultValue="0"
      :onClickValue="onClickValue" :conversionFn="conversionFn"></RuleList>



    <div id="dynamic_content" class="rules"></div>
  </div>
</template>

<script lang="ts">

//const currentSuccessionRule = ref(null)

// function stringToVec(s: string): Vec2d | null {
//   const coordinates: string[] = s.split(',');
//   if (coordinates.length < 2) return zeroVec;
//   let v: Vec2d = [parseInt(coordinates[0]), parseInt(coordinates[1])];
//   if (Number.isNaN(v[0]) || Number.isNaN(v[1])) return zeroVec
//   return v;
// }

export default {
  data() {
    return {
      title: 'Pixel Reactor v3.0',
      pgwidth: '',
      pgheight: '',
      ruleOffset: ''
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
