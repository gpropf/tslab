<script setup lang="ts">


import { useRulesStore } from '@/stores/rules'
import { ParametricGrid, PixelReactor, RuleGrid, type Vec2d } from "../PixelReactor"

/// <reference path="./../../../ParametricGrid.ts"/>


import RuleList from './components/RuleList.vue';
import { type ColorInfo } from './components/ParametricGridVC.vue';
import { createApp } from 'vue';

import { provide, ref, onMounted, getCurrentInstance } from 'vue'

import LabelledInput from './components/LabelledInput.vue';
import ParametricGridVC from './components/ParametricGridVC.vue';
//import { Gson, GsonClass } from "../../../Gson"

import { dbg, leftPad, stringToVec } from "../Util";


const rules = useRulesStore();
const { getMouseLocation, setMouseLocation, setPixelReactor, getPixelReactor } = rules;

// const numberToColorMap = new Map();
// numberToColorMap.set(0, "#000000");
// numberToColorMap.set(1, "#00FF00");
// numberToColorMap.set(2, "#00AA00");
// numberToColorMap.set(3, "#FF00FF");
// numberToColorMap.set(4, "#AA00AA");
// numberToColorMap.set(5, "#00AAFF");
// const numColors = numberToColorMap.size;

//console.log(`LEFT PAD test: `, leftPadString("13", 5));

// Some helper functions for the grids.
function vizFn(cellval: number) {
  let hexColor = prRef.value.paletteMap.get(cellval % prRef.value.paletteMap.size);
  let colorInfo: ColorInfo = { fillRGB: `${hexColor}`, strokeRGB: "#BBAABB" }; return colorInfo;
}

/**
 * conversionFn: This function is passed as a parameter along with the onClickValue to
 * components like SVGGrid. Its job is to convert onClickValue into the type T in ParametericGrid<T>.
 * @param v 
 */
function conversionFn(v: string) {
  return parseInt(v);
}
// End helpers

const newRuleId = ref("")
const onClickValue = ref("1")
const mainGridName = ref("MAIN")
const mainGridKey = ref(0);
const mainGridWidth = ref("60");
const mainGridHeight = ref("40");
const pgwidth = ref("3");
const pgheight = ref("3")
const screenWidth = ref(600);
const screenHeight = ref(400);
const recordingStartIter = ref(0);
const recordingEndIter = ref(100);
const mainGridRef = ref<InstanceType<typeof ParametricGridVC>>();
const prJsonBuffer = ref("");
const inOutBuffer = ref("");
const selectedRule = ref("");
const copyRuleAtLoc = ref("0,0");


// Create main PR and load it into the store.
let pixelReactor = new PixelReactor<number>();
setPixelReactor(pixelReactor);
let prRef = getPixelReactor();

let mouseLocation = getMouseLocation();

function formatVector(v: Vec2d) {
  return `< ${v[0]},${v[1]} >`
}

/**
 * createTestRules: Creates the rules from the C++ implementation
 * 
 */
function createTestRules() {
  let rule1Id = prRef.value.createRuleGrid("3", "3");
  let rule2Id = prRef.value.createRuleGrid("3", "3");
  let rule3Id = prRef.value.createRuleGrid("5", "5");
  let rule1 = prRef.value.getRule(rule1Id);
  let rule2 = prRef.value.getRule(rule2Id);
  let rule3 = prRef.value.getRule(rule3Id);
  let mainGrid = prRef.value.getRule("MAIN");
  if (rule1 && rule2 && rule3 && mainGrid) {
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
    rule1.successor = rule2;
    rule2.successor = rule3;
    mainGrid.setLocation(30, 20, 1);
  }
}

/**
 * Creates the rules from the original ClojureScript app.
 */
function createTestRules2() {
  let rule1Id = prRef.value.createRuleGrid("3", "3");
  let rule2Id = prRef.value.createRuleGrid("3", "3");
  let rule3Id = prRef.value.createRuleGrid("5", "5");
  let rule4Id = prRef.value.createRuleGrid("3", "1");
  let rule5Id = prRef.value.createRuleGrid("3", "1");
  let rule6Id = prRef.value.createRuleGrid("3", "3");
  let rule7Id = prRef.value.createRuleGrid("3", "3");
  let rule1 = prRef.value.getRule(rule1Id);
  let rule2 = prRef.value.getRule(rule2Id);
  let rule3 = prRef.value.getRule(rule3Id);
  let rule4 = prRef.value.getRule(rule4Id);
  let rule5 = prRef.value.getRule(rule5Id);
  let rule6 = prRef.value.getRule(rule6Id);
  let rule7 = prRef.value.getRule(rule7Id);
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

    mainGrid.setLocation(45, 30, 1);
  }
}


/**
 * Loads a new PR from whatever is found in the textarea.
 */
function loadNewPR(resizeOnly: boolean = false) {
  prRef.value.restoreFromJSON(inOutBuffer.value, resizeOnly);
}


let vueComponent: any;

function delayedLoad() {
  setTimeout(() => { loadNewPR(); }, 1000);
}

