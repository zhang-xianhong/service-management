<template>
  <el-row>
    <el-steps class="tenant-steps" :active="activeStep" simple>
      <el-step :icon="activeStep > 1 ? 'el-icon-success' : 'el-icon-edit'" title="填写公司信息"></el-step>
      <el-step :icon="activeStep > 2 ? 'el-icon-success' : 'el-icon-edit'" title="填写联系人信息"></el-step>
      <el-step icon="el-icon-edit" title="注册系统管理员"></el-step>
    </el-steps>
  </el-row>
  <keep-alive>
    <component :is="componentName" :isEdit="isEdit" v-model="tenantDetail" @go="goStep" @submit="onSubmit"></component>
  </keep-alive>
</template>

<script lang="ts">
import { reactive, toRefs, ref, getCurrentInstance } from 'vue';
import CompanyInfo from './components/CompanyInfo.vue';
import UserInfo from './components/UserInfo.vue';
import ManagerInfo from './components/ManagerInfo.vue';
import { useRoute, useRouter } from 'vue-router';
import { getTenantDetail, createTenant, updateTenant } from '@/api/tenant';

export default {
  name: 'TenantEdit',
  components: {
    CompanyInfo,
    UserInfo,
    ManagerInfo,
  },
  setup() {
    const instance = getCurrentInstance();
    // 路由信息
    const route = useRoute();

    const router = useRouter();

    const tenantId = route.params.id as string;

    const isEdit = parseInt(tenantId, 10) > 0;

    const tenantDetail = ref({
      contact: {},
      manager: {},
    } as any);

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
      switch (step) {
        case 1:
          state.componentName = 'CompanyInfo';
          break;
        case 2:
          state.componentName = 'UserInfo';
          break;
        default:
          state.componentName = 'ManagerInfo';
      }
    };

    const onSubmit = async () => {
      if (isEdit) {
        const { code } = await updateTenant(tenantId, {
          ...tenantDetail.value,
          ...{ contact: undefined, manager: undefined },
        });
        if (code === 0) {
          (instance as any).proxy.$message({
            type: 'success',
            message: '更新成功',
          });
          router.back();
        }
      } else {
        const { code } = await createTenant(tenantDetail.value);
        if (code === 0) {
          (instance as any).proxy.$message({
            type: 'success',
            message: '新建成功',
          });
          router.back();
        }
      }
    };

    return {
      ...toRefs(state),
      isEdit,
      tenantDetail,
      goStep,
      onSubmit,
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
