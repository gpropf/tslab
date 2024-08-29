<script setup lang="ts">


import { useRulesStore } from '@/stores/rules'
import { ParametricGrid, RuleGrid } from "./../../../ParametricGrid"

/// <reference path="./../../../ParametricGrid.ts"/>

import RuleGridVC from './components/RuleGridVC.vue';
import { type ColorInfo } from './components/ParametricGridVC.vue';
import { createApp } from 'vue';

import { provide, ref } from 'vue'
//import {  } from 'vue'
import LabelledInput from './components/LabelledInput.vue';
import ParametricGridVC from './components/ParametricGridVC.vue';

// const mouseLocation = ref([0,0]);

// function updateMouseLocation(newLoc) {
//   mouseLocation.value = newLoc;
// }

// provide('mouseLocation', {
//   mouseLocation,
//   updateMouseLocation
// });

const rules = useRulesStore();
const { ruleGridMap, setRule, getRule, serialize, getMouseLocation, setMouseLocation  } = rules;

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

function createPGVC(inwidth: string, inheight: string) {
  let ComponentClass = createApp(RuleGridVC, {
    width: parseInt(inwidth), height: parseInt(inheight),
    vizFn: vizFn, defaultValue: 1, onClickValue: onClickValue, programaticallyCreated: true, conversionFn: conversionFn,
    screenWidth: 150, screenHeight: 100, id: newRuleId.value, priority: 50
  })
  
  const wrapper = document.getElementById("dynamic_content")
  if (wrapper) {
    const newDiv = document.createElement("div")
    newDiv.className = "rule"
    ComponentClass.mount(newDiv)
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

let mouseLocation = getMouseLocation();
</script>


<template>
  <div>
    <h1>{{ title }}</h1>
    <LabelledInput v-model:inputValue="mainGridWidth" id="main-grid-width-id" inputType="text"
      placeholder="Enter Main Grid Width" componentName="Main Grid Width" />
    <LabelledInput v-model:inputValue="mainGridHeight" id="main-grid-height-id" inputType="text"
      placeholder="Enter Main Grid Height" componentName="Main Grid Height" />
    <h2>Grid Data Entry</h2>    
    <LabelledInput v-model:inputValue="onClickValue" id="on-click-value-id" inputType="text"
      placeholder="Enter Color index number for grids" componentName="Color index" />
      <LabelledInput v-model:inputValue="pgwidth" id="rule-grid-width" inputType="text"
      placeholder="Enter width for rulegrid" componentName="Rulegrid Width" />
      <LabelledInput v-model:inputValue="pgheight" id="rule-grid-height" inputType="text"
      placeholder="Enter height for rulegrid" componentName="Rulegrid Height" />
    <!-- <div>
      <input type="text" v-model="pgwidth" placeholder="Width of new PG">
    </div> -->
    <!-- <div>
      <input type="text" v-model="pgheight" placeholder="Height of new PG">
    </div> -->
    <div> {{ mouseLocation }}</div>
    <button @click="createPGVC(pgwidth, pgheight)">New Grid</button>
    <button @click="mainGridKey++">Resize Main Grid</button>
    <button @click="testFindAllMatches('newrule')">Test Match</button>
    <button @click="rgm = serialize(); rgm.forEach((value: string, id: string) => { console.log(`${id}:${value}`) })">Test Serialization</button>

    <LabelledInput v-model:inputValue="newRuleId" id="new-rule-id" inputType="text"
      placeholder="Enter Id string for new rule" componentName="New Rule Id" />

    <ParametricGridVC :key="mainGridKey" :screenWidth="screenWidth" :screenHeight="screenHeight"
      :width="parseInt(mainGridWidth)" :height="parseInt(mainGridHeight)" :vizFn="vizFn" :defaultValue="0"
      :onClickValue="onClickValue" :programaticallyCreated="false" :conversionFn="conversionFn" :id="mainGridName" />

    <div id="dynamic_content" class="rules"></div>
  </div>
</template>

<script lang="ts">

export default {
  data() {
    return {
      title: 'Pixel Reactor v3.0',
      pgwidth: '',
      pgheight: ''
    }
  }
}
</script>


<style>
.rules {
  height: 250px;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
}

.rules>* {
  flex: 1 1 300px;
}


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
