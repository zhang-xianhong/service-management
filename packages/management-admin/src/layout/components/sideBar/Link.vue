<template>
  <component :is="type" v-bind="linkProps(to)">
    <slot />
  </component>
</template>

<script lang="ts">
import { isExternal } from '@/utils/validate';
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'Link',
  props: {
    to: {
      type: String,
      require: true,
      default: () => '',
    },
  },
  setup(props) {
    const isExternals = computed(() => isExternal(props.to));
    const type = computed(() => {
      if (isExternals.value) {
        return 'a';
      }
      return 'router-link';
    });
    const linkProps = (to: string) => {
      if (isExternals.value) {
        return {
          href: to,
          target: '_blank',
          rel: 'noopener',
        };
      }
      return {
        to,
      };
    };
    return {
      isExternals,
      type,
      linkProps,
    };
  },
});
</script>
