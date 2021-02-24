import Vue, { createApp } from 'vue'
import App from './App.vue'

import './permission'

import Element from './element'
import Store from './store'
import Router from './router'
import DataList from './components/dataList/Index.vue'

const app: Vue.App = createApp(App)

app.component('DataList', DataList)

// element全局配置
app.config.globalProperties.$ELEMENT = {
  size: 'small'
}

app
  .use(Element)
  .use(Store)
  .use(Router)
  .mount('#app')
