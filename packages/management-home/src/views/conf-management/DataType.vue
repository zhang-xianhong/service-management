<template>
  <el-row>
    <el-col :span="6">
      <el-input
        placeholder="请输入数据类型名称"
        suffix-icon="el-icon-search"
        @input="filterDataType"
        v-model="searchProps.keyword"
      ></el-input>
    </el-col>
    <el-col :offset="12" :span="6" style="text-align: right;">
      <el-button type="primary" @click="addDataType">新增</el-button>
      <el-button @click="groupDelete()">删除</el-button>
    </el-col>
  </el-row>
  <el-row>
    <el-table
      :data="tableData"
      v-loading="loading"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      @sort-change="sortChange"
    >
      <el-table-column type="selection" width="45" />
      <el-table-column type="index" label="序号" width="50" />
      <el-table-column label="数据类型" prop="name" sortable></el-table-column>
      <el-table-column label="描述" prop="description" sortable></el-table-column>
      <el-table-column label="克隆源" prop="cloneBy" sortable></el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <template v-if="!scope.row.isSystem">
            <el-button type="primary" size="mini" @click="onEdit(scope.row)">编辑</el-button>
            <el-button size="mini" @click="onDelete(scope.row)">删除</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
  </el-row>
  <el-row style="justify-content:flex-end">
    <el-pagination
      :current-page="searchProps.page"
      :page-size="searchProps.pageSize"
      :page-sizes="[10, 20, 50]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handlePageSizeChange"
      @current-change="handlePageChange"
    >
    </el-pagination>
  </el-row>
</template>

<script lang="ts">
import { reactive, getCurrentInstance, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import { getDataTypes, deleteDataType } from '@/api/settings/data-types';
import { debounce } from 'lodash';

interface TableState {
  tableData: Array<object>;
  loading: boolean;
  multipleSelection: Array<object>;
  total: number;
  searchProps: {
    keyword: string;
    page: number;
    pageSize: number;
    sortField: string;
    sortType: 'ascending' | 'descending';
  };
}

export default {
  name: 'DataType',
  setup() {
    // 表单相关状态
    const tableState: TableState = reactive({
      tableData: [],
      loading: false,
      multipleSelection: [],
      total: 0,
      searchProps: {
        keyword: '',
        page: 1,
        pageSize: 10,
        sortField: 'createTime',
        sortType: 'ascending',
      },
    });

    // 获取路由器信息
    const router = useRouter();

    // 获取组件实例
    const instance = getCurrentInstance();

    // 获取数据类型
    async function getTableData() {
      tableState.loading = true;
      const { data } = await getDataTypes(tableState.searchProps);
      tableState.loading = false;
      tableState.total = data.count;
      tableState.tableData = data.rows || [];
    }

    getTableData();

    // 新增数据类型
    function addDataType() {
      router.push('datatype/edit/0');
    }

    // 编辑数据类型
    const onEdit = (rowData: any) => {
      router.push(`datatype/edit/${rowData.id}`);
    };

    // 删除数据类型
    const onDelete = async (rowData: any) => {
      const { code }: any = await deleteDataType({ ids: [rowData.id] });
      if (code === 0) {
        (instance as any).proxy.$message({
          type: 'success',
          message: '删除成功',
        });
        getTableData();
      }
    };

    // 批量删除数据类型
    const groupDelete = async () => {
      const { code }: any = await deleteDataType({ ids: [tableState.multipleSelection.map((item: any) => item.id)] });
      if (code === 0) {
        (instance as any).proxy.$message({
          type: 'success',
          message: '删除成功',
        });
        getTableData();
      }
    };

    // 数据类型筛选
    const filterDataType = debounce(getTableData, 1000);

    // 数据类型勾选
    const handleSelectionChange = (val: Array<object>) => {
      tableState.multipleSelection = val;
    };

    // 表单排序
    const sortChange = ({ order, prop }: { order: 'ascending' | 'descending'; prop: string }) => {
      tableState.searchProps.sortField = prop;
      tableState.searchProps.sortType = order;
    };

    // 每页条数改变
    const handlePageSizeChange = (pageSize: number) => {
      tableState.searchProps.pageSize = pageSize;
    };

    // 页数切换
    const handlePageChange = (pageNum: number) => {
      tableState.searchProps.page = pageNum;
    };

    return {
      ...toRefs(tableState),
      addDataType,
      onEdit,
      onDelete,
      groupDelete,
      filterDataType,
      handleSelectionChange,
      handlePageSizeChange,
      handlePageChange,
      sortChange,
    };
  },
};
</script>

<style scoped>
.datatype-add {
  float: right;
  margin-bottom: 12px;
}
</style>
