<template>
  <div style="background: #fff; padding: 30px">
    <company-info ref="companyRef" :isEdit="isEditMode" v-model="tenantDetail"></company-info>
    <user-info ref="userRef" :isEdit="isEditMode" v-model="tenantDetail.contact"></user-info>
    <manager-info ref="managerRef" :isEdit="isEditMode" v-model="tenantDetail.manager"></manager-info>
    <el-row>
      <el-button type="primary" v-if="!isEditMode" @click="isEditMode = true">编辑</el-button>
      <el-button type="primary" v-if="isEditMode" @click="onSubmit">保存</el-button>
      <el-button @click="onCancel">返回</el-button>
    </el-row>
  </div>
</template>

<script lang="ts">
import { ref, getCurrentInstance, defineComponent, Ref } from 'vue';
import CompanyInfo from './components/CompanyInfo.vue';
import UserInfo from './components/UserInfo.vue';
import ManagerInfo from './components/ManagerInfo.vue';
import { useRoute, useRouter } from 'vue-router';
import { getTenantDetail, updateTenant } from '@/api/tenant';

export default defineComponent({
  name: 'TenantEdit',
  components: {
    CompanyInfo,
    UserInfo,
    ManagerInfo,
  },
  setup() {
    const instance = getCurrentInstance();
    const route = useRoute();
    const router = useRouter();
    const tenantId = route.params.id as string;
    const isEditMode = ref(false); // parseInt(tenantId, 10) > 0; // 标识是新建租户还是编辑租户，如果为true则为更新
    const companyRef: Ref<any> = ref(null);
    const userRef: Ref<any> = ref(null);
    const managerRef: Ref<any> = ref(null);

    // 租户详情
    const tenantDetail = ref({
      contact: {},
      manager: {},
    } as any);

    const getDetail = async () => {
      const { data } = await getTenantDetail(tenantId);
      tenantDetail.value = data;
    };

    getDetail();
    // 并行校验表单输入
    const validate = () =>
      Promise.all([
        new Promise((resolve) => {
          companyRef.value.formRef.validate((validator: boolean) => {
            resolve(validator);
          });
        }),
        new Promise((resolve) => {
          userRef.value.formRef.validate((validator: boolean) => {
            resolve(validator);
          });
        }),
        new Promise((resolve) => {
          managerRef.value.formRef.validate((validator: boolean) => {
            resolve(validator);
          });
        }),
      ]);

    // 租户更新或新建
    const onSubmit = async () => {
      const validator = await validate();
      // 所有表单都校验通过则继续向下，否则直接返回false
      if (validator.some((item: any) => !item)) {
        return false;
      }
      const updateData: any = tenantDetail.value;
      delete updateData.manager.password;
      Object.keys(updateData).forEach((key: string) => {
        if (updateData[key] === '') {
          delete updateData[key];
        }
      });
      const { code } = await updateTenant(tenantId, updateData);
      if (code === 0) {
        (instance as any).proxy.$message({
          type: 'success',
          message: '更新成功',
        });
        router.back();
      }
    };

    const onCancel = async () => {
      router.back();
    };

    return {
      companyRef,
      userRef,
      managerRef,
      isEditMode,
      tenantDetail,
      onSubmit,
      onCancel,
    };
  },
});
</script>

<style lang="scss" scoped>
.tenant-steps {
  width: 70%;
  padding-bottom: 18px;
}
.form-item {
  .el-input__inner {
    height: 32px;
  }
}
</style>
<style lang="scss">
.form-item {
  width: 40%;
  font-size: 12px;
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
  width: 115px;
  height: 85px;
  line-height: 85px;
  text-align: center;
}
.avatar {
  width: 115px;
  height: 85px;
  display: block;
}
.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  color: #909399;
  font-size: 30px;
}
</style>
