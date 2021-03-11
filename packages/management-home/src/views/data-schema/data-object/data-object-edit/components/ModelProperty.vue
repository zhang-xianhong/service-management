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
          @change="validatePropertyName(scope.row.name, scope.$index)"
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
          @change="handleChange('description', scope.row, scope.$index)"
        />
      </template>
    </el-table-column>
    <el-table-column prop="typeId" label="数据类型" min-width="100">
      <template #default="scope">
        <el-select
          v-model="scope.row.typeId"
          placeholder="请选择"
          :disabled="scope.row.isSystem"
          @change="handleChange('typeId', scope.row, scope.$index)"
        >
          <el-option v-for="item in dataTypes" :key="item.id" :label="item.name" :value="item.id"> </el-option>
        </el-select>
      </template>
    </el-table-column>

    <el-table-column width="70" v-for="column in checkableColumns" :key="column.prop" v-bind="{ ...column }">
      <template #default="scope">
        <el-checkbox
          v-model="scope.row[column.prop]"
          :disabled="scope.row.isSystem"
          @change="handleChange(column.prop, scope.row, scope.$index)"
        />
      </template>
    </el-table-column>

    <el-table-column label="关联数据对象" min-width="100">
      <template #default="scope">
        <el-cascader
          :options="cascaderOptions"
          @change="changeHandler(scope.row, $event)"
          v-model="scope.row.releatedData"
        ></el-cascader>
      </template>
    </el-table-column>
    <el-table-column prop="operation" label="" align="center" fixed="right" width="50">
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
import { reactive, computed, onMounted } from 'vue';
import DataCheckableColumns from '../../../config/data-checkable-columns';
import { getDataTypes } from '@/api/settings/data-types';
import { ElMessage } from 'element-plus';
import { getModelListAll } from '@/api/schema/model';
import { useRoute } from 'vue-router';

export default {
  name: 'ModelProperty',
  props: {
    modelValue: {
      type: Array,
      default: () => [],
    },
  },
  setup(props: { modelValue: Array<any> }, { emit }: { emit: (event: string, ...args: any[]) => void }) {
    const route = useRoute();
    // 属性可勾选配置项
    const checkableColumns = DataCheckableColumns;

    // 数据对象属性初始化，如果传入属性为空则默认指定id属性
    function initializeProperties() {
      if (props.modelValue?.length) {
        return props.modelValue.map((item, index) => ({
          ...item,
          index: index + 1,
          releatedData: item.foreignModelId ? [item.foreignModelId, item.foreignId] : [],
        }));
      }
      return [
        {
          index: 1,
          name: 'id',
          description: '编号',
          typeId: '1',
          notNull: true,
          isUnique: true,
          isIndex: true,
          isParticipleSupport: false,
          isPinyinSupport: false,
          foreignId: '',
          isSystem: true,
          releatedData: [],
        },
      ];
    }

    // 属性列表
    const properties = computed({
      get: () => initializeProperties(),
      set: (value: any[]) => {
        emit('update:modelValue', value);
      },
    });

    // 新增属性
    const hadnleAddField = () => {
      properties.value = [
        ...properties.value,
        {
          index: properties.value.length + 1,
          name: '',
          description: '',
          typeId: '',
          notNull: false,
          isUnique: false,
          isIndex: false,
          isParticipleSupport: false,
          isPinyinSupport: false,
          foreignId: '',
          releatedData: [],
        },
      ];
    };

    // 属性移除
    function handleRemoveField(index: number): void {
      const result = properties.value;
      result.splice(index, 1);
      properties.value = result;
    }

    // 属性名校验，仅支持小驼峰命名规则
    function validatePropertyName(name: string, index: number): void {
      if (typeof name === 'string' && /^[a-z]/g.test(name)) {
        const result = properties.value;
        result[index].name = name;
        properties.value = result;
        return;
      }
      ElMessage({
        message: '参数命名必须遵守小驼峰规则！',
        type: 'error',
        duration: 5 * 1000,
      });
    }

    // 属性修改
    function handleChange(field: string, row: any, index: number): void {
      const result = properties.value;
      result[index][field] = row[field];
      emit('update:modelValue', result);
    }

    // 数据类型选项
    const dataTypes: any[] = reactive([]);

    // 获取数据类型选项
    const fetchDataTypes = async () => {
      try {
        const { data } = await getDataTypes();
        dataTypes.push(...data);
      } catch (error) {}
    };

    fetchDataTypes();

    // 数据关联对象级联框选项
    const cascaderOptions = reactive([] as any[]);

    // 获取级联框选项
    const getCascaderOptions = async () => {
      const { data } = await getModelListAll({ fields: 1 });
      const models = data
        .filter((item: any) => item.id !== route.params.id)
        .map((item: any) => ({
          ...item,
          value: item.id,
          label: item.name,
          leaf: false,
          children: item.fields?.map((field: any) => ({
            value: field.id,
            label: field.name,
            leaf: true,
          })),
        }));
      cascaderOptions.push(...models);
    };

    // 关联对象勾选级联框选择
    function changeHandler(data: any, node: any[]) {
      const result = properties.value;
      const [foreignModelId, foreignId] = node;
      const finalResult = result.map((item) => {
        if (data.index === item.index) {
          return { ...item, foreignModelId, foreignId };
        }
        return { ...item };
      });
      properties.value = finalResult;
    }

    // 获取所有模型列表
    onMounted(() => {
      getCascaderOptions();
    });

    return {
      properties,
      checkableColumns,
      dataTypes,
      hadnleAddField,
      handleRemoveField,
      validatePropertyName,
      handleChange,
      cascaderOptions,
      changeHandler,
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
