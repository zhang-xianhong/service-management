<template>
  <el-row>
    <el-col :span="4" style="text-align: left">
      <el-button style="width: 90px" type="primary" @click="onAdd">
        <i class="el-icon-plus" style="font-weight: bloder; margin-right: 2px"></i>新建
      </el-button>
      <!-- TODO：待确定 -->
      <!-- <el-button @click="freezeInBatches">冻结</el-button>
      <el-button @click="deleteInBatches">删除</el-button>-->
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
      <el-table-column type="index" label="序号" width="50" />
      <el-table-column property="name" label="企业名称">
        <template #default="scope">
          <router-link :to="{ path: `/tenant-list/edit/${scope.row.id}` }">{{ scope.row.name }}</router-link>
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
          <template v-if="scope.row.status === statusEnum.ENABLE">启用</template>
          <template v-else>禁用</template>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-button type="text" v-if="scope.row.status === statusEnum.ENABLE" @click="onFreeze(scope.row.id)"
            >禁用</el-button
          >
          <el-button type="text" v-if="scope.row.status === statusEnum.FREEZE" @click="onEnable(scope.row.id)"
            >启用</el-button
          >
          <el-button type="text" :disabled="scope.row.status === statusEnum.FREEZE" @click="onResetPWD(scope.row)"
            >重置密码</el-button
          >
          <el-button type="text" :disabled="scope.row.status === statusEnum.ENABLE" @click="onDelete(scope.row)"
            >删除</el-button
          >
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
  </el-row>
  <PublicResetPassword ref="publicResetPassword"></PublicResetPassword>
  <PrivateResetPassword ref="privateResetPassword"></PrivateResetPassword>
</template>

<script lang="ts">
import { reactive, toRefs, getCurrentInstance, ref, Ref, watch } from 'vue';
import { getTenantList, deleteTenant, freezeTenant, enableTenant } from '@/api/tenant';
import { debounce } from 'lodash';
import { useRouter } from 'vue-router';
import PackagedPagination from '@/components/packaged-pagination/Index.vue';
import { userInfo } from '@/layout/messageCenter/user-info';
import PublicResetPassword from './components/PublicResetPassword.vue';
import PrivateResetPassword from './components/PrivateResetPassword.vue';
// 租户数据接口
interface TenantItemInterface {
  id: number;
  name: string;
  status: number;
  contactName: string;
  contactTel: string;
  contactEmail: string;
  managerId: number;
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
  'ENABLE',
  'FREEZE',
}

export default {
  name: 'Tenant',
  components: {
    PackagedPagination,
    PublicResetPassword,
    PrivateResetPassword,
  },
  setup() {
    const router = useRouter();
    const instance = getCurrentInstance();
    const publicResetPassword: Ref<any> = ref(null);
    const privateResetPassword: Ref<any> = ref(null);
    const isPublic = ref(true);

    watch(userInfo, () => {
      isPublic.value = userInfo.value?.deployEnv === 'public';
    });
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

    // 获取租户列表数据
    const getTableData = async () => {
      tableState.loading = true;
      const { data } = await getTenantList(tableState.searchProps);
      tableState.tableData = data.rows.map((item: any) => ({
        id: item.id,
        name: item.name,
        status: item.status,
        contactName: item.contact?.name,
        contactTel: item.contact?.phone,
        contactEmail: item.contact?.email,
        managerId: item.manager?.userId,
        managerName: item.manager?.displayName,
        managerAccount: item.manager?.userName,
        managerTel: item.manager?.phoneNumber,
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

    // 新增租户时tententId默认为零
    const onAdd = () => {
      router.push('/tenant-list/add');
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

    // 租户删除
    const onDelete = async (rowData: any) => {
      (instance as any).proxy
        .$confirm(`是否删除${rowData.contactName}租户`, '提示', {
          distinguishCancelAndClose: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        })
        .then(async () => {
          const { code } = await deleteTenant(rowData.id);
          if (code === 0) {
            (instance as any).proxy.$message({
              type: 'success',
              message: '删除成功',
            });
            getTableData();
          }
        });
    };

    // 租户冻结
    const onFreeze = async (id: string) => {
      const { code } = await freezeTenant(id);
      if (code === 0) {
        (instance as any).proxy.$message({
          type: 'success',
          message: '禁用成功',
        });
        getTableData();
      }
    };

    // 租户启动
    const onEnable = async (id: string) => {
      const { code } = await enableTenant(id);
      if (code === 0) {
        (instance as any).proxy.$message({
          type: 'success',
          message: '启用成功',
        });
        getTableData();
      }
    };

    // 重置租户密码
    const onResetPWD = async (data: any) => {
      const { managerId } = data;
      if (isPublic.value) {
        publicResetPassword.value.handleResetPasswd(managerId);
      } else {
        privateResetPassword.value.handleResetPasswd(managerId);
      }
    };

    return {
      ...toRefs(tableState),
      statusEnum,
      publicResetPassword,
      privateResetPassword,
      isPublic,
      handlePageSizeChange,
      handlePageChange,
      handleComputerNameInput,
      onAdd,
      freezeInBatches,
      deleteInBatches,
      onDelete,
      onFreeze,
      onEnable,
      onResetPWD,
    };
  },
};
</script>

<style lang="scss" scoped></style>
