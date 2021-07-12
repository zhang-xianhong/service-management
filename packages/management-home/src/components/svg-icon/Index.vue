<template>
  <svg :class="svgClass" aria-hidden="true">
    <use :xlink:href="icon" />
  </svg>
</template>

<script lang="ts">
import { computed } from 'vue';
export default {
  name: 'SvgIcon',
  props: {
    iconClass: {
      type: String,
      default: () => '',
    },
    iconName: {
      type: String,
      default: '',
    },
  },
  setup(props: any) {
    const svgClass = computed(() => (props.iconClass ? `svg-icon ${props.iconClass}` : 'svg-icon'));
    const icon = computed(() => `#icon-${props.iconName}`);
    return {
      svgClass,
      icon,
    };
  },
};
</script>

<style>
.svg-icon {
  width: 1em;
  height: 1em;
  fill: currentColor;
  overflow: hidden;
}
</style>
