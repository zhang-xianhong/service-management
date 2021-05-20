<template>
  <div class="email">
    <h1>验证邮箱</h1>
    <el-input v-model="emailInfo.email" placeholder="请输入您要找登录密码的邮箱号"></el-input>
    <el-input v-model="emailInfo.captcha" placeholder="请输入验证码">
      <template #suffix><div class="email-captcha">发送验证码</div></template>
    </el-input>
    <el-button class="email-btn" type="primary" @click="$emit('submit', 'email')">确定</el-button>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, WritableComputedRef, computed } from 'vue';

interface EmailInfoInterface {
  email: string;
  captcha: string;
}

export default defineComponent({
  name: 'Email',
  props: {
    data: {
      type: Object as PropType<EmailInfoInterface>,
      default: () => ({ email: '', captcha: '' }),
    },
  },
  emits: ['submit'],
  setup(props: { data: EmailInfoInterface }) {
    const emailInfo: WritableComputedRef<EmailInfoInterface> = computed(() => props.data);
    return {
      emailInfo,
    };
  },
});
</script>

<style lang="scss">
.email {
  .el-input__inner {
    height: 48px;
    margin-bottom: 16px;
  }
  .el-input__suffix-inner {
    height: 48px;
  }
}
</style>

<style scoped lang="scss">
.email {
  h1 {
    margin-bottom: 30px;
  }
  &-captcha {
    color: #006eff;
    width: 172px;
    height: 48px;
    line-height: 48px;
    border-left: 1px solid #dcdfe6;
  }
  &-btn {
    width: 100%;
    height: 48px;
  }
}
</style>
