<script setup lang="ts">
/// <reference path="./../../../pgrid.ts"/>
import { RouterLink, RouterView } from 'vue-router'
import { ParametricGrid } from "./../../../pgrid"
import ParametricGridVC from './ParametricGridVC.vue';
import { type ColorInfo } from './ParametricGridVC.vue';
import { createApp } from 'vue';
import { ref, provide } from 'vue'
//import HelloWorld from './components/HelloWorld.vue';
import LabelledInput from './components/LabelledInput.vue';

const numberToColorMap  = new Map();
numberToColorMap.set(0, "#000000");
numberToColorMap.set(1, "#00FF00");
numberToColorMap.set(2, "#00AA00");
numberToColorMap.set(3, "#FF00FF");
numberToColorMap.set(4, "#AA00AA");
numberToColorMap.set(5, "#00AAFF");
const numColors = numberToColorMap.size;

function vizFn(cellval: number) {  
  let hexColor = numberToColorMap.get(cellval % numColors);
  let colorInfo: ColorInfo = { fillRGB: `${hexColor}` }; return colorInfo;
}



function createPGVC(inwidth: string, inheight: string) {
  var ComponentClass = createApp(ParametricGridVC, {
    width: parseInt(inwidth), height: parseInt(inheight),
    vizFn: vizFn, defaultValue: 175, onClickValue: onClickValue, programaticallyCreated: true
  })
  //var pg = new ComponentClass(20, 16, 555);
  const wrapper = document.getElementById("dynamic_content")
  if (wrapper) {
    const newDiv = document.createElement("div")
    ComponentClass.mount(newDiv)
    wrapper.appendChild(newDiv)
  }

}

const onClickValue = ref(0)
const newTask = ref(0);
const testDatum = ref(null);
provide('newTask', newTask);

</script>

<template>
  <div>
    <header>
      <!-- <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" /> -->
      <div class="wrapper">
        <!-- <HelloWorld msg="You did it!" /> -->

        <!-- <nav>
          <RouterLink to="/">Home</RouterLink>
          <RouterLink to="/about">About</RouterLink>
        </nav> -->
      </div>
    </header>
    <h1>{{ title }}</h1>
    <LabelledInput label="foo field" inputType="text" placeholder="42" id="test1" v-model="testDatum"></LabelledInput>
    <h2>Grid Data Entry</h2>
    <p>Input value: {{ testDatum }}</p>
    <div>
      <input type="text" v-model="newTask" placeholder="Test of provide/inject value">
    </div>
    <div>
      <input type="text" v-model="onClickValue" placeholder="onClickValue">
    </div>
    <div>
      <input type="text" v-model="pgwidth" placeholder="Width of new PG">
    </div>
    <div>
      <input type="text" v-model="pgheight" placeholder="Height of new PG">
    </div>
    <!-- <div v-if="newTask.length > 0">
      <h3>Test of provide/inject value</h3>
      <p>{{ newTask }}</p>
    </div>

    <div v-if="pgwidth.length > 0">
      <h3>PG width</h3>
      <p>{{ pgwidth }}</p>
    </div> -->

    <!-- <button @click="pgfactory(pgwidth)">Make Grid</button> -->
    <button @click="createPGVC(pgwidth, pgheight)">New Grid</button>
    <ParametricGridVC :width=4 :height="3" :vizFn="vizFn" :defaultValue="100" :onClickValue="onClickValue"
      :programaticallyCreated="false" />

    <div id="dynamic_content"></div>

    <!-- <RouterView /> -->
  </div>
</template>

<script lang="ts">

var pgGlobal: ParametricGrid<number>

export default {
  data() {
    return {
      title: 'My To Do App',
      newTask: 125,
      pgwidth: '',
      pgheight: ''

    }
  }
}
</script>


<style scoped>
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
