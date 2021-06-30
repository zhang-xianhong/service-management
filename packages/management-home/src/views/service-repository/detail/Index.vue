<template>
  <div class="repository-detail">
    <el-tabs v-model="activeTab" @tab-click="handleTabClick">
      <el-tab-pane label="基本信息" name="base">
        <div class="service-depened-wrapper">
          <service-base :snapshotNo="''" />
        </div>
      </el-tab-pane>
      <el-tab-pane label="服务依赖" name="depend">
        <div class="service-depened-wrapper">
          <service-depend v-if="activeTab === 'depend'" />
        </div>
      </el-tab-pane>
      <el-tab-pane label="接口列表" name="api">接口列表</el-tab-pane>
      <el-tab-pane label="历史版本" name="history">历史版本</el-tab-pane>
    </el-tabs>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import ServiceDepend from '../components/depend/Index.vue';
import ServiceBase from '../components/base/index.vue';
export default defineComponent({
  components: { ServiceDepend, ServiceBase },
  setup() {
    const activeTab = ref('base');
    const handleTabClick = () => 1;
    return {
      activeTab,
      handleTabClick,
    };
  },
});
</script>
<style lang="scss" scoped>
.repository-detail {
  margin: -20px;
}
.service-depened-wrapper {
  height: calc(100vh - 200px);
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
