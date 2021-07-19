<template>
  <div class="detail-with-tabs">
    <el-tabs v-model="activeTab" v-loading="loading">
      <el-tab-pane label="请求参数" name="req">
        <div class="tab-content-wrap">
          <request-list />
        </div>
      </el-tab-pane>
      <el-tab-pane label="返回参数" name="res">
        <div class="tab-content-wrap">
          <api-list />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { defineComponent, ref } from 'vue';
import RequestList from './request/List.vue';
import ApiList from '../api/List.vue';
export default defineComponent({
  components: {
    RequestList,
    ApiList,
  },
  setup() {
    const activeTab = ref('req');
    const loading = ref(false);
    return {
      activeTab,
      loading,
    };
  },
});
</script>
<style lang="scss" scoped></style>
