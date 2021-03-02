<template>
  <form-panel>
    <el-tabs v-model="activeTab" @tab-click="handleTabChange">
      <el-tab-pane label="基本信息" name="base">
        <base-info :data="form" />
      </el-tab-pane>
      <el-tab-pane label="对象分析" name="analysis">对象分析</el-tab-pane>
      <el-tab-pane label="相似度分析" name="similarity">相似度分析</el-tab-pane>
    </el-tabs>
  </form-panel>
</template>
<script lang="ts">
import { ElMessage } from 'element-plus';
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import { useRoute, useRouter } from 'vue-router';
// import { getModelDetail } from '@/api/schema/model';
import BaseInfo from './BaseInfo.vue';

export default defineComponent({
  components: {
    BaseInfo,
  },
  setup() {
    const activeTab = ref('base');
    const route = useRoute();
    const router = useRouter();
    const isCreate = ref(true);
    const loading = ref(true);
    const baseData = {
      form: reactive({}),
    };
    const handleTabChange = () => 1;

    const getModelInfo = async () => {
      try {
        loading.value = true;
        // const {data} = await getModelDetail(id)
        setTimeout(() => {
          console.log(6666);
          baseData.form = {
            value: 234,
          };
        }, 2000);
      } catch (error) {
        ElMessage.error(error.message);
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      const id = Number(route.params.id);
      if (isNaN(id)) {
        ElMessage.error('无效的ID');
        router.back();
        return;
      }
      isCreate.value = id === 0;
      if (id > 0) {
        getModelInfo();
      } else {
        loading.value = false;
      }
    });
    return {
      ...toRefs(baseData.form),
      activeTab,
      isCreate,
      handleTabChange,
    };
  },
});
</script>
