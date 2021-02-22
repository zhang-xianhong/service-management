import 'element-plus/lib/theme-chalk/index.css'
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
  ElPopover
} from 'element-plus'

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
  ElPopover
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
