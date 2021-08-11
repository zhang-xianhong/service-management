<template>
  <div class="reset-password__container">
    <div class="password-head">
      <div class="password-head-left">重置密码</div>
      <div class="password-head-right">
        <span>已有账号？</span>
        <a href="/login">马上登录</a>
      </div>
    </div>
    <el-form :model="formData" :rules="rules" ref="form" class="password-reset__form">
      <el-form-item prop="password" size="large">
        <el-input v-model="formData.password" placeholder="请输入您的新密码" show-password></el-input>
      </el-form-item>
      <el-form-item prop="confirmationPassword" size="large">
        <el-input v-model="formData.confirmationPassword" placeholder="请再次输入您的新密码" show-password></el-input>
      </el-form-item>
      <el-form-item size="large">
        <el-button class="reset-btn" type="primary" @click="submit">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, reactive, ref, SetupContext } from 'vue';
import { ConfirmPasswordRules, PasswordRules } from '@/utils/validate';
import { retrievePassword } from '@/api/tenant';
import useMsg from '../useMsg';
export default defineComponent({
  name: 'Password',
  props: {
    email: {
      type: String as PropType<string>,
      default: '',
    },
    userId: {
      type: Number as PropType<number>,
      default: 0,
    },
    code: {
      type: String as PropType<string>,
      default: '',
    },
    captcha: {
      type: String as PropType<string>,
      default: '',
    },
  },
  setup(props, ctx: SetupContext) {
    const formData = reactive({
      password: '',
      confirmationPassword: '',
      email: computed(() => props.email),
      verifyCode: computed(() => props.captcha),
    });
    const form: any = ref(null);
    const { msgTips } = useMsg();
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
      } else {
        callback();
      }
    };
    const rules = {
      password: [...PasswordRules, { validator: validatePassword, trigger: 'blur' }],
      confirmationPassword: [...ConfirmPasswordRules, { validator: validateConfirmationPassword, trigger: 'blur' }],
    };
    const submit = () => {
      form.value.validate(async (valid: boolean) => {
        if (valid) {
          if (formData.password !== formData.confirmationPassword) {
            msgTips('error', '两次输入密码不一致');
          } else {
            const { code } = await retrievePassword({
              userEmail: formData.email,
              verifyCode: formData.verifyCode,
              firstInputNewPassword: formData.password,
              secondInputNewPassword: formData.confirmationPassword,
            });
            if (code === 0) {
              msgTips('success', '密码重置成功');
              const payload = {
                type: 'Complete',
              };
              ctx.emit('submit', payload);
            } else {
              msgTips('error', '密码重置失败');
            }
          }
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
  width: 560px;
  .password-head {
    margin-bottom: 30px;
    display: flex;
    justify-content: space-between;
    &-left {
      font-size: 20px;
      font-weight: bolder;
    }
    &-right {
      font-size: 16px;
      color: #aaa;
      & > a {
        text-decoration: underline;
        color: #aaa;
      }
    }
  }
  .password-reset__form {
    .el-form-item {
      width: 100%;
      margin-bottom: 3em;
    }
    .reset-btn {
      width: 100%;
    }
  }
}
</style>
