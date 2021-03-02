<template>
  <div class="business-edit-advance">
    <el-form label-position="top" :model="advanceForm">
      <el-form-item label="对象依赖" prop="objDep">
        <el-input :value="advanceForm.objDep.join()" disabled readonly class="readonly-input"></el-input>
      </el-form-item>
      <el-form-item label="服务依赖" prop="svcDep">
        <el-input
          placeholder="请选择服务"
          :value="advanceForm.svcDep.join()"
          readonly
          @click="showSvcDialog"
          class="readonly-input"
        ></el-input>
      </el-form-item>
      <el-form-item label="库依赖" prop="libDep">
        <el-input placeholder="请输入库信息" type="textarea" :rows="5" v-model="advanceForm.libDep"></el-input>
      </el-form-item>
    </el-form>
    <el-dialog title="服务选择" v-model="svcDialogVisible" width="80%">
      <el-row gutter="10">
        <el-col :span="10">
          <el-input placeholder="请选择服务"></el-input>
        </el-col>
        <el-col :span="4">
          <el-select v-model="filterForm.svc">
            <el-option label="业务服务" value="businessSvc"></el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-select placeholder="请选择分类" v-model="filterForm.type"></el-select>
        </el-col>
        <el-col :span="3">
          <el-select placeholder="请选择标签" v-model="filterForm.tag"></el-select>
        </el-col>
        <el-col :span="4">
          <el-input placeholder="请输入名称" suffix-icon="el-icon-search" v-model="filterForm.search"></el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4" :offset="20" class="btn-row">
          <el-button type="primary">添加所有</el-button>
          <el-button>清除所有</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-table :data="svcList">
          <el-table-column v-for="col in columns" :key="col.name" :prop="col.name" :label="col.label"></el-table-column>
          <el-table-column prop="operation" label="操作" :width="130">
            <template #default="scope">
              <el-button type="primary" @click="add(scope.row)">添加</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="saveSvcDep()">确定</el-button>
          <el-button @click="svcDialogVisible = false">取消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue';
import { advanceForm } from './form-data';

export default defineComponent({
  name: 'BusinessEditAdvance',
  setup() {
    const svcDialogVisible = ref(false);

    const getValues = () => advanceForm.value;

    const saveSvcDep = () => {
      // todo
    };

    const showSvcDialog = () => {
      svcDialogVisible.value = true;
    };
    const filterForm = ref({
      tag: '',
      type: '',
      search: '',
      svc: 'businessSvc',
    });
    const columns = [
      {
        name: 'name',
        label: '服务名称',
      },
      {
        name: 'desc',
        label: '服务描述',
      },
      {
        name: 'type',
        label: '分类',
      },
      {
        name: 'tag',
        label: '标签',
      },
      {
        name: 'project',
        label: '所属项目',
      },
      {
        name: 'dependence',
        label: '服务依赖',
      },
      {
        name: 'level',
        label: '服务级别',
      },
      {
        name: 'modified',
        label: '修改次数',
      },
    ];
    const add = () => {
      // todo
    };

    return {
      advanceForm,
      getValues,
      svcDialogVisible,
      saveSvcDep,
      showSvcDialog,
      filterForm,
      columns,
      add,
    };
  },
});
</script>

<style lang="scss" scoped>
.business-edit-advance {
  .readonly-input:deep(input) {
    cursor: pointer;
  }
  .btn-row {
    margin-top: 10px;
    text-align: right;
  }
}
</style>
