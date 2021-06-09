<template>
  <div style="background: #fff; padding: 30px">
    <el-steps :active="currentState.activeStep" finish-status="success" simple style="margin: 20px 0">
      <el-step :title="step.title" v-for="step in steps" :key="step.id"></el-step>
    </el-steps>
    <keep-alive>
      <component
        :is="currentState.component"
        v-model="currentState.modelValue"
        @go="goStep"
        @submit="onSubmit"
        :isCreate="isCreate"
        :isEdit="isCreate"
        :ref="currentState.ref"
      ></component>
    </keep-alive>
    <el-row>
      <el-button @click="goPrevStep(currentState.activeStep)" v-if="currentState.activeStep !== 0">上一步</el-button>
      <el-button type="primary" @click="goNextStep(currentState.activeStep)" v-if="currentState.activeStep !== 2"
        >下一步</el-button
      >
      <el-button type="primary" @click="goLastStep()" v-if="currentState.activeStep === 2">完成</el-button>
    </el-row>
  </div>
</template>

<script lang="ts">
import { ref, getCurrentInstance, defineComponent, Ref, reactive } from 'vue';
import CompanyInfo from './components/CompanyInfo.vue';
import UserInfo from './components/UserInfo.vue';
import ManagerInfo from './components/ManagerInfo.vue';
import { useRouter } from 'vue-router';
import { createTenant } from '@/api/tenant';
import PackagedSteps from '@/components/packaged-steps/Index.vue';

export default defineComponent({
  name: 'TenantAdd',
  components: {
    CompanyInfo,
    UserInfo,
    ManagerInfo,
    PackagedSteps,
  },
  setup() {
    const instance = getCurrentInstance();
    const router = useRouter();
    const companyRef: Ref<any> = ref(null);
    const userRef: Ref<any> = ref(null);
    const managerRef: Ref<any> = ref(null);
    const isCreate = ref(true);

    // 租户详情
    const tenantDetail = ref({
      contact: {},
      manager: {},
    } as any);

    const steps = [
      {
        id: 0,
        title: '填写企业信息',
        component: 'CompanyInfo',
        ref: 'companyRef',
        refForm: companyRef,
        modelValue: tenantDetail.value,
      },
      {
        id: 1,
        title: '填写联系人信息',
        component: 'UserInfo',
        ref: 'userRef',
        refForm: userRef,
        modelValue: tenantDetail.value.contact,
      },
      {
        id: 2,
        title: '注册系统管理员',
        component: 'ManagerInfo',
        ref: 'managerRef',
        refForm: managerRef,
        modelValue: tenantDetail.value.manager,
      },
    ];

    // 新建租户
    const onSubmit = async () => {
      const { code } = await createTenant(tenantDetail.value);
      if (code === 0) {
        (instance as any).proxy.$message({
          type: 'success',
          message: '新建成功',
        });
        router.back();
      }
    };

    const currentState = reactive({
      ...steps[0],
      activeStep: steps[0].id,
    });

    const goStep = (step: number) => {
      const currentStep = steps[step];
      currentState.activeStep = currentStep.id;
      currentState.component = currentStep.component;
      currentState.ref = currentStep.ref;
      currentState.refForm = currentStep.refForm;
      currentState.modelValue = currentStep.modelValue;
    };
    const goPrevStep = (step: number) => {
      goStep(step - 1);
    };
    const goNextStep = (step: number) => {
      const currentStep = steps[step];
      currentStep.refForm.value.formRef.validate((validator: boolean) => {
        if (validator) {
          goStep(step + 1);
        }
      });
    };

    const goLastStep = () => {
      managerRef.value.formRef.validate((validator: boolean) => {
        if (validator) {
          onSubmit();
        }
      });
    };

    const onCancel = async () => {
      router.back();
    };

    return {
      isCreate,
      companyRef,
      userRef,
      managerRef,
      steps,
      currentState,
      tenantDetail,
      onSubmit,
      onCancel,
      goStep,
      goPrevStep,
      goNextStep,
      goLastStep,
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
.tenant-title {
  font-size: 14px;
  font-weight: bolder;
}
</style>
