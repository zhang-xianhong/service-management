<template>
  <div class="logo-bar">
    <div class="logo-content" :style="{height: pubicStyle.navBarHeight, background: pubicStyle.sideBarBgcolor}">
      <img src="./citybaselogo.png">
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import pubicStyle from '@/styles/layout.scss'

export default defineComponent({
  name: 'logoBar',
  setup () {
    return {
      pubicStyle
    }
  }
})
</script>

<style lang="scss">
.side-bar{
  width: 100%;
  height: 50px !important;
  min-height: 50px;
  max-height: 50px;
  background: rgba(255,255,255,0.4);
  .logo-content {
    width: 100%;
    line-height: 50px;
    color: white;
    &>img{
      width: 180px;
    }
  }
}
</style>
