<template>
  <div>
    <list-wrap
      :loading="loading"
      :inProject="false"
      :empty="list.length === 0"
      :hasCreateAuth="true"
      :handleCreate="
        () => {
          handleAdd();
        }
      "
    >
      <el-table
        :data="list"
        style="width: 100%"
        row-key="$id"
        default-expand-all
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        class="params-table"
      >
        <el-table-column prop="name" label="属性" class-name="col-inline is-required">
          <template #default="scope">
            <span v-if="scope.row.readonly || scope.row.builtin">{{ scope.row.name }}</span>
            <el-input
              placeholder="请输入属性名称"
              v-model.trim="scope.row.name"
              maxlength="50"
              v-else
              :ref="(ref) => (inputRefs[`name.${scope.row.$id}`] = ref)"
              @input="() => clearError(`name.${scope.row.$id}`)"
              @change="(value) => handleInputChange('name', scope.row.$id, value)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="dtoName" align="right">
          <template #default="scope">
            <span v-if="scope.row.dtoName" class="import-info">
              来源：<service-name :name="`${scope.row.serviceName}_${scope.row.dtoName}`"></service-name>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="属性类型" width="180" class-name="is-required">
          <template #default="scope">
            <span v-if="scope.row.readonly">{{ getParamTypeName(scope.row.type) }}</span>
            <el-select
              placeholder="请选择属性类型"
              v-model="scope.row.type"
              v-else
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
        <el-table-column prop="required" label="是否必填" width="150" class-name="is-required">
          <template #default="scope">
            <span v-if="scope.row.readonly">{{ scope.row.required ? '是' : '否' }}</span>
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
        <el-table-column prop="example" label="属性示例">
          <template #default="scope">
            <span v-if="scope.row.type === 'Array' || scope.row.type === 'Object'">{{ scope.row.example }}</span>
            <el-input
              v-else
              placeholder="请输入示例值"
              v-model.trim="scope.row.example"
              minlength="1"
              maxlength="20"
              :ref="(ref) => (inputRefs[`example.${scope.row.$id}`] = ref)"
              @input="() => clearError(`example.${scope.row.$id}`)"
              @change="(value) => handleInputChange('example', scope.row.$id, value)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="description" label="属性描述">
          <template #default="scope">
            <el-input
              placeholder="请输入属性描述"
              v-model.trim="scope.row.desc"
              maxlength="512"
              :ref="(ref) => (inputRefs[`description.${scope.row.$id}`] = ref)"
              @input="() => clearError(`description.${scope.row.$id}`)"
              @change="(value) => handleInputChange('description', scope.row.$id, value)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="actions" label="操作" align="right" width="150">
          <template #default="scope">
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
        </el-table-column>
      </el-table>
      <div class="error-wrap">{{ formError }}</div>
    </list-wrap>

    <div class="code-preview">
      <h3 class="code-preview__title">
        预览
        <el-button type="text" @click="handlePreview" :disabled="list.length === 0">生成预览</el-button>
      </h3>
      <pre
        v-highlight
        v-if="list.length > 0"
      ><code v-html="previewCode" class="json" style="background: #f5f5f5; padding: 10px;"></code></pre>
    </div>

    <StringSettingDialog ref="stringSettingDialog" @change="handleConfigChange" />
    <IntSettingDialog ref="intSettingDialog" @change="handleConfigChange" />
    <FloatSettingDialog ref="floatSettingDialog" @change="handleConfigChange" />
    <DateSettingDialog ref="dateSettingDialog" @change="handleConfigChange" />
    <BooleanSettingDialog ref="booleanSettingDialog" @change="handleConfigChange" />
    <SelectDtoProperties
      ref="dtoPropertiesDialog"
      @on-confirm="handleDtoConfirm"
      :referenceType="currentQuoteType"
      :dto-id="dtoId"
    ></SelectDtoProperties>
  </div>
</template>
<script>
import { defineComponent, ref, computed, watch, inject } from 'vue';
import { CONTENT_TYPES, getParamTypeName, PARAMS_TYPE_BODY } from '../api-params/config';
import StringSettingDialog from '../api-params/settings/String.vue';
import FloatSettingDialog from '../api-params/settings/Float.vue';
import IntSettingDialog from '../api-params/settings/Int.vue';
import DateSettingDialog from '../api-params/settings/Date.vue';
import BooleanSettingDialog from '../api-params/settings/Boolean.vue';
import SelectDtoProperties from './SelectDtoProperties.vue';
import { dtoUniqueId } from './dto';
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
  parseList,
} from '../api-params/util';
import { ElMessage } from 'element-plus';

