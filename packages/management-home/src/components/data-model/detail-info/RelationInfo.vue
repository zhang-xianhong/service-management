<template>
  <div class="baseinfo-container">
    <div class="baseinfo-title">基本信息</div>
    <el-form :model="formData" label-width="120px">
      <el-form-item label="数据对象">
        <div class="baseinfo-content">{{ formData.from }}</div>
      </el-form-item>
      <el-form-item label="关联对象">
        <div class="baseinfo-content">{{ formData.to }}</div>
      </el-form-item>
      <el-form-item label="关联类型">
        <el-radio-group></el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="danger" @click="removeRelation">删除</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
// import _ from 'lodash/fp';

export default defineComponent({
  name: 'RelationInfo',
  props: {
    data: {
      require: true,
      type: Object,
    },
  },
  setup(props: any) {
    return {
      formData: props.data,
    };
  },
});
</script>

<style lang="scss" scoped>
.baseinfo-container {
  padding: 12px;
}
.baseinfo-title {
  margin-bottom: 20px;
}
.baseinfo-content {
  display: inline-block;
  width: 400px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
