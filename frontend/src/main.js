import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';

import App from './App.vue'
import router from './router'




const app = createApp(App)

// primevue
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';

app.use(PrimeVue, {
  theme: {
    preset: Aura
  }
});

app.use(createPinia())
app.use(router)

app.mount('#app')
