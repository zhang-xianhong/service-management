<template>
  <el-form ref="formRef" :model="form" :rules="formRules" label-width="120px">
    <el-form-item prop="name" label="数据对象名称" required>
      <el-input v-model="form.name" placeholder="请输入英文名称，作为唯一标识，不可重复"></el-input>
    </el-form-item>
    <el-form-item prop="description" label="数据对象描述" required>
      <el-input v-model="form.description" placeholder="请输入中文名称"></el-input>
    </el-form-item>
    <el-form-item prop="demand" label="需求">
      <el-select v-model="form.demand" placeholder="请选择"></el-select>
    </el-form-item>
    <el-form-item prop="owner" label="负责人">
      <el-select v-model="form.owner" placeholder="请选择" multiple></el-select>
    </el-form-item>
    <el-form-item prop="classification" label="分类">
      <el-select v-model="form.classification" placeholder="请选择" multiple></el-select>
    </el-form-item>
    <el-form-item prop="tags" label="标签">
      <el-select v-model="form.tags" placeholder="请选择" multiple></el-select>
    </el-form-item>
    <el-form-item prop="detail" label="对象详情">
      <el-input type="textarea" :rows="3" placeholder="请输入数据对象描述，最多支持225个字符" v-model="form.detail">
      </el-input>
    </el-form-item>
    <el-form-item label="属性" prop="properties">
      <model-property v-model="form.properties" />
    </el-form-item>
    <el-form-item prop="operation">
      <el-button type="primary" @click="onSubmit">保存</el-button>
      <el-button type="text" @click="onCancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { ref, reactive, watchEffect } from 'vue';
import ModelProperty from './ModelProperty.vue';
import { createModel, updateModel } from '@/api/schema/model';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';

export default {
  name: 'BaseInfo',
  components: {
    ModelProperty,
  },
  props: {
    data: {
      type: Object,
      default: () => ({ data: {} }),
    },
    isCreate: {
      type: Boolean,
      default: true,
    },
  },
  setup(props: { data: any; isCreate: boolean }) {
    // 路由器获取
    const router = useRouter();
    const formRef = ref();

    // 表单内容相关数据
    const form = reactive({} as any);

    watchEffect(() => {
      form.id = props.data?.id || 0;
      form.name = props.data?.name || '';
      form.description = props.data?.description || '';
      form.demand = props.data?.demand || '';
      form.owner = props.data.owner ? props.data.owner.split(',') : [];
      form.classification = props.data.classification ? props.data.classification.split(',') : [];
      form.tags = props.data.tags ? props.data.tags.split(',') : [];
      form.detail = props.data?.detail || '';
      form.properties = props.data?.fields || [];
    });

    // 表单校验规则
    const formRules = {
      name: [{ required: true, message: '请输入数据对象名称', trigger: 'blur' }],
      description: [{ required: true, message: '请输入数据对象描述', trigger: 'blur' }],
    };

    // 对表单内容进行校验，主要校验数据对象模型名及属性名
    function validator(data: any): boolean {
      if (typeof data.name !== 'string' || /^[a-z]/g.test(data.name)) {
        ElMessage.error('数据对象名称必须遵守大驼峰命名规则！');
        return false;
      }
      const popertiesValidatorResult: boolean = data.fields.some((field: any) => {
        if (!field.name || typeof field.name !== 'string' || !/^[a-z]/g.test(field.name)) {
          ElMessage.error('属性名称不能为空且必须遵守小驼峰命名规则！');
          return false;
        }
        if (!field.description) {
          ElMessage.error('属性描述不能为空！');
          return false;
        }
        if (!field.typeId) {
          ElMessage.error('属性数据类型不能为空！');
          return false;
        }
        return true;
      });
      return popertiesValidatorResult;
    }

    // 新建数据对象模型
    async function createDataModel(data: object) {
      try {
        const result = await createModel(data);
        if ((result as any).code === 0) {
          ElMessage.success('保存成功');
          router.back();
        }
      } catch (error) {
        ElMessage.error('保存异常');
      }
    }

    // 更新数据对象模型
    async function updateDataModel(data: any) {
      try {
        const result = await updateModel(data, data.id);
        if ((result as any).code === 0) {
          ElMessage.success('保存成功');
          router.back();
        }
      } catch (error) {
        ElMessage.error('更新异常');
      }
    }

    // 表单提交
    function onSubmit(): void {
      formRef.value.validate(async (valid: boolean) => {
        if (!valid) {
          return;
        }
        const saveData = {
          ...form,
          owner: form.owner.join(','),
          classification: form.classification.join(','),
          tags: form.tags.join(','),
          fields: [...form.properties],
        };
        if (validator(saveData)) {
          if (props.isCreate) {
            await createDataModel(saveData);
          } else {
            await updateDataModel(saveData);
          }
        }
      });
    }

    // 取消修改
    function onCancel(): void {
      router.back();
    }

    return {
      form,
      formRef,
      formRules,
      onSubmit,
      onCancel,
    };
  },
};
</script>
