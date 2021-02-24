<template>
  <div class="main-window">
    <div class="content-view">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'mainwindow'
})
</script>

<style lang="scss">
@import '@/styles/layout';
.main-window{
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: #f2f2f2;
}
.content-view {
  margin: 16px;
  height: 100%;
  background: $contentBgcolor;
}
</style>
