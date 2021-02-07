<template>
  <div class="main-menu">
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import { getRouterRef, getComputedRoutes } from '@/layout/messageCenter/routerRef'
import Link from '@/layout/components/sideBar/link.vue'
import Item from '@/layout/components/sideBar/item.vue'
import { isExternal } from '@/utils/validate'
// import path from 'path'

export default defineComponent({
  name: 'Menu',
  components: {
    // eslint-disable-next-line vue/no-unused-components
    Link,
    // eslint-disable-next-line vue/no-unused-components
    Item
  },
  setup () {
    onMounted(() => {
      const luts = getComputedRoutes()
      console.log(Object.keys(luts), luts)
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
