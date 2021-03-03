<template>
  <data-list
    :loading="loading"
    :total="total"
    :page="searchParams.page"
    :pageSize="searchParams.pageSize"
    :tableColumns="columns"
    :showSeting="showSeting"
    @page-change="handlePageChange"
    @setColumns="customColumns"
  >
    <template v-slot:headLeft>
      <el-button type="primary">分配用户</el-button>
      <el-button plain>分配团队</el-button>
      <el-button plain>负责人</el-button>
      <el-button plain>删除</el-button>
    </template>
    <template v-slot:headRight>
      <el-input v-model="searchParams.keyword" placeholder="请输入关键字" />
      <el-button icon="el-icon-search" type="primary"></el-button>
    </template>
    <el-table :default-sort="{ prop: 'name', order: 'descending' }" @sort-change="handleSortChange" style="width: 100%">
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column v-for="column in tableColumns" :key="column.prop" v-bind="{ ...column }" />
      <el-table-column label="操作" fixed="right"> </el-table-column>
    </el-table>
  </data-list>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue';
import { PageInfo, SortInfo } from '@/types/dataList';
import { Columns } from './columns';
export default defineComponent({
  name: 'userManagerment',
  setup() {
    const loading = ref(false);
    const showSeting = ref(true);
    const total = ref(100);
    const columns = ref(Columns);
    const searchParams = reactive({
      category: '',
      tags: [],
      keyword: '',
      page: 1,
      pageSize: 10,
    });

    // 分页改变
    const handlePageChange = ({ key, value }: PageInfo) => {
      searchParams[key] = value;
      console.log(searchParams);
    };

    // 排序改变
    const handleSortChange = ({ prop, order }: SortInfo) => {
      console.log(prop, order);
    };

    const tableColumns: any = ref([]);

    // 自定义显示列
    const customColumns = (data: any) => {
      console.log(data);
      tableColumns.value = data;
    };
    onMounted(() => {
      if (!showSeting.value) {
        tableColumns.value = columns.value;
      }
    });
    return {
      loading,
      showSeting,
      total,
      columns,
      searchParams,
      handlePageChange,
      handleSortChange,
      customColumns,
      tableColumns,
    };
  },
});
</script>
