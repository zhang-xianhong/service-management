<template>
  <data-list
    :loading="loading"
    :total="total"
    :page="searchParams.page"
    :pageSize="searchParams.pageSize"
    @page-change="handlePageChange"
  >
    <template v-slot:headLeft>
      <el-select v-model="searchParams.category" placeholder="请选择"> </el-select>
      <el-select v-model="searchParams.tags" placeholder="请选择"> </el-select>
      <el-input v-model="searchParams.keyword" placeholder="请输入关键字" />
      <el-button icon="el-icon-search" type="primary"></el-button>
    </template>
    <template v-slot:headRight>
      <el-button type="primary">新增</el-button>
    </template>
    <el-table :default-sort="{ prop: 'name', order: 'descending' }" @sort-change="handleSortChange" style="width: 100%">
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column v-for="column in columns" :key="column.prop" v-bind="{ ...column }" />
      <el-table-column label="操作" fixed="right"> </el-table-column>
    </el-table>
  </data-list>
</template>
<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import { PageInfo, SortInfo } from '@/types/dataList';
import { Columns } from './columns';
export default defineComponent({
  name: 'dashboard',
  setup() {
    const loading = ref(false);
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

    return {
      loading,
      total,
      columns,
      searchParams,
      handlePageChange,
      handleSortChange,
    };
  },
});
</script>
