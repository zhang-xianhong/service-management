<template>
  <div class="reset-password__container">
    <h1>重置CityBase密码</h1>
    <el-form :model="formData" :rules="rules" ref="form" label-width="100px" class="password-reset__form">
      <el-form-item label="邮箱" prop="email" size="large">
        <el-input :model-value="formData.email" type="email" placeholder="请输入您的邮箱地址" readonly></el-input>
      </el-form-item>
      <el-form-item label="设置登录密码" prop="password" size="large">
        <el-input v-model="formData.password" type="password" placeholder="请输入您的新密码" show-password></el-input>
      </el-form-item>
      <el-form-item label="确认登录密码" prop="confirmationPassword" size="large">
        <el-input
          v-model="formData.confirmationPassword"
          type="password"
          placeholder="请再次输入您的新密码"
          show-password
        ></el-input>
      </el-form-item>
      <el-form-item size="large">
        <el-button class="reset-btn" type="primary" @click="submit">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, reactive, ref } from 'vue';
import { PasswordRules } from '@/utils/validate';
import { resetPassWord } from '@/api/company/users';
import useMsg from '../useMsg';
export default defineComponent({
  name: 'Password',
  props: {
    email: {
      type: String as PropType<string>,
      default: 'hi@1990',
    },
    userId: {
      type: Number as PropType<number>,
      default: 0,
    },
    code: {
      type: String as PropType<string>,
      default: '',
    },
  },
  setup(props) {
    const formData = reactive({
      password: '',
      confirmationPassword: '',
      email: computed(() => props.email),
    });
    const form: any = ref(null);

    // 获取组件实例
    const { msgTips, goLoginPages } = useMsg();
    const validatePassword = (rule: any, value: string, callback: Function) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (formData.confirmationPassword !== '') {
          // eslint-disable-next-line no-unused-expressions
          form.value?.validateField('confirmationPassword');
        }
        callback();
      }
    };
    const validateConfirmationPassword = (rule: any, value: string, callback: Function) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== formData.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    const rules = {
      password: [...PasswordRules, { validator: validatePassword, trigger: 'blur' }],
      confirmationPassword: [
        { required: true, message: '请再次输入新的密码', trigger: 'blur' },
        { validator: validateConfirmationPassword, trigger: 'blur' },
      ],
    };

    const submit = () => {
      // disable submit
      // eslint-disable-next-line no-unused-expressions
      form.value?.validate(async (valid: boolean) => {
        if (valid) {
          const { code } = await resetPassWord({
            resetCode: props.code,
            newPassword: formData.password,
            userId: props.userId,
          });
          if (code === 0) {
            msgTips('success', '密码重置成功');
          } else {
            msgTips('error', '密码重置失败');
          }
          goLoginPages();
        } else {
          return false;
        }
      });
    };
    return {
      formData,
      rules,
      form,
      submit,
    };
  },
});
</script>
<style scoped lang="scss">
.reset-password__container {
  width: 500px;
  h1 {
    margin-bottom: 30px;
    text-align: center;
  }
  .password-reset__form {
    .el-form-item {
      margin-bottom: 2em;
    }
    .reset-btn {
      width: 100%;
    }
  }
}
</style>
