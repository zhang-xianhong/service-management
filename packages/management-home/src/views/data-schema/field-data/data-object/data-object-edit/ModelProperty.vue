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
    <el-table-column prop="typeId" label="数据类型" min-width="100">
      <template #default="scope">
        <el-select v-model="scope.row.typeId" placeholder="请选择" :disabled="scope.row.isSystem">
          <el-option v-for="item in dataTypes" :key="item.id" :label="item.name" :value="item.id"> </el-option>
        </el-select>
      </template>
    </el-table-column>

    <el-table-column width="70" v-for="column in checkableColumns" :key="column.prop" v-bind="{ ...column }">
      <template #default="scope">
        <el-checkbox v-model="scope.row[column.prop]" :disabled="scope.row.isSystem" />
      </template>
    </el-table-column>

    <el-table-column label="关联数据对象" min-width="100">
      <template #default="scope">
        <!-- <el-cascader
          :value="
            scope.row.foreignModelId && scope.row.foreignId ? [scope.row.foreignModelId, scope.row.foreignId] : []
          "
          :props="relatedDatatModelProps"
        ></el-cascader> -->
        {{ scope.row.foreignId }}
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
import { reactive, watchEffect, toRefs } from 'vue';
import DataFieldProperty from '../../types/data-field-property';
import DataCheckableColumns from '../../config/data-checkable-columns';
import { getDataTypes } from '@/api/settings/data-types';
import { ElMessage } from 'element-plus';
import { getModelDetail } from '@/api/schema/model';
// import { useRoute } from 'vue-router';

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

    // const route = useRoute();

    const tableData: { properties: Array<DataFieldProperty> } = reactive({
      properties: [],
    });

    setTimeout(() => {
      tableData.properties = props.modelValue.map((item, index) => ({ ...item, index: index + 1 }));
    }, 1000);

    if (tableData.properties.length === 0) {
      tableData.properties.push({
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
      });
    }

    // 监听属性信息发生变化通知父组件
    watchEffect(() => {
      emit('update:modelValue', tableData.properties);
    });

    // 新增属性
    const hadnleAddField = () => {
      tableData.properties.push({
        index: tableData.properties.length + 1,
        name: '',
        description: '',
        typeId: '',
        notNull: false,
        isUnique: false,
        isIndex: false,
        isParticipleSupport: false,
        isPinyinSupport: false,
        foreignId: '',
      });
    };

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

    // 属性移除
    function handleRemoveField(index: number): void {
      tableData.properties.splice(index, 1);
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

    // 获取数据对象级联下拉框的选项
    async function getDataModelOptions(level: number, modelId?: number) {
      // 获取目标模型的属性列表
      if (level === 1 && modelId) {
        const { data } = await getModelDetail(modelId);
        return data.fields.map((item: any) => ({
          value: item.foreignId,
          label: item.name,
          leaf: true,
        }));
      }
    }

    // 所有数据模型列表
    const allModelList: any[] = [];

    // 关联数据对象配置参数
    const relatedDatatModelProps = {
      lazy: true,
      async lazyLoad(node: any, resolve: (node: any) => void) {
        const { level } = node;
        if (level === 0) {
          resolve(allModelList);
        } else if (level === 1) {
          const nodes = await getDataModelOptions(level, node.data.value);
          resolve(nodes);
        }
      },
    };

    // onMounted(() => {
    //   获取数据类型列表
    //   获取所有的数据模型列表
    //   const { data } = await getModelListAll();
    //   allModelList = data
    //     .map((item: any) => ({
    //       children: [],
    //       value: item.id,
    //       label: item.name,
    //       leaf: false,
    //     }))
    //     .filter((item: any) => item.value !== route.params.id);
    // });

    return {
      ...toRefs(tableData),
      checkableColumns,
      dataTypes,
      relatedDatatModelProps,
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
