<template>
  <el-table :data="properties" border style="width: 100%">
    <el-table-column prop="index" label="序号" fixed width="80"></el-table-column>
    <el-table-column prop="name" label="属性名称" fixed min-width="100">
      <template #default="scope">
        <el-input
          v-model.trim="scope.row.name"
          placeholder="请输入属性名称"
          maxlength="64"
          :disabled="scope.row.isSystem"
          @change="validatePropertyName(scope.row.name)"
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
          <el-option v-for="item in dataTypes" :key="item.id" :label="item.name" :value="item.id"> </el-option>
        </el-select>
      </template>
    </el-table-column>

    <el-table-column width="70" v-for="column in checkableColumns" :key="column.prop" v-bind="{ ...column }">
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
        <el-button type="text" class="action" :disabled="scope.row.isSystem" @click="handleRemoveField(scope.$index)">
          <i class="el-icon-delete"></i>
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  <div class="table-actions">
    <el-button type="text" @click="hadnleAddField">新增属性</el-button>
  </div>
</template>
<script lang="ts">
import { onMounted, reactive, ref, watchEffect } from 'vue';
import DataFieldProperty from '../../types/data-field-property';
import DataCheckableColumns from '../../config/data-checkable-columns';
import { getDataTypes } from '@/api/settings/data-types';
import { ElMessage } from 'element-plus';

export default {
  name: 'ModelProperty',
  props: {
    modelValue: {
      type: Array,
      default: () => [],
    },
  },
  setup(props: { modelValue: Array<any> }, { emit }: { emit: (event: string, ...args: any[]) => void }) {
    // 属性可勾选配置项
    const checkableColumns = DataCheckableColumns;

    // 属性信息
    const properties: Array<DataFieldProperty> = props.modelValue.length === 0 ? reactive([]) : props.modelValue;

    if (properties.length === 0) {
      properties.push({
        index: 1,
        name: 'id',
        description: '编号',
        type: 1,
        notNull: true,
        isUnique: true,
        isIndex: true,
        isParticipleSupport: false,
        isPinyinSupport: false,
        foreignId: '',
        isSystem: true,
      });
    }

    // 监听属性信息发生变化通知父组件
    watchEffect(() => {
      emit('update:modelValue', properties);
    });

    // 新增属性
    const hadnleAddField = () => {
      properties.push({
        index: properties.length + 1,
        name: '',
        description: '',
        type: '',
        notNull: false,
        isUnique: false,
        isIndex: false,
        isParticipleSupport: false,
        isPinyinSupport: false,
        foreignId: '',
      });
    };

    // 数据类型选项
    const dataTypes = ref([]);

    // 获取数据类型选项
    const fetchDataTypes = async () => {
      try {
        const { data } = await getDataTypes();
        dataTypes.value = data;
      } catch (error) {}
    };

    onMounted(() => {
      fetchDataTypes();
    });

    // 属性移除
    function handleRemoveField(index: number): void {
      properties.splice(index, 1);
    }

    // 属性名校验，仅支持小驼峰命名规则
    function validatePropertyName(name: string): void {
      if (typeof name === 'string' && /^[a-z]/g.test(name)) {
        return;
      }
      ElMessage({
        message: '参数命名必须遵守小驼峰规则！',
        type: 'error',
        duration: 5 * 1000,
      });
    }

    return {
      properties,
      checkableColumns,
      dataTypes,
      hadnleAddField,
      handleRemoveField,
      validatePropertyName,
    };
  },
};
</script>
<style lang="scss" scoped>
.model-property__error {
  color: red;
}
.action {
  font-size: 18px;
  cursor: pointer;
  &:not(.is-disabled) {
    color: #606266;
  }
}
</style>
