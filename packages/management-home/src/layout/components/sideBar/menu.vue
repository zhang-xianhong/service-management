<template>
  <div class="main-menu">
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import { getRouterRef } from '@/layout/messageCenter/routerRef'

export default defineComponent({
  name: 'menu',
  components: {},
  setup () {
    onMounted(() => {
      console.log(getRouterRef())
    })
  }
})
</script>

<style lang="scss">
.main-menu{
  width: 100%;
  height: 100%;
  background: rgba(255,255,255,0.2);
}
</style>
