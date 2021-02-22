<template>
  <div class="side-bar">
    <keep-alive>
      <div>
        <logo></logo>
        <el-scrollbar wrap-class="scrollbar-wrapper">
          <el-menu
            :collapse="isCollapse"
            :background-color="variables.menuBg"
            :text-color="variables.menuText"
            :unique-opened="false"
            :active-text-color="variables.menuActiveText"
            :collapse-transition="false"
            mode="vertical"
            :default-active="activeMenu"
          >
            <sidebar-item v-for="route in permissionRoutes" :key="route.path" :item="route" :base-path="route.path" />
          </el-menu>
        </el-scrollbar>
      </div>
    </keep-alive>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, getCurrentInstance } from 'vue'
import logo from '@/layout/components/sideBar/logo.vue'
import SidebarItem from '@/layout/components/sideBar/SidebarItem.vue'
import variables from '@/styles/variables.scss'
import { getComputedRoutes } from '@/layout/messageCenter/routerRef'
import { getLink } from '@/layout/messageCenter/linkto'

export default defineComponent({
  name: 'sideBar',
  components: {
    logo,
    SidebarItem
  },
  setup (props, ctx) {
    const isCollapse = computed(() => false)
    // eslint-disable-next-line
    // @ts-ignore
    const proxy = getCurrentInstance().proxy
    const activeMenu = computed(() => {
      // eslint-disable-next-line
      // @ts-ignore
      const route = proxy.$route
      console.log(proxy, route)
      const { meta, path } = route
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    })
    const permissionRoutes = getComputedRoutes()
    console.log(permissionRoutes)
    return {
      variables,
      isCollapse,
      activeMenu,
      permissionRoutes,
      getLink
    }
  }
})
</script>

<style lang="scss">

.side-bar{
  width: 100%;
  height: 100%;
  li{
    text-align: left !important;
  }
}
</style>
