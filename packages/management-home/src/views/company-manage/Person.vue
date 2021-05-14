<template>
  <div>
    <el-row>
      <el-col :span="10" style="text-align: left">
        <el-button type="primary" style="width: 90px" @click="openAddDialog">新建</el-button>
        <el-button @click="handleAble">启用</el-button>
        <el-button @click="handleDisable">禁用</el-button>
        <el-button @click="handleDel">删除</el-button>
      </el-col>
      <el-col :offset="10" :span="4" style="text-align: right">
        <el-input placeholder="请输入键名称" suffix-icon="el-icon-search"></el-input>
        <span class="el-icon-setting"></span>
      </el-col>
    </el-row>
    <el-row style="background: #fff">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="selection" width="45" />
        <el-table-column type="index" label="序号" width="50" />
        <el-table-column label="登录账号" prop="account"></el-table-column>
        <el-table-column label="姓名" prop="name"></el-table-column>
        <el-table-column label="手机" prop="phone"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="账户状态" prop="accountStatus"></el-table-column>
        <el-table-column label="激活状态" prop="defaultValue"></el-table-column>
        <el-table-column label="部门" prop="dept"></el-table-column>
        <el-table-column label="操作" width="300">
          <template>
            <el-button type="primary" size="mini">编辑</el-button>
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
import { defineComponent, ref, reactive, toRefs, Ref, provide, onMounted } from 'vue';
import AddPerson from './components/AddPerson.vue'
interface TableState {
  tableData: Array<object>;
  loading: boolean;
  multipleSelection: Array<object>;
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
export default defineComponent({
  name: 'Person',
  components: { AddPerson },
  setup() {
    const selMenu = ref('list');
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
        pageSize: 10
      },
    });

    const refAddDialog: Ref<RefAddDialog | null> = ref(null);

    // 获取列表
    const getList = async () => {
      console.log('获取人员列表')
    };

    // 启用
    const handleAble = () => {
      console.log('启用')
    };

    // 禁用
    const handleDisable = () => {
      console.log('禁用')
    };

    // 删除
    const handleDel = () => {
      console.log('删除')
    };

    // 新建
    const handleCreate = () => {
      console.log('新建')
    };

    // 编辑
    const handleEdit = () => {
      console.log('编辑')
    }

    getList();

    // 打开对话框
    const openAddDialog = (): void => {
      (refAddDialog.value as RefAddDialog).openDialog();
    };

    const openEditDialog = (): void => {
      (refAddDialog.value as RefAddDialog).openDialog('edit', {});
    }
    provide('handleCreate', handleCreate);
    provide('handleEdit', handleEdit);
    onMounted(() => {
      getList();
    })
    return {
      ...toRefs(tableState),
      selMenu,
      handleAble,
      openAddDialog,
      openEditDialog,
      handleDisable,
      handleDel,
      Attr,
      refAddDialog
    }
  }
})
</script>
<style lang="sass" scoped>

</style>
