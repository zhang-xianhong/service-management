<template>
<<<<<<< HEAD
  <el-table :data="properties" border style="width: 100%">
=======
  <el-table :data="properties" max-height="400" border style="width: 100%">
>>>>>>> ac3522f07928bab4509780875e29a1b14cf6e753
    <el-table-column prop="index" label="序号" fixed width="80">
      <template #default="scope">
        {{ scope.$index + 1 }}
      </template>
    </el-table-column>
    <el-table-column prop="name" label="属性名称" fixed min-width="100">
      <template #default="scope">
        <el-input
          v-model.trim="scope.row.name"
          placeholder="请输入属性名称"
          maxlength="64"
          :disabled="scope.row.isSystem"
        />
      </template>
    </el-table-column>
    <el-table-column prop="description" label="属性描述" min-width="100">
      <template #default="scope">
        <el-input
          v-model.trim="scope.row.description"
          maxlength="255"
          placeholder="请输入属性描述"
          :disabled="scope.row.isSystem"
        />
      </template>
    </el-table-column>
    <el-table-column prop="type" label="数据类型" min-width="100">
      <template #default="scope">
        <el-select v-model="scope.row.type" placeholder="请选择" :disabled="scope.row.isSystem">
          <el-option v-for="item in dataTypes" :key="item.value" :label="item.name" :value="item.value"> </el-option>
        </el-select>
      </template>
    </el-table-column>
<<<<<<< HEAD

    <el-table-column width="70" v-for="column in checkableColumns" :key="column.prop" v-bind="{ ...column }">
=======
    <el-table-column prop="notNull" label="非空" width="70">
>>>>>>> ac3522f07928bab4509780875e29a1b14cf6e753
      <template #default="scope">
        <el-checkbox v-model="scope.row[column.prop]" :disabled="scope.row.isSystem" />
      </template>
    </el-table-column>

    <el-table-column prop="description" label="关联数据对象" min-width="100">
      <template #default="scope">
        <el-input v-model="scope.row.foreignId" />
      </template>
    </el-table-column>
    <el-table-column prop="opt" label="" align="center" fixed="right" width="50">
      <template #default="scope">
        <el-button type="text" class="action" :disabled="scope.row.isSystem">
          <i class="el-icon-delete"></i>
        </el-button>
      </template>
    </el-table-column>
<<<<<<< HEAD
=======
    <el-table-column prop="opt" label="" align="center" fixed="right" width="50">
      <a class="action">
        <i class="el-icon-delete"></i>
      </a>
    </el-table-column>
>>>>>>> ac3522f07928bab4509780875e29a1b14cf6e753
  </el-table>
  <div class="table-actions">
    <el-button type="text" @click="hadnleAddField">新增属性</el-button>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue';
import { CheckableColumns, DataFieldProperty } from './property';
import { getDataTypes } from '@/api/settings/data-types';
export default defineComponent({
  name: 'ModelProperty',
  setup() {
    const properties: Array<DataFieldProperty> = reactive([
      {
<<<<<<< HEAD
        name: 'id',
        description: '编号',
        type: 'id',
        notNull: true,
        unique: true,
        index: true,
        participle: false,
        pinyin: false,
        foreignId: '',
        isSystem: true,
=======
        name: 'test',
>>>>>>> ac3522f07928bab4509780875e29a1b14cf6e753
      },
    ]);
    const dataTypes = ref([]);
    const checkableColumns = ref(CheckableColumns);
    const fetchDataTypes = async () => {
      try {
        const { data } = await getDataTypes();
        dataTypes.value = data;
      } catch (error) {}
    };
    const hadnleAddField = () => {
      properties.push({
        name: '',
        description: '',
        type: '',
        notNull: false,
        unique: false,
        index: false,
        participle: false,
        pinyin: false,
        foreignId: '',
      });
    };
    const handleRemoveField = () => {};

    onMounted(() => {
      fetchDataTypes();
    });
    return {
      properties,
<<<<<<< HEAD
      checkableColumns,
      dataTypes,
      hadnleAddField,
      handleRemoveField,
=======
      columns,
>>>>>>> ac3522f07928bab4509780875e29a1b14cf6e753
    };
  },
});
</script>
<style lang="scss" scoped>
.action {
  font-size: 18px;
  cursor: pointer;
  &:not(.is-disabled) {
    color: #606266;
  }
}
</style>
