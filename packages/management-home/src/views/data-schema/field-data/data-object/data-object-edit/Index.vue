<template>
  <form-panel>
    <el-tabs v-model="activeTab" @tab-click="handleTabChange">
      <el-tab-pane label="基本信息" name="base">
        <base-info :data="baseInfo" />
      </el-tab-pane>
      <el-tab-pane label="对象分析" name="analysis">对象分析</el-tab-pane>
      <el-tab-pane label="相似度分析" name="similarity">相似度分析</el-tab-pane>
    </el-tabs>
  </form-panel>
</template>
<script lang="ts">
import { ElMessage } from 'element-plus';
import { defineComponent, onMounted, reactive, toRefs } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getModelDetail } from '@/api/schema/model';
import BaseInfo from './BaseInfo.vue';

export default defineComponent({
  components: {
    BaseInfo,
  },
  setup() {
    // 页面相关状态信息
    const state = reactive({
      activeTab: 'base',
      isCreate: true,
      loading: true,
      baseInfo: {},
    });

    const route = useRoute();
    const router = useRouter();

    const handleTabChange = () => 1;

    const getModelInfo = async (id: number) => {
      try {
        state.loading = true;
        const { data = {} } = await getModelDetail(id);
        state.baseInfo = data;
      } catch (error) {
        ElMessage.error(error.message);
      } finally {
        state.loading = false;
      }
    };

    onMounted(() => {
      const id = Number(route.params.id);
      if (isNaN(id)) {
        ElMessage.error('无效的ID');
        router.back();
        return;
      }
      state.isCreate = id === 0;
      if (id > 0) {
        getModelInfo(id);
      } else {
        state.loading = false;
      }
    });
    return {
      ...toRefs(state),
      handleTabChange,
    };
  },
});
</script>
