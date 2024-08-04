<script setup lang="ts">
import { ref } from 'vue'
import { ParametricGrid } from "./../../../pgrid.ts"
import { inject } from "vue";

interface ColorInfo {
    fillRGB: string;
}

type ObjectVisualizationFn = (a: any) => ColorInfo

const count = ref(10)

const props = defineProps<{
    width: number,
    height: number,
    vizFn: ObjectVisualizationFn,
    defaultValue: any,
    onClickValue: any,
    programaticallyCreated: boolean
}>()

let pgGlobal = new ParametricGrid<any>(props.width, props.height, props.defaultValue);
pgGlobal.setLocation(2, 1, 120)
console.log(pgGlobal);
var viewBox=`0 0 ${props.width} ${props.height}`;




const newTask = inject<number>("newTask", 75);

</script>



<template>
    <button @click="count++; pgGlobal.setLocation(3, 2, count * 5)">You clicked me {{ count }} times.></button>
    <div>WIDTH: {{ pgGlobal.width }}</div>
    <div>HEIGHT: {{ pgGlobal.height }}</div>
    <div>Click val: {{ onClickValue }}</div>
    <div v-if="programaticallyCreated">This PG was created dynamically!
        <svg :viewBox="viewBox" width="320" height="200" xmlns="http://www.w3.org/2000/svg">
    <svg v-for="(row, y) in pgGlobal._grid" xmlns="http://www.w3.org/2000/svg">
            
            <svg v-for="(cellval, x) in row"><rect @click="pgGlobal.setLocation(x, y, onClickValue.value); console.log(vizFn(onClickValue.value)); $forceUpdate()" :x="x" :y="y" width="1" height="1" :fill="vizFn(cellval).fillRGB"/></svg>
        
    </svg></svg>
</div>
    <div v-else="programaticallyCreated">This PG was NOT created dynamically!
    
    <svg :viewBox="viewBox" width="320" height="200" xmlns="http://www.w3.org/2000/svg">
        <svg v-for="(row, y) in pgGlobal._grid" xmlns="http://www.w3.org/2000/svg">
            
                <svg v-for="(cellval, x) in row"><rect @click="pgGlobal.setLocation(x, y, onClickValue); console.log(vizFn(onClickValue)); $forceUpdate()" :x="x" :y="y" width="1" height="1" :fill="vizFn(cellval).fillRGB"/></svg>
            
        </svg>
    </svg>
</div>
</template>

