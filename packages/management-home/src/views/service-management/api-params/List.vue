<template>
  <div>
    <el-radio-group v-model="paramsMethod" style="margin-bottom: 20px" @change="handleParamsMethodChange">
      <el-radio-button :label="item" v-for="item in paramsMethods" :key="item" class="param-type">
        {{ item }}
      </el-radio-button>
    </el-radio-group>

    <div class="content-types" v-if="paramsMethod === 'body' && !isResponse">
      <el-radio v-model="contentType" :label="item" v-for="item in contentTypes" :key="item" :disabled="!isEdit">
        {{ item }}
      </el-radio>
    </div>

    <list-wrap
      :loading="loading"
      :inProject="false"
      :empty="list.length === 0"
      :hasCreateAuth="true"
      :handleCreate="handleAdd"
    >
      <el-table
        :data="list"
        style="width: 100%"
        row-key="$id"
        default-expand-all
        :span-method="objectSpanMethod"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        class="params-table"
      >
        <el-table-column prop="name" label="参数" class-name="col-inline">
          <template #default="scope">
            <span v-if="!isEdit || scope.row.readonly || scope.row.builtin">{{ scope.row.name }}</span>
            <el-input
              placeholder="请输入参数名称"
              v-model.trim="scope.row.name"
              maxlength="50"
              v-else
              :ref="(ref) => (inputRefs[`name.${scope.row.$id}`] = ref)"
              @input="() => clearError(`name.${scope.row.$id}`)"
              @change="(value) => handleInputChange('name', scope.row.$id, value)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="serverName" align="right">
          <template #default="scope">
            <span v-if="scope.row.serverName" class="import-info">
              <tooltip :content="`来源：${scope.row.serverName}_${scope.row.modelName}`"></tooltip>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="参数类型" width="180">
          <template #default="scope">
            <span v-if="!isEdit || scope.row.readonly">{{ getParamTypeName(scope.row.type) }}</span>
            <el-select
              v-else
              placeholder="请选择参数类型"
              v-model="scope.row.type"
              @change="
                (value) => {
                  handleTypeChange(scope.row, value);
                }
              "
            >
              <el-option
                v-for="item in paramTypes"
                :disabled="isDisableParamType(item.value, scope.row)"
                :key="item.value"
                :value="item.value"
                :label="item.name"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="required" label="是否必填" width="150">
          <template #default="scope">
            <span v-if="!isEdit || scope.row.readonly">{{ scope.row.required ? '是' : '否' }}</span>
            <el-select placeholder="请选择" v-model="scope.row.required" v-else>
              <el-option
                v-for="item in paramRequireds"
                :key="item.value"
                :value="item.value"
                :label="item.name"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="example" label="参数示例">
          <template #default="scope">
            <span v-if="!isEdit || scope.row.type === 'Array' || scope.row.type === 'Object'">{{
              scope.row.example
            }}</span>
            <el-input
              v-else
              placeholder="请输入参数示例"
              v-model.trim="scope.row.example"
              minlength="1"
              maxlength="20"
              :ref="(ref) => (inputRefs[`example.${scope.row.$id}`] = ref)"
              @input="() => clearError(`example.${scope.row.$id}`)"
              @change="(value) => handleInputChange('example', scope.row.$id, value)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="desc" label="参数描述">
          <template #default="scope">
            <tooltip v-if="!isEdit" :content="scope.row.desc"></tooltip>
            <el-input
              v-else
              placeholder="请输入参数描述"
              v-model.trim="scope.row.desc"
              maxlength="512"
              :ref="(ref) => (inputRefs[`desc.${scope.row.$id}`] = ref)"
              @input="() => clearError(`desc.${scope.row.$id}`)"
              @change="(value) => handleInputChange('desc', scope.row.$id, value)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="actions" label="操作" align="right" width="150">
          <template #default="scope">
            <template v-if="isEdit">
              <el-button type="text" @click="handleAdd(scope.row)" v-if="canAdd(scope.row)">添加</el-button>

              <el-dropdown
                v-if="scope.row.type === 'Object' && !(scope.row.dtoId && scope.row.importType === 1)"
                trigger="click"
                style="margin: 0 5px"
              >
                <el-button type="text"
                  >引入<i class="el-icon-arrow-down el-icon--right" style="margin-left: 0"></i
                ></el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item key="1" @click="handleOpenDto(scope.row, 1)">只读引入</el-dropdown-item>
                    <el-dropdown-item key="2" @click="handleOpenDto(scope.row, 2)">克隆引入</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>

              <el-button
                type="text"
                v-else-if="scope.row.type !== 'Array' && scope.row.type !== 'Object'"
                @click="handleSetting(scope.row)"
                >设置</el-button
              >
              <el-button type="text" @click="handleRemove(scope.row)" v-if="canDel(scope.row)">删除</el-button>
            </template>
            <template v-else>
              <el-button
                type="text"
                v-if="scope.row.type !== 'Array' && scope.row.type !== 'Object'"
                @click="handleSetting(scope.row)"
                >设置</el-button
              >
            </template>
          </template>
        </el-table-column>
      </el-table>
      <div class="error-wrap">{{ formError }}</div>
    </list-wrap>

    <div class="code-preview">
      <h3 class="code-preview__title">
        预览
        <el-button type="text" @click="handlePreview" :disabled="list.length === 0">生成预览</el-button>
      </h3>
      <pre v-highlight><code v-html="previewCode" class="json" style="background: #f5f5f5; padding: 10px;"></code></pre>
    </div>

    <div class="params-form-btns" v-if="list.length > 0">
      <el-button type="primary" @click="handleToggleEdit(true)" v-if="!isEdit">编辑</el-button>
      <template v-else>
        <el-button type="primary" @click="handleSave" :loading="submitting">确定</el-button>
        <el-button @click="handleCancel">取消</el-button>
      </template>
    </div>

    <dto-list-dialog ref="dtoListDialog" @on-confirm="handleDtoConfirm" />
    <stringSettingDialog ref="stringSettingDialog" @change="handleConfigChange" />
    <intSettingDialog ref="intSettingDialog" @change="handleConfigChange" />
    <floatSettingDialog ref="floatSettingDialog" @change="handleConfigChange" />
    <dateSettingDialog ref="dateSettingDialog" @change="handleConfigChange" />
    <booleanSettingDialog ref="booleanSettingDialog" @change="handleConfigChange" />
  </div>
