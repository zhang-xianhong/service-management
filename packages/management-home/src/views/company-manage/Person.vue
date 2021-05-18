<template>
  <div>
    <el-row>
      <el-col :span="10" style="text-align: left">
        <el-button type="primary" style="width: 90px" @click="openAddDialog">新建</el-button>
        <el-button @click="handleUpdateStatus(0)" :disabled="!multipleSelection.length">启用</el-button>
        <el-button @click="handleUpdateStatus(-1)" :disabled="!multipleSelection.length">禁用</el-button>
        <el-button @click="handleDel" :disabled="!multipleSelection.length">删除</el-button>
      </el-col>
      <el-col :offset="10" :span="4" style="text-align: right">
        <el-input
          placeholder="请输入姓名"
          suffix-icon="el-icon-search"
          @input="filterAccount"
          v-model="searchProps.keyword"
        ></el-input>
        <!-- <span class="el-icon-setting"></span> -->
      </el-col>
    </el-row>
    <el-row style="background: #fff">
      <el-table :data="tableData" style="width: 100%" @selection-change="selChange">
        <el-table-column type="selection" width="45" />
        <el-table-column type="index" label="序号" width="50" />
        <el-table-column label="登录账号" prop="userName"></el-table-column>
        <el-table-column label="姓名" prop="displayName"></el-table-column>
        <el-table-column label="手机" prop="phoneNumber"></el-table-column>
        <el-table-column label="邮箱" prop="primaryMail"></el-table-column>
        <el-table-column label="账户状态" prop="status">
          <template #default="scope">{{ USERSTATUS[scope.row.status] }}</template>
        </el-table-column>
        <!-- <el-table-column label="激活状态" prop="defaultValue"></el-table-column> -->
        <el-table-column label="部门" prop="dept"></el-table-column>
        <el-table-column label="操作" width="300">
          <template #default="scope">
            <el-button type="primary" size="mini" @click="openEditDialog(scope.row)">编辑</el-button>
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
      ></packaged-pagination>
    </el-row>
    <AddPerson ref="refAddDialog" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, toRefs, Ref, provide, getCurrentInstance } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import AddPerson from './components/AddPerson.vue';
import { getUserList, createUser, updateUser, delUser, updateUserStatus } from '@/api/company/users';

const USERSTATUS: any = {
  0: '启用',
  '-1': '禁用',
};
interface TableState {
  tableData: Array<object>;
  loading: boolean;
  multipleSelection: Array<any>;
  total: number;
  historyData: Array<object>;
  searchProps: {
    keyword: string;
    page: number;
    pageSize: number;
  };
}
interface RefAddDialog {
  openDialog: Function;
  [attr: string]: any;
}

const RES_CODE: any = {
  success: 0,
};

export default defineComponent({
  name: 'Person',
  components: { AddPerson },
  setup() {
    // 表单相关状态
    const tableState: TableState = reactive({
      tableData: [],
      loading: false,
      multipleSelection: [],
      total: 0,
      historyData: [],
      searchProps: {
        keyword: '',
        page: 1,
        pageSize: 10,
      },
    });

    const refAddDialog: Ref<RefAddDialog | null> = ref(null);

    // 获取组件实例
    const instance = getCurrentInstance();

    // 打开对话框
    const openAddDialog = (): void => {
      (refAddDialog.value as RefAddDialog).openDialog();
    };

    const openEditDialog = (data: any): void => {
      (refAddDialog.value as RefAddDialog).openDialog('edit', { ...data, status: String(data.status) });
    };

    // 关闭对话框
    const closeDialog = () => {
      (refAddDialog.value as RefAddDialog).closeDialog();
    };

    // 初始化dialog
    const initAddDialog = () => {
      (refAddDialog.value as RefAddDialog).initDialog();
    };
    // 获取列表
    const getList = async () => {
      // tableState.loading = true;
      const { code, data } = await getUserList(tableState.searchProps);
      if (code === RES_CODE.success) {
        tableState.total = data.count;
        tableState.tableData = data.rows || [];
      } else {
        (instance as any).proxy.$message({
          type: 'error',
          message: '获取人员列表失败',
        });
      }
    };
    getList();

    const selChange = (data: any): void => {
      tableState.multipleSelection = data;
    };

    // 查询
    const filterAccount = (): void => {
      getList();
    };

    // 更新状态
    const handleUpdateStatus = async (status: number) => {
      const ids = tableState.multipleSelection.map((item) => item.id);
      const { code } = await updateUserStatus({ ids, status });
      if (code === RES_CODE.success) {
        (instance as any).proxy.$message({
          type: 'success',
          message: '修改成功',
        });
        getList();
      } else {
        (instance as any).proxy.$message({
          type: 'error',
          message: '修改失败',
        });
      }
    };

    // 删除 await deleteConfig(rowData.id);
    const handleDel = (): void => {
      ElMessageBox.confirm(`是否删除已选项?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const ids = tableState.multipleSelection.map((item) => item.id);
          // 待传参
          const { code } = await delUser({ ids });
          if (code === RES_CODE.success) {
            (instance as any).proxy.$message({
              type: 'success',
              message: '删除成功',
            });
            getList();
          } else {
            (instance as any).proxy.$message({
              type: 'error',
              message: '删除失败',
            });
          }
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '已取消操作',
          });
        });
    };

    // 新建
    const handleCreate = async (data: any) => {
      const { code } = await createUser({
        ...data,
        status: parseInt(data.status, 10),
      });
      if (code === RES_CODE.success) {
        (instance as any).proxy.$message({
          type: 'success',
          message: '新建成功',
        });
        initAddDialog();
        getList();
      } else {
        (instance as any).proxy.$message({
          type: 'error',
          message: '添加失败',
        });
      }
    };

    // 编辑
    const handleEdit = async (data: any) => {
      const { code } = await updateUser({
        ...data,
        status: parseInt(data.status, 10),
      });
      if (code === RES_CODE.success) {
        (instance as any).proxy.$message({
          type: 'success',
          message: '编辑成功',
        });
        getList();
      } else {
        (instance as any).proxy.$message({
          type: 'error',
          message: '编辑失败',
        });
      }
      closeDialog();
    };

    provide('handleCreate', handleCreate);
    provide('handleEdit', handleEdit);

    return {
      ...toRefs(tableState),
      handleUpdateStatus,
      openAddDialog,
      openEditDialog,
      handleDel,
      selChange,
      filterAccount,
      refAddDialog,
      USERSTATUS,
    };
  },
});
</script>
<style lang="sass" scoped></style>
