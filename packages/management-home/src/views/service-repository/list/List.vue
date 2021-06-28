<template>
  <div class="g-data-list">
    <el-row>
      <el-col :span="6" style="text-align: left"></el-col>
      <el-col :offset="12" :span="6" style="text-align: right">
        <el-input
          placeholder="请输入服务名称"
          suffix-icon="el-icon-search"
          @input="handlerSearch"
          v-model="searchProps.keyword"
        ></el-input>
      </el-col>
    </el-row>
    <list-wrap :loading="loading" :inProject="false" :empty="total === 0" :hasCreateAuth="false">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="date" label="序号"> </el-table-column>
        <el-table-column prop="name" label="服务英文名"> </el-table-column>
        <el-table-column prop="address" label="服务中文名"> </el-table-column>
        <el-table-column prop="address" label="级别"> </el-table-column>
        <el-table-column prop="address" label="类型"> </el-table-column>
        <el-table-column prop="address" label="分类"> </el-table-column>
        <el-table-column prop="address" label="标签"> </el-table-column>
        <el-table-column prop="address" label="服务来源"> </el-table-column>
        <el-table-column prop="address" label="开发方"> </el-table-column>
        <el-table-column prop="address" label="权限"> </el-table-column>
        <el-table-column prop="address" label="版本"> </el-table-column>
        <el-table-column prop="address" label="操作"> </el-table-column>
      </el-table>
      <packaged-pagination
        @size-change="handlerPageSizeChange"
        @current-change="handleCurrentPageChange"
        :current-page="searchProps.page"
        :page-sizes="[1, 10, 15, 20, 50]"
        :page-size="searchProps.pageSize"
        layout="sizes, prev, pager, next, jumper"
        :total="total"
        v-if="total > 0"
      ></packaged-pagination>
    </list-wrap>
    <distribute-dialog />
    <shared-dialog />
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';
import DistributeDialog from '../components/dialog/Distribute.vue';
import SharedDialog from '../components/dialog/Shared.vue';
interface TableState {
  tableData: Array<object>;
  loading: boolean;
  total: number;
  searchProps: {
    keyword: string;
    page: number;
    pageSize: number;
    sortField: string;
    sortType: 'ascending' | 'descending';
  };
}
export default defineComponent({
  components: {
    DistributeDialog,
    SharedDialog,
  },
  name: 'ServiceRepositoryList',
  setup() {
    // 表单相关状态
    const tableState: TableState = reactive({
      tableData: [],
      loading: false,
      total: 0,
      searchProps: {
        keyword: '',
        status: null,
        auditResults: null,
        page: 1,
        pageSize: 10,
        sortField: 'createTime',
        sortType: 'descending',
      },
    });

    const fetchData = async () => {
      tableState.loading = true;
      tableState.loading = false;
    };

    const handlerSearch = (value: string) => {
      tableState.searchProps.keyword = value;
      tableState.searchProps.page = 1;
      fetchData();
    };

    const handlerPageSizeChange = (size: number) => {
      tableState.searchProps.pageSize = size;
      fetchData();
    };

    const handleCurrentPageChange = (page: number) => {
      tableState.searchProps.page = page;
      fetchData();
    };

    fetchData();

    return {
      ...toRefs(tableState),
      handlerSearch,
      handlerPageSizeChange,
      handleCurrentPageChange,
    };
  },
});
</script>
