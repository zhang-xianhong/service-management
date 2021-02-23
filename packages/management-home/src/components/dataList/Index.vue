<template>
  <div class="data-list">
    <aside class="data-list__head" v-if="$slots.head">
      <slot name="head"/>
    </aside>
    <main class="data-list__body">
      <slot/>
    </main>
    <aside class="data-list__foot" v-if="$slots.foot">
      <slot name="foot"/>
    </aside>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'DataList'
})
</script>
<style scoped lang="scss">
.data-list {
  &__head {
    margin-bottom: 20px;
  }
  &__foot {
    margin-top: 20px;
    text-align: right;
  }
}
</style>
