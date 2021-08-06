<template>
  <div class="sa-tooltip">
    <div class="sa-tooltip__placeholder">
      <span ref="placeholder">{{ content }}</span>
    </div>
    <div class="sa-tooltip__content">
      <el-tooltip v-if="showTooltip" effect="dark" :visible-arrow="visibleArrow" :placement="placement">
        <template #content>
          <span style="display: inline-block; max-width: 500px">{{ content }}</span>
        </template>
        <span>{{ content }}</span>
      </el-tooltip>
      <span v-else>{{ content }}</span>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
export default defineComponent({
  name: 'Tooltip',
  props: {
    visibleArrow: {
      type: Boolean,
      default: false,
    },
    placement: {
      type: String,
      default: 'top',
    },
    content: {
      type: String,
      default: '',
    },
  },
  setup() {
    const placeholder: any = ref(null);
    const showTooltip = ref(false);
    onMounted(() => {
      const $el = placeholder.value;
      const $parent = $el.parentNode;
      if ($el.offsetWidth > $parent.offsetWidth) {
        showTooltip.value = true;
      }
    });

    return {
      placeholder,
      showTooltip,
    };
  },
});
</script>
<style lang="scss" scoped>
.sa-tooltip {
  width: 100%;
  overflow: hidden;
  position: relative;
  &__placeholder {
    visibility: hidden;
    opacity: 0;
  }
  &__placeholder,
  &__content {
    max-width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  &__content {
    position: absolute;
    top: 0;
  }
}
</style>
