<template>
  <el-row style="font-weight:bolder">管理员信息</el-row>
  <el-row style="padding:0 20px;">
    <el-form
      class="managerinfo-form"
      ref="formRef"
      :model="managerInfo"
      :rules="rules"
      inline
      label-width="140px"
      label-position="left"
    >
      <el-form-item prop="account" class="form-item" label="管理员账号">
        <template v-if="isEdit">{{ managerInfo.account }}</template>
        <el-input
          v-else
          v-model="managerInfo.account"
          style="width: 400px"
          placeholder="请输入小写英文账号"
          @blur="validateManagerAccount"
        ></el-input>
      </el-form-item>
      <el-form-item v-if="!isEdit" prop="password" class="form-item" label="初始密码">
        <el-input
          show-password
          v-model="managerInfo.password"
          style="width: 400px"
          placeholder="请输入初始密码"
        ></el-input>
      </el-form-item>
      <el-form-item prop="name" class="form-item" label="管理员姓名">
        <template v-if="isEdit">{{ managerInfo.name }}</template>
        <el-input
          v-else
          v-model="managerInfo.name"
          style="width: 400px"
          placeholder="请输入中文租户管理员姓名"
        ></el-input>
      </el-form-item>
      <el-form-item v-if="!isEdit" prop="confirmPassword" class="form-item" label="确认初始密码">
        <el-input
          show-password
          v-model="managerInfo.confirmPassword"
          style="width: 400px"
          placeholder="请确认初始密码"
        ></el-input>
      </el-form-item>
      <el-form-item prop="phone" class="form-item" label="管理员电话">
        <template v-if="isEdit">{{ managerInfo.phone }}</template>
        <el-input v-else v-model="managerInfo.phone" style="width: 400px" placeholder="请输入管理员电话号码"></el-input>
      </el-form-item>
    </el-form>
  </el-row>
  <el-row>
    <el-button @click="goPreviousStep">上一步</el-button>
    <el-button type="primary" @click="onSubmit">完成</el-button>
  </el-row>
</template>

<script lang="ts">
import { computed, ref, SetupContext, WritableComputedRef, getCurrentInstance } from 'vue';
import { validateAccount } from '@/api/tenant';

// 管理员信息接口
interface ManagerInfoInterface {
  account: string;
  name: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export default {
  name: 'ManagerInfo',
  emits: ['go', 'submit'],
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
    modelValue: {
      type: Object,
      default: () => ({
        contact: {},
        manager: {},
      }),
    },
  },
  setup(props: { isEdit: boolean; modelValue: any }, ctx: SetupContext) {
    // 表单引用
    const formRef: any = ref(null);

    // 组件实例
    const instance = getCurrentInstance();

    // 管理员信息
    const managerInfo: WritableComputedRef<ManagerInfoInterface> = computed(() => props.modelValue.manager);

    // 初始密码校验
    const validatePass = (rule: any, value: string, callback: Function) => {
      if (value !== '') {
        // 密码输入不能与帐号或手机号相同
        if (value === managerInfo.value.account || value === managerInfo.value.phone) {
          callback(new Error('密码不能与帐号或手机号相同'));
        }
        formRef.value.validateField('confirmPassword');
      }
      callback();
    };

    // 密码再次输入校验
    const checkPasswordValidator = (rule: any, value: string, callback: Function) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else {
        if (value !== props.modelValue.manager.password) {
          callback(new Error('两次输入密码不一致'));
        }
        callback();
      }
    };

    // 表单校验规则
    const rules = {
      account: [
        { required: true, message: '请输入管理员账号', trigger: 'blur' },
        { min: 3, max: 20, message: '管理员账号长度在2到40个字符之间', trigger: 'blur' },
        { pattern: /^[a-z0-9-]+$/g, message: '包含非法字符，只能输入小写字母、数字、中划线', trigger: 'blur' },
      ],
      name: [
        { required: true, message: '请输入管理人中文姓名', trigger: 'blur' },
        { min: 2, max: 20, message: '联系人姓名长度在2到40个字符之间', trigger: 'blur' },
        { pattern: /^[\u4e00-\u9fa5]+$/g, message: '联系人姓名仅支持中文', trigger: 'blur' },
      ],
      phone: [
        { required: true, message: '请输入联系人电话', trigger: 'blur' },
        { pattern: /^\d{11}$/g, message: '联系人电话输入格式不合法，请重新输入', trigger: 'blur' },
      ],
      password: [
        { required: true, message: '请输入初始密码', trigger: 'blur' },
        { min: 8, max: 16, message: '密码长度在8到16位', trigger: 'blur' },
        { pattern: /^[a-zA-Z0-9_]+$/g, message: '包含非法字符，只能输入大小写字母、数字、下划线', trigger: 'blur' },
        { validator: validatePass, trigger: 'blur' },
      ],
      confirmPassword: [
        { required: true, message: '请再次确认初始密码', trigger: 'blur' },
        { validator: checkPasswordValidator, trigger: 'blur' },
      ],
    };

    const goPreviousStep = () => {
      ctx.emit('go', 2);
    };

    const validateManagerAccount = async (el: any) => {
      if (el.target.value === '') {
        return;
      }
      const { data } = await validateAccount(el.target.value);
      if (!data.usable) {
        (instance as any).proxy.$message({
          type: 'error',
          message: '企业英文简称已存在，请重新输入！',
        });
      }
    };

    const onSubmit = () => {
      formRef.value.validate((validator: boolean) => {
        if (validator) {
          ctx.emit('submit');
        }
      });
    };

    return {
      formRef,
      managerInfo,
      rules,
      goPreviousStep,
      validateManagerAccount,
      onSubmit,
    };
  },
};
</script>

<style scoped>
.managerinfo-form {
  width: 100%;
}
</style>
