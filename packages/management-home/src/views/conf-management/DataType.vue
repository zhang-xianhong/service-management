<template>
  <el-row>
    <el-col :span="6" style="text-align: left">
      <el-button type="primary" @click="addDataType" style="width: 90px" v-if="getShowBool('add')" icon="el-icon-plus"
        >新建</el-button
      >
      <el-button :disabled="!isDeletable" @click="groupDelete()" v-if="getShowBool('delete')">删除</el-button>
    </el-col>
    <el-col :offset="8" :span="10" style="text-align: right">
      <el-input
        style="width: 300px"
        placeholder="请输入数据类型名称"
        suffix-icon="el-icon-search"
        @input="filterDataType"
        v-model="searchProps.keyword"
      ></el-input>
    </el-col>
  </el-row>
  <el-row style="background: #fff">
    <ListWrap :loading="loading" :empty="!total" :handleCreate="addDataType" :hasCreateAuth="getShowBool('add')">
      <el-table
        :data="tableData"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        @sort-change="sortChange"
      >
        <el-table-column type="selection" width="45" v-if="getShowBool('delete')" />
        <el-table-column type="index" label="序号" width="50" />
        <el-table-column label="类型名称" prop="name" sortable></el-table-column>
        <el-table-column label="描述" prop="description" sortable></el-table-column>
        <!--      <el-table-column label="克隆源" prop="cloneBy" sortable></el-table-column>-->
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <template v-if="!scope.row.isSystem">
              <el-button type="text" size="mini" @click="onEdit(scope.row)" v-if="getShowBool('update')"
                >编辑</el-button
              >
              <el-button type="text" size="mini" @click="onDelete(scope.row)" v-if="getShowBool('delete')"
                >删除</el-button
              >
            </template>
          </template>
        </el-table-column>
      </el-table>
      <packaged-pagination
        v-if="total"
        :current-page="searchProps.page"
        :page-size="searchProps.pageSize"
        :page-sizes="[10, 20, 50]"
        layout="sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handlePageSizeChange"
        @current-change="handlePageChange"
      ></packaged-pagination>
    </ListWrap>
  </el-row>
</template>

<script lang="ts">
import { computed, reactive, getCurrentInstance, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import { getDataTypes, deleteDataType } from '@/api/settings/data-types';
import PackagedPagination from '@/components/pagination/Index.vue';
import { debounce } from 'lodash';
import { ElMessageBox } from 'element-plus';
import { getShowBool } from '@/utils/permission-show-module';

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
  components: {
    PackagedPagination,
  },
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
        sortType: 'descending',
      },
    });

    // 删除按钮是否可点击
    const isDeletable = computed(() => tableState.multipleSelection.length > 0);

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
      ElMessageBox.confirm(`是否删除选中?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const { code }: any = await deleteDataType({ ids: [rowData.id] });
        if (code === 0) {
          (instance as any).proxy.$message({
            type: 'success',
            message: '删除成功',
          });
          getTableData();
        } else {
          (instance as any).proxy.$message({
            type: 'error',
            message: '删除失败',
          });
        }
      });
    };

    // 批量删除数据类型
    const groupDelete = async () => {
      ElMessageBox.confirm(`是否删除选中?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        if (tableState.multipleSelection.every((item: any) => item.isSystem)) {
          (instance as any).proxy.$message({
            type: 'warn',
            message: '系统默认数据类型不可删除',
          });
          return;
        }
        const { code }: any = await deleteDataType({
          ids: [tableState.multipleSelection.map((item: any) => item.id)],
        });
        if (code === 0) {
          (instance as any).proxy.$message({
            type: 'success',
            message: '删除成功',
          });
          getTableData();
        } else {
          (instance as any).proxy.$message({
            type: 'error',
            message: '删除失败',
          });
        }
      });
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
      getTableData();
    };

    // 每页条数改变
    const handlePageSizeChange = (pageSize: number) => {
      tableState.searchProps.pageSize = pageSize;
      getTableData();
    };

    // 页数切换
    const handlePageChange = (pageNum: number) => {
      tableState.searchProps.page = pageNum;
      getTableData();
    };

    return {
      ...toRefs(tableState),
      isDeletable,
      addDataType,
      onEdit,
      onDelete,
      groupDelete,
      filterDataType,
      handleSelectionChange,
      handlePageSizeChange,
      handlePageChange,
      sortChange,
      getShowBool,
    };
  },
};
</script>

<style scoped>
.datatype-add {
  float: right;
  margin-bottom: 12px;
}
.el-row {
  margin-bottom: 10px;
}
</style>
