<template>
  <div class="datatype-add">
    <el-button type="primary" @click="addDataType">新增数据类型</el-button>
  </div>
  <el-table :data="tableData" style="width: 100%" border>
    <el-table-column label="数据类型" prop="name" width="240"></el-table-column>
    <el-table-column label="描述" prop="description"></el-table-column>
    <el-table-column label="克隆源" prop="cloneBy" width="240"></el-table-column>
    <el-table-column label="操作" width="200">
      <template #default="scope">
        <template v-if="!scope.row.isSystem">
          <el-button type="primary" size="mini" @click="onEdit(scope.row)">编辑</el-button>
          <el-button size="mini" @click="onDelete(scope.row)">删除</el-button>
        </template>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts">
import { ref, getCurrentInstance } from 'vue';
import { useRouter } from 'vue-router';
import { getDataTypes, deleteDataType } from '@/api/settings/data-types';
export default {
  name: 'DataType',
  setup() {
    // 表单数据
    const tableData = ref([]);

    // 获取路由器信息
    const router = useRouter();

    // 获取组件实例
    const instance = getCurrentInstance();

    // 获取所有数据类型
    async function getTableData() {
      const { data = [] } = await getDataTypes();
      tableData.value = data;
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

    return {
      tableData,
      addDataType,
      onEdit,
      onDelete,
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
