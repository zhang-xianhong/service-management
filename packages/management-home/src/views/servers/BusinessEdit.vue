<template>
  <div class="business-edit">
    <el-row>
      <el-button type="primary" @click="save">保存</el-button>
      <el-button @click="backToList">返回</el-button>
    </el-row>
    <el-row>
      <el-tabs v-model="currentTab" class="">
        <el-tab-pane label="基本信息" name="basic"><basic-form ref="basicFormRef"></basic-form></el-tab-pane>
        <el-tab-pane label="高级设置" name="advance"><advance-form ref="advanceFormRef"></advance-form></el-tab-pane>
        <el-tab-pane label="业务对象关联" name="relation"
          ><relation-form ref="relationFormRef"></relation-form
        ></el-tab-pane>
        <el-tab-pane label="计算列" name="computed"><computed-form></computed-form></el-tab-pane>
        <el-tab-pane label="接口配置" name="api"><api-form ref="apiFormRef"></api-form></el-tab-pane>
        <el-tab-pane label="视图设计" name="view"><view-form></view-form></el-tab-pane>
        <el-tab-pane label="运行参数" name="args"><args-form></args-form></el-tab-pane>
      </el-tabs>
    </el-row>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import BasicForm from './business-edit-form/Basic.vue';
import AdvanceForm from './business-edit-form/Advance.vue';
import RelationForm from './business-edit-form/Relation.vue';
import ComputedForm from './business-edit-form/Computed.vue';
import ApiForm from './business-edit-form/Api.vue';
import ViewForm from './business-edit-form/View.vue';
import ArgsForm from './business-edit-form/Args.vue';

export default defineComponent({
  name: 'BusinessEdit',
  components: { BasicForm, AdvanceForm, RelationForm, ComputedForm, ApiForm, ViewForm, ArgsForm },
  setup() {
    const basicFormRef: any = ref(null);
    const advanceFormRef: any = ref(null);
    const relationFormRef: any = ref(null);
    const apiFormRef: any = ref(null);
    const router = useRouter();
    const backToList = () => {
      router.push({ path: '/serve/business-server' });
    };

    const currentTab = ref('basic');

    const save = () => {
      const basicValues = basicFormRef.value.getValues();
      if (!basicValues.isValid) {
        currentTab.value = 'basic';
        return;
      }
      const advanceValues = advanceFormRef.value.getValues();
      const relationValues = relationFormRef.value.getValues();
      if (!relationValues.isValid) {
        currentTab.value = 'relation';
        return;
      }
      const apiValues = apiFormRef.value.getValues();
      console.log({ basicValues, advanceValues, relationValues, apiValues });
    };

    return {
      backToList,
      currentTab,
      save,
      basicFormRef,
      advanceFormRef,
      relationFormRef,
      apiFormRef,
    };
  },
});
</script>

<style lang="scss" scoped>
.business-edit:deep(.el-tabs.el-tabs--top) {
  width: 100%;
}
</style>
