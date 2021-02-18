<template>
  <div class="nav-bar">
    <div class="bread-bar">
      <bread-curmb></bread-curmb>
    </div>
    this is navbar
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import breadCurmb from '@/components/breadCurmb/index.vue'

export default defineComponent({
  name: 'navBar',
  components: {
    breadCurmb
  }
})
</script>

<style lang="scss">
.nav-bar{
  width: 100%;
  height: 100%;
  color: white;
  line-height: 50px;
  position: relative;
  .bread-bar{
    width: 200px;
    height: 30px;
    position: absolute;
    top: 0;
    margin-top: auto;
    bottom: 0;
    margin-bottom: auto;
    left: 40px;
    padding-top: 15px;
  }
}
</style>
