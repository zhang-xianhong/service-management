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
      <el-row :gutter="10">
        <el-col :span="10">
          <el-input placeholder="请选择服务" :value="advanceForm.svcDep.join()"></el-input>
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
          <el-button type="primary" @click="addAll(svcList)">添加所有</el-button>
          <el-button @click="clear">清除所有</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-table :data="svcList">
          <el-table-column v-for="col in columns" :key="col.name" :prop="col.name" :label="col.label"></el-table-column>
          <el-table-column prop="operation" label="操作" :width="130">
            <template #default="{ row }">
              <el-button type="primary" @click="add(row.name)" :disabled="advanceForm.svcDep.includes(row.name)">
                添加
              </el-button>
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
import { ref, Ref, defineComponent } from 'vue';
import { advanceForm } from './form-data';
import { getServiceList } from '@/api/servers';
import { svcFormColumns } from './form-config';
import _ from 'lodash/fp';

export default defineComponent({
  name: 'BusinessEditAdvance',
  setup() {
    const svcDialogVisible = ref(false);
    const getValues = () => advanceForm.value;
    const saveSvcDep = () => {
      svcDialogVisible.value = false;
    };
    const svcList: Ref<Array<Record<string, any>>> = ref([]);
    const showSvcDialog = async () => {
      svcDialogVisible.value = true;
      const { data: serviceList } = await getServiceList({ pageNum: 0, pageSize: 10 });
      svcList.value = serviceList.list;
    };
    const filterForm = ref({
      tag: '',
      type: '',
      search: '',
      svc: 'businessSvc',
    });
    const columns = svcFormColumns;
    const add = (payload: any) => {
      advanceForm.value.svcDep = advanceForm.value.svcDep.concat(payload);
    };

    const addAll = _.flow(_.map('name'), add);
    const clear = () => {
      advanceForm.value.svcDep = [];
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
      svcList,
      addAll,
      clear,
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
