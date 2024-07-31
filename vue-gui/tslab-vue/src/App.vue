<script setup lang="ts">
/// <reference path="./../../../pgrid.ts"/>
import { RouterLink, RouterView } from 'vue-router'
import { ParametricGrid } from "./../../../pgrid.ts"
import ParametricGridVC from './ParametricGridVC.vue';
//import HelloWorld from './components/HelloWorld.vue'

function vizFn(cellval: number) { let colorInfo: ColorInfo = {fillRGB:`rgb(${cellval},${cellval},${cellval})`}; return colorInfo;}

</script>

<template>
  <div>
    <header>
      <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

      <div class="wrapper">
        <!-- <HelloWorld msg="You did it!" /> -->

        <nav>
          <RouterLink to="/">Home</RouterLink>
          <RouterLink to="/about">About</RouterLink>
        </nav>
      </div>
    </header>
    <h1>{{ title }}</h1>
    <h2>Grid Data Entry</h2>

    <div>
      <input type="text" v-model="newTask" placeholder="Add a new task">
    </div>

    <div>
      <input type="text" v-model="pgwidth" placeholder="Width of new PG">
    </div>

    <div v-if="newTask.length > 0">
      <h3>New task preview</h3>
      <p>{{ newTask }}</p>
    </div>

    <div v-if="pgwidth.length > 0">
      <h3>PG width</h3>
      <p>{{ pgwidth }}</p>
    </div>


    <button @click="pgfactory(pgwidth)">Make Grid</button>
    <ParametricGridVC :width=4 :height="3" :vizFn="vizFn"/>

    <RouterView />
  </div>
</template>

<script lang="ts">

function pgfactory(pgwidth: number) {
  pgwidth++;
  console.log("PG Width = ", pgwidth)
  pgGlobal = new ParametricGrid(pgwidth, 8, 555);
  pgGlobal.setLocation(8, 4, 100);
  pgGlobal.setLocation(9, 3, 200);
  console.log(pgGlobal);
}

var pgGlobal: ParametricGrid<number>


export default {
  data() {
    return {
      title: 'My To Do App',
      newTask: '',
      pgwidth: 0
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
