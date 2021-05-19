<template>
  <div class="email">
    <h1>重置密码</h1>
    <el-input v-model="passwordInfo.password" type="password" placeholder="请输入您的新密码"></el-input>
    <el-input v-model="passwordInfo.confirmPassword" type="password" placeholder="请再次输入您的新密码"></el-input>
    <el-button class="email-btn" type="primary" @click="$emit('submit', 'password')">提交</el-button>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, WritableComputedRef, computed } from 'vue';

interface PasswordInfoInterface {
  password: string;
  confirmPassword: string;
}

export default defineComponent({
  name: 'Password',
  props: {
    data: {
      type: Object as PropType<PasswordInfoInterface>,
      default: () => ({ password: '', confirmPassword: '' }),
    },
  },
  emits: ['submit'],
  setup(props: { data: PasswordInfoInterface }) {
    const passwordInfo: WritableComputedRef<PasswordInfoInterface> = computed(() => props.data);
    return {
      passwordInfo,
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
