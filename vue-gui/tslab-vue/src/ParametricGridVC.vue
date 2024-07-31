<script setup lang="ts">
import { ref } from 'vue'
import { ParametricGrid } from "./../../../pgrid.ts"

const count = ref(10)

const props = defineProps<{
    width: number,
    height: number
}>()

var pgGlobal = new ParametricGrid<any>(props.width, props.height, 100);
pgGlobal.setLocation(2, 1, 12)
console.log(pgGlobal);
</script>



<template>
    <button @click="count++; pgGlobal.setLocation(3, 2, count * 5)">You clicked me {{ count }} times.></button>
    <div>{{ pgGlobal.width }}</div>
    <div>{{ pgGlobal.height }}</div>
    <svg viewBox="0 0 4 3" width="320" height="200" xmlns="http://www.w3.org/2000/svg">
        <svg v-for="(row, y) in pgGlobal._grid" xmlns="http://www.w3.org/2000/svg">
            
                <svg v-for="(cellval, x) in row"><rect @click="pgGlobal.setLocation(x, y, 250); $forceUpdate()" :x="x" :y="y" width="1" height="1" :fill="'rgb(200, 200, ' + cellval + ')'"/></svg>
            
        </svg>
    </svg>
</template>