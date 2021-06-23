<template>
  <div style="background: #fff">
    <el-table :data="tableData" style="width: 100%" height="330" :row-class-name="tableRowClassName">
      <el-table-column label="序号" type="index" width="50"></el-table-column>
      <el-table-column label="接口名称" prop="name">
        <template #default="scope">
          <el-input v-if="!scope.row.isSystem" v-model.trim="scope.row.name" placeholder="请输入英文名称"></el-input>
          <template v-else>{{ scope.row.name }}</template>
        </template>
      </el-table-column>
      <el-table-column label="请求方式" prop="method">
        <template #default="scope">
          <el-select v-if="!scope.row.isSystem" v-model="scope.row.method" placeholder="请选择请求方式">
            <el-option
              v-for="(option, index) in requestMethodOptions"
              :key="index"
              :label="option.label"
              :value="option.value"
            ></el-option>
          </el-select>
          <template v-else>{{ getMethodName(scope.row.method) }}</template>
        </template>
      </el-table-column>
      <el-table-column label="数据对象" prop="modelId">
        <template #default="scope">
          <el-select v-if="!scope.row.isSystem" v-model="scope.row.modelId" placeholder="请选择数据对象">
            <el-option
              v-for="(model, index) in modelList"
              :key="index"
              :label="model.name"
              :value="model.id"
            ></el-option>
          </el-select>
          <template v-else>{{ scope.row.modelName === 'all' ? '通用' : scope.row.modelName }}</template>
        </template>
      </el-table-column>
      <el-table-column label="URL" prop="url">
        <template #default="scope">
          <el-input v-if="!scope.row.isSystem" v-model.trim="scope.row.url" placeholder="请输入URL"></el-input>
          <template v-else>{{ scope.row.url }}</template>
        </template>
      </el-table-column>
      <el-table-column label="接口描述" prop="description">
        <template #default="scope">
          <el-input
            v-if="!scope.row.isSystem"
            v-model.trim="scope.row.description"
            placeholder="请填写接口描述"
          ></el-input>
          <template v-else>{{ scope.row.description }}</template>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template #default="scope">
          <template v-if="!scope.row.isSystem">
            <a class="operation-link" @click="openParamsModel(scope.$index, scope.row)">参数</a>
            <a class="operation-link" @click="addItem(scope.$index)" v-if="scope.$index === 0">添加</a>
            <a class="operation-link" @click="deleteItem(scope.$index, scope.row)">删除</a>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <div class="ports-configuration__operations">
      <el-button type="primary" @click="updateApis">保存</el-button>
      <el-button @click="cancelChange">取消</el-button>
    </div>
  </div>
  <!-- 参数配置弹窗 -->
  <el-dialog title="参数配置" v-model="dialogVisible" width="780px">
    <el-row>
      <el-col :span="4" style="text-align: left; vertical-align: middle; line-height: 32px; font-weight: bolder">
        {{ getMethodName(dialogState.method) }}
      </el-col>
      <el-col :span="20">
        <el-input v-model.trim="dialogState.url" placeholder="请输入URL"></el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-button-group>
        <el-button
          @click="dialogState.paramType = ParamTypeEnum.REQUEST_PARAM"
          :type="dialogState.paramType === 0 ? 'primary' : undefined"
          >params</el-button
        >
        <el-button
          @click="dialogState.paramType = ParamTypeEnum.PATH_VARIABLE"
          :type="dialogState.paramType === 2 ? 'primary' : undefined"
          >query</el-button
        >
        <el-button
          v-if="dialogState.method == 1"
          @click="dialogState.paramType = ParamTypeEnum.REQUEST_BODY"
          :type="dialogState.paramType === 1 ? 'primary' : undefined"
        >
          body
        </el-button>
      </el-button-group>
      <el-table :data="computedParams" border>
        <el-table-column prop="name" label="参数名称">
          <template #default="scope">
            <el-input v-model.trim="scope.row.name" placeholder="请输入参数名称"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="参数类型">{{ ParamTypeEnum[dialogState.paramType] }}</el-table-column>
        <el-table-column prop="type" label="数据类型">
          <template #default="scope">
            <el-select v-model="scope.row.type" placeholder="请选择数据类型">
              <el-option
                v-for="(item, index) in dataTypeOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="required" label="是否必填">
          <template #default="scope">
            <el-select v-model="scope.row.required">
              <el-option :value="1" label="是"></el-option>
              <el-option :value="0" label="否"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template #default="scope">
            <a class="operation-link" @click="addParam(scope.$index, dialogState.paramType)">添加</a>
            <a class="operation-link" @click="deleteParam(scope.$index, dialogState.paramType)">删除</a>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleParamsModify">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, watch, getCurrentInstance, SetupContext, computed } from 'vue';
import { getServiceApis, updateServiceApis } from '@/api/servers';
import _ from 'lodash';

// 参数类型枚举
enum ParamTypeEnum {
  'REQUEST_PARAM',
  'REQUEST_BODY',
  'PATH_VARIABLE',
}

// 请求方式枚举
enum RequestMethodEnum {
  'GET',
  'POST',
  'PUT',
}

// 请求方式选项
const requestMethodOptions = Object.entries(RequestMethodEnum)
  .slice(0, Object.entries(RequestMethodEnum).length / 2)
  .map(([key, value]) => ({ label: value, value: Number.parseInt(key, 10) }));

