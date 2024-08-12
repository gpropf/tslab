<script setup lang="ts">
import { computed } from 'vue';

/* 
We make inputValue a string because it doesn't seem to work if it's a number.
Also, we don't know the actual type of the input data. If we need a number,
 we use parseInt, parseFloat, etc...
*/
const inputValue = defineModel('inputValue')

const props = defineProps<{
    inputType: string,
    componentName: string,
    placeholder?: string,
    id?: string
}>()

const innerId = computed(() => { return props.id + "-inner" })

</script>



<template>
    <div :id="id">
        <label :for="innerId">{{ componentName }}</label>
        <input :type="inputType" v-model="inputValue" :placeholder="placeholder" :id="innerId" />
    </div>
</template>

<style scoped>
h1 {
    font-weight: 500;
    font-size: 2.6rem;
    position: relative;
    top: -10px;
}

h3 {
    font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
    text-align: center;
}

@media (min-width: 1024px) {

    .greetings h1,
    .greetings h3 {
        text-align: left;
    }
}
</style>
