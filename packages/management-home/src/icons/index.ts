import SvgIcon from '@/components/svg-icon/Index.vue'; // svg component

const req = require.context('./svg', false, /\.svg$/);
req.keys().forEach(req);

export default {
  // element-plus UI组件按需引入
  install(app: any): void {
    app.component('svg-icon', SvgIcon);
  },
};
