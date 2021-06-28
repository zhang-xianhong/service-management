<template>
  <div class="repository-detail">
     <el-tabs v-model="activeTab" @tab-click="handleTabClick">
      <el-tab-pane label="基本信息" name="base">基本信息</el-tab-pane>
      <el-tab-pane label="服务依赖" name="depend">
        <service-depend/>
      </el-tab-pane>
      <el-tab-pane label="接口列表" name="api">接口列表</el-tab-pane>
      <el-tab-pane label="历史版本" name="history">历史版本</el-tab-pane>
    </el-tabs>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import ServiceDepend from '../components/depend/Index.vue';
export default defineComponent({
  components: {ServiceDepend},
  setup() {
    const activeTab = ref('base')
    const handleTabClick = () => {}
    return {
      activeTab,
      handleTabClick
    }
  },
});
</script>
<style lang="scss" scoped>
.repository-detail {
  margin: -20px;
}
</style>
<style lang="scss">
.repository-detail {
  .el-tabs__header {
    background-color: white;
    .el-tabs__nav {
      padding-left: 20px;
      padding-right: 20px;
    }
    .el-tabs__active-bar {
      margin-left: 20px;
    }
  }
  .el-tabs__content {
    margin: 20px;
  }
}
</style>