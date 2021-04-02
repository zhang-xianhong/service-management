<template>
  <el-row>
    <el-steps class="tenant-steps" :active="activeStep" simple>
      <el-step :icon="activeStep > 1 ? 'el-icon-success' : 'el-icon-edit'" title="填写公司信息"></el-step>
      <el-step :icon="activeStep > 2 ? 'el-icon-success' : 'el-icon-edit'" title="填写联系人信息"></el-step>
      <el-step icon="el-icon-edit" title="注册系统管理员"></el-step>
    </el-steps>
  </el-row>
  <keep-alive>
    <component :is="componentName" @go="goStep" :isEdit="isEdit" v-model="tenantDetail"></component>
  </keep-alive>
</template>

<script lang="ts">
import { reactive, toRefs, ref } from 'vue';
import CompanyInfo from './components/CompanyInfo.vue';
import UserInfo from './components/UserInfo.vue';
import ManagerInfo from './components/ManagerInfo.vue';
import { useRoute } from 'vue-router';
import { getTenantDetail } from '@/api/tenant';

export default {
  name: 'TenantEdit',
  components: {
    CompanyInfo,
    UserInfo,
    ManagerInfo,
  },
  setup() {
    // 路由信息
    const route = useRoute();

    const tenantId = route.params.id as string;

    const isEdit = parseInt(tenantId, 10) > 0;

    const tenantDetail = ref({} as any);

    const getDetail = async () => {
      const { data } = await getTenantDetail(tenantId);
      tenantDetail.value = data;
    };

    if (isEdit) {
      getDetail();
    }

    const state = reactive({
      activeStep: 1,
      componentName: 'CompanyInfo',
    });

    const goStep = (step: number) => {
      state.activeStep = step;
      state.componentName = step === 2 ? 'UserInfo' : 'ManagerInfo';
    };
    return {
      ...toRefs(state),
      isEdit,
      tenantDetail,
      goStep,
    };
  },
};
</script>

<style lang="scss" scoped>
.tenant-steps {
  width: 70%;
  padding-bottom: 18px;
}
</style>
<style lang="scss">
.form-item {
  width: 40%;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  &:hover {
    border-color: #409eff;
  }
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
