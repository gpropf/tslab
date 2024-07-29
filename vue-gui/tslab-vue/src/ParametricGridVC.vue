<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)

defineProps<{
  width?: number,
  height?: number
}>()

</script>



<template>
    <button @click="count++">You clicked me {{ count }} times.</button>
</template>