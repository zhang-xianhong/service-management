<template>
  <reset-password>
    <password-form :email="email" :userId="userId" :code="code"></password-form>
  </reset-password>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import LoginPage from './Index.vue';
import PasswordForm from './components/Password.vue';
import { verifyCouldResetPassword } from '@/api/company/users';
import useMsg from './useMsg';
export default defineComponent({
  components: {
    ResetPassword: LoginPage,
    PasswordForm,
  },
  setup() {
    const email = ref('');
    const userId = ref(0);
    const code = ref('');
    onMounted(async () => {
      // 验证code是否合法
      // 从URL 获取code
      const params = new URL(document.location.href).searchParams;
      const verifyCode = params.get('code');
      const uid = params.get('uid');
      const { msgTips, goLoginPages } = useMsg();

      if (!verifyCode || !uid) {
        msgTips('error', '该链接无效');
        goLoginPages();
        return;
      }
      try {
        const { code: responseCode, data } = await verifyCouldResetPassword({
          code: verifyCode,
          userId: Number(uid),
        });
        if (responseCode === 0) {
          if (data.invalid) {
            // 不合法
            msgTips('error', '该链接已过期');
            goLoginPages();
          } else {
            // 合法
            email.value = data.primaryMail;
            userId.value = Number(uid);
            code.value = verifyCode;
          }
        }
      } catch (error) {
        console.log(error);
      }
    });
    return {
      email,
      userId,
      code,
    };
  },
});
</script>

<style></style>
