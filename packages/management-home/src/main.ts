import Vue, { createApp } from 'vue'
import App from './App.vue'

import './permission'

import Element from './element'
import Store from './store'
import Router from './router'
import DataList from './layout/components/dataList/Index.vue'

const app: Vue.App = createApp(App)

app.component('DataList', DataList)

app.use(Element).use(Store).use(Router).mount('#app')
