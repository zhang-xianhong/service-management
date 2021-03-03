<template>
  <div class="business-edit-basic">
    <el-form label-position="top" :model="basicForm" :rules="rules" ref="basicFormRef">
      <el-form-item label="服务名称" prop="name">
        <el-input placeholder="请输入英文命名，并以Svc结尾" v-model="basicForm.name"></el-input>
      </el-form-item>
      <el-form-item label="服务描述" prop="description">
        <el-input placeholder="请输入中文命名" v-model="basicForm.description"></el-input>
      </el-form-item>
      <el-form-item label="对应需求">
        <el-select placeholder="请选择对应需求" v-model="basicForm.demand" multiple></el-select>
      </el-form-item>
      <el-form-item label="负责人">
        <el-select placeholder="请选择负责人" v-model="basicForm.principal" multiple></el-select>
      </el-form-item>
      <el-form-item>
        支持版本管理
        <el-checkbox v-model="basicForm.versionManagement"></el-checkbox>
      </el-form-item>
      <el-form-item label="分类">
        <el-select placeholder="请选择分类" v-model="basicForm.classification"></el-select>
      </el-form-item>
      <el-form-item label="标签定义">
        <el-select placeholder="请选择标签" v-model="basicForm.tags" multiple></el-select>
      </el-form-item>
      <el-form-item label="服务详情">
        <el-input v-model="basicForm.detail" type="textarea" :rows="5"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { basicForm } from './form-data';

export default defineComponent({
  name: 'BusinessEditBasic',
  setup() {
    const basicFormRef: any = ref(null);

    const rules = {
      name: [{ required: true, message: '请输入服务名称', trigger: 'blur' }],
      description: [{ required: true, message: '请输入服务描述', trigger: 'blur' }],
    };

    const getValues = () => {
      basicFormRef.value.validate((isValid: boolean) => {
        basicForm.value.isValid = isValid;
      });
      return basicForm.value;
    };

    return {
      basicForm,
      rules,
      getValues,
      basicFormRef,
    };
  },
});
</script>

<style lang="scss" scoped>
.business-edit-basic:deep(.el-select.el-select--small) {
  width: 100%;
}
</style>
