import Vue, { createApp } from 'vue';
import App from './App.vue';

import './permission';

import Element from './element';
import Store from './store';
import Router from './router';
import DataList from './components/data-list/Index.vue';
import FormPanel from './components/form-panel/Index.vue';
const app: Vue.App = createApp(App);

app.component('DataList', DataList);
app.component('FormPanel', FormPanel);

// element全局配置
app.config.globalProperties.$ELEMENT = {
  size: 'small',
};

app
  .use(Element)
  .use(Store)
  .use(Router)
  .mount('#app');
