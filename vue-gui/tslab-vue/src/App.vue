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
import { Gson, Rocket } from "../../../Gson"
//import { type } from 'os';



// const rocket = new Rocket("foo")
// console.log((rocket as any).fuel)
// console.log((rocket as any).class)
// rocket.addFuel(10);
// //type R = ConstructorParameters<typeof Rocket>;
// //const r: Rocket = new Rocket("FOOO")
// //console.log("Constructor params for Rocket: ",typeof(r));

// let rocketFromObj = Object.create(Rocket.prototype)
// console.log("RKT:", rocketFromObj)

// let jsonText = '{ "fuel": "23", "class": "Rocket", "testObj": {"foo": "F1", "bar": "B1" } }'
// let rawObjFromJson = JSON.parse(jsonText)
// let rawObjFromJsonKeys = Object.keys(rawObjFromJson);

// if ("class" in rawObjFromJson) {
//   console.log("Object data has class member")
// }

// console.log(Object.keys(rawObjFromJson).forEach(key => {
//   console.log("KEY:", key, typeof (rawObjFromJson[key]));
//   rocketFromObj[key] = rawObjFromJson[key]
// }))

// console.log("New Rocket! ", rocketFromObj)




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

// function testFindAllMatches(ruleName: string) {
//   let mainGrid = getRule("MAIN");
//   if (mainGrid === undefined) return;
//   let ruleGrid = getRule(ruleName);
//   if (ruleGrid === undefined) return;
//   let matches = mainGrid.simpleMatchAllTransforms(ruleGrid as RuleGrid<any>);
//   console.log("MATCHES: ", matches)
// }

// function testMatchingAllRules() {
//   let matchMap = pixelReactor.getAllMatches();
//   console.log("PR: ALL THE MATCHES! ", matchMap);
// }



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
  prRef.value.updateStacks.clear();
  prMatches = prRef.value.buildMatchMap();
  console.log("prMatches: ", prMatches)
  pattternHistograms = prRef.value.buildPatternHistograms(prMatches);
  console.log('PH: ', pattternHistograms);
  let mainGrid = prRef.value.getRule("MAIN");
  if (mainGrid) {
    let pixelsToCheck = prRef.value.buildListOfPixelsToCheckForEachNewPixel(pattternHistograms, mainGrid);
    console.log('Pixels2Check: ', pixelsToCheck)
    let matchesByRuleAndTransformID = prRef.value.matchUniquePatternsForNewPixels(pixelsToCheck, prMatches)
    console.log("matchesByRuleAndTransformID: ", matchesByRuleAndTransformID)
    let rawGridStringToSuccessorMap = prRef.value.buildRawGridStringToSuccessorMap(prMatches)
    console.log("buildRawGridStringToSuccessorMap:", rawGridStringToSuccessorMap);

    let updateStacks = prRef.value.updateStacksWithMatchSuccessors(rawGridStringToSuccessorMap,
    matchesByRuleAndTransformID);
    console.log("updateStacks: ", updateStacks)
    //prRef.value.updateStacks.clear();
  }
}

function createTestRules() {
  createRuleGrid("3", "3");
  createRuleGrid("3", "3");
  let rule1 = prRef.value.getRule("rule-1");
  let rule2 = prRef.value.getRule("rule-2");
  let mainGrid = prRef.value.getRule("MAIN");
  if (rule1 && rule2 && mainGrid) {
    rule1.setLocation(0, 1, 1);
    rule1.setLocation(1, 1, 1);
    rule1.setLocation(2, 1, 1);
    rule1.successor = rule2;
    mainGrid.setLocation(10, 12, 1);
    mainGrid.setLocation(11, 12, 1);
    mainGrid.setLocation(12, 12, 1);
    mainGrid.setLocation(30, 15, 1);
    mainGrid.setLocation(30, 16, 1);
    mainGrid.setLocation(30, 17, 1);
    mainGrid.setLocation(55, 35, 1);
    rule2.setLocation(1, 1, 1);  
    rule2.successor = rule1;
  }
}

//PixelReactor.initClass();
console.log("transformToPriorityOffsetMap: ", PixelReactor.transformToPriorityOffsetMap)

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
    <button @click="checkPixels()">Build Match Map</button>
    <button @click="console.log('PR Ids: ', prRef.value.getAllRuleIds())">Print PR rule IDs</button>
    <button @click="console.log('Gson(PR): ', JSON.stringify(gson.serialize(prRef.value)))">Gson Serialize</button>
    <button @click="console.log('stringify PR: ', JSON.stringify(prRef.value))">stringify PR</button>    

    <LabelledInput v-model:inputValue="newRuleId" id="new-rule-id" inputType="text"
      placeholder="Enter Id string for new rule" componentName="New Rule Id" size="20" />
    
    <ParametricGridVC :key="mainGridKey" :screenWidth="screenWidth" :screenHeight="screenHeight"
      :width="parseInt(mainGridWidth)" :height="parseInt(mainGridHeight)" :vizFn="vizFn" :defaultValue="0"
      :onClickValue="onClickValue" :conversionFn="conversionFn" :id="mainGridName" />

    <RuleList :pixelReactor="prRef" :screenWidth="150" :screenHeight="100"
     :vizFn="vizFn" :defaultValue="0" :onClickValue="onClickValue" :conversionFn="conversionFn"></RuleList>

    

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
  // watch: {
  //   ruleOffset(value) {
  //     let v = stringToVec(value)
  //     if (v == null) return null;
  //     //ruleOffsetVec.value = v;
  //     console.log("New value for ruleOffset: ", v)
  //   }
  // }
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
