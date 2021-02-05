<template>
  <div class="side-bar">
    <logo></logo>
    <main-menu></main-menu>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import logo from '@/layout/components/sideBar/logo.vue'
import mainMenu from '@/layout/components/sideBar/menu.vue'

export default defineComponent({
  name: 'sideBar',
  components: {
    logo,
    mainMenu
  }
})
</script>

<style lang="scss">
.side-bar{
  width: 100%;
  height: 100%;
  background: rgba(255,255,255,0.2);
}
</style>
