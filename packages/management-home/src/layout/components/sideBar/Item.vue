<template>
  <div>
    <template v-if="icon">
      <i :class="[icon, 'sub-el-icon']" v-if="icon.includes('el-')"></i>
    </template>
    <span v-if="title">{{ title }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'linkItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: () => ''
    },
    title: {
      type: String,
      default: () => ''
    }
  }
})
</script>

<style scoped>
.sub-el-icon {
  color: currentColor;
  width: 1em;
  height: 1em;
}
</style>
