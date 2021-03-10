import 'element-plus/lib/theme-chalk/index.css';
import lang from 'element-plus/lib/locale/lang/zh-cn';
import locale from 'element-plus/lib/locale';

import {
  ElButton,
  ElIcon,
  ElImage,
  ElInput,
  ElTable,
  ElTableColumn,
  ElInfiniteScroll,
  ElLoading,
  ElMessage,
  ElMessageBox,
  ElNotification,
  ElSubmenu,
  ElMenu,
  ElMenuItem,
  ElBreadcrumb,
  ElBreadcrumbItem,
  ElScrollbar,
  ElPopover,
  ElPagination,
  ElTabs,
  ElTabPane,
  ElForm,
  ElFormItem,
  ElSelect,
  ElOption,
  ElRadio,
  ElRadioGroup,
  ElCheckbox,
  ElCheckboxGroup,
  ElSlider,
  ElInputNumber,
  ElBadge,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElTag,
  ElRow,
  ElCol,
  ElDrawer,
  ElDialog,
  ElLink,
  ElCascader,
  ElTimeline,
  ElTimelineItem,
  ElCard,
} from 'element-plus';

const components = [
  ElButton,
  ElIcon,
  ElImage,
  ElInput,
  ElTable,
  ElTableColumn,
  ElSubmenu,
  ElMenu,
  ElMenuItem,
  ElBreadcrumb,
  ElBreadcrumbItem,
  ElScrollbar,
  ElPopover,
  ElPagination,
  ElTabs,
  ElTabPane,
  ElForm,
  ElFormItem,
  ElSelect,
  ElOption,
  ElRadio,
  ElRadioGroup,
  ElCheckbox,
  ElCheckboxGroup,
  ElSlider,
  ElInputNumber,
  ElBadge,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElTag,
  ElRow,
  ElCol,
  ElDialog,
  ElDrawer,
  ElDialog,
  ElTag,
  ElLink,
  ElCascader,
  ElTimeline,
  ElTimelineItem,
  ElCard,
];
const plugins = [ElInfiniteScroll, ElLoading, ElMessage, ElMessageBox, ElNotification];

// 设置语言
locale.use(lang);

export default {
  // element-plus UI组件按需引入
  install(app: any): void {
    components.forEach((component) => {
      app.component(component.name, component);
    });
    plugins.forEach((plugin) => {
      app.use(plugin);
    });
  },
};