onMounted(() => {
  // text content should be the same as current `count.value`
  //console.log("SVGGrid mounted!")
  const instance = getCurrentInstance();
  vueComponent = instance?.proxy;
  //console.log("VC (SVGGrid): ", props.prGrid.vueComponent);

})

const workerRef = ref();

// This worker code from: https://stackoverflow.com/questions/73862386/how-do-i-compile-web-workers-with-vue3vite
if (typeof Worker !== "undefined") {
  //const workerUrl = new URL("workerTest.ts", import.meta.url);

  // The path to the worker needs to be directly in the worker constructor, see - https://vite.dev/guide/features.html#web-workers
  // From the reference: "The worker detection will only work if the new URL() constructor is used directly inside the new Worker() declaration"
  const worker = new Worker(new URL("workerTest.ts", import.meta.url), { type: "module" });
  console.log(worker);
  workerRef.value = worker;
  workerRef.value.postMessage({ type: "connect", value: JSON.stringify(prRef.value) },);
  //worker.onmessage = combineValues;
  // onUnmounted(() => {
  //   worker.postMessage({type:"destroy"},);
  //   worker.terminate();
  // })
} else {
  console.log("Workers not allowed. Reverting to single threaded application.");
  // connect(channelInfo, combineValues)
  // onUnmounted(() => destroy())
}



</script>

