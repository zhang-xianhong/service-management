<template>
  <div class="business-edit-interface">
    <el-button type="primary" @click="addRow"><i class="el-icon-plus"></i>新增接口</el-button>
    <el-table :data="interfaceRecords" :row-class-name="tableRowClass" ref="interfaceTable">
      <el-table-column type="expand" width="1">
        <template #default="{ row }">
          <p>使用说明:</p>
          <el-input type="textarea" v-model="row.detail" :rows="3" placeholder="接口使用说明"></el-input>
        </template>
      </el-table-column>
      <el-table-column type="index" :width="50"></el-table-column>
      <el-table-column prop="name" label="名称">
        <template #default="{ row }">
          <el-input :disabled="row.isDefault" v-model="row.name" />
        </template>
      </el-table-column>
      <el-table-column prop="desc" label="描述">
        <template #default="{ row }">
          <el-input :disabled="row.isDefault" v-model="row.desc" />
        </template>
      </el-table-column>
      <el-table-column prop="url" label="URL">
        <template #default="{ row }">
          <el-input :disabled="row.isDefault" :modelValue="`/${row.name}`" />
        </template>
      </el-table-column>
      <el-table-column prop="method" label="请求方式">
        <template #default="{ row }">
          <el-input :disabled="row.isDefault" v-model="row.method" />
        </template>
      </el-table-column>
      <el-table-column prop="operator" label="操作" width="150">
        <template #default="scope">
          <el-button :disabled="scope.row.isDefault" @click="deleteRow(scope.$index)">删除</el-button>
          <el-button class="el-icon-male" type="primary" @click="detail(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { ref, Ref, defineComponent } from 'vue';

interface InterfaceRecord {
  name: string;
  desc: string;
  method: string;
  detail: string;
  isDefault: boolean;
}

const defaultInterface = [
  {
    name: 'save',
    desc: '保存',
    url: '/save',
    method: 'POST',
    detail: '',
    isDefault: true,
  },
  {
    name: 'insert',
    desc: '新增',
    method: 'POST',
    detail: '',
    isDefault: true,
  },
  {
    name: 'delete',
    desc: '删除',
    method: 'POST',
    detail: '',
    isDefault: true,
  },
  {
    name: 'update',
    desc: '更新',
    method: 'POST',
    detail: '',
    isDefault: true,
  },
  {
    name: 'get',
    desc: '查看',
    method: 'GET',
    detail: '',
    isDefault: true,
  },
  {
    name: 'list',
    desc: '列表',
    method: 'GET',
    detail: '',
    isDefault: true,
  },
];

export default defineComponent({
  name: 'BusinessEditInterface',
  setup() {
    const interfaceTable: any = ref(null);
    // 计算列记录表格
    const interfaceRecords: Ref<Array<InterfaceRecord>> = ref(defaultInterface);
    const deleteRow = (rowIndex: number) => {
      interfaceRecords.value.splice(rowIndex, 1);
    };
    const addRow = () => {
      interfaceRecords.value.push({
        name: '',
        desc: '',
        method: '',
        detail: '',
        isDefault: false,
      });
    };
    const tableRowClass = ({ row: { isDefault = false } }) => (isDefault ? 'default-row' : 'normal-row');

    const detail = (row: any) => {
      interfaceTable.value.toggleRowExpansion(row);
    };

    return {
      interfaceRecords,
      deleteRow,
      addRow,
      tableRowClass,
      detail,
      interfaceTable,
    };
  },
});
</script>

<style lang="scss" scoped>
.business-edit-interface {
  &::v-deep {
    table {
      width: 100% !important;
    }
    .default-row {
      background: #f7f7f7;
    }
    .normal-row {
      background: white;
    }
    .el-table__expand-icon {
      display: none;
    }
  }
}
</style>
