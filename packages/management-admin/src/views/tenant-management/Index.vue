<template>
  <el-row>
    <el-col :span="4" style="text-align:left">
      <el-button style="width:90px" type="primary" @click="onAdd">
        <i class="el-icon-plus" style="font-weight:bloder;margin-right:2px;"></i>新建
      </el-button>
      <!-- TODO：待确定 -->
      <!-- <el-button @click="freezeInBatches">冻结</el-button>
      <el-button @click="deleteInBatches">删除</el-button> -->
    </el-col>
    <el-col :offset="14" :span="6" style="text-align: right">
      <el-input
        placeholder="请输入公司名称"
        suffix-icon="el-icon-search"
        @input="handleComputerNameInput"
        v-model="searchProps.keyword"
      ></el-input>
    </el-col>
  </el-row>
  <el-row style="background: #fff">
    <el-table :data="tableData">
      <el-table-column type="selection" width="45" />
      <el-table-column type="index" label="序号" width="50" />
      <el-table-column property="name" label="企业名称">
        <template #default="scope">
          <router-link :to="{ path: `tenant-list/edit/${scope.row.id}` }">{{ scope.row.name }}</router-link>
        </template>
      </el-table-column>
      <el-table-column property="contactName" label="联系人"></el-table-column>
      <el-table-column property="contactTel" label="联系电话"></el-table-column>
      <el-table-column property="contactEmail" label="联系人邮箱"></el-table-column>
      <el-table-column property="managerAccount" label="管理员账号"></el-table-column>
      <el-table-column property="managerName" label="管理员姓名"></el-table-column>
      <el-table-column property="managerTel" label="管理员电话"></el-table-column>
      <el-table-column property="status" label="状态">
        <template #default="scope">
          <template v-if="scope.row.status === statusEnum.START">启用</template>
          <template v-else>冻结</template>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-button type="primary" v-if="scope.row.status === statusEnum.START" @click="onFreeze(scope.row.id)">
            冻结
          </el-button>
          <el-button type="primary" v-if="scope.row.status === statusEnum.FREEZE" @click="onStart(scope.row.id)">
            启动
          </el-button>
          <el-button :disabled="scope.row.status === statusEnum.START" @click="onDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <packaged-pagination
      :current-page="searchProps.page"
      :page-size="searchProps.pageSize"
      :page-sizes="[10, 20, 50]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handlePageSizeChange"
      @current-change="handlePageChange"
    ></packaged-pagination>
    <router-link to="/login">登录页面</router-link>
  </el-row>
</template>

<script lang="ts">
import { reactive, toRefs, getCurrentInstance } from 'vue';
import { getTenantList, deleteTenant, freezeTenant, enableTenant } from '@/api/tenant';
import { debounce } from 'lodash';
import { useRouter } from 'vue-router';
import PackagedPagination from '@/components/packaged-pagination/Index.vue';

// 租户数据接口
interface TenantItemInterface {
  id: number;
  name: string;
  status: number;
  contactName: string;
  contactTel: string;
  contactEmail: string;
  managerAccount: string;
  managerName: string;
  managerTel: string;
}

// 组件状态数据接口
interface TableStateInterface {
  tableData: TenantItemInterface[];
  loading: boolean;
  searchProps: {
    page: number;
    pageSize: number;
    keyword: string;
  };
  selections: any[];
  total: number;
}

// 租户状态
enum statusEnum {
  'START',
  'FREEZE',
}

export default {
  name: 'Tenant',
  components: {
    PackagedPagination,
  },
  setup() {
    const router = useRouter();

    const instance = getCurrentInstance();

    const tableState: TableStateInterface = reactive({
      tableData: [],
      loading: false,
      searchProps: {
        page: 1,
        pageSize: 10,
        keyword: '',
      },
      total: 0,
      selections: [],
    });

    const getTableData = async () => {
      tableState.loading = true;
      const { data } = await getTenantList(tableState.searchProps);
      tableState.tableData = data.rows.map((item: any) => ({
        id: item.id,
        name: item.name,
        status: item.status,
        contactName: item.contact.name,
        contactTel: item.contact.phone,
        contactEmail: item.contact.email,
        managerName: item.manager.name,
        managerAccount: item.manager.account,
        managerTel: item.manager.phone,
      }));
      tableState.total = data.count;
      tableState.loading = false;
    };

    getTableData();

    const handlePageSizeChange = (pageSize: number) => {
      tableState.searchProps.pageSize = pageSize;
      getTableData();
    };

    const handlePageChange = (page: number) => {
      tableState.searchProps.page = page;
      getTableData();
    };

    const handleComputerNameInput = debounce(getTableData, 1000);

    const onAdd = () => {
      router.push('tenant-list/edit/0');
    };

    // 批量冻结
    const freezeInBatches = () => {
      if (tableState.selections.length === 0) {
        (instance as any).proxy.$message({
          type: 'warning',
          message: '请先勾选租户项',
        });
      }
    };

    // 批量删除
    const deleteInBatches = () => {
      if (tableState.selections.length === 0) {
        (instance as any).proxy.$message({
          type: 'warning',
          message: '请先勾选租户项',
        });
      }
    };

    const onDelete = async (rowData: any) => {
      (instance as any).proxy.$alert(`是否删除${rowData.contactName}租户`, '提示', {
        confirmButtonText: '确定',
        callback: async () => {
          const { code } = await deleteTenant(rowData.id);
          if (code === 0) {
            (instance as any).proxy.$message({
              type: 'success',
              message: '删除成功',
            });
            getTableData();
          }
        },
      });
    };

    const onFreeze = async (id: string) => {
      const { code } = await freezeTenant(id);
      if (code === 0) {
        (instance as any).proxy.$message({
          type: 'success',
          message: '冻结成功',
        });
        getTableData();
      }
    };

    const onStart = async (id: string) => {
      const { code } = await enableTenant(id);
      if (code === 0) {
        (instance as any).proxy.$message({
          type: 'success',
          message: '启动成功',
        });
        getTableData();
      }
    };

    return {
      ...toRefs(tableState),
      statusEnum,
      handlePageSizeChange,
      handlePageChange,
      handleComputerNameInput,
      onAdd,
      freezeInBatches,
      deleteInBatches,
      onDelete,
      onFreeze,
      onStart,
    };
  },
};
</script>

<style lang="scss" scoped></style>
