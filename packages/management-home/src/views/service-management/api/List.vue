<template>
  <div>
    <list-wrap :loading="loading" :inProject="false" :empty="list.length === 0" :hasCreateAuth="false">
      <el-table :data="list" style="width: 100%" row-key="$id" default-expand-all class="apis-table">
        <el-table-column prop="name" label="接口名称">
          <template #default="scope">
            <span v-if="editId !== scope.row.$id">{{ scope.row.name }}</span>
            <el-input
              placeholder="请输入接口名称"
              v-model.trim="scope.row.name"
              maxlength="256"
              v-else
              :ref="(ref) => (inputRefs[`name.${scope.row.$id}`] = ref)"
              @input="() => clearError(`name.${scope.row.$id}`)"
              @change="(value) => handleInputChange('name', scope.row.$id, value)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="method" label="请求方式" width="170">
          <template #default="scope">
            <span v-if="editId !== scope.row.$id">{{ scope.row.method }}</span>
            <el-select v-else placeholder="请选择请求方式" v-model="scope.row.method">
              <el-option v-for="item in methodTypes" :key="item" :value="item" :label="item"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="modelId" label="数据对象" width="200">
          <template #default="scope">
            <span v-if="scope.row.isSystem">通用</span>
            <template v-else>
              <span v-if="editId !== scope.row.$id">{{ scope.row.methodType }}</span>
              <el-select v-else placeholder="请选择数据对象" v-model="scope.row.methodType">
                <el-option
                  v-for="(model, index) in modelList"
                  :key="index"
                  :label="model.name"
                  :value="model.id"
                ></el-option>
              </el-select>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="url" label="Path">
          <template #default="scope">
            <span v-if="editId !== scope.row.$id">{{ scope.row.url }}</span>
            <el-input
              placeholder="请输入Path路径"
              v-model.trim="scope.row.url"
              maxlength="500"
              v-else
              :ref="(ref) => (inputRefs[`url.${scope.row.$id}`] = ref)"
              @input="() => clearError(`url.${scope.row.$id}`)"
              @change="(value) => handleInputChange('url', scope.row.$id, value)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="description" label="接口描述">
          <template #default="scope">
            <tooltip v-if="editId !== scope.row.$id" :content="scope.row.description"></tooltip>
            <el-input
              v-else
              placeholder="请输入接口描述"
              v-model.trim="scope.row.description"
              maxlength="512"
              :ref="(ref) => (inputRefs[`description.${scope.row.$id}`] = ref)"
              @input="() => clearError(`description.${scope.row.$id}`)"
              @change="(value) => handleInputChange('description', scope.row.$id, value)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="actions" label="操作" align="right" width="180">
          <template #default="scope">
            <template v-if="!scope.row.isSystem">
              <template v-if="scope.row.id && editId !== scope.row.$id">
                <el-button type="text" @click="handleAdd(scope.row)">添加</el-button>
                <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
                <el-button type="text">参数</el-button>
                <el-button type="text" @click="handleRemove(scope.row)">删除</el-button>
              </template>
              <template v-else>
                <el-button type="text" @click="handleSave(scope.row)">保存</el-button>
                <el-button type="text" @click="handleCancel(scope.row)">取消</el-button>
              </template>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <div class="error-wrap">{{ formError }}</div>
    </list-wrap>
  </div>
</template>
<script>
import { defineComponent, ref } from 'vue';
import { ElMessageBox } from 'element-plus';
import { METHOD_TYPES } from './config';
import { validName, validUrl, validDescription, parseList } from './util';
import { getServiceApis } from '@/api/servers';
import _ from 'lodash';
export default defineComponent({
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
  setup(props) {
    const loading = ref(false);
    const isAdd = ref(false);
    const editId = ref('');
    const sourceList = ref([]);
    const list = ref([]);
    const inputRefs = ref({});
    const formError = ref('');
    const fetchList = async () => {
      loading.value = true;
      const { data } = await getServiceApis(props.id);
      const apiList = parseList(data);
      sourceList.value = _.cloneDeep(apiList);
      list.value = _.cloneDeep(apiList);
      loading.value = false;
    };

    fetchList();

    // 清除错误
    const clearError = (refId) => {
      try {
        const ref = inputRefs.value[refId];
        ref.$el.classList.remove('is-error');
      } catch (e) {
        console.log(e);
      }
    };

    // validate after input change
    const handleInputChange = (field, id, value) => {
      formError.value = '';
      let valid = false;
      switch (field) {
        case 'name':
          valid = validName(value, list.value, id);
          break;
        case 'url':
          valid = validUrl(value, list.value, id);
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

    const beforeEditOrAdd = async () => {
      if (editId.value || isAdd.value) {
        return ElMessageBox.confirm(`有未保存的更改，确定放弃更改吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        });
      }
      return Promise.resolve(true);
    };

    /**
     * 移除无效的行
     */
    const removeEmptyAddRows = () => {
      for (let i = 0, len = list.value.length; i < len; i++) {
        const row = list.value[i];
        if (row && !row.id) {
          list.value.splice(i, 1);
          i = i - 1;
        }
      }
    };

    // 新增
    const handleAdd = async (row) => {
      try {
        await beforeEditOrAdd();
        removeEmptyAddRows();
        isAdd.value = true;
        const $id = 'aaa';
        const index = list.value.findIndex((item) => item.$id === row.$id);
        console.log(index);
        list.value.splice(index + 1, 0, {
          $id,
        });
        editId.value = $id;
      } catch (e) {
        console.log(e);
      }
    };

    // 编辑
    const handleEdit = async (row) => {
      try {
        await beforeEditOrAdd();
        removeEmptyAddRows();
        isAdd.value = false;
        editId.value = row.$id;
      } catch (e) {}
    };

    // 删除
    const handleRemove = (row) => {
      ElMessageBox.confirm(`确定删除接口 ${row.name} 吗？`, '提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        // todo
      });
    };

    // 保存
    const handleSave = (row) => {
      console.log(row);
    };

    // 取消
    const handleCancel = () => {
      isAdd.value = false;
      editId.value = '';
      list.value = _.cloneDeep(sourceList.value);
    };

    return {
      isAdd,
      editId,
      list,
      inputRefs,
      formError,
      loading,
      methodTypes: [...METHOD_TYPES],
      handleAdd,
      handleEdit,
      handleRemove,
      clearError,
      handleInputChange,
      handleSave,
      handleCancel,
      validName,
    };
  },
});
</script>
<style lang="scss" scoped>
.apis-table {
  ::v-deep .el-select,
  ::v-deep .el-input {
    width: 100%;
  }
  ::v-deep .is-error .el-input__inner {
    border-color: #f56c6c;
  }
}
.error-wrap {
  color: #f56c6c;
  height: 20px;
  line-height: 20px;
  margin: 5px 0;
}
</style>
