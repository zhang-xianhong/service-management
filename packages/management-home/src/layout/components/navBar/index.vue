<template>
  <div class="nav-bar">
    this is navbar
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'navBar'
})
</script>

<style lang="scss">
.nav-bar{
  width: 100%;
  height: 100%;
  background: rgba(255,255,255,0.4);
}
</style>
