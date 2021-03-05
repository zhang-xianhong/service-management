<template>
  <div class="business-edit">
    <el-row>
      <el-button type="primary" @click="save">保存</el-button>
      <el-button @click="backToList">返回</el-button>
    </el-row>
    <el-row>
      <el-tabs v-model="currentTab" class="">
        <el-tab-pane label="基本信息" name="basic"><basic-form></basic-form></el-tab-pane>
        <el-tab-pane label="高级设置" name="advance"><advance-form></advance-form></el-tab-pane>
        <el-tab-pane label="业务对象关联" name="relation"><relation-form></relation-form></el-tab-pane>
        <el-tab-pane label="计算列" name="computed"><computed-form></computed-form></el-tab-pane>
        <el-tab-pane label="接口配置" name="api"><api-form></api-form></el-tab-pane>
        <el-tab-pane label="视图设计" name="view"><view-form></view-form></el-tab-pane>
        <el-tab-pane label="运行参数" name="args"><args-form></args-form></el-tab-pane>
      </el-tabs>
    </el-row>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import BasicForm from './business-edit-form/Basic.vue';
import AdvanceForm from './business-edit-form/Advance.vue';
import RelationForm from './business-edit-form/Relation.vue';
import ComputedForm from './business-edit-form/Computed.vue';
import ApiForm from './business-edit-form/Api.vue';
import ViewForm from './business-edit-form/View.vue';
import ArgsForm from './business-edit-form/Args.vue';
import { addService, updateService, getServiceById } from '@/api/servers';
import * as formData from './business-edit-form/form-data';
import _ from 'lodash/fp';

export default defineComponent({
  name: 'BusinessEdit',
  components: { BasicForm, AdvanceForm, RelationForm, ComputedForm, ApiForm, ViewForm, ArgsForm },
  props: {
    id: {
      type: String,
    },
  },
  setup(props) {
    const router = useRouter();
    const backToList = () => {
      router.push({ path: '/service/business' });
    };

    const currentTab = ref('basic');

    const save = async () => {
      const { id } = props;
      const basicValues = formData.basicForm.value;
      if (!basicValues.isValid) {
        currentTab.value = 'basic';
        return;
      }
      const advanceValues = formData.advanceForm.value;
      const relationValues = formData.relationForm.value;
      if (!relationValues.isValid) {
        currentTab.value = 'relation';
        return;
      }
      const apiValues = formData.apis.value;
      const params = {
        ..._.pick(['name', 'description', 'owner', 'tag', 'classification'])(basicValues),
        ..._.pick(['moduleDependencyId'])(relationValues),
        dependencies: _.map(({ dependencyId = '' }) => ({ dependencyId }))(advanceValues.dependencies),
        apis: _.map((api: any) => ({
          name: api.name,
          description: api.description,
          url: `/${api.name}`,
          method: api.method,
          paramType: 'REQUEST_BODY',
        }))(apiValues),
      };
      const postRes = id ? await updateService(id, params) : await addService(params);
      if (postRes.code === 0) {
        backToList();
      }
    };

    onMounted(async () => {
      const { id } = props;
      if (id) {
        const { data: serviceDetail } = await getServiceById({ id });
        Object.assign(formData.basicForm.value, serviceDetail);
        formData.advanceForm.value.dependencies = _.map((dep: any) => ({
          dependencyId: dep.dependencyId,
          name: dep.service.name,
        }))(serviceDetail.dependencies);
        formData.apis.value = serviceDetail.apis.map((api: formData.ApiRecord, index: number) => {
          const isDefault = index < 6;
          return {
            ...api,
            isDefault,
          };
        });
        Object.assign(formData.relationForm.value, serviceDetail);
      }
    });
    return {
      backToList,
      currentTab,
      save,
    };
  },
});
</script>

<style lang="scss" scoped>
.business-edit:deep(.el-tabs.el-tabs--top) {
  width: 100%;
}
</style>
