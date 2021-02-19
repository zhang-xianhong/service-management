import Vue, { createApp } from 'vue'
import App from './App.vue'

import Element from './element'
import Store from './store'
import Router from './router'

const app: Vue.App = createApp(App)

app.use(Element).use(Store).use(Router).mount('#app')
