<template>
  <div class="packaged-steps" :style="{ width }">
    <div
      v-for="(item, index) in data"
      :key="index"
      class="packaged-steps__item"
      :class="{ 'packaged-steps__item--active': index + 1 === active }"
      :style="{ width: computedStepWidth }"
    >
      <div class="step-title">{{ item.title }}</div>
      <div class="step-icon">
        <div class="step-icon__rect"></div>
        <div v-if="index + 1 < data.length" class="step-icon__triangle"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

// 步骤信息接口
interface StepInterface {
  title?: string;
  icon?: string;
}
export default defineComponent({
  name: 'PackagedSteps',
  emits: ['change'],
  props: {
    width: {
      type: String,
      default: '100%',
    },
    active: {
      type: Number,
      default: 1,
    },
    data: {
      type: Array,
      default: () => [],
    },
  },
  setup(props: { width: string; active: number | string; data: Array<any> }) {
    const computedStepWidth = computed(() => `${Math.floor(100 / props.data.length)}%`);
    return {
      computedStepWidth,
    };
  },
});
</script>

<style lang="scss" scoped>
.packaged-steps {
  display: flex;
  justify-content: space-around;
  margin-bottom: 60px;
  &__item {
    display: inline-block;
    --bg-color: #e6e6e6;
    &--active {
      --bg-color: #006eff;
    }
    .step-title {
      height: 30px;
      line-height: 30px;
      font-size: 20px;
      font-weight: bolder;
      color: var(--bg-color);
    }
    .step-icon {
      width: 100%;
      height: 16px;
      margin-top: 12px;
      &__rect {
        display: inline-block;
        width: 160px;
        height: 8px;
        margin: 4px 0px;
        background: var(--bg-color);
      }
      &__triangle {
        display: inline-block;
        height: 0;
        width: 0;
        overflow: hidden;
        font-size: 0;
        line-height: 0;
        border-color: transparent;
        border-left-color: var(--bg-color);
        border-style: solid;
        border-width: 8px;
      }
    }
  }
}
</style>
