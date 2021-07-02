<template>
  <el-form :model="releaseFormData" :rules="formRules" ref="releaseBaseForm" label-width="100px" class="demo-ruleForm">
    基础信息
  </el-form>
</template>
<script lang="ts">
import { defineComponent, reactive } from 'vue';
export default defineComponent({
  name: 'BaseInfo',
  setup() {
    const releaseFormData = reactive({});
    const formRules = [{}];
    return {
      releaseFormData,
      formRules,
    };
  },
});
</script>
