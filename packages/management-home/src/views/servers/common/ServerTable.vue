<template>
  <el-table :data="tableData" :style="style" v-bind="$attrs">
    <el-table-column v-if="isSelectAble" type="selection" width="55" fixed> </el-table-column>
    <el-table-column v-if="isShowIndex" prop="index" label="序号" width="60" fixed> </el-table-column>
    <el-table-column
      v-for="(item, index) in tableColumns"
      :key="index"
      :prop="item.prop"
      :label="item.label"
      :width="item.width"
      :fixed="item.fixed"
    >
      <template #default="scope">
        <!-- 默认输出 -->
        <template v-if="item.isDefault">{{ scope.row[item.prop] }}</template>
        <!-- 自定义表格行内容 -->
        <slot :name="item.prop" v-bind="{ [item.prop]: scope.row[item.prop], rowData: scope.row }"></slot>
        <!-- 表格行内容为按钮 -->
        <template v-if="item.isButton">
          <el-button v-for="(option, index) in item.buttonOptions" :key="index" type="primary" v-bind="option">{{
            option.label ? option.label : scope.row[item.prop]
          }}</el-button>
        </template>
      </template>
    </el-table-column>
    <el-table-column v-if="isShowOperation" label="操作" width="300px">
      <template #default="scope">
        <el-button
          v-for="(item, index) in tableOperations"
          :key="index"
          size="mini"
          :type="item.type"
          v-bind="item.options"
          @click="handleOperate(item, scope.$index, scope.row)"
          >{{ item.label ? item.label : scope.row[item.prop] }}</el-button
        >
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts">
import { SetupContext, computed } from 'vue';

type ButtonType = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text';

// 操作项数据接口
interface OperationItemInterface {
  name: string; // 操作名称，例如'edit'等
  label: string; // 按钮名称，例如 '编辑'等
  type: ButtonType; // 按钮类型
  eventName?: string; // emit事件名称
  [index: string]: any;
}

export default {
  name: 'ServerTable',
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
        return props.operations.map((item: OperationItemInterface) => ({
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

    // 操作栏处理函数，如果操作配置项有eventName则emit该事件，否则emit 'operate: {name}'事件
    function handleOperate(operationItem: OperationItemInterface, index: number, row: number): undefined {
      if (operationItem) {
        if (operationItem.eventName) {
          ctx.emit(operationItem.eventName, index, row);
          return undefined;
        }
        ctx.emit(`operate:${operationItem.name}`, index, row);
      }
    }

    return {
      tableData,
      tableOperations,
      tableColumns,
      handleOperate,
    };
  },
};
</script>

<style lang="scss" scoped></style>
