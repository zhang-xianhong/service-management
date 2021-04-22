<template>
  <div class="packaged-steps" :style="{ width }">
    <div
      v-for="(item, index) in data"
      :key="index"
      class="packaged-steps__step"
      :class="{ 'packaged-steps__step--active': index + 1 <= active }"
      :style="{ width: computedStepWidth }"
    >
      <i v-if="item.icon" :class="icon"></i>
      <span v-else class="packaged-steps__icon" :class="{ 'packaged-steps__icon--active': index + 1 <= active }">
        {{ index + 1 }}
      </span>
      <span class="packaged-steps__title" :class="{ 'packaged-steps__title--active': index + 1 <= active }">{{
        item.title
      }}</span>
      <span class="packaged-steps__next" v-if="index + 1 < data.length">
        <i class="el-icon-arrow-right"></i>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { computed } from 'vue';

// 步骤信息接口
interface StepInterface {
  title?: string;
  icon?: string;
}
export default {
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
};
</script>

<style lang="scss" scoped>
.packaged-steps {
  &__step {
    display: inline-block;
  }
  &__icon {
    width: 32px;
    height: 32px;
    line-height: 28px;
    display: inline-block;
    border-radius: 16px;
    text-align: center;
    margin-right: 12px;
    border: 1px solid #bbb;
    color: #bbb;
    &--active {
      background: #006eff;
      border: #006eff;
      color: #fff;
      line-height: 32px;
    }
  }
  &__title {
    color: #bbb;
    font-size: 14px;
    font-weight: bolder;
    height: 32px;
    line-height: 32px;
    display: inline-block;
    &--active {
      color: #000;
    }
  }
  &__next {
    height: 32px;
    line-height: 32px;
    display: inline-block;
    margin-left: 35%;
    font-size: larger;
    font-weight: bolder;
    color: #bbb;
  }
}
</style>
