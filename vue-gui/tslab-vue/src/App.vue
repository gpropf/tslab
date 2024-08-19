<script setup lang="ts">

import { useCounterStore } from '@/stores/counter'

/// <reference path="./../../../ParametricGrid.ts"/>
//import { RouterLink, RouterView } from 'vue-router'
//import { ParametricGrid } from "./../../../ParametricGrid"
import ParametricGridVC from './ParametricGridVC.vue';
import { type ColorInfo } from './ParametricGridVC.vue';
import { createApp } from 'vue';
//import { createPinia } from 'pinia'
//import { defineStore } from 'pinia'
import { ref } from 'vue'
//import HelloWorld from './components/HelloWorld.vue';
import LabelledInput from './components/LabelledInput.vue';

const store = useCounterStore();
const { count, doubleCount, ruleGridMap, increment, setRule, getRule } = store;

const numberToColorMap = new Map();
numberToColorMap.set(0, "#000000");
numberToColorMap.set(1, "#00FF00");
numberToColorMap.set(2, "#00AA00");
numberToColorMap.set(3, "#FF00FF");
numberToColorMap.set(4, "#AA00AA");
numberToColorMap.set(5, "#00AAFF");
const numColors = numberToColorMap.size;

//const rules: any[] = [];

function vizFn(cellval: number) {
  let hexColor = numberToColorMap.get(cellval % numColors);
  let colorInfo: ColorInfo = { fillRGB: `${hexColor}` }; return colorInfo;
}

function conversionFn(v: string) {
  return parseInt(v);
}



function createPGVC(inwidth: string, inheight: string) {
  var ComponentClass = createApp(ParametricGridVC, {
    width: parseInt(inwidth), height: parseInt(inheight),
    vizFn: vizFn, defaultValue: 1, onClickValue: onClickValue, programaticallyCreated: true, conversionFn: conversionFn,
    screenWidth: 150, screenHeight: 100, id: newRuleId.value
  })
  //var pg = new ComponentClass(20, 16, 555);
  const wrapper = document.getElementById("dynamic_content")
  if (wrapper) {
    const newDiv = document.createElement("div")
    newDiv.className = "rule"
    ComponentClass.mount(newDiv)
    wrapper.appendChild(newDiv)
    //rules.push(ComponentClass)
  }

}

const newRuleId = ref("newrule")
const onClickValue = ref("1")
const mainGridName = ref("MAIN")
//const newTask = ref(0);
//const testDatum = ref(null);
const first = ref("Greg");
//const last = ref("");
const mainGridKey = ref(0);
const mainGridWidth = ref("60");
const mainGridHeight = ref("40");
const screenWidth = ref(600);
const screenHeight = ref(400);

//provide('newTask', newTask);

// const useRuleStore = defineStore('rules', () => {
//   const count = ref(0)
//   const name = ref('Eduardo')
//   const doubleCount = computed(() => count.value * 2)
//   function increment() {
//     count.value++
//   }

//   return { count, name, doubleCount, increment }
// })

</script>



<template>
  <div>
    <h1>{{ title }}</h1>
    <LabelledInput v-model:inputValue="mainGridWidth" id="main-grid-width-id" inputType="text"
      placeholder="Enter Main Grid Width" componentName="Main Grid Width" />
    <LabelledInput v-model:inputValue="mainGridHeight" id="main-grid-height-id" inputType="text"
      placeholder="Enter Main Grid Height" componentName="Main Grid Height" />
    <h2>Grid Data Entry</h2>
    <p>Input value: {{ first }}</p>
    <LabelledInput v-model:inputValue="onClickValue" id="on-click-value-id" inputType="text"
      placeholder="Enter Color index number for grids" componentName="Color index" />
    <div>
      <input type="text" v-model="pgwidth" placeholder="Width of new PG">
    </div>
    <div>
      <input type="text" v-model="pgheight" placeholder="Height of new PG">
    </div>

    <button @click="createPGVC(pgwidth, pgheight)">New Grid</button>
    <button @click="mainGridKey++">Resize Main Grid</button>
    <!-- <button @click="console.log(rules[0])">View First Rule</button> -->
    <LabelledInput v-model:inputValue="newRuleId" id="new-rule-id" inputType="text"
    placeholder="Enter Id string for new rule" componentName="New Rule Id" />


    <ParametricGridVC :key="mainGridKey" :screenWidth="screenWidth" :screenHeight="screenHeight"
      :width="parseInt(mainGridWidth)" :height="parseInt(mainGridHeight)" :vizFn="vizFn" :defaultValue="0"
      :onClickValue="onClickValue" :programaticallyCreated="false" :conversionFn="conversionFn" :id="mainGridName" />

    <div id="dynamic_content" class="rules"></div>

    <!-- <RouterView /> -->
  </div>
</template>

<script lang="ts">

//var pgGlobal: ParametricGrid<number>

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
