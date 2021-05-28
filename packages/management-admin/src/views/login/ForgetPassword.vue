<template>
  <div class="password">
    <div class="password-header">
      <div class="password-header__icon">
        <img :src="tencentLogo" />
        <div class="password-header__icon--verb"></div>
        <img :src="citybaseLogo" />
      </div>
    </div>
    <div class="password-body">
      <div class="password-body__container">
        <packaged-steps width="600px" :active="activeStep" :data="steps"></packaged-steps>
        <keep-alive>
          <component :is="componentName" @submit="onSubmit">
            <div v-if="componentName === 'Complete'" class="complete-container">
              <div class="complete-container__title"><img :src="completeLogo" /><span>设置密码成功</span></div>
              <el-button class="complete-container__btn" type="primary" @click="backToLogin">立即登录</el-button>
            </div>
          </component>
        </keep-alive>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import PackagedSteps from '@/components/packaged-steps/Index.vue';
import Email from './components/Email.vue';
import Password from './components/Password.vue';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const tencentLogo = require('../../assets/img/tencent-logo.png');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const citybaseLogo = require('../../assets/img/citybase-logo.png');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const completeLogo = require('../../assets/img/complete.png');

export default defineComponent({
  name: 'ForgetPassword',
  components: {
    PackagedSteps,
    Email,
    Password,
    Complete: {
      setup(props, ctx) {
        return () => ctx.slots.default && ctx.slots.default();
      },
    },
  },
  setup() {
    const router = useRouter();
    const state = reactive({
      activeStep: 1,
      steps: [{ title: '1.验证邮箱' }, { title: '2.重置密码' }, { title: '3.完成' }],
      componentName: 'Email',
    });
    // TODO:忘记密码接口暂未开发
    const onSubmit = (type: 'email' | 'password') => {
      console.log(type);
    };
    const backToLogin = () => {
      router.push('/login');
    };
    return {
      ...toRefs(state),
      tencentLogo,
      citybaseLogo,
      completeLogo,
      onSubmit,
      backToLogin,
    };
  },
});
</script>

<style scoped lang="scss">
.password {
  background: #fff;
  height: 900px;
  &-header {
    height: 72px;
    border-bottom: 1px solid #e6e6e6;
    &__icon {
      float: left;
      padding-left: 120px;
      &--verb {
        width: 1px;
        display: inline-block;
        height: 50px;
        margin: 11px 20px;
        border-left: 1px solid #e6e6e6;
      }
    }
  }
  &-body {
    height: calc(100% - 70px);
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.complete-container {
  &__title {
    margin: 40px auto;
    width: 174px;
    display: flex;
    span {
      font-size: 20px;
      font-weight: bolder;
      margin-left: 16px;
    }
  }
  &__btn {
    width: 100%;
    height: 48px;
  }
}
</style>
