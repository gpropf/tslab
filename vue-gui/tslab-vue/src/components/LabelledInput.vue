<script lang="ts">
import { ref, onMounted } from 'vue'
export default {
    setup() {
        const input = ref(null);
        const inputValue = ref('');

        onMounted(() => {
            input.value.focus();
        });

        function focusInput() {
            input.value.focus();
        }

        return {
            input,
            inputValue,
            focusInput,
        };

        defineProps<{
            id: string,
            label: string,
            inputType: string,
            placeholder: string
        }>();
    },
};



</script>



<template>
    <div>
        <input type="text" ref="input" v-model="inputValue" />
        <button @click="focusInput">Focus Input</button>
        <p>Input value: {{ inputValue }}</p>
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
