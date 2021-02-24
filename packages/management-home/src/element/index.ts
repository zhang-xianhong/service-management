import 'element-plus/lib/theme-chalk/index.css'
import locale from 'element-plus/lib/locale'
import lang from 'element-plus/lib/locale/lang/zh-cn'
import 'dayjs/locale/zh-cn'
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
  ElBadge,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElSelect,
  ElOption,
  ElRow
} from 'element-plus'

// 设置语言
locale.use(lang)

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
  ElBadge,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElSelect,
  ElOption,
  ElRow
]

const plugins = [ElInfiniteScroll, ElLoading, ElMessage, ElMessageBox, ElNotification]

export default {
  // element-plus UI组件按需引入
  install: function (app: any): void {
    components.forEach(component => {
      app.component(component.name, component)
    })
    plugins.forEach(plugin => {
      app.use(plugin)
    })
  }
}
