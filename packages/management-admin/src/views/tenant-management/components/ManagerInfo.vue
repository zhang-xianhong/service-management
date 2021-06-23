<template>
  <el-row class="tenant-title">管理员信息</el-row>
  <el-row>
    <el-form
      class="managerinfo-form"
      ref="formRef"
      :model="managerInfo"
      :rules="rules"
      inline
      label-width="140px"
      label-position="left"
    >
      <el-form-item prop="userName" class="form-item" label="管理员账号">
        <template v-if="!isCreate">{{ managerInfo.userName }}</template>
        <el-input
          v-else
          v-model="managerInfo.userName"
          style="width: 400px"
          placeholder="请输入小写英文账号"
          maxlength="20"
        ></el-input>
      </el-form-item>
      <el-form-item prop="primaryMail" class="form-item" label="管理员邮箱">
        <template v-if="!isEdit">{{ managerInfo.primaryMail }}</template>
        <el-input
          v-else
          v-model="managerInfo.primaryMail"
          style="width: 400px"
          placeholder="请输入管理员邮箱"
        ></el-input>
      </el-form-item>
      <el-form-item prop="displayName" class="form-item" label="管理员姓名">
        <template v-if="!isEdit">{{ managerInfo.displayName }}</template>
        <el-input
          v-else
          v-model="managerInfo.displayName"
          style="width: 400px"
          maxlength="20"
          placeholder="请输入中文租户管理员姓名"
        ></el-input>
      </el-form-item>
      <el-form-item v-if="isCreate" prop="password" class="form-item" label="初始密码">
        <el-input
          show-password
          v-model="managerInfo.password"
          style="width: 400px"
          placeholder="请输入初始密码"
        ></el-input>
        <el-button type="text" v-if="managerInfo.password" class="btn-copy" @click="handleCopy">复制</el-button>
      </el-form-item>
      <el-form-item prop="phoneNumber" class="form-item" label="管理员电话">
        <template v-if="!isEdit">{{ managerInfo.phoneNumber }}</template>
        <el-input
          v-else
          v-model="managerInfo.phoneNumber"
          style="width: 400px"
          placeholder="请输入管理员电话号码"
        ></el-input>
      </el-form-item>
      <el-form-item v-if="isCreate" prop="confirmPassword" class="form-item" label="确认初始密码">
        <el-input
          show-password
          v-model="managerInfo.confirmPassword"
          style="width: 400px"
          placeholder="请确认初始密码"
        ></el-input>
      </el-form-item>
    </el-form>
  </el-row>
</template>

<script lang="ts">
import { computed, ref, WritableComputedRef, Ref } from 'vue';
import ManagerInfoInterface from '../types/manager-info-interface';
import { copyFun } from '@/utils';

export default {
  name: 'ManagerInfo',
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
    isCreate: {
      type: Boolean,
      default: false,
    },
    modelValue: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props: { isEdit: boolean; isCreate: boolean; modelValue: any }) {
    // 表单引用
    const formRef: Ref<any> = ref(null);

    // 管理员信息
    const managerInfo: WritableComputedRef<ManagerInfoInterface> = computed(() => props.modelValue);

    // 初始密码校验
    const validatePass = (rule: any, value: string) =>
      new Promise((resolve, reject) => {
        if (value !== '') {
          // 密码输入不能与帐号或手机号相同
          if (value === managerInfo.value.userName || value === managerInfo.value.phoneNumber) {
            reject(new Error('密码不能与帐号或手机号相同'));
          }
          formRef.value.validateField('confirmPassword');
        }
        resolve(true);
      });

    // // 密码再次输入校验
    const checkPasswordValidator = (rule: any, value: string) =>
      new Promise((resolve, reject) => {
        if (value === '') {
          reject(new Error('请再次输入密码'));
        } else {
          if (value !== managerInfo.value.password) {
            reject(new Error('两次输入密码不一致'));
          }
          resolve(true);
        }
      });

    // 表单校验规则
    const rules = {
      userName: [
        { required: true, message: '请输入管理员账号' },
        { min: 2, max: 20, message: '管理员账号长度在2到20个字符之间', trigger: 'blur' },
        { pattern: /^[a-z0-9-]+$/g, message: '包含非法字符，只能输入小写字母、数字、中划线', trigger: 'blur' },
      ],
      displayName: [
        { required: true, message: '请输入管理员中文姓名' },
        { min: 2, max: 20, message: '管理员姓名长度在2到20个字符之间', trigger: 'blur' },
        { pattern: /^[\u4e00-\u9fa5]+$/g, message: '联系人姓名仅支持中文', trigger: 'blur' },
      ],
      phoneNumber: [
        { required: true, message: '请输入管理员电话' },
        { pattern: /^\d{11}$/g, message: '管理员电话输入格式不合法，请重新输入', trigger: 'blur' },
      ],
      primaryMail: [
        { required: true, message: '请输入邮箱地址', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' },
      ],
      password: [
        { required: true, message: '请输入初始密码' },
        { min: 8, max: 16, message: '密码长度在8到16位', trigger: 'blur' },
        { pattern: /^[a-zA-Z0-9_]+$/g, message: '包含非法字符，只能输入大小写字母、数字、下划线', trigger: 'blur' },
        { validator: validatePass, trigger: 'blur' },
      ],
      confirmPassword: [
        { required: true, message: '请确认初始密码' },
        { validator: checkPasswordValidator, trigger: 'blur' },
      ],
    };

    // 复制密码
    const handleCopy = () => {
      copyFun(managerInfo.value.password);
    };

    return {
      formRef,
      managerInfo,
      rules,
      handleCopy,
    };
  },
};
</script>

<style scoped>
.managerinfo-form {
  width: 100%;
}
.btn-copy {
  position: absolute;
  right: 35px;
  top: 0;
}
</style>
