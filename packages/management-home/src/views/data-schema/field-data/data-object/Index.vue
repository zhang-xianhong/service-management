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
      <router-link to="/schema/data-object/0">
        <el-button type="primary">新增</el-button>
      </router-link>
      <el-button :disabled="!selections.length">克隆</el-button>
      <el-button :disabled="!selections.length">删除</el-button>
      <el-button>分类</el-button>
      <el-button>标签</el-button>
      <el-button>负责人</el-button>
    </template>
    <packaged-table
      :data="data"
      :columns="columns"
      :operations="operations"
      :default-sort="{ prop: 'name', order: 'descending' }"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
    >
      <template #name="{ rowData }">
        <router-link :to="`/schema/data-object/${rowData.id}`">{{ rowData.name }} </router-link>
      </template>
    </packaged-table>
  </data-list>
</template>
<script lang="ts">
import { reactive, ref, onMounted, toRefs } from 'vue';
import { PageInfo, SortInfo } from '@/types/dataList';
import { getModelList } from '@/api/schema/model';
import { RouterLink } from 'vue-router';
import PackagedTable from '@/components/packaged-table/PackagedTable.vue';
import { tableColumns, tableOperations } from '../config/data-object-management-table';
import TableColumnInterface from '@/components/packaged-table/types/table-columns-interface';
import TableOperationInterface from '@/components/packaged-table/types/table-operation-interface';

interface TableStateInterface {
  data: any[];
  columns: TableColumnInterface[];
  operations: TableOperationInterface[];
  selections: any[];
  total: number;
}

export default {
  name: 'dashboard',
  components: {
    PackagedTable,
    RouterLink,
  },
  setup() {
    // 表格相关数据
    const tableState: TableStateInterface = reactive({
      data: [],
      columns: tableColumns,
      operations: tableOperations,
      selections: [],
      total: 0,
    });

    // 加载中
    const loading = ref(false);

    // 获取表格数据参数
    const searchParams = {
      category: '',
      tags: [],
      keyword: '',
      page: 1,
      pageSize: 10,
      sortField: '',
      sortType: '',
    };

    // 获取数据对象列表
    const getList = async () => {
      loading.value = true;
      try {
        const { data } = await getModelList(searchParams);
        tableState.data = data.list;
        tableState.total = data.total;
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

    // 勾选数据对象项
    const handleSelectionChange = (val: Array<object>) => {
      tableState.selections = val;
    };

    onMounted(() => {
      getList();
    });

    return {
      ...toRefs(tableState),
      loading,
      searchParams,
      handlePageChange,
      handleSortChange,
      handleSelectionChange,
    };
  },
};
</script>
