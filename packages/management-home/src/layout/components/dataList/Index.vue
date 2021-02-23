<template>
  <div class="data-list">
    <aside class="data-list__head" v-if="$slots.head">
      <slot name="head"/>
    </aside>
    <main class="data-list__body">
      <slot/>
    </main>
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
}
</style>
