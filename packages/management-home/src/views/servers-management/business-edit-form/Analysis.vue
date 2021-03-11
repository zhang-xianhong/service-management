<template>
  <div class="business-edit-analysis">
    <el-form label-position="top">
      <el-form-item label="修改次数">
        <el-input disabled v-model="changes"></el-input>
      </el-form-item>
      <el-form-item label="服务依赖">
        <tag-input :disabled="true" v-model="svcDep"></tag-input>
      </el-form-item>
      <el-form-item label="对象依赖">
        <tag-input :disabled="true" v-model="objDep"></tag-input>
      </el-form-item>
      <el-form-item label="直接依赖">
        <tag-input :disabled="true" v-model="directDep"></tag-input>
      </el-form-item>
      <el-form-item label="简介依赖">
        <tag-input :disabled="true" v-model="indirectDep"></tag-input>
      </el-form-item>
      <el-form-item label="全部反向依赖">
        <tag-input :disabled="true" v-model="reverseDep"></tag-input>
      </el-form-item>
      <el-form-item label="继承关系">
        <tag-input :disabled="true" v-model="extend"></tag-input>
      </el-form-item>
      <el-form-item label="被继承关系">
        <tag-input :disabled="true" v-model="extended"></tag-input>
      </el-form-item>
      <el-form-item label="变更历史">
        <div class="disabled-area">
          <ol>
            <li v-for="hisItem in history" :key="hisItem.$index">{{ hisItem }}</li>
          </ol>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script lang="ts">
import { defineComponent, toRefs } from 'vue';
import { analysisData } from './form-data';
import TagInput from '@/components/tag-input/index.vue';
export default defineComponent({
  name: 'BusinessEditAnalysis',
  components: { TagInput },
  setup() {
    return {
      ...toRefs(analysisData.value),
    };
  },
});
</script>
<style lang="scss" scoped>
.disabled-area {
  background-color: #f5f7fa;
  border: 1px solid #e5e7ed;
  color: #c0c4cc;
  cursor: not-allowed;
  border-radius: 4px;
  font-size: 13px;
}
</style>
