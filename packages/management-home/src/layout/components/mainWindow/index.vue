<template>
  <div class="main-window">
    this is mainWindow
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'mainwindow'
})
</script>

<style lang="scss">
.main-window{
  width: 100%;
  height: 100%;
  background: #9dbbdb;
}
</style>
