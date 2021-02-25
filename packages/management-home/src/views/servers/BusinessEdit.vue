<template>
  <div class="business-edit">
    <el-row>
      <el-button type="primary">保存</el-button>
      <el-button @click="backToList">返回</el-button>
    </el-row>
    <el-row>
      <el-tabs v-model="currentTab" class="">
        <el-tab-pane label="基本信息" name="basic"><basic-form></basic-form></el-tab-pane>
        <el-tab-pane label="高级设置" name="advance"></el-tab-pane>
        <el-tab-pane label="业务对象关联" name="relation"></el-tab-pane>
        <el-tab-pane label="计算列" name="computed"></el-tab-pane>
        <el-tab-pane label="接口配置" name="interface"></el-tab-pane>
        <el-tab-pane label="视图设计" name="view"></el-tab-pane>
        <el-tab-pane label="运行参数" name="args"></el-tab-pane>
      </el-tabs>
    </el-row>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import BasicForm from './business-edit-form/Basic.vue';

export default defineComponent({
  name: 'BusinessEdit',
  components: { BasicForm },
  setup() {
    const router = useRouter();
    const backToList = () => {
      router.push({ path: '/serve/business-server' });
    };

    const currentTab = ref('basic');

    return {
      backToList,
      currentTab,
    };
  },
});
</script>

<style lang="scss" scoped>
.business-edit::v-deep .el-tabs.el-tabs--top {
  width: 100%;
}
</style>
