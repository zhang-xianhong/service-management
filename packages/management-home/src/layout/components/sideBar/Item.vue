<template>
  <div>
    <span class="icon-wrap" v-if="icon">
      <i :class="[icon, 'sub-el-icon']" v-if="icon.includes('el-')"></i>
      <svg-icon v-else :icon-name="icon" style="margin-right: 0; vertical-align: baseline"></svg-icon>
      &nbsp;
    </span>
    <span v-else class="blank-span"></span>
    <span v-if="title">{{ title }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'linkItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: () => '',
    },
    title: {
      type: String,
      default: () => '',
    },
    hover: {
      type: Boolean,
      default: () => false,
    },
  },
});
</script>

<style scoped>
.sub-el-icon {
  color: currentColor;
  width: 1em;
  height: 1em;
}
.blank-span {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background-color: white;
  display: inline-block;
  margin: auto 12px auto auto;
}
.icon-wrap :hover {
  color: red;
}
</style>
