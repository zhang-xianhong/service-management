<template>
  <el-table :data="tableData" :style="style" :selection="selecion" :ref="tableRef" v-bind="$attrs">
    <el-table-column v-if="isSelectAble" type="selection" width="55" fixed></el-table-column>
    <el-table-column v-if="isShowIndex" prop="index" label="序号" width="60" fixed> </el-table-column>
    <el-table-column
      v-for="({ prop, label, width, fixed, isButton, isDefault, buttonOptions, ...restArgs }, index) in tableColumns"
      :key="index"
      :prop="prop"
      :label="label"
      :width="width"
      :fixed="fixed"
      v-bind="restArgs"
    >
      <template #default="scope">
        <!-- 默认输出 -->
        <template v-if="isDefault">{{ scope.row[prop] }}</template>
        <!-- 自定义表格行内容 -->
        <slot :name="prop" v-bind="{ [prop]: scope.row[prop], rowData: scope.row }"></slot>
        <!-- 表格行内容为按钮 -->
        <template v-if="isButton">
          <el-button
            v-for="(option, index) in buttonOptions"
            :key="index"
            type="primary"
            v-bind="optionsHandler(option, prop, scope.row)"
            >{{ option.label ? option.label : scope.row[prop] }}</el-button
          >
        </template>
      </template>
    </el-table-column>
    <el-table-column v-if="isShowOperation" label="操作" width="300px">
      <template #default="scope">
        <el-button
          v-for="(item, index) in tableOperations"
          :key="index"
          :type="item.type"
          v-bind="item.options"
          @click="handleOperate(item, scope.row)"
          >{{ item.label ? item.label : '' }}</el-button
        >
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts">
import { SetupContext, computed, watchEffect, ref } from 'vue';
import ButtonOptionInterface from './types/table-button-interface';

export default {
  name: 'PackagedTable',
  props: {
    // 表格内容
    data: {
      type: Array,
      default: () => [],
    },
    // 表格样式，默认width: 100%
    style: {
      type: String,
      default: 'width: 100%',
    },
    // 表格勾选项
    selecion: {
      type: Array,
      default: () => [],
    },
    // 是否显示勾选框，默认开启
    isSelectAble: {
      type: Boolean,
      default: true,
    },
    // 是否显示序号列，默认显示
    isShowIndex: {
      type: Boolean,
      default: true,
    },
    // 其他表格列配置
    columns: {
      type: Array,
      default: () => [],
    },
    // 是否显示操作列，默认显示
    isShowOperation: {
      type: Boolean,
      default: true,
    },
    // 操作项配置
    operations: {
      type: Array,
      default: () => [],
    },
  },
  setup(props: any, ctx: SetupContext) {
    // 表格内容预处理
    const tableData = computed(() => {
      if (Array.isArray(props.data)) {
        return props.data.map((item: any, index: number) => ({
          ...item,
          index: index + 1,
        }));
      }
      return [];
    });

    // 表格操作项预处理
    const tableOperations = computed(() => {
      if (Array.isArray(props.operations)) {
        return props.operations.map((item: ButtonOptionInterface) => ({
          ...item,
          name: item.name || '',
          label: item.label || '',
          type: item.type || 'primary',
          eventName: item.eventName || '',
          fixed: item.fixed || false,
          options: item.options || {},
        }));
      }
      return [];
    });

    // 表格列配置项预处理
    const tableColumns = computed(() => {
      if (Array.isArray(props.columns)) {
        return props.columns.map((item: any) => ({
          isDefault: !item.isButton,
          ...item,
          buttonOptions: item.buttonOptions || [],
        }));
      }
      return [];
    });

    // 操作栏按钮处理
    function handleOperate(operationItem: ButtonOptionInterface, rowData: any): void {
      if (operationItem) {
        if (operationItem.eventName) {
          ctx.emit(operationItem.eventName, rowData);
          return;
        }
        ctx.emit(`operate:${operationItem.name}`, rowData);
      }
    }

    // table组件引用
    const tableRef = ref();

    // 监听传入勾选项勾选并勾选，不过需注意会触发check事件
    watchEffect(() => {
      props.selecion.forEach((item: number) => {
        tableRef.value.toggleRowSelection(props.data[item]);
      });
    });

    // 表格内按钮事件触发
    function buttonEventHandler(option: ButtonOptionInterface, prop: string, rowData: any) {
      if (option.eventName) {
        ctx.emit(option.eventName, prop, rowData);
      } else {
        ctx.emit(`${option.trigger || 'click'}:${option.name || ''}`, rowData);
      }
    }

    // 按钮选项参数处理
    function optionsHandler(option: ButtonOptionInterface, prop: string, rowData: any): object {
      const { trigger = 'click', name, eventName, label, ...restOptions } = option;
      // 对按钮触发事件类型进行限制，仅支持'hover'｜'click'｜'dbclick'｜'focus'类型
      switch (trigger) {
        case 'hover':
          return {
            '@hover': buttonEventHandler(option, prop, rowData),
            ...restOptions,
          };
        case 'dbclick':
          return {
            '@dbclick': buttonEventHandler(option, prop, rowData),
            ...restOptions,
          };
        case 'focus':
          return {
            '@focus': buttonEventHandler(option, prop, rowData),
            ...restOptions,
          };
        default:
          return {
            '@click': buttonEventHandler(option, prop, rowData),
            ...restOptions,
          };
      }
    }

    return {
      selection: props.selecion,
      tableRef,
      tableData,
      tableOperations,
      tableColumns,
      handleOperate,
      optionsHandler,
    };
  },
};
</script>
