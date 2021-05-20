<template>
  <keep-alive>
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :collapse="isCollapse"
        :background-color="menuVariables.menuBg"
        :text-color="menuVariables.menuText"
        :unique-opened="false"
        :active-text-color="menuVariables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
        router
        :default-active="activeMenu"
      >
        <sidebar-item v-for="route in permissionRoutes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </keep-alive>
</template>

<script lang="ts">
import { defineComponent, computed, getCurrentInstance, ref } from 'vue';
import SidebarItem from '@/layout/components/sideBar/SidebarItem.vue';
import menuVariables from '@/styles/menu.scss';
import { getComputedRoutes } from '@/layout/messageCenter/routerRef';
import { getLink } from '@/layout/messageCenter/linkto';

export default defineComponent({
  name: 'sideBar',
  components: {
    SidebarItem,
  },
  setup() {
    const isCollapse = computed(() => false);
    // eslint-disable-next-line
    // @ts-ignore
    const { proxy } = getCurrentInstance();
    const activeMenu = computed(() => {
      // eslint-disable-next-line
      // @ts-ignore
      const route = proxy.$route;
      const { meta, path } = route;
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    });
    const permissionRoutes = ref(getComputedRoutes() as any);

    return {
      menuVariables,
      isCollapse,
      activeMenu,
      permissionRoutes,
      getLink,
    };
  },
});
</script>

<style lang="scss">
@import './src/styles/layout';
.side-bar {
  width: 100%;
  height: 100%;
  li {
    text-align: left !important;
  }
  .el-scrollbar {
    height: calc(100vh - #{$navBarHeight}) !important;
  }
}
</style>
