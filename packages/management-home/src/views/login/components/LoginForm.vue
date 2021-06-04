<template>
  <div class="form">
    <h1>登录</h1>
    <el-form ref="formRef" :model="loginInfo" :rules="formRules">
      <el-form-item prop="username">
        <el-input class="form-item" v-model="loginInfo.username" placeholder="帐号"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          type="password"
          show-password
          class="form-item"
          v-model="loginInfo.password"
          placeholder="密码"
          minlength="8"
        ></el-input>
      </el-form-item>
      <el-form-item prop="captchaCode">
        <el-input
          class="form-item"
          v-model="loginInfo.captchaCode"
          placeholder="验证码"
          @change="onInputCaptchaCode"
        >
          <template #suffix>
            <el-button id="success-btn" v-if="isPassed" type="success" circle>
              <i class="el-icon-check"></i>
            </el-button>
            <img @click="getCaptchaUrl" :src="captchaUrl" />
          </template>
        </el-input>
      </el-form-item>
    </el-form>
    <el-button class="form-item__btn" type="primary" @click="onLogin" :loading="loading">登录</el-button>
    <!-- TODO:后续版本开发 -->
    <!-- <div class="form-item__link" @click="goForgetPassword">忘记密码?</div> -->
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, Ref, getCurrentInstance } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getCaptcha, login, getCode, verifyCaptcha } from '@/api/auth';
import { getUser } from '@/shared/userinfo';

export default defineComponent({
  name: 'LoginForm',
  setup() {
    const instance = getCurrentInstance();
    const formRef: Ref<any> = ref(null);
    const router = useRouter();
    const route = useRoute();
    const loginInfo = reactive({
      username: '',
      password: '',
      captchaCode: '',
    });
    const captchaUrl = ref('');

    const formRules = {
      username: [{ required: true, message: '帐号不能为空!', trigger: 'blur' }],
      password: [
        { required: true, message: '密码不能为空!', trigger: 'blur' },
        { min: 8, max: 20, message: '密码长度为 8 到 20 个字符', trigger: 'blur' },
      ],
      captchaCode: [{ required: true, message: '验证码不能为空!', trigger: 'blur' }],
    };

    const getCaptchaUrl = async () => {
      const { data } = await getCaptcha();
      captchaUrl.value = data;
    };
    getCaptchaUrl();

    const goForgetPassword = () => {
      router.push('/login/forget-password');
    };

    const isPassed: Ref<boolean> = ref(false);

    const onInputCaptchaCode = async (value: string) => {
      if (!value) {
        isPassed.value = false;
        return;
      }
      try {
        const { data } = await verifyCaptcha({ captchaCode: value });
        if (data) {
          isPassed.value = true;
        } else {
          isPassed.value = false;
        }
      } catch (error) {
        isPassed.value = false;
      }
    };

    const loading: Ref<boolean> = ref(false);

    const onLogin = async () => {
      formRef.value.validate(async (valid: boolean) => {
        if (valid) {
          try {
            loading.value = true;
            const { data } = await getCode({
              captchaCode: loginInfo.captchaCode,
            });
            const { code } = await login({
              account: loginInfo.username,
              loginVerifyCode: data.loginVerifyCode,
              secret: `${loginInfo.password}.${data.code}`,
            });
            if (code === 0) {
              await getUser();
              loading.value = false;
              if (route.params.redirect) {
                router.push(route.params.redirect as string);
              }
              router.push('/');
            } else {
              loading.value = false;
              loginInfo.captchaCode = '';
              isPassed.value = false;
              getCaptchaUrl();
              let msg = '';
              switch (code) {
                case 1105001:
                  msg = '验证码错误！';
                  break;
                case 1118000:
                  msg = '该账号已处于禁用状态，请联系管理员申请权限!';
                  break;
                default:
                  msg = '帐号或密码错误，请重新输入！';
              }
              (instance as any).proxy.$message({
                type: 'error',
                message: msg,
              });
            }
          } catch {
            loading.value = false;
            loginInfo.captchaCode = '';
            isPassed.value = false;
            getCaptchaUrl();
          }
        }
      });
    };
    return {
      formRef,
      loading,
      loginInfo,
      captchaUrl,
      formRules,
      getCaptchaUrl,
      goForgetPassword,
      isPassed,
      onInputCaptchaCode,
      onLogin,
    };
  },
});
</script>

<style lang="scss">
.form-item {
  .el-input__inner {
    height: 48px;
  }
  .el-input__suffix {
    right: 0px;
  }
}
</style>

<style scoped lang="scss">
.form {
  &-item {
    display: block;
    width: 400px;
    height: 48px;
    line-height: 48px;
    margin-bottom: 16px;
    &__btn {
      width: 400px;
      height: 48px;
      font-size: 14px;
    }
    &__link {
      color: #bbb;
      cursor: pointer;
    }
    img {
      width: 130px;
      height: 100%;
      border-left: 1px solid #dcdfe6;
      cursor: pointer;
    }
  }
}
#success-btn {
  height: 16px;
  width: 16px;
  border-radius: 50%;
  transform: translateY(-90%);
  min-height: 0px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin-right: 8px;
}
</style>
