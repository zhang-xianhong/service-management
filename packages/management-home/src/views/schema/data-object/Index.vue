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
    <el-table
      :data="datasource"
      :default-sort="{ prop: 'name', order: 'descending' }"
      @sort-change="handleSortChange"
      style="width: 100%"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column v-for="column in columns" :key="column.prop" v-bind="{ ...column }" />
      <el-table-column label="操作" fixed="right"> </el-table-column>
    </el-table>
  </data-list>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, onMounted } from 'vue';
import { PageInfo, SortInfo } from '@/types/dataList';
import { Columns } from './columns';
import { getDataObjectList } from '@/api/schema/data-object';
export default defineComponent({
  name: 'dashboard',
  setup() {
    const loading = ref(false);
    const total = ref(100);
    const columns = ref(Columns);
    const datasource = ref([] as Array<object>);
    const searchParams = reactive({
      category: '',
      tags: [],
      keyword: '',
      page: 1,
      pageSize: 10,
      sortField: '',
      sortType: '',
    });

    const getList = async () => {
      loading.value = true;
      try {
        const { data } = await getDataObjectList(searchParams);
        datasource.value = data.list;
        total.value = data.total;
      } catch (error) {}
      loading.value = false;
    };

    // 分页改变
    const handlePageChange = ({ key, value }: PageInfo) => {
      searchParams[key] = value;
      getList();
    };

    // 排序改变
    const handleSortChange = ({ prop, order }: SortInfo) => {
      searchParams.sortField = prop;
      searchParams.sortType = order;
      getList();
    };

    onMounted(() => {
      getList();
    });

    return {
      loading,
      total,
      columns,
      searchParams,
      datasource,
      handlePageChange,
      handleSortChange,
    };
  },
});
</script>
