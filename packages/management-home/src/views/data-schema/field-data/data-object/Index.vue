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
    <packaged-table :data="datasource" :columns="tableColumns" :operations="tableOperations"></packaged-table>
    <el-table
      :data="datasource"
      :default-sort="{ prop: 'name', order: 'descending' }"
      @sort-change="handleSortChange"
      @selection-change="handleSelectionChange"
      style="width: 100%"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column label="序号" fixed min-width="80" type="index">
        <template #default="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="数据名称" fixed min-width="100" prop="name">
        <template #default="scope">
          <router-link :to="`/schema/data-object/${scope.row.id}`">{{ scope.row.name }}</router-link>
        </template>
      </el-table-column>
      <el-table-column v-for="column in columns" :key="column.prop" v-bind="{ ...column }" />
      <el-table-column label="操作" fixed="right"> </el-table-column>
    </el-table>
  </data-list>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, onMounted, toRefs } from 'vue';
import { PageInfo, SortInfo } from '@/types/dataList';
import DataFormColumns from '../config/data-form-columns';
import { getModelList } from '@/api/schema/model';
import PackagedTable from '@/components/packaged-table/PackagedTable.vue';
import { tableColumns, tableOperations } from '../config/data-object-management-table';

export default defineComponent({
  name: 'dashboard',
  components: {
    PackagedTable,
  },
  setup() {
    const tableState = reactive({
      data: [],
      columns: tableColumns,
      operations: tableOperations,
    });
    const loading = ref(false);
    const total = ref(100);
    const columns = DataFormColumns;
    const datasource = ref([] as Array<object>);
    const selections = ref([] as Array<object>);
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
        const { data } = await getModelList(searchParams);
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

    const handleSelectionChange = (val: Array<object>) => {
      selections.value = val;
      console.log(val);
    };

    onMounted(() => {
      getList();
    });

    return {
      ...toRefs(tableState),
      loading,
      total,
      columns,
      searchParams,
      datasource,
      selections,
      handlePageChange,
      handleSortChange,
      handleSelectionChange,
    };
  },
});
</script>
