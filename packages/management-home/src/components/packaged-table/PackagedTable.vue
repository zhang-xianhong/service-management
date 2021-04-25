<template>
  <el-table :data="tableData" :style="style" :selection="selecion" ref="tableRef" v-bind="$attrs">
    <el-table-column v-if="isSelectAble" type="selection" width="55" fixed></el-table-column>
    <el-table-column v-if="isShowIndex" prop="index" label="序号" width="60" fixed> </el-table-column>
    <el-table-column
      v-for="({ isButton, isDefault, prop, isDate, buttonOptions, ...restArgs }, index) in tableColumns"
      :key="index"
      v-bind="restArgs"
    >
      <template #default="scope">
        <!-- 默认输出 -->
        <template v-if="isDefault">
          <!-- 如果为日期类型自动格式化处理 -->
          <template v-if="isDate && scope.row[prop]">{{ dateFormat(scope.row[prop]) }}</template>
          <template v-else>{{ scope.row[prop] }}</template>
        </template>
        <!-- 自定义表格行内容 -->
        <slot :name="prop" v-bind="{ [prop]: scope.row[prop], rowData: scope.row }"></slot>
        <!-- 表格行内容为按钮 -->
        <template v-if="isButton">
          <template v-for="({ name, label, trigger, eventName, ...restOptions }, index) in buttonOptions" :key="index">
            <el-button
              v-if="(label || scope.row[prop]) && handleButtonVisibility(buttonsVisibility[name], scope.row)"
              :key="index"
              type="primary"
              v-on="buttonEventHandler(trigger, prop, scope.row, name, eventName)"
              v-bind="handleButtonOptions(restOptions, scope.row)"
              :ref="
                (el) => {
                  buttonsRef[name] = el;
                }
              "
            >
              {{ label ? label : scope.row[prop] }}
            </el-button>
          </template>
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
import { SetupContext, computed, watchEffect, ref, reactive } from 'vue';
import ButtonOptionInterface from './types/table-button-interface';
import TableColumnsInterface from './types/table-columns-interface';
import dateFormat from '@/utils/date-format';

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
    // table组件引用
    const tableRef: any = ref(null);
    // 表格内按钮引用
    const buttonsRef: any = ref({});
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
          isDate: false,
          ...item,
          buttonOptions: item.buttonOptions || [],
        }));
      }
      return [];
    });

    // 按钮是否可见配置
    const buttonsVisibility: Record<string, boolean | Function> = reactive({});

    // 按钮是否可见配置初始化
    Object.values(props.columns as TableColumnsInterface[]).forEach((item: TableColumnsInterface) => {
      if (item.buttonOptions && item.buttonOptions.length) {
        item.buttonOptions.forEach((data: ButtonOptionInterface) => {
          if (data.visibility || data.visibility === false) {
            buttonsVisibility[data.name] = data.visibility;
          }
        });
      }
    });

    // 操作栏按钮事件触发
    function handleOperate(operationItem: ButtonOptionInterface, rowData: any): void {
      if (operationItem) {
        if (operationItem.eventName) {
          ctx.emit(operationItem.eventName, rowData);
          return;
        }
        ctx.emit(`${operationItem.trigger || 'click'}:${operationItem.name || ''}`, rowData);
      }
    }

    // 监听传入勾选项勾选并勾选，不过需注意会触发check事件
    watchEffect(() => {
      props.selecion.forEach((item: number) => {
        tableRef.value.toggleRowSelection(props.data[item]);
      });
    });

    // 表格内按钮事件触发
    function buttonEventHandler(trigger: any, prop: string, rowData: any, name: string, eventName?: string): object {
      if (!trigger) {
        return {};
      }
      // 对按钮触发事件类型进行限制，仅支持'hover'｜'click'｜'dbclick'｜'focus'类型
      switch (trigger) {
        case 'hover':
          return {
            hover: () => {
              ctx.emit(`${eventName || `hover:${name}`}`, prop, rowData);
            },
          };
        case 'dbclick':
          return {
            dbclick: () => {
              ctx.emit(`${eventName || `dbclick:${name}`}`, prop, rowData);
            },
          };
        case 'focus':
          return {
            focus: () => {
              ctx.emit(`${eventName || `focus:${name}`}`, prop, rowData);
            },
          };
        default:
          return {
            click: () => {
              ctx.emit(`${eventName || `click:${name}`}`, prop, rowData);
            },
          };
      }
    }

    // 表单内按钮选项处理
    function handleButtonOptions(options: object, rowData: any) {
      const result: any = { ...options };
      Object.entries(options).forEach(([key, value]) => {
        if (typeof value === 'function') {
          result[key] = value(rowData);
        }
      });
      return result;
    }

    // 表单内按钮是否可见配置处理
    function handleButtonVisibility(visibility: any, rowData: any) {
      if (visibility === undefined) {
        return true;
      }
      if (typeof visibility === 'function') {
        return visibility(rowData);
      }
      return !!visibility;
    }

    // 修改表格内按钮是否可见
    function changeButtonVisibility(name: string, visibility: boolean | Function) {
      buttonsVisibility[name] = visibility;
    }

    // 组件向外暴露按钮引用
    ctx.expose({
      buttonsRef,
      changeButtonVisibility,
    });

    return {
      selection: props.selecion,
      tableRef,
      buttonsRef,
      tableData,
      tableOperations,
      tableColumns,
      buttonsVisibility,
      handleOperate,
      buttonEventHandler,
      handleButtonOptions,
      handleButtonVisibility,
      dateFormat,
    };
  },
};
</script>