</template>
<script>
import { defineComponent, ref, computed, watch, reactive } from 'vue';
import qs from 'qs';
import {
  getParamsMethods,
  postParamsMethods,
  CONTENT_TYPES,
  getParamTypeName,
  PARAMS_TYPES_QUERY,
  PARAMS_TYPE_FORM_DATA,
  PARAMS_TYPE_BODY,
  PARAMS_TYPE_RESPONSE,
} from './config';
import StringSettingDialog from './settings/String.vue';
import FloatSettingDialog from './settings/Float.vue';
import IntSettingDialog from './settings/Int.vue';
import DateSettingDialog from './settings/Date.vue';
import BooleanSettingDialog from './settings/Boolean.vue';
import DtoListDialog from '../dto/Index.vue';
import {
  genParam,
  findAndUpdateParams,
  paramsToExample,
  validParams,
  validName,
  validExample,
  validDescription,
  genTreeDefine,
  dtoToParams,
  paramsToSaveData,
  responseToParams,
} from './util';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getApiParams, saveApiParams } from '@/api/servers';
import _ from 'lodash';
export default defineComponent({
  name: 'ParamsList',
  components: {
    StringSettingDialog,
    FloatSettingDialog,
    IntSettingDialog,
    DateSettingDialog,
    BooleanSettingDialog,
    DtoListDialog,
  },
  props: {
    isResponse: {
      type: Boolean,
      default: false,
    },
    apiInfo: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  setup(props) {
    // eslint-disable-next-line vue/no-setup-props-destructure
    const { apiInfo } = props;
    const loading = ref(false);
    const methodType = ref((apiInfo.methodType || '').toLowerCase());
    const paramsMethod = ref(apiInfo.methodType === 'POST' ? 'body' : 'query');
    const contentType = ref('json');
    const inputRefs = ref({});
    const formError = ref('');
    const previewCode = ref('');
    const stringSettingDialog = ref(null);
    const intSettingDialog = ref(null);
    const floatSettingDialog = ref(null);
    const dateSettingDialog = ref(null);
    const booleanSettingDialog = ref(null);
    const dtoListDialog = ref(null);
    const isEdit = ref(false);
    const paramsDefine = ref(null);
    const submitting = ref(false);
    const sourceData = ref(null);

    const listMap = reactive({
      body: [],
      query: [],
      headers: [],
    });
    const list = computed(() => listMap[paramsMethod.value]);

    const paramsMethods = computed(() => {
      if (props.isResponse) {
        return [];
      }
      if (props.methodType === 'get') {
        return getParamsMethods;
      }
      return postParamsMethods;
    });

    watch(
      () => props.apiInfo,
      (newValue) => {
        methodType.value = (newValue.methodType || '').toLowerCase();
      },
    );

    // 获取接口参数
    const fetchApiParams = async () => {
      loading.value = true;
      const { data } = await getApiParams({
        serviceId: apiInfo.serviceId,
        apiUniqueId: apiInfo.uniqueId,
        type: props.isResponse ? 2 : 1,
      });
      const res = responseToParams(data.data);
      sourceData.value = _.cloneDeep(res);
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      resetListMap();
      loading.value = false;
    };

    fetchApiParams();

    // 数据重置
    const resetListMap = () => {
      const res = _.cloneDeep(sourceData.value);
      // eslint-disable-next-line no-restricted-syntax
      postParamsMethods.forEach((k) => {
        const item = res[k];
        if (item) {
          listMap[k] = item.list;
          if (k === 'body') {
            contentType.value = item.contentType || 'json';
          }
        } else {
          listMap[k] = [];
        }
      });
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      updateParamsDefine();
    };

    // 更新节点描述
    const updateParamsDefine = () => {
      paramsDefine.value = genTreeDefine(listMap[paramsMethod.value]);
    };

    const handleParamsMethodChange = () => {
      formError.value = '';
      updateParamsDefine();
    };

    // 编辑态切换
    const handleToggleEdit = (value) => {
      isEdit.value = value;
    };

    // 添加
    const handleAdd = (row) => {
      if (!row.$id) {
        handleToggleEdit(true);
        listMap[paramsMethod.value].push(genParam());
      } else {
        findAndUpdateParams(listMap[paramsMethod.value], row.$id, (items, index) => {
          items.splice(index + 1, 0, genParam());
        });
      }
      updateParamsDefine();
    };

    // 移除
    const handleRemove = (row) => {
      findAndUpdateParams(listMap[paramsMethod.value], row.$id, (items, index) => {
        items.splice(index, 1);
      });
      updateParamsDefine();
    };

    // 类型改变
    const handleTypeChange = (row, value) => {
      const define = paramsDefine.value[row.$id];
      const oldType = define.type;
      const afterTypeChange = () => {
        if (value === 'Array' || value === 'Object') {
          const children = [];
          if (value === 'Array') {
            children.push(
              genParam({
                builtin: true,
                name: 'item',
              }),
            );
          } else {
            children.push(genParam());
          }
          findAndUpdateParams(listMap[paramsMethod.value], row.$id, (items, index, item) => {
            items.splice(index, 1, {
              ...item,
              example: '',
              config: {},
              children,
            });
          });
        } else {
          findAndUpdateParams(listMap[paramsMethod.value], row.$id, (items, index, item) => {
            // eslint-disable-next-line no-param-reassign
            delete item.children;
            items.splice(index, 1, item);
          });
        }
        updateParamsDefine();
      };
      if (['Array', 'Object'].includes(oldType)) {
        ElMessageBox.confirm('是否确认对属性进行修改？修改后将清除该属性子属性', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            afterTypeChange();
          })
          .catch(() => {
            // eslint-disable-next-line no-param-reassign
            row.type = oldType;
          });
      }
    };

    // 保存
    const handleSave = async () => {
      formError.value = '';
      const error = Object.values(listMap).some((list) => {
        const res = validParams(list);
        if (res) {
          const error = res[0];
          try {
            const ref = inputRefs.value[`${error.field}.${error.id}`];
            ref.$el.classList.add('is-error');
            ref.focus();
          } catch (e) {}
          formError.value = error.message;
          return true;
        }
        return false;
      });
      if (error) {
        return false;
      }

      const baseInfo = {
        serviceId: apiInfo.serviceId,
        apiId: apiInfo.uniqueId,
      };
      const saveData = [];
      Object.keys(listMap).forEach((key) => {
        const list = [...listMap[key]];
        if (list.length) {
          saveData.push({
            ...baseInfo,
            paramIn: _.startCase(key),
            contentType: key === 'body' ? contentType.value : '',
            list: paramsToSaveData(list),
          });
        }
      });

      try {
        submitting.value = true;
        await saveApiParams({
          data: saveData,
          type: props.isResponse ? 2 : 1,
        });
        ElMessage.success('保存成功');
        fetchApiParams();
      } catch (e) {}
      submitting.value = false;
    };

    // 清除错误
    const clearError = (refId) => {
      try {
        const ref = inputRefs.value[refId];
        ref.$el.classList.remove('is-error');
      } catch (e) {
        console.log(e);
      }
    };

    // 取消
    const handleCancel = () => {
      handleToggleEdit(false);
      clearError();
      formError.value = '';
      resetListMap();
    };

    // validate after input change
    const handleInputChange = (field, id, value) => {
      formError.value = '';
      let valid = false;
      switch (field) {
        case 'name':
          valid = validName(value);
          break;
        case 'example':
          valid = validExample(value);
          break;
        case 'desc':
          valid = validDescription(value);
          break;
      }
      if (valid) {
        try {
          const ref = inputRefs.value[`${field}.${id}`];
          ref.$el.classList.add('is-error');
        } catch (e) {}
        formError.value = valid;
      }
    };

    // 设置
    const handleSetting = (row) => {
      let ref = null;
      switch (row.type) {
        case 'String':
          ref = stringSettingDialog.value;
          break;
        case 'Float':
        case 'Double':
          ref = floatSettingDialog.value;
          break;
        case 'Int32':
        case 'Int64':
          ref = intSettingDialog.value;
          break;
        case 'Boolean':
          ref = booleanSettingDialog.value;
          break;
        case 'Date':
          ref = dateSettingDialog.value;
          break;
      }
      if (ref) {
        ref.handleOpen(row, isEdit.value);
      }
    };

    // 设置
    const handleConfigChange = ({ id, config }) => {
      findAndUpdateParams(listMap[paramsMethod.value], id, (items, index, item) => {
        items.splice(index, 1, {
          ...item,
          config: {
            ...config,
          },
        });
      });
    };

    // 可选的参数类型
    const paramTypes = computed(() => {
      if (props.isResponse) {
        return [...PARAMS_TYPE_RESPONSE];
      }
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const _contentType = contentType.value;
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const _paramMethod = paramsMethod.value;
      if (_paramMethod === 'query' || _paramMethod === 'headers') {
        return [...PARAMS_TYPES_QUERY];
      }
      if (_paramMethod === 'body') {
        switch (_contentType) {
          case 'form-data':
            return [...PARAMS_TYPE_FORM_DATA];
          case 'x-www-form-urlencoded':
            return [...PARAMS_TYPES_QUERY];
        }
        return [...PARAMS_TYPE_BODY];
      }
      return [...PARAMS_TYPE_RESPONSE];
    });

    // 禁用类型
    const isDisableParamType = (type, row) => {
      if ((type !== 'Array' && type !== 'Object') || !paramsDefine.value) {
        return false;
      }
      const define = paramsDefine.value[row.$id];
      if (define && define.level >= 3) {
        let { parent } = define;
        let step = 2;
        while (parent) {
          if (parent.type !== type) {
            return false;
          }
          if (step === 0) {
            break;
          }
          step -= 1;
          parent = parent.parent;
        }
        return true;
      }
      return false;
    };

    // 预览
    const handlePreview = () => {
      try {
        const json = paramsToExample(listMap[paramsMethod.value], {});
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const _paramMethod = paramsMethod.value;
        if (!props.isResponse && _paramMethod === 'query') {
          previewCode.value = qs.stringify(json, { arrayFormat: 'brackets' });
        } else {
          previewCode.value = JSON.stringify(json, null, 4);
        }
      } catch (e) {
        console.log(e);
        ElMessage.error(e.message);
      }
    };

    // 是否可添加
    const canAdd = (row) => {
      if (!paramsDefine.value || !paramsDefine.value[row.$id]) {
        return true;
      }
      const define = paramsDefine.value[row.$id];
      console.log(define);
      if (define.parent && (define.parent.type === 'Array' || define.parent.isReadonlyImport)) {
        return false;
      }
      return true;
    };

    // 是否可删除
    const canDel = (row) => {
      // 引用只读
      if (!paramsDefine.value || !paramsDefine.value[row.$id]) {
        return true;
      }
      const define = paramsDefine.value[row.$id];
      if (define.parent) {
        const { type, length, isReadonlyImport } = define.parent;
        if (isReadonlyImport || type === 'Array' || (type === 'Object' && length === 1)) {
          return false;
        }
      }
      return true;
    };

    const currentQuoteParamId = ref(null);
    // 引入方式
    const currentQuoteType = ref(1);

    // 打开DTO模态框
    const handleOpenDto = (row, type) => {
      currentQuoteParamId.value = row.$id;
      currentQuoteType.value = type;
      dtoListDialog.value.openDtoList();
    };

    // DTO确定
    const handleDtoConfirm = (row) => {
      const currentParamId = currentQuoteParamId.value;
      if (!currentParamId) {
        return;
      }
      const params = dtoToParams(row, currentQuoteType.value);
      findAndUpdateParams(listMap[paramsMethod.value], currentParamId, (items, index, item) => {
        item.children.push(...params);
        items.splice(index, 1, {
          ...item,
        });
      });
      updateParamsDefine();
    };

    // 合并单元格
    const objectSpanMethod = ({ row, columnIndex }) => {
      if (!row.serverName || !row.readonly) {
        if (columnIndex === 0) {
          return {
            rowspan: 1,
            colspan: 2,
          };
        }
        if (columnIndex === 1) {
          return {
            rowspan: 1,
            colspan: 0,
          };
        }
      }
      return {
        rowspan: 1,
        colspan: 1,
      };
    };
    return {
      methodType,
      paramsMethod,
      paramsMethods,
      paramTypes,
      contentTypes: [...CONTENT_TYPES],
      contentType,
      paramRequireds: [
        {
          name: '是',
          value: 1,
        },
        {
          name: '否',
          value: 0,
        },
      ],
      loading,
      list,
      previewCode,
      inputRefs,
      formError,
      isEdit,
      handleToggleEdit,
      getParamTypeName,
      handleAdd,
      handleRemove,
      handleTypeChange,
      handleSave,
      clearError,
      handleInputChange,
      handleSetting,
      handleConfigChange,
      handleCancel,
      stringSettingDialog,
      intSettingDialog,
      floatSettingDialog,
      booleanSettingDialog,
      dateSettingDialog,
      dtoListDialog,
      paramsDefine,
      isDisableParamType,
      handlePreview,
      handleOpenDto,
      handleDtoConfirm,
      canAdd,
      canDel,
      handleParamsMethodChange,
      objectSpanMethod,
      submitting,
    };
  },
});
</script>
<style lang="scss" scoped>
.param-type {
  text-transform: capitalize;
}
.content-types {
  margin: 5px 0 20px 0;
  display: flex;
  align-items: center;
}
.params-table {
  ::v-deep .el-select,
  ::v-deep .el-input {
    width: 100%;
  }
  ::v-deep .is-error .el-input__inner {
    border-color: #f56c6c;
  }
  .import-info {
    color: #999;
    ::v-deep .sa-tooltip__content {
      right: 0;
    }
  }
}
.params-form-btns {
  margin: 20px 0 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.error-wrap {
  color: #f56c6c;
  height: 20px;
  line-height: 20px;
}
</style>
