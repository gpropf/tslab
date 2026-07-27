import './assets/main.css'
const version = import.meta.env.VITE_VERSION;
console.log(`Current version: ${version}`);

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'



const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
