import { createApp } from 'vue'
import App from './App.vue'
import './assets/scss/general.scss'
import '@tomtom-international/web-sdk-maps/dist/maps.css';
import * as bootstrap from 'bootstrap'
import { router } from './router'

const app = createApp(App)
app.use(router)
app.mount('#app')