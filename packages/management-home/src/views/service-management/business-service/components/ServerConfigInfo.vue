<template>
  <div style="background: #fff">
    <el-table :data="tableData" style="width: 100%" height="330">
      <el-table-column label="序号" type="index" width="50"></el-table-column>
      <el-table-column label="键" prop="key" width="500">
        <template #default="scope">
          <a @click="openDetailDialog">{{ scope.row.name }}</a>
        </template>
      </el-table-column>
      <el-table-column label="值" prop="value"></el-table-column>
      <el-table-column label="默认值" prop="defaultValue"></el-table-column>
      <el-table-column label="类型" prop="type">
        <template #default="scope">
          {{ scope.row.type === 1 ? '应用类型' : '系统类型' }}
        </template>
      </el-table-column>
      <el-table-column label="版本" prop="version"></el-table-column>
      <el-table-column label="操作" width="120">
        <template #default="scope">
          <template v-if="!scope.row.isSystem">
            <a class="operation-link">添加</a>
            <a class="operation-link">变更历史</a>
            <a class="operation-link">删除</a>
          </template>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs } from 'vue';
export default {
  name: 'ServerConfigInfo',
  setup() {
    const state = reactive({
      tableData: [],
      isOpenDetailDialog: false,
    });

    const openDetailDialog = () => {
      state.isOpenDetailDialog = true;
    };
    return {
      ...toRefs(state),
      openDetailDialog,
    };
  },
};
</script>

<style scoped lang="scss">
.operation-link {
  margin-right: 4px;
}
</style>
