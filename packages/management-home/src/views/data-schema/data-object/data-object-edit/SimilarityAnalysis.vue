<template>
  <packaged-table :data="tableData" :columns="tableColumns" :isShowOperation="false" :isSelectAble="false" border>
    <template #name="slots">
      <div class="similarity-item__name">{{ slots.row.name }}</div>
    </template>
  </packaged-table>
</template>

<script lang="ts">
import PackagedTable from '@/components/packaged-table/PackagedTable.vue';
import TableColumnsInterface from '@/components/packaged-table/types/table-columns-interface';
import { tableColumns } from '../../config/data-object-similarity-table';
import { reactive, toRefs } from 'vue';

// 表格数据内容接口
interface TableDataInterface {
  name: string;
  description?: string;
  projectName?: string;
  user?: string;
  similarity: string;
  objectPropertyNum: number;
  samePropertyNum: number;
  [key: string]: unknown;
}

export default {
  name: 'SimilarityAnalysis',
  components: {
    PackagedTable,
  },
  setup() {
    const state = reactive({
      tableData: [] as TableDataInterface[],
      tableColumns: tableColumns as TableColumnsInterface[],
    });

    return {
      ...toRefs(state),
    };
  },
};
</script>

<style lang="scss" scoped>
.similarity-item__name {
  color: $linkColor;
  &:hover {
    color: $titleColor;
  }
}
</style>
