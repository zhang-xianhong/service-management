<template>
  <div class="packaged-pagination">
    <span class="packaged-pagination__total" :total="total">共 {{ total }} 条</span>
    <el-pagination
      @size-change="$emit('size-change', $event)"
      @current-change="$emit('current-change', $event)"
      :current-page="page"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      :pager-count="5"
      :total="total"
      :layout="layout"
      v-bind="$attrs"
    ></el-pagination>
  </div>
</template>

<script lang="ts">
export default {
  name: 'PackagedPagination',
  emits: ['size-change', 'current-change'],
  props: {
    page: {
      type: Number,
      default: 1,
    },
    pageSize: {
      type: Number,
      default: 10,
    },
    total: {
      type: Number,
      default: 0,
    },
    pageSizes: {
      type: Array,
      default: () => [10, 20, 50, 100],
    },
    layout: {
      type: String,
      default: 'sizes, prev, pager, next, jumper',
    },
  },
};
</script>

<style lang="scss">
.packaged-pagination {
  height: 50px;
  padding: 8px;
  width: 100%;
  .el-pagination {
    float: right;
    .el-pagination__total {
      display: none;
    }
  }
}
</style>

<style lang="scss" scoped>
.packaged-pagination {
  &::after {
    content: '';
    clear: both;
  }
  &__total {
    font-size: 12px;
    display: inline-block;
    line-height: 34px;
    height: 34px;
  }
}
</style>
