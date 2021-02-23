<template>
  <div class="layout">
    <header class="layout-head">
      <nav-bar/>
    </header>
    <main class="layout-main">
      <aside class="layout-sidebar">
        <side-bar/>
      </aside>
      <div class="layout-container">
        <el-scrollbar >
          <div class="layout-viewport">
            <router-view />
          </div>
        </el-scrollbar>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import SideBar from './components/sideBar/Index.vue'
import NavBar from './components/navBar/Index.vue'
import publicStyle from '@/styles/layout.scss'

export default defineComponent({
  name: 'Layout',
  components: {
    SideBar,
    NavBar
  },
  setup () {
    return {
      publicStyle
    }
  }
})
</script>

<style lang="scss">
@import "./src/styles/layout";

.layout{
  width: 100%;
  height: 100%;
  display: flex;
  overflow: hidden;
  flex-flow: column;
  background-color: #f2f2f2;
  &-head {
    height: 50px;
    flex-shrink: 0;
    background-color: #262F3E;
  }
  &-main {
    flex: 1;
    display: flex;
    overflow: hidden;
  }
  &-sidebar {
    width: 210px;
    flex-shrink: 0;
    background-color: #1e222d;
    .el-menu-item:focus, .el-menu-item:hover{
      background-color: $routerHoverBgcolor !important;
    }
    .el-submenu__title:focus, .el-submenu__title:hover{
      background-color: $routerHoverBgcolor !important;
    }
    .el-menu-item.is-active{
      color: $routerActiveColor !important;
      background-color: $routerActiveBgcolor !important;
    }
  }
  &-container {
    flex: 1;
    overflow: hidden;
  }
  &-viewport {
    margin: 20px;
    padding: 20px;
    background-color: white;
  }

  .el-menu {
    background: transparent;
    border-right: none;
  }

  // .layout-item{
  //   flex: 1;
  // }
  // .side-bar-item{
  //   max-width: 210px;
  //   background: rgba(0,0,0,0.2);
  //   background: $sideBarBgcolor !important;
  //   flex-shrink: 0;
  //   .el-submenu .el-menu-item{
  //     background: $routerLiBgcolor !important;
  //   }
  //   .el-submenu__title{
  //     background: $routerUlBgcolor !important;
  //   }
  //   .el-menu-item{
  //     background: $routerUlBgcolor !important;
  //     color: #ffffff !important;
  //   }
  //   .el-menu-item.is-active{
  //     background: $routerActiveBgcolor !important;
  //   }
  // }
  // .nav-content{
  //   background: rgba(255,255,255,0.3);
  //   display: flex;
  //   flex-direction: column;
  //   &>div{
  //     flex: 1;
  //   }
  //   .nav-parent{
  //     color: $deepColor;
  //     height: 50px;
  //     min-height: 50px;
  //     max-height: 50px;
  //   }
  //   .mian-parent{
  //     position: relative;
  //   }
  // }
}
</style>
