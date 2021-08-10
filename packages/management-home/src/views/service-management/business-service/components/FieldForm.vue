<template>
  <div class="drawer-content">
    <div class="drawer-content__main">
      <list-wrap :loading="modelFieldsLoading" :inProject="false" :empty="fields.length === 0" :hasCreateAuth="false">
        <el-table :data="fields" height="100%">
          <el-table-column type="index" width="50"></el-table-column>
          <el-table-column prop="name" label="属性名称">
            <template #default="scope">
              <span v-if="isReadonly">{{ scope.row.name }}</span>
              <el-input v-model.trim="scope.row.name" :disabled="isFieldDisabled(scope)" v-else></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="description" label="属性描述">
            <template #default="scope">
              <span v-if="isReadonly">{{ scope.row.description }}</span>
              <el-input v-model.trim="scope.row.description" :disabled="isFieldDisabled(scope)" v-else></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="type" label="数据类型">
            <template #default="scope">
              <span v-if="isReadonly">{{ getModelTypeName(scope.row.typeId) }}</span>
              <el-select v-model="scope.row.typeId" :disabled="isFieldDisabled(scope)" v-else>
                <el-option
                  v-for="type in allTypes"
                  :key="type.id"
                  :label="type.name"
                  :value="type.id"
                  :disabled="type.id === 1"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="notNull" label="非空" width="60">
            <template #default="scope">
              <span v-if="isReadonly">{{ scope.row.notNull ? '是' : '否' }}</span>
              <el-checkbox v-model="scope.row.notNull" :disabled="isFieldDisabled(scope)" v-else></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column prop="isUnique" label="唯一" width="60">
            <template #default="scope">
              <span v-if="isReadonly">{{ scope.row.isUnique ? '是' : '否' }}</span>
              <el-checkbox v-model="scope.row.isUnique" :disabled="isFieldDisabled(scope)" v-else></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column prop="isIndex" label="索引" width="60">
            <template #default="scope">
              <span v-if="isReadonly">{{ scope.row.isIndex ? '是' : '否' }}</span>
              <el-checkbox v-model="scope.row.isIndex" :disabled="isFieldDisabled(scope)" v-else></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column
            prop="operations"
            label="操作"
            width="180"
            align="right"
            v-if="getShowBool('moduleUpdate') && !isRefrenceService && isInEdit"
          >
            <template #default="scope">
              <el-button type="text" @click="add(scope.$index)" class="operator" v-if="scope.$index === 0"
                >添加</el-button
              >
              <el-button
                @click="remove(scope.$index)"
                class="operator"
                :disabled="isFieldDisabled(scope)"
                v-if="fields.length > 0"
                type="text"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </list-wrap>
    </div>
    <div class="drawer-content__btns">
      <template v-if="getShowBool('moduleUpdate') && !isRefrenceService">
        <el-button type="primary" @click="save" v-if="isInEdit">确定</el-button>
        <el-button type="primary" @click="toggleIsInEdit(true)" v-else>编辑</el-button>
      </template>
      <el-button @click="handleCancel">取消</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, getCurrentInstance, inject, onMounted, Ref, ref, watchEffect } from 'vue';
import { getDataTypesAll } from '@/api/settings/data-types';
import { updateFields } from '@/api/schema/model';
import { getShowBool } from '@/utils/permission-show-module';
import _ from 'lodash/fp';
import { isRefrence } from '../utils/permisson';
import { ElMessage, ElMessageBox } from 'element-plus';

export default defineComponent({
  name: 'ColumnForm',
  props: {
    modelFieldsLoading: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, context) {
    // 组件实例
    const instance = getCurrentInstance();
    const currentModel = inject('currentModel') as Ref<any>;
    const serviceId = inject('serviceId') as number;
    const afterUpdate = inject('afterUpdate') as Function;
    const isRefrenceService = inject(isRefrence);
    const isInEdit = ref(false);
    const fields: Ref<Array<any>> = ref([]);
    watchEffect(() => {
      fields.value = _.cloneDeep(currentModel.value?.fields || []);
    });
    const add = (index: number) => {
      console.log(index);
      fields.value.splice(0, 0, {
        name: '',
        description: '',
        type: '',
        isUnique: false,
        notNull: false,
        isIndex: false,
      });
    };
    const remove = (index: number) => {
      fields.value.splice(index, 1);
    };

    const allTypes = ref([]);
    const initTypeOption = async () => {
      const { code, data } = await getDataTypesAll();
      if (code === 0) {
        allTypes.value = data;
      }
    };
    const back = () => {
      context.emit('back');
    };
    const save = async () => {
      // 过滤空和非法字符
      const res = fields.value.find((item: any) => {
        const { description, name, typeId } = item;
        return !(description && name && typeId && /^([a-z]|[a-z]+[A-Z][a-z]+)+$/.test(name));
      });
      if (res) {
        let msg = '';
        const { description, name } = res;
        if (!name) {
          msg = '属性名不能为空！';
        } else if (!/^([a-z]|[a-z]+[A-Z][a-z]+)+$/.test(name)) {
          msg = '属性名称填写错误，必须是小驼峰格式';
        } else if (!description) {
          msg = '属性描述不能为空！';
        } else {
          msg = '数据类型不能为空！';
        }
        (instance as any).proxy.$message({
          type: 'warning',
          message: msg,
        });
        return;
      }

      const inputData = _.flow(
        _.filter((field: any) => !field.isSystem),
        _.map(
          _.pick([
            'id',
            'name',
            'description',
            'typeId',
            'notNull',
            'isUnique',
            'isIndex',
            'isParticipleSupport',
            'isPinyinSupport',
          ]),
        ),
      )(fields.value);

      if (inputData.length === 0) {
        ElMessage.error('请至少添加一个属性');
        return;
      }

      inputData.forEach((x: any) => {
        if (!x.notNull) {
          // eslint-disable-next-line no-param-reassign
          x.notNull = false;
        }
      });
      const { code } = await updateFields(currentModel.value?.id, {
        serviceId,
        fields: inputData,
      });
      if (code === 0) {
        currentModel.value.fields = fields.value;
        ElMessage.success('保存成功');
        isInEdit.value = false;
        afterUpdate();
      }
    };
    const isFieldDisabled = (scope: any) => scope.row.isSystem || scope.row.typeId === 1;

    onMounted(() => {
      initTypeOption();
    });

    // 获取类型名称
    const getModelTypeName = (id: number) => {
      const type: any = allTypes.value.find((item: any) => item.id === id);
      return type?.name || '';
    };

    const isReadonly = computed(() => !isInEdit.value);
    const toggleIsInEdit = (value: boolean) => (isInEdit.value = value);
    const beforeClose = () => {
      isInEdit.value = false;
    };
    const handleCancel = () => {
      if (isInEdit.value) {
        ElMessageBox.confirm(`编辑中的数据尚未保存，是否退出?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(async () => {
          beforeClose();
          context.emit('back');
        });
      } else {
        beforeClose();
        context.emit('back');
      }
    };

    return {
      fields,
      add,
      remove,
      allTypes,
      back,
      save,
      isFieldDisabled,
      getShowBool,
      isRefrenceService,
      isInEdit,
      isReadonly,
      toggleIsInEdit,
      handleCancel,
      getModelTypeName,
    };
  },
});
</script>

<style lang="scss" scoped>
.operator {
  cursor: pointer;
  & + & {
    margin-left: 10px;
  }
}
.form-field__btns {
  padding: 5px;
  text-align: center;
}
.column-table {
  &::v-deep {
    .el-table {
      .cell {
        line-height: 30px;
      }
    }
  }
}
</style>
