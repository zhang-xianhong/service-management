<template>
  <div class="data-list">
    <aside class="data-list__head" v-if="$slots.head || $slots.headLeft || $slots.headRight">
      <div class="data-list__search" v-if="$slots.headLeft">
        <slot name="headLeft" />
      </div>
      <div class="data-list__actions" v-if="$slots.headRight">
        <slot name="headRight" />
        <el-button v-if="showSeting" type="primary" size="mini" icon="el-icon-s-tools" @click="openDrawer()"
          >设置</el-button
        >
      </div>
      <slot name="head" />
    </aside>
    <main class="data-list__body" v-loading="loading">
      <slot />
    </main>
    <div v-if="showSeting">
      <CustomColumn ref="customColumn" :tableColumns="tableColumns" @handelChange="customColumns"></CustomColumn>
    </div>
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
import { defineComponent, ref } from 'vue';
import CustomColumn from './CustomColumn.vue';
export default defineComponent({
  name: 'DataList',
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    showPagination: {
      type: Boolean,
      default: true,
    },
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
      default: 2000,
    },
    showSeting: {
      type: Boolean,
      default: true,
    },
    tableColumns: {
      type: Array,
      default: () => [],
    },
  },
  components: { CustomColumn },
  emits: ['pageChange', 'setColumns'],
  setup(props, { emit }) {
    const handlePageSizeChange = (size: number) => {
      emit('pageChange', {
        key: 'pageSize',
        value: size,
      });
    };
    const handlePageChange = (page: number) => {
      emit('pageChange', {
        key: 'page',
        value: page,
      });
    };
    const customColumns = (colnums: any) => {
      emit('setColumns', colnums);
    };
    const customColumn = ref(null);
    const openDrawer = () => {
      (customColumn.value as any).openDrawer();
    };
    return {
      customColumn,
      openDrawer,
      handlePageSizeChange,
      handlePageChange,
      customColumns,
    };
  },
});
</script>
<style scoped lang="scss">
.data-list {
  &__head {
    padding: 16px;
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
