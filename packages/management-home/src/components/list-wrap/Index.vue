<template>
  <div class="sa-list-wrap" :style="{ backgroundColor: backgroundColor }">
    <div class="sa-list-wrap__empty" v-if="isEmptyProject">暂无项目，请联系管理员添加项目</div>
    <div class="sa-list-wrap__content" v-else v-loading="loading" element-loading-text="加载中...">
      <div class="sa-list-wrap__main">
        <slot />
      </div>
      <div class="sa-list-wrap__empty" v-if="empty && !loading">
        <slot name="empty" v-if="$slots.emit" />
        <span v-else>
          暂无数据<span v-if="hasCreateAuth">，立即<a @click="handleCreate">新建</a></span>
        </span>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed } from 'vue';
import { userProjectList } from '@/layout/messageCenter/user-info';
import _ from 'lodash';
export default defineComponent({
  name: 'ListWrap',
  props: {
    // 是否在项目下
    inProject: {
      type: Boolean,
      default: true,
    },
    loading: {
      type: Boolean,
      default: true,
    },
    backgroundColor: {
      type: String,
      default: '#fff',
    },
    empty: {
      type: Boolean,
      default: false,
    },
    hasCreateAuth: {
      type: Boolean,
      default: true,
    },
    handleCreate: {
      type: Function,
      default: _.noop,
    },
  },
  setup(props) {
    const isEmptyProject = computed(() => props.inProject && userProjectList.length === 0);
    return {
      userProjectList,
      isEmptyProject,
    };
  },
});
</script>
<style lang="scss" scoped>
.sa-list-wrap {
  &__empty,
  &__content {
    min-height: 200px;
  }
  &__empty {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
<style lang="scss">
.sa-list-wrap .el-table__empty-block {
  display: none;
}
.sa-list-wrap .el-loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  .circular {
    width: 32px;
    height: 32px;
    margin-right: 10px;
  }
}
</style>
