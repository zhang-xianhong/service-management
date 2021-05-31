import Vue, { createApp } from 'vue';
import App from './App.vue';

import './permission';

import Element from './element';
import SvgIcon from './icons';
import Store from './store';
import Router from './router';
import DataList from './components/data-list/Index.vue';
import FormPanel from './components/form-panel/Index.vue';
import { showModule } from '@/utils/permission-show-module';
import { addHighLight } from '@/plugins/highlight';

const app: Vue.App = createApp(App);

app.component('DataList', DataList);
app.component('FormPanel', FormPanel);
addHighLight(app);

// element全局配置
app.config.globalProperties.$ELEMENT = {
  size: 'small',
};
// 权限点鉴权，控制页面中按钮/模块显隐函数
app.config.globalProperties.$showModule = showModule;

app.use(Element).use(SvgIcon).use(Store).use(Router).mount('#app');
