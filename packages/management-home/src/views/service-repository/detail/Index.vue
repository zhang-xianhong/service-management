<template>
  <div class="repository-detail">
    <el-tabs v-model="activeTab" @tab-click="handleTabClick">
      <el-tab-pane label="基本信息" name="base">
        <service-base :loading="loading" :info="serviceInfo" />
      </el-tab-pane>
      <el-tab-pane label="服务依赖" name="depend">
        <div class="service-depened-wrapper">
          <service-depend ref="serviceDependRef" />
        </div>
      </el-tab-pane>
      <el-tab-pane label="接口列表" name="api">
        <service-api />
      </el-tab-pane>
      <el-tab-pane label="历史版本" name="history">
        <service-history />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { getRepositoryDetail } from '@/api/repository';
import ServiceDepend from '../components/depend/Index.vue';
import ServiceBase from './Base.vue';
import ServiceApi from './Api.vue';
import ServiceHistory from './History.vue';

export default defineComponent({
  name: 'RepositoryPlatformDetail',
  components: { ServiceDepend, ServiceBase, ServiceApi, ServiceHistory },
  setup() {
    const activeTab = ref('base');
    const serviceDependRef = ref(null as any);
    const serviceInfo = ref(null as any);
    const { params } = useRoute();
    const { id } = params;
    const loading = ref(true);
    const handleTabClick = () => 1;
    const fetchData = async () => {
      loading.value = true;
      const { data } = await getRepositoryDetail(id as string);
      serviceInfo.value = data;
      loading.value = false;
    };

    fetchData();

    watch(activeTab, (tab) => {
      if (tab === 'depend') {
        serviceDependRef.value.render();
      }
    });
    return {
      activeTab,
      handleTabClick,
      serviceDependRef,
      serviceInfo,
      loading,
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
    background-color: white;
  }
}
</style>