export default defineComponent({
  name: 'PropertiesList',
  components: {
    StringSettingDialog,
    FloatSettingDialog,
    IntSettingDialog,
    DateSettingDialog,
    BooleanSettingDialog,
    SelectDtoProperties,
  },
  props: {
    propertiesList: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['onChange'],
  setup(props) {
    const loading = ref(false);
    const list = ref([]);
    const dtoId = inject(dtoUniqueId);
    const contentType = ref('json');
    const inputRefs = ref({});
    const formError = ref('');
    const previewCode = ref('');
    const stringSettingDialog = ref(null);
    const intSettingDialog = ref(null);
    const floatSettingDialog = ref(null);
    const dateSettingDialog = ref(null);
    const booleanSettingDialog = ref(null);
    const paramsDefine = ref(null);
    const dtoPropertiesDialog = ref(null);

    const updateParamsDefine = () => {
      paramsDefine.value = genTreeDefine(list.value);
    };
    // 添加
    const handleAdd = (row) => {
      if (!row?.$id) {
        list.value.push(genParam());
      } else {
        findAndUpdateParams(list.value, row.$id, (items, index) => {
          items.splice(index + 1, 0, genParam());
        });
      }
      updateParamsDefine();
    };

    // 移除
    const handleRemove = (row) => {
      findAndUpdateParams(list.value, row.$id, (items, index) => {
        items.splice(index, 1);
      });
      updateParamsDefine();
    };

    // 类型改变
    const handleTypeChange = (row, value) => {
      if (value === 'Array' || value === 'Object') {
        const children = [];
        if (value === 'Array') {
          children.push(
            genParam({
              readonly: true,
              name: 'item',
            }),
          );
        } else {
          children.push(genParam());
        }
        findAndUpdateParams(list.value, row.$id, (items, index, item) => {
          items.splice(index, 1, {
            ...item,
            example: '',
            config: {},
            children,
          });
        });
      } else {
        findAndUpdateParams(list.value, row.$id, (items, index, item) => {
          // eslint-disable-next-line no-param-reassign
          delete item.children;
          items.splice(index, 1, item);
        });
      }
      updateParamsDefine();
    };

    // 校验
    const validator = () => {
      const res = validParams(list.value, paramsDefine.value);
      formError.value = '';
      if (res) {
        const error = res[0];
        const ref = inputRefs.value[`${error.field}.${error.id}`];
        ref.$el.classList.add('is-error');
        ref.focus();
        formError.value = error.message;
        return false;
      }
      return true;
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
      clearError();
      formError.value = '';
      // TODO. 将list.value重置为初始化值
    };

    // validate after input change
    const handleInputChange = (field, id, value) => {
      formError.value = '';
      let valid = false;
      switch (field) {
        case 'name':
          valid = validName(value, {
            id,
            defines: paramsDefine.value,
          });
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
        ref.handleOpen(row, true);
      }
    };

    // 设置
    const handleConfigChange = ({ id, config }) => {
      findAndUpdateParams(list.value, id, (items, index, item) => {
        items.splice(index, 1, {
          ...item,
          config: {
            ...config,
          },
        });
      });
    };

    // 可选的参数类型
    const paramTypes = computed(() => [...PARAMS_TYPE_BODY]);

    // 禁用类型
    const isDisableParamType = (type, row) => {
      if ((type !== 'Array' && type !== 'Object') || !paramsDefine.value) {
        return false;
      }
      const define = paramsDefine.value[row.$id];
      if (define.level >= 3) {
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
        const json = paramsToExample(list.value, {});
        // eslint-disable-next-line @typescript-eslint/naming-convention
        previewCode.value = JSON.stringify(json, null, 4);
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
      if (define.isReadonlyImport) return false; // fix #90774013
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

    const handleOpenDto = (row, type) => {
      // type 1:只读引入 2: 克隆引入
      currentQuoteParamId.value = row.$id;
      currentQuoteType.value = type;

      // eslint-disable-next-line no-unused-expressions
      dtoPropertiesDialog?.value.openDialog();
    };

    const paramsToSaveData = (params) => {
      const parse = (items) =>
        items.map((item) => {
          const { $id, config, readonly, ...dto } = item;
          const newItem = {
            ...dto,
            config: JSON.stringify(config),
          };
          if (item.children && item.children.length) {
            newItem.children = parse(item.children);
          }
          return newItem;
        });
      return parse(params);
    };

    /**
     *  properties 添加到目标对象下,有两种引入方式，
     *  克隆引入
     *    拷贝属性至当前的dto list下面，和当前的属性合并
     *  只读引入
     *    替换当前的 dto list下面，但是将这个dto
     */
    const handleDtoConfirm = (data) => {
      // 读取选中的节点数据

      const currentParamId = currentQuoteParamId.value;
      if (!currentParamId) {
        return;
      }
      const params = dtoToParams(data, currentQuoteType.value);

      findAndUpdateParams(list.value, currentParamId, (items, index, item) => {
        item.children.push(...params);
        items.splice(index, 1, {
          ...item,
        });
      });

      updateParamsDefine();

      dtoPropertiesDialog.value.closeDialog();
    };

    const initEdit = () => {
      list.value = parseList([...props.propertiesList]);
      updateParamsDefine();
      handlePreview();
    };
    initEdit();
    watch(
      () => props.propertiesList,
      () => {
        initEdit();
      },
    );

    // getData 提供外部调用
    const getData = () => {
      const properties = paramsToSaveData(list.value);
      const res = validator();
      if (res) {
        if (properties.length === 0) {
          ElMessage.error('请至少添加一个属性');
          return false;
        }
        return properties;
      }
      return false;
    };
    return {
      paramTypes,
      contentTypes: [...CONTENT_TYPES],
      dtoPropertiesDialog,
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
      getParamTypeName,
      handleAdd,
      handleRemove,
      handleTypeChange,
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
      paramsDefine,
      isDisableParamType,
      handlePreview,
      canAdd,
      canDel,
      handleOpenDto,
      handleDtoConfirm,
      currentQuoteType,
      getData,
      dtoId,
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
