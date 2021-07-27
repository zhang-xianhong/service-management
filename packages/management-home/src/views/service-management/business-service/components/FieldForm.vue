<template>
  <div style="background: #fff">
    <div style="width: 100%; height: 330px; position: relative" class="column-table">
      <el-table :data="fields" :height="330">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="name" label="属性名称">
          <template #default="scope">
            <el-input v-model.trim="scope.row.name" :disabled="isFieldDisabled(scope)"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="属性描述">
          <template #default="scope">
            <el-input v-model.trim="scope.row.description" :disabled="isFieldDisabled(scope)"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="数据类型">
          <template #default="scope">
            <el-select v-model="scope.row.typeId" :disabled="isFieldDisabled(scope)">
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
            <el-checkbox v-model="scope.row.notNull" :disabled="isFieldDisabled(scope)"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column prop="isUnique" label="唯一" width="60">
          <template #default="scope">
            <el-checkbox v-model="scope.row.isUnique" :disabled="isFieldDisabled(scope)"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column prop="isIndex" label="索引" width="60">
          <template #default="scope">
            <el-checkbox v-model="scope.row.isIndex" :disabled="isFieldDisabled(scope)"></el-checkbox>
          </template>
        </el-table-column>
        <!--        <el-table-column prop="isParticipleSupport" label="分词" width="60">-->
        <!--          <template #default="scope">-->
        <!--            <el-checkbox v-model="scope.row.isParticipleSupport" :disabled="isFieldDisabled(scope)"></el-checkbox>-->
        <!--          </template>-->
        <!--        </el-table-column>-->
        <!--        <el-table-column prop="isPinyinSupport" label="拼音" width="60">-->
        <!--          <template #default="scope">-->
        <!--            <el-checkbox v-model="scope.row.isPinyinSupport" :disabled="isFieldDisabled(scope)"></el-checkbox>-->
        <!--          </template>-->
        <!--        </el-table-column>-->
        <el-table-column prop="operations" label="操作" width="180" v-if="getShowBool('add') && !isRefrenceService">
          <template #default="scope">
            <a @click="add(scope.$index)" class="operator" v-if="scope.$index === 0">添加</a>
            <a
              @click="remove(scope.$index)"
              class="operator"
              :disabled="isFieldDisabled(scope)"
              v-if="scope.$index !== 0"
              >删除</a
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="form-field__btns">
      <el-button type="primary" @click="save" v-if="getShowBool('add') && !isRefrenceService">确定</el-button>
      <el-button @click="back">取消</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, inject, Ref, watchEffect, getCurrentInstance } from 'vue';
import { getDataTypesAll } from '@/api/settings/data-types';
import { updateFields } from '@/api/schema/model';
import { getShowBool } from '@/utils/permission-show-module';
import _ from 'lodash/fp';
import { isRefrence } from '../utils/permisson';
export default defineComponent({
  name: 'ColumnForm',
  setup(props, context) {
    // 组件实例
    const instance = getCurrentInstance();
    const currentModel = inject('currentModel') as Ref<any>;
    const serviceId = inject('serviceId') as number;
    const afterUpdate = inject('afterUpdate') as Function;
    const isRefrenceService = inject(isRefrence);
    const fields: Ref<Array<any>> = ref([]);
    watchEffect(() => {
      fields.value = _.cloneDeep(currentModel.value?.fields || []);
    });
    const modelId = currentModel.value.id;
    const add = (index: number) => {
      console.log(index);
      fields.value.splice(0, 0, {
        name: '',
        description: '',
        type: '',
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

      inputData.forEach((x: any) => {
        if (!x.notNull) {
          // eslint-disable-next-line no-param-reassign
          x.notNull = false;
        }
      });

      const { code } = await updateFields(modelId, {
        serviceId,
        fields: inputData,
      });
      if (code === 0) {
        currentModel.value.fields = fields.value;
        afterUpdate();
        context.emit('back');
      }
    };
    const isFieldDisabled = (scope: any) => scope.row.isSystem;

    onMounted(() => {
      initTypeOption();
    });
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
