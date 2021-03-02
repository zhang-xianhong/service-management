<template>
  <el-form ref="formRef" :model="form" :rules="formRules" label-width="120px">
    <el-form-item prop="name" label="数据对象名称" required>
      <el-input v-model="form.name" placeholder="请输入英文名称，作为唯一标识，不可重复"></el-input>
    </el-form-item>
    <el-form-item prop="description" label="数据对象描述" required>
      <el-input v-model="form.description" placeholder="请输入中文名称"></el-input>
    </el-form-item>
    <el-form-item label="属性" prop="fields">
      <model-property ref="propertyRef" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { ref, watchEffect } from 'vue';
import ModelProperty from './ModelProperty.vue';
import { createModel } from '../../../../api/schema/model';
import { ElMessage } from 'element-plus';

export default {
  components: {
    ModelProperty,
  },
  props: {
    data: {
      type: Object,
    },
  },
  setup() {
    // 表单相关数据
    // const formState = {
    //   name: '',
    //   description: '',
    // }
    const form = {};
    const propertyRef = ref();
    const formRef = ref();
    const formRules = {
      name: [{ required: true, message: '请输入数据对象名称', trigger: 'blur' }],
      description: [{ required: true, message: '请输入数据对象描述', trigger: 'blur' }],
    };
    const onSubmit = () => {
      formRef.value.validate(async (valid: boolean) => {
        if (!valid) {
          return;
        }
        const saveData = {
          ...form,
          fields: [...propertyRef.value.properties],
        };
        const isFieldError = saveData.fields.some((field: any) => {
          if (!field.name) {
            ElMessage.error('属性名称不能为空');
            return true;
          }
          if (!field.description) {
            ElMessage.error('属性描述不能为空');
            return true;
          }
          if (!field.type) {
            ElMessage.error('请选择数据类型');
            return true;
          }
          return false;
        });
        if (isFieldError) {
          return;
        }
        try {
          await createModel(saveData);
        } catch (error) {}
      });
    };
    const handleValueChange = () => {
      // console.log(prop.value)
    };
    watchEffect(() => {
      // console.log(22222, props.data)
    });
    return {
      form,
      onSubmit,
      propertyRef,
      formRef,
      formRules,
      handleValueChange,
    };
  },
  watch: {
    value: {
      handler: 'handleValueChange',
      deep: true,
    },
  },
};
</script>
