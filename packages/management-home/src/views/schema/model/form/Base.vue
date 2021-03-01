<template>
  <el-form ref="baseForm" :model="form" label-width="120px">
    <el-form-item label="数据对象名称" required>
      <el-input v-model="form.name" placeholder="请输入英文名称，作为唯一标识，不可重复"></el-input>
    </el-form-item>
    <el-form-item label="数据对象描述" required>
      <el-input v-model="form.description" placeholder="请输入中文名称"></el-input>
    </el-form-item>
    <el-form-item label="属性">
      <model-property/>
    </el-form-item>  
    <el-form-item>
      <el-button type="primary" @click="onSubmit">保存</el-button>
    </el-form-item>
  </el-form>
</template>
<script lang="ts">
import { defineComponent, reactive } from 'vue';
import ModelProperty from './Property.vue'
export default defineComponent({
  components: {
    ModelProperty
  },
  setup() {
    const form = reactive({});
    const onSubmit = () => 1;
    return {
      form,
      onSubmit,
    };
  },
});
</script>
