<template>
  <div class="main-window">
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
@import './src/styles/layout';
.main-window{
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: $contentBgcolor;
}
</style>
