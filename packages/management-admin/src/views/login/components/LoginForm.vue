<template>
  <div class="form">
    <h1>登录</h1>
    <el-input class="form-item" v-model="loginInfo.username" placeholder="帐号"></el-input>
    <el-input
      type="password"
      show-password
      class="form-item"
      v-model="loginInfo.password"
      placeholder="密码"
    ></el-input>
    <el-input class="form-item" v-model="loginInfo.captchaCode" placeholder="验证码">
      <template #suffix>
        <img @click="getCaptchaUrl" :src="captchaUrl" />
      </template>
    </el-input>
    <el-button class="form-item" type="primary" @click="onLogin">登录</el-button>
    <div class="form-item__link" @click="goForgetPassword">忘记密码?</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { getCaptcha, login } from '@/api/login';

export default defineComponent({
  name: 'LoginForm',
  setup() {
    const router = useRouter();
    const loginInfo = reactive({
      username: '',
      password: '',
      captchaCode: '',
    });
    const captchaUrl = ref('');

    const getCaptchaUrl = async () => {
      const { data } = await getCaptcha();
      captchaUrl.value = data;
    };
    getCaptchaUrl();

    const goForgetPassword = () => {
      router.push('/login/forget-password');
    };

    const onLogin = async () => {
      const { code } = await login(loginInfo);
      if (code === 0) {
        router.push('/');
      }
    };
    return {
      loginInfo,
      captchaUrl,
      getCaptchaUrl,
      goForgetPassword,
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
    margin-bottom: 16px;
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
</style>