// 数据类型枚举
enum DataTypeEnum {
  'String',
  'Integer',
  'Long',
  'Float',
  'Double',
  'Boolean',
  'Date',
  'File',
}

// 数据类型选项
const dataTypeOptions = Object.entries(DataTypeEnum)
  .slice(0, Object.entries(DataTypeEnum).length / 2)
  .map(([key, value]) => ({ label: value, value: Number.parseInt(key, 10) }));

export default defineComponent({
  name: 'ServerPortsInfo',
  props: {
    id: {
      type: String,
      default: '',
    },
    modelList: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['back'],
  setup(props: { id: string }, ctx: SetupContext) {
    // 组件实例
    const instance = getCurrentInstance();

    // 表单数据
    const tableData = ref([] as any[]);

    // 初始化表格数据
    const initializeTableData = async () => {
      const { data } = await getServiceApis(props.id);
      tableData.value = [
        { name: '', method: '', url: '', description: '', isSystem: 0 },
        ...data.filter((item: any) => item.isSystem === 0),
        ...data.filter((item: any) => item.isSystem === 1),
      ];
    };

    initializeTableData();

    // 添加属性
    const addItem = (index: number) => {
      tableData.value.splice(index + 1, 0, {
        name: '',
        method: '',
        url: '',
        description: '',
        isSystem: 0,
      });
    };

    // 删除属性
    const deleteItem = (index: number) => {
      tableData.value.splice(index, 1);
    };

    const getMethodName = (id: number) => {
      const target = requestMethodOptions.filter((item) => item.value === id);
      return target[0]?.label || '';
    };

    const currentItemIndex = ref(0);

    // 参数配置弹窗是否可见
    const dialogVisible = ref(false);

    // 参数弹窗所需数据
    const dialogState = reactive({
      method: '',
      url: '',
      name: '',
      params: [] as any[],
      type: '',
      paramType: 0,
    });

    // 参数列表表格数据
    const computedParams = ref([] as any[]);

    const currentParams = computed(() =>
      computedParams.value.filter((x: any) => x.paramType === dialogState.paramType),
    );

    const updateParamsData = () => {
      dialogState.params = _.unionBy([...dialogState.params, ...computedParams.value], 'name');
      const result = dialogState.params.filter((item: any) => item.paramType === dialogState.paramType);
      result.push({ name: '', paramType: dialogState.paramType, required: '', type: '' });
      computedParams.value = _.unionBy(result, 'name');
    };
    // 监听参数类型变化切换参数列表数据
    watch(
      () => dialogState.paramType,
      () => {
        updateParamsData();
        console.log(dialogState.paramType);
      },
      {
        immediate: true,
      },
    );

    // 打开参数配置弹窗
    const openParamsModel = (index: number, rowData: any) => {
      currentItemIndex.value = index;
      dialogVisible.value = true;
      dialogState.name = rowData.name || '';
      dialogState.method = rowData.method;
      dialogState.url = rowData.url;
      dialogState.type = rowData.type;
      dialogState.params = rowData.params || [];
      computedParams.value = rowData.params.filter((x: any) => x.paramType === 0);
      computedParams.value.push({ name: '', paramType: 0, required: '', type: '' });
    };

    // 添加参数
    const addParam = (index: number, paramType: string) => {
      computedParams.value.splice(index + 1, 0, {
        name: '',
        paramType,
        required: '',
        type: '',
        isSystem: 0,
      });
    };

    // 删除参数
    const deleteParam = (index: number) => {
      computedParams.value.splice(index, 1);
    };

    // 参数配置修改
    const handleParamsModify = () => {
      updateParamsData();
      const params = dialogState.params
        .map((param: any, index: number) => ({
          ...param,
          ...{ paramOrder: index, description: '' },
        }))
        .filter((item: any) => item.name !== '');
      console.log(params, 'this is params');
      tableData.value[currentItemIndex.value].params = params;
      tableData.value[currentItemIndex.value].url = dialogState.url;
      dialogVisible.value = false;
    };

    // 取消接口修改
    const cancelChange = () => {
      ctx.emit('back');
    };

    // 保存接口修改
    const updateApis = async () => {
      const { code } = await updateServiceApis(
        {
          apis: tableData.value.filter((item: any) => item.name !== '' && item.isSystem === 0),
        },
        props.id,
      );
      if (code === 0) {
        (instance as any).proxy.$message({
          type: 'success',
          message: '保存成功',
        });
        cancelChange();
      }
    };

    // 表单列类名生成
    const tableRowClassName = ({ row }: { row: any }) => {
      if (row.isSystem === 1) {
        return 'system-row';
      }
    };

    return {
      ParamTypeEnum,
      tableData,
      requestMethodOptions,
      getMethodName,
      dialogVisible,
      dialogState,
      computedParams,
      openParamsModel,
      addItem,
      deleteItem,
      addParam,
      deleteParam,
      handleParamsModify,
      updateApis,
      cancelChange,
      dataTypeOptions,
      tableRowClassName,
      currentParams,
    };
  },
});
</script>

<style lang="scss">
.system-row {
  background: #f5f7fa !important;
}
</style>

<style scoped lang="scss">
.operation-link {
  margin-right: 4px;
  &:hover {
    cursor: pointer;
  }
}
.ports-configuration__operations {
  display: flex;
  padding: 12px;
  place-content: center;
}
</style>