<template>
  <div>
    <h1>{{ title }}</h1>
    <div class="control-panel-container">
      <div class="control-panel-child">
        <LabelledInput v-model:inputValue="prRef.mainGridWidth" id="main-grid-width-id" inputType="text"
          placeholder="Enter Main Grid Width" componentName="Main Grid Width" size="4" />
        <LabelledInput v-model:inputValue="prRef.mainGridHeight" id="main-grid-height-id" inputType="text"
          placeholder="Enter Main Grid Height" componentName="Main Grid Height" size="4" />
        <button @click="prRef.mainGridKey++;">Resize Main Grid</button>
      </div>
      <div class="control-panel-child">
        <LabelledInput v-model:inputValue="onClickValue" id="on-click-value-id" inputType="text"
          placeholder="Enter Color index number for grids" componentName="Color index" size="2" />
        <LabelledInput v-model:inputValue="pgwidth" id="rule-grid-width" inputType="text"
          placeholder="Enter width for rulegrid" componentName="Rulegrid Width" size="4" />
        <LabelledInput v-model:inputValue="pgheight" id="rule-grid-height" inputType="text"
          placeholder="Enter height for rulegrid" componentName="Rulegrid Height" size="4" />
        <button @click="prRef.createRuleGrid(pgwidth, pgheight, newRuleId)">New Rule Grid</button>
        <LabelledInput v-model:inputValue="newRuleId" id="new-rule-id" inputType="text"
          placeholder="Enter Id string for new rule" componentName="New Rule Id" size="20" />
      </div>
      <div class="control-panel-child">
        <LabelledInput v-model:inputValue="prRef.recordingStartFrame" id="recording-start-iter" inputType="text"
          placeholder="Recording Start Iteration" componentName="Recording Start Iteration" size="4" />
        <LabelledInput v-model:inputValue="prRef.recordingEndFrame" id="recording-end-iter" inputType="text"
          placeholder="Recording Ending Iteration" componentName="Recording Ending Iteration" size="4" />
        <input type="checkbox" id="recordingOn" name="recordingOn" value="recording" v-model="prRef.recordingEnabled">
        <label for="recordingOn">Check to Record</label><br>

      </div>
      <div class="control-panel-child">
        <textarea rows="8" cols="25" v-model="inOutBuffer">{{ inOutBuffer }}</textarea>
        <button @click="inOutBuffer = JSON.stringify(prRef); console.log('stringify PR: ', prJsonBuffer);">stringify
          PR</button>
        <button @click="inOutBuffer = prRef.framesToJson(); console.log('Frames: ', inOutBuffer);">Output
          Frames</button>
        <button @click="prRef.recordedFrames = []; console.log('Recorded Frames now: ', prRef.recordedFrames);">Clear
          Frames</button>

        <button @click="loadNewPR(true); delayedLoad();">Load PR (resize & load)</button>
        <button @click="prRef.makeAllNonZeroPixelsNew();">Refresh Pixels</button>
        <button @click="prRef.loadPalette(inOutBuffer); console.log('Loaded Palette: ', inOutBuffer);">Load
          Custom Palette</button>
      </div>
    </div>
    <div class="control-panel-container">
      <div class="control-panel-child"> Mouse Location: {{ formatVector(mouseLocation) }}</div>
      <div class="control-panel-child" id="update-stack"> Update Stack: {{ prRef.printUpdateStack(mouseLocation) }}
      </div>
      <div class="control-panel-child"> Iteration Count: {{ prRef.iterationCount }}</div>
    </div>



    <!-- <button
      @click="console.log('Gathering Stats'); prRef.gatherStats(); console.log(`msPerIter: ${prRef.msPerIter}`)">Get
      Stats</button>
    <button @click="prRef.gatherRepeatedStats(200);">Get N Stats</button> -->
    <div>
      <button @click="createTestRules()">Create Test Rules 1</button>
      <button @click="createTestRules2()">Create Test Rules 2</button>
      <button @click="prRef.deleteAllRules();">Delete All Rules!</button>
    </div>

    <div>
      <!-- <button @click="console.log('Gson(PR): ', JSON.stringify(gson.serialize(prRef)))">Gson Serialize</button> -->

      <!-- <button @click="console.log('stringify with replacer: ', JSON.stringify(prRef, replacer));">stringify with replacer</button> -->
    </div>
    <div class="control-panel-container">
      <div class="control-panel-child">



        <ParametricGridVC :key="prRef.mainGridKey" :screenWidth="screenWidth" :screenHeight="screenHeight"
          :width="parseInt(prRef.mainGridWidth)" :height="parseInt(prRef.mainGridHeight)" :vizFn="vizFn"
          :defaultValue="0" :onClickValue="onClickValue" :conversionFn="conversionFn" :id="mainGridName"
          ref="mainGridRef" />
      </div>
      <div class="control-panel-child" style="display: flex; flex-direction: column;">
        <div class="control-panel-child">
          <button @click="prRef.iterate();">Single Step</button>
          <button @click="workerRef.postMessage({ type: 'connect', value: JSON.stringify(prRef) },);">Test Worker
            Thread</button>
          <button @click="prRef.toggleRun();">Toggle Run</button>
          <LabelledInput v-model:inputValue="prRef.iterationDelay" id="iteration-delay-id" inputType="text"
            placeholder="Iteration delay (ms)" componentName="Iteration delay (ms)" size="3" />
          <button @click="prRef.iterationCount = 0;">Zero Iteration Counter</button>
        </div>
        <div class="control-panel-child" style="display: flex; flex-direction: row;">
          Palette: <br />
          <div class="palette-radio-button" v-for="[id, color] in prRef.paletteMap" :key="id"
            :style="{ backgroundColor: prRef.paletteMap.get(id) }">
            <input v-model="onClickValue" type="radio" id="color" name="color" :value="id"> {{ id }}
          </div>

        </div>
        <div class="control-panel-child" style="display: flex; flex-direction: row;">
          <label for="color-asc-t"> Color Sort Ascending
            <input v-model="prRef.colorAsc" type="radio" id="color-asc-t" name="color-asc" value="0">
          </label>
          <label for="color-asc-f"> Color Sort Descending
            <input v-model="prRef.colorAsc" type="radio" id="color-asc-f" name="color-asc" value="1">
          </label>
          <label for="use-tie-breaker"> Use tie-breaker
            <input type="checkbox" id="use-tie-breaker" v-model="prRef.useTieBreaker">
          </label>
        </div>
        <div class="control-panel-child" style="display: flex; flex-direction: row;">
          <label for="priority-asc-t"> Priority Sort Ascending
            <input v-model="prRef.priorityAsc" type="radio" id="priority-asc-t" name="priority-asc" value="0">
          </label>
          <label for="priority-asc-f"> Priority Sort Descending
            <input v-model="prRef.priorityAsc" type="radio" id="priority-asc-f" name="priority-asc" value="1">
          </label>
        </div>


        <div class="control-panel-child" style="flex-direction: column;">
          <button @click="dbg('Clearing Main Grid', 0); prRef.clearMainGrid()">Clear Main Grid</button>
          <button @click="dbg('Toggling view updates', 0); prRef.toggleView()">Toggle View</button>
          <button
            @click="console.log(`Selected Rule: ${selectedRule}`); prRef.copyRuleIntoMainGrid(selectedRule, stringToVec(copyRuleAtLoc))">Copy
            Rule into Main @ loc: </button>
          <input type="text" v-model="copyRuleAtLoc" placeholder="copyRuleAtLoc" size="3"></input>
        </div>


      </div>

    </div>


    <RuleList :pixelReactor="prRef" :screenWidth="150" :screenHeight="100" :vizFn="vizFn" :defaultValue="0"
      :onClickValue="onClickValue" :conversionFn="conversionFn" v-model:selectedRule="selectedRule"></RuleList>

  </div>
</template>

<script lang="ts">


export default {
  data() {
    return {
      title: 'Pixel Reactor v3.0-ghp',
      pgwidth: '',
      pgheight: '',
      ruleOffset: ''
    }
  }

}
</script>


<style>
div#update-stack {
  min-height: 100px;
}

.palette-radio-button {
  padding: 10px;
}

.control-panel-container {
  display: flex;
}

.control-panel-child {
  flex: 1;
  border: 2px solid rgb(120, 131, 233);
  padding: 5px;
  margin-right: 5px;
}

.control-panel-vertical-child {
  display: flex;
  flex-direction: column;
  border: 2px solid rgb(120, 131, 233);
  padding: 5px;
  margin-right: 5px;
}

/* .control-panel-child:first-child {
  margin-right: 5px;
} */

input[type="checkbox"] {
  margin-left: 5px;
}

button {
  margin: 2px;
}

div {
  margin-bottom: 2px;
}

label {
  display: inline-block;
  width: 150px;
  /* text-align: right; */
  margin-left: 5px;
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
