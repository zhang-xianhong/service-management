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
  ElScrollbar
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
  ElScrollbar
]
const plugins = [ElInfiniteScroll, ElLoading, ElMessage, ElMessageBox, ElNotification]

export default {
  install: function (app: any): void {
    components.forEach(component => {
      app.component(component.name, component)
    })
    plugins.forEach(plugin => {
      app.use(plugin)
    })
    const option = {
      size: 'small',
      zIndex: 2000
    }
    app.config.globalProperties.$ELEMENT = option
  }
}
