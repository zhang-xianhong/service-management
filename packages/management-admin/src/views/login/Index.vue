<template>
  <el-row class="login">
    <el-col class="login-sidebar" :span="8">
      <div class="login-sidebar__nav" @click="backToHead">
        <i class="el-icon-arrow-left"></i>
        返回到首页
      </div>
    </el-col>
    <el-col class="login-main" :span="16">
      <login-form></login-form>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import LoginForm from './components/LoginForm.vue';

export default defineComponent({
  name: 'Login',
  components: {
    LoginForm,
  },
  setup() {
    const backToHead = () => {
      window.location.href = 'https://citybase.qq.com';
      window.location.reload();
    };
    return {
      backToHead,
    };
  },
});
</script>

<style scoped lang="scss">
$image: url(~@/assets/img/citybase-login.jpg);
.login {
  height: 100%;
  background: #fff;
  &-sidebar {
    display: inline-block;
    width: 524px;
    height: 100%;
    color: #fff;
    background: $image no-repeat #f0f0f0;
    background-size: cover;
    &__nav {
      display: inline-block;
      margin: 46px auto auto 50px;
      height: 24px;
      line-height: 24px;
      font-size: 18px;
      letter-spacing: 0;
    }
  }
  &-main {
    display: inline-flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
