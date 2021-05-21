<template>
  <el-row style="font-size: 12px; font-weight: bolder">管理员信息</el-row>
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
      <el-form-item prop="account" class="form-item" label="管理员账号" required>
        {{ managerInfo.account }}
      </el-form-item>
      <!-- <el-form-item prop="password" class="form-item" label="初始密码" required>
        {{ managerInfo.password }}
      </el-form-item> -->
      <el-form-item prop="name" class="form-item" label="管理员姓名" required>
        {{ managerInfo.name }}
      </el-form-item>
      <!-- <el-form-item prop="confirmPassword" class="form-item" label="确认初始密码" required>
        {{ managerInfo.confirmPassword }}
      </el-form-item> -->
      <el-form-item prop="phone" class="form-item" label="管理员电话" required>
        {{ managerInfo.phone }}
      </el-form-item>
      <el-form-item prop="email" class="form-item" label="管理员邮箱" required>
        {{ managerInfo.email }}
      </el-form-item>
    </el-form>
  </el-row>
</template>

<script lang="ts">
import { computed, ref, SetupContext, WritableComputedRef } from 'vue';

interface ManagerInfoInterface {
  account: string;
  name: string;
  email: string;
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
      default: () => ({}),
    },
  },
  setup(props: { isEdit: boolean; modelValue: any }, ctx: SetupContext) {
    // 表单引用
    const formRef: any = ref(null);

    // 管理员信息
    const managerInfo: WritableComputedRef<ManagerInfoInterface> = computed({
      get: () => props.modelValue?.manager || {},
      set: (newValue: any) => ctx.emit('update:modelValue', newValue),
    });

    // 初始密码校验
    const validatePass = (rule: any, value: string, callback: Function) => {
      if (value !== '') {
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
        { required: true, message: '请输入管理员账号' },
        { min: 3, max: 20, message: '管理员账号长度在2到40个字符之间', trigger: 'blur' },
        { pattern: /^[a-zA-Z0-9-]+$/g, message: '包含非法字符，只能输入小写字母、数字、中划线', trigger: 'blur' },
      ],
      name: [
        { required: true, message: '请输入管理员中文姓名' },
        { min: 3, max: 20, message: '管理员姓名长度在2到40个字符之间', trigger: 'blur' },
        { pattern: /^[\u4e00-\u9fa5]+$/g, message: '联系人姓名仅支持中文', trigger: 'blur' },
      ],
      phone: [
        { required: true, message: '请输入管理员电话' },
        { pattern: /^\d{11}$/g, message: '管理员电话输入格式不合法，请重新输入', trigger: 'blur' },
      ],
      email: [
        { required: true, message: '请输入管理员邮箱', trigger: 'blur' },
        {
          pattern: /^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/g,
          message: '管理员邮箱输入格式不合法，请重新输入',
          trigger: 'blur',
        },
      ],
      password: [
        { required: true, message: '请输入初始密码' },
        { min: 8, max: 16, message: '密码长度在8到16位', trigger: 'blur' },
        { validator: validatePass, trigger: 'blur' },
      ],
      confirmPassword: [{ validator: checkPasswordValidator, trigger: 'blur' }],
    };

    return {
      formRef,
      managerInfo,
      rules,
    };
  },
};
</script>

<style scoped>
.managerinfo-form {
  width: 100%;
}
</style>
