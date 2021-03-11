<template>
  <div class="business-edit-basic">
    <el-form label-position="top" :model="basicForm" :rules="rules" ref="basicFormRef">
      <el-form-item label="服务名称" prop="name">
        <el-input
          placeholder="请输入英文命名，以srv-开头, 支持小写字母、数字及中划线, 不能以中划线结尾"
          v-model="basicForm.name"
        ></el-input>
      </el-form-item>
      <el-form-item label="服务描述" prop="description">
        <el-input placeholder="请输入中文命名" v-model="basicForm.description"></el-input>
      </el-form-item>
      <el-form-item label="对应需求">
        <el-select placeholder="请选择对应需求" v-model="basicForm.demand" multiple></el-select>
      </el-form-item>
      <el-form-item label="负责人">
        <el-select placeholder="请选择负责人" v-model="basicForm.owner"></el-select>
      </el-form-item>
      <el-form-item>
        支持版本管理
        <el-checkbox v-model="basicForm.versionManagement"></el-checkbox>
      </el-form-item>
      <el-form-item label="分类">
        <el-select placeholder="请选择分类" v-model="basicForm.classification"></el-select>
      </el-form-item>
      <el-form-item label="标签定义">
        <el-select placeholder="请选择标签" v-model="tags" multiple></el-select>
      </el-form-item>
      <el-form-item label="服务详情">
        <el-input v-model="basicForm.detail" type="textarea" :rows="5"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, watch } from 'vue';
import { basicForm } from './form-data';

export default defineComponent({
  name: 'BusinessEditBasic',
  setup() {
    const basicFormRef: any = ref(null);

    const rules = {
      name: [
        { required: true, message: '请输入服务名称', trigger: 'blur' },
        {
          validator(rule: any, value: string, callback: (error?: string) => {}) {
            if (value.length > 45) return callback('最长支持45个字符');
            if (!value.startsWith('srv-')) return callback('服务名需要以srv-开头');
            if (!/^[a-z0-9-]+$/.test(value)) return callback('只能包含小写字母、数字及中划线');
            if (/-$/.test(value)) return callback('服务名不能以中划线结尾');
            callback();
          },
          trigger: 'blur',
        },
      ],
      description: [{ required: true, message: '请输入服务描述', trigger: 'blur' }],
    };

    const getValues = () => {
      basicFormRef.value.validate((isValid: boolean) => {
        basicForm.value.isValid = isValid;
      });
      return basicForm.value;
    };

    const tags: Ref<Array<string>> = ref([]);
    watch(basicForm, (newForm) => {
      tags.value = newForm.tag.split(',');
    });
    watch(tags, (newTags) => {
      if (newTags.join() !== basicForm.value.tag) {
        basicForm.value.tag = tags.value.join();
      }
    });

    return {
      basicForm,
      rules,
      getValues,
      basicFormRef,
      tags,
    };
  },
});
</script>

<style lang="scss" scoped>
.business-edit-basic:deep(.el-select.el-select--small) {
  width: 100%;
}
</style>
