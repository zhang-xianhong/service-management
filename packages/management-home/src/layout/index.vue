<template>
  <div class="layout">
    <div class="layout-item side-bar-item">
      <side-bar></side-bar>
    </div>
    <div class="layout-item nav-content">
      <div class="nav-parent">
        <nav-bar></nav-bar>
      </div>
      <div class="mian-parent">
        <main-window></main-window>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import sideBar from './components/sideBar/index.vue'
import navBar from './components/navBar/index.vue'
import mainWindow from './components/mainWindow/index.vue'

export default defineComponent({
  name: 'Layout',
  components: {
    sideBar,
    navBar,
    mainWindow
  },
  setup () {
    return {}
  }
})
</script>

<style lang="scss">
.layout{
  width: 100%;
  min-height: 100%;
  background: cadetblue;
  display: flex;
  .layout-item{
    flex: 1;
  }
  .side-bar-item{
    max-width: 180px;
    background: rgba(0,0,0,0.2);
  }
  .nav-content{
    background: rgba(255,255,255,0.3);
    display: flex;
    flex-direction: column;
    &>div{
      flex: 1;
    }
    .nav-parent{
      height: 50px;
      min-height: 50px;
      max-height: 50px;
    }
  }
}
</style>
