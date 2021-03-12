import Vue, { createApp } from 'vue';
import App from './App.vue';

import './permission';

import Element from './element';
import Store from './store';
import Router from './router';
import DataList from './components/dataList/Index.vue';
import FormPanel from './components/form-panel/Index.vue';
import { showModule } from '@/utils/permission-show-module';

const app: Vue.App = createApp(App);
// app.showModal = showModule;

app.component('DataList', DataList);
app.component('FormPanel', FormPanel);

// element全局配置
app.config.globalProperties.$ELEMENT = {
  size: 'small',
};
app.config.globalProperties.$showModule = showModule;

app
  .use(Element)
  .use(Store)
  .use(Router)
  .mount('#app');
