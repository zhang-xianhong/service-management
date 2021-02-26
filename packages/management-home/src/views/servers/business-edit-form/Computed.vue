<template>
  <div class="business-edit-compute">
    <el-button type="primary" @click="showDialog"><i class="el-icon-plus"></i>新增计算列</el-button>
    <el-table :data="computeRecords">
      <el-table-column prop="name" label="字段名"></el-table-column>
      <el-table-column prop="desc" label="描述"></el-table-column>
      <el-table-column prop="obj" label="所属对象"></el-table-column>
      <el-table-column prop="operator" label="操作" :width="150">
        <template #default="scope">
          <el-button type="primary" @click="editRow(scope.$index, scope.row)">编辑</el-button>
          <el-button @click="deleteRow(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="新增计算列" v-model="dialogVisible" width="40%">
      <el-form label-width="80px" :model="computeForm">
        <el-form-item label="所属对象">
          <el-input v-model="computeForm.obj"></el-input>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="computeForm.name"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="computeForm.desc"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="saveCompute()">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { ref, Ref, defineComponent } from 'vue';

interface ComputeRecord {
  name: string;
  desc: string;
  obj: string;
}

export default defineComponent({
  name: 'BusinessEditCompute',
  setup() {
    let currentRow = -1;
    // 计算列记录表格
    const computeRecords: Ref<Array<ComputeRecord>> = ref([]);
    const deleteRow = (rowIndex: number) => {
      computeRecords.value.splice(rowIndex, 1);
    };

    // 计算列弹窗
    const dialogVisible = ref(false);
    const showDialog = () => {
      dialogVisible.value = true;
    };

    // 计算列表单
    const computeForm: Ref<ComputeRecord> = ref({
      name: '',
      desc: '',
      obj: '',
    });
    const saveCompute = () => {
      if (!~currentRow) {
        computeRecords.value.push(computeForm.value);
      } else {
        computeRecords.value[currentRow] = computeForm.value;
        currentRow = -1;
      }
      dialogVisible.value = false;
      computeForm.value = {
        name: '',
        desc: '',
        obj: '',
      };
    };
    const editRow = (rowIndex: number, rowData: ComputeRecord) => {
      currentRow = rowIndex;
      computeForm.value = rowData;
      dialogVisible.value = true;
    };

    return {
      computeRecords,
      deleteRow,
      computeForm,
      saveCompute,
      dialogVisible,
      showDialog,
      editRow,
    };
  },
});
</script>

<style lang="scss" scoped>
.business-edit-compute {
  &::v-deep {
    table {
      .el-select.el-select--small {
        width: 100%;
      }
    }
    .el-select.el-select--small {
      width: calc(100% - 50px);
    }
  }
}
</style>
