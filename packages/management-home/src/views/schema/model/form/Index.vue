<template>
  <form-panel>
    <el-tabs v-model="activeTab" @tab-click="handleTabChange">
      <el-tab-pane label="基本信息" name="base">
        <Base />
      </el-tab-pane>
      <el-tab-pane label="对象分析" name="analysis">对象分析</el-tab-pane>
      <el-tab-pane label="相似度分析" name="similarity">相似度分析</el-tab-pane>
    </el-tabs>
  </form-panel>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import Base from './Base.vue';
export default defineComponent({
  components: {
    Base,
  },
  setup() {
    const activeTab = ref('base');
    const handleTabChange = () => 1;
    return {
      activeTab,
      handleTabChange,
    };
  },
});
</script>
