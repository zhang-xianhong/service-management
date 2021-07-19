<template>
  <div>
    <el-radio-group v-model="paramsMethod" style="margin-bottom: 20px">
      <el-radio-button :label="item" v-for="item in paramsMethods" :key="item" class="param-type">
        {{ item }}
      </el-radio-button>
    </el-radio-group>

    <list-wrap :loading="loading" :inProject="false" :empty="list.length === 0" :hasCreateAuth="false">
      <el-table
        :data="list"
        style="width: 100%"
        row-key="$id"
        default-expand-all
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        class="params-table"
      >
        <el-table-column prop="name" label="参数" class-name="col-inline">
          <template #default="scope">
            <span v-if="scope.row.readonly">{{ scope.row.name }}</span>
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
        <el-table-column prop="type" label="参数类型" width="180">
          <template #default="scope">
            <el-select
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
                :key="item.value"
                :value="item.value"
                :label="item.name"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="required" label="是否必填" width="150">
          <template #default="scope">
            <el-select placeholder="请选择" v-model="scope.row.required">
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
            <el-input
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
        <el-table-column prop="description" label="参数描述">
          <template #default="scope">
            <el-input
              placeholder="请输入参数描述"
              v-model.trim="scope.row.description"
              maxlength="512"
              :ref="(ref) => (inputRefs[`description.${scope.row.$id}`] = ref)"
              @input="() => clearError(`description.${scope.row.$id}`)"
              @change="(value) => handleInputChange('description', scope.row.$id, value)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="actions" label="操作" align="right" width="150">
          <template #default="scope">
            <el-button type="text" @click="handleAdd(scope.row)">添加</el-button>
            <el-button type="text" v-if="scope.row.type === 'object'">引入</el-button>
            <el-button type="text" v-else-if="scope.row.type !== 'array'" @click="handleSetting(scope.row)"
              >设置</el-button
            >
            <el-button type="text" @click="handleRemove(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="error-wrap">{{ formError }}</div>

      <div class="code-preview">
        <h3 class="code-preview__title">
          预览
          <el-button type="text">生成预览</el-button>
        </h3>
        <pre v-highlight><code v-html="previewCode" class="json"></code></pre>
      </div>

      <div class="params-form-btns">
        <el-button type="primary" @click="handleSave">确定</el-button>
        <el-button>取消</el-button>
      </div>
    </list-wrap>
    <stringSettingDialog ref="stringSettingDialog" @change="handleConfigChange" />
    <intSettingDialog ref="intSettingDialog" @change="handleConfigChange" />
    <floatSettingDialog ref="floatSettingDialog" @change="handleConfigChange" />
    <dateSettingDialog ref="dateSettingDialog" @change="handleConfigChange" />
    <booleanSettingDialog ref="booleanSettingDialog" @change="handleConfigChange" />
  </div>
</template>
<script>
import { defineComponent, ref, computed } from 'vue';
import { getParamsMethods, postParamsMethods, PARAMS_TYPES } from './config';
import StringSettingDialog from '../settings/String.vue';
import FloatSettingDialog from '../settings/Float.vue';
import IntSettingDialog from '../settings/Int.vue';
import DateSettingDialog from '../settings/Date.vue';
import BooleanSettingDialog from '../settings/Boolean.vue';
import {
  genParam,
  findAndUpdateParams,
  paramsToExample,
  validParams,
  validName,
  validExample,
  validDescription,
} from './util';
export default defineComponent({
  name: 'RequestList',
  components: {
    StringSettingDialog,
    FloatSettingDialog,
    IntSettingDialog,
    DateSettingDialog,
    BooleanSettingDialog,
  },
  props: {
    methodType: {
      type: String,
      default: 'get',
    },
  },
  setup(props) {
    const loading = ref(false);
    const list = ref([genParam()]);
    const paramsMethod = ref('query');
    const inputRefs = ref({});
    const formError = ref('');
    const stringSettingDialog = ref(null);
    const intSettingDialog = ref(null);
    const floatSettingDialog = ref(null);
    const dateSettingDialog = ref(null);
    const booleanSettingDialog = ref(null);
    const paramsMethods = computed(() => {
      if (props.methodType === 'get') {
        return getParamsMethods;
      }
      return postParamsMethods;
    });

    const handleAdd = (row) => {
      findAndUpdateParams(list.value, row.$id, (items, index) => {
        items.splice(index + 1, 0, genParam());
      });
    };
    const handleRemove = (row) => {
      findAndUpdateParams(list.value, row.$id, (items, index) => {
        items.splice(index, 1);
      });
    };
    const handleTypeChange = (row, value) => {
      if (value === 'array' || value === 'object') {
        const children = [];
        if (value === 'array') {
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
    };

    const handleSave = () => {
      const res = validParams(list.value);
      formError.value = '';
      if (res) {
        const error = res[0];
        const ref = inputRefs.value[`${error.field}.${error.id}`];
        ref.$el.classList.add('is-error');
        ref.focus();
        formError.value = error.message;
      }
    };

    const clearError = (refId) => {
      try {
        const ref = inputRefs.value[refId];
        ref.$el.classList.remove('is-error');
      } catch (e) {
        console.log(e);
      }
    };

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
        case 'description':
          valid = validDescription(value);
          break;
      }
      if (valid) {
        const ref = inputRefs.value[`${field}.${id}`];
        ref.$el.classList.add('is-error');
        formError.value = valid;
      }
    };

    // 设置
    const handleSetting = (row) => {
      let ref = null;
      switch (row.type) {
        case 'string':
          ref = stringSettingDialog.value;
          break;
        case 'float':
          ref = floatSettingDialog.value;
          break;
        case 'int':
          ref = intSettingDialog.value;
          break;
        case 'boolean':
          ref = booleanSettingDialog.value;
          break;
        case 'date':
          ref = dateSettingDialog.value;
          break;
      }
      if (ref) {
        ref.handleOpen(row);
      }
    };

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

    const previewCode = computed(() => JSON.stringify(paramsToExample(list.value, {}), null, 4));
    return {
      paramsMethod,
      paramsMethods,
      paramTypes: [...PARAMS_TYPES],
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
      handleAdd,
      handleRemove,
      handleTypeChange,
      handleSave,
      clearError,
      handleInputChange,
      handleSetting,
      handleConfigChange,
      stringSettingDialog,
      intSettingDialog,
      floatSettingDialog,
      booleanSettingDialog,
      dateSettingDialog,
    };
  },
});
</script>
<style lang="scss" scoped>
.param-type {
  text-transform: capitalize;
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
