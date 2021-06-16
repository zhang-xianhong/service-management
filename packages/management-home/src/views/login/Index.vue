<template>
  <el-row class="login">
    <el-col class="login-sidebar" :span="8">
      <div class="login-sidebar__nav" @click="backToHead">
        <i class="el-icon-arrow-left"></i>
        返回到首页
      </div>
      <div class="login-sidebar-introduce">
        <div class="login-sidebar-introduce__title">腾讯云CityBase积木平台</div>
        <ul class="login-sidebar-introduce__content">
          <li>是腾讯云CityBase数据、应用及服务建模开发中心，以模型为核心，主要提供如下能力：</li>
          <li>• 多源异构数据的快速接入、转换、融合；</li>
          <li>• 城市大体量二维、三维模型的轻量化；</li>
          <li>• 游戏级高逼真的云渲染；</li>
          <li>• 模型驱动的软件开发，实现微服务及应用的低代码构建和快速组装；</li>
          <li>• 城市基础设施全要素数字化基础数据模型，并开放给各产业合作伙伴，打通产业上下游。</li>
        </ul>
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
      // window.location.reload();
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
    display: inline-flex;
    flex-direction: column;
    justify-content: space-around;
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
      cursor: pointer;
      > a {
        color: #fff;
      }
    }
    &-introduce {
      margin: auto 40px 80px 50px;
      &__title {
        font-family: 'PingFangSC-Semibold';
        font-size: 18px;
        color: #fff;
      }
      &__content {
        padding: 0;
        margin: 0;
        margin-top: 24px;
        line-height: 24px;
        list-style: none;
        font-family: 'PingFangSC-Regular';
        font-size: 14px;
        color: #fff;
      }
    }
  }
  &-main {
    display: inline-flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
