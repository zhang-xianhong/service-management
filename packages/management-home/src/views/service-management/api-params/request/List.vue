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
            <el-input placeholder="请输入参数名称" v-model.trim="scope.row.name" v-else />
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
            <el-input placeholder="请输入参数示例" v-model.trim="scope.row.example" />
          </template>
        </el-table-column>
        <el-table-column prop="description" label="参数描述">
          <template #default="scope">
            <el-input placeholder="请输入参数描述" v-model.trim="scope.row.description" />
          </template>
        </el-table-column>
        <el-table-column prop="actions" label="操作" align="right" width="150">
          <template #default="scope">
            <el-button type="text" @click="handleAdd(scope.row)">添加</el-button>
            <el-button type="text" v-if="scope.row.type === 'object'">引入</el-button>
            <el-button type="text" v-else>设置</el-button>
            <el-button type="text" @click="handleRemove(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="code-preview">
        <pre v-highlight><code v-html="previewCode" class="json"></code></pre>
      </div>
    </list-wrap>
  </div>
</template>
<script>
import { defineComponent, ref, computed } from 'vue';
import { getParamsMethods, postParamsMethods, PARAMS_TYPES } from './config';
import { genParam, findAndUpdateParams, paramsToExample } from './util';
export default defineComponent({
  name: 'RequestList',
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
      handleAdd,
      handleRemove,
      handleTypeChange,
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
}
</style>
