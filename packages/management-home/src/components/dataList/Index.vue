<template>
  <div class="data-list">
    <aside class="data-list__head" v-if="$slots.head || $slots.headLeft || $slots.headRight">
      <div class="data-list__search" v-if="$slots.headLeft">
        <slot name="headLeft" />
      </div>
      <div class="data-list__actions" v-if="$slots.headRight">
        <slot name="headRight" />
      </div>
      <slot name="head" />
    </aside>
    <main class="data-list__body" v-loading="loading">
      <slot />
    </main>
    <aside class="data-list__foot" v-if="showPagination && total">
      <el-pagination
        background
        :disabled="loading"
        :current-page="page"
        :page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handlePageSizeChange"
        @current-change="handlePageChange"
      >
      </el-pagination>
    </aside>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'DataList',
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    showPagination: {
      type: Boolean,
      default: true
    },
    page: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    },
    total: {
      type: Number,
      default: 2000
    }
  },
  methods: {
    handlePageSizeChange (size: number) {
      this.$emit('pageChange', {
        key: 'pageSize',
        value: size
      })
    },
    handlePageChange (page: number) {
      this.$emit('pageChange', {
        key: 'page',
        value: page
      })
    }
  }
})
</script>
<style scoped lang="scss">
.data-list {
  &__head {
    margin-bottom: 20px;
    display: flex;
    align-items: center;
  }
  &__foot {
    margin-top: 20px;
    text-align: right;
  }
  &__search,
  &__actions {
    display: flex;
    align-items: center;
    > *:not(:first-child) {
      margin-left: 10px;
    }

    > .el-input {
      max-width: 220px;
    }
  }
  &__search {
    margin-right: 20px;
  }
  &__actions {
    margin-left: auto;
  }
}
</style>
