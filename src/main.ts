import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import * as echarts from 'echarts'
import htmlToPdf from '@/helper/htmlToPdf'

const app = createApp(App)

app.config.globalProperties.$echarts = echarts

app.use(htmlToPdf)

app.use(createPinia())
app.use(router)

app.mount('#app')
