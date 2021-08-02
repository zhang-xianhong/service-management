<template>
  <div class="detail-with-tabs">
    <el-tabs v-model="activeTab" v-loading="loading">
      <el-tab-pane label="请求参数" name="req">
        <div class="tab-content-wrap">
          <params-list :apiInfo="apiInfo" v-if="apiInfo" />
        </div>
      </el-tab-pane>
      <el-tab-pane label="返回参数" name="res">
        <div class="tab-content-wrap">
          <params-list :is-response="true" :apiInfo="apiInfo" v-if="apiInfo" />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { defineComponent, ref } from 'vue';
import ParamsList from './List.vue';
import { findServiceApi } from '@/api/servers/index';
import { useRoute } from 'vue-router';
export default defineComponent({
  components: {
    ParamsList,
  },
  setup() {
    const activeTab = ref('req');
    const loading = ref(false);
    const apiInfo = ref(null);
    const route = useRoute();
    const serviceId = ref(route.params.serviceId);
    const apiId = ref(route.params.apiId);

    const getInfo = async () => {
      loading.value = true;
      const { data } = await findServiceApi({
        serviceId: serviceId.value,
        uniqueId: apiId.value,
      });
      apiInfo.value = data;
      loading.value = false;
    };
    getInfo();

    return {
      activeTab,
      loading,
      apiInfo,
      serviceId,
      apiId,
    };
  },
});
</script>
<style lang="scss" scoped>
.tab-content-wrap {
  min-height: 400px;
}
</style>
