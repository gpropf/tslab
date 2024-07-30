<script setup lang="ts">
import { ref } from 'vue'
import { ParametricGrid } from "./../../../pgrid.ts"

const count = ref(10)

const props = defineProps<{
    width: number,
    height: number
}>()

var pgGlobal = new ParametricGrid<number>(props.width, props.height, 3);
pgGlobal.setLocation(2, 1, 12)
console.log(pgGlobal);
</script>



<template>
    <button @click="count++; pgGlobal.setLocation(3, 2, count)">You clicked me {{ count }} times.></button>
    <div>{{ pgGlobal.width }}</div>
    <div>{{ pgGlobal.height }}</div>
    <ol>
        <li v-for="row in pgGlobal._grid">
            <ol>
                <li v-for="cellval in row">{{ cellval }}</li>
            </ol>
        </li>
    </ol>
</template>