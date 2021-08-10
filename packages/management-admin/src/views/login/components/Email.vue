<template>
  <div class="email">
    <div class="email-head">
      <div class="email-head-left">验证邮箱</div>
      <div class="email-head-right">
        <span>已有账号？</span>
        <a href="/login">马上登录</a>
      </div>
    </div>
    <el-form :model="emailInfo" :rules="rules" ref="form">
      <el-form-item prop="email">
        <el-input v-model="emailInfo.email" placeholder="请输入账号验证邮箱"></el-input>
      </el-form-item>
      <el-form-item prop="captcha">
        <el-input v-model="emailInfo.captcha" placeholder="请输入验证码">
          <template #suffix
            ><div class="email-captcha" :class="{ 'email-captcha__toash': isToash }" @click="sendVerifyCode">
              {{ isToash ? reSend : '发送验证码' }}
            </div></template
          >
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="email-btn" type="primary" @click="submit">下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { ElMessage } from 'element-plus';
// import { sendRetrievePasswordVerifyCode } from '@/api/servers/index';
import { sendRetrievePasswordVerifyCode } from '@/api/tenant';
import {
  defineComponent,
  PropType,
  WritableComputedRef,
  computed,
  reactive,
  ref,
  SetupContext,
  onBeforeUnmount,
} from 'vue';

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
  setup(props: { data: EmailInfoInterface }, ctx: SetupContext) {
    const emailInfos: WritableComputedRef<EmailInfoInterface> = computed(() => props.data);
    const emailInfo: EmailInfoInterface = reactive({
      email: '',
      captcha: '',
    });
    const form: any = ref(null);
    const isToash = ref(false);
    const timeout = ref(null as any);
    const reSend = ref('');

    const checkMail = (rule: any, szMail: string): boolean => {
      const reg = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/;
      return reg.test(szMail);
    };

    const checkCaptcha = (rule: any, captcha: string): boolean => {
      const reg = /^\d{6}$/;
      return reg.test(captcha);
    };

    const rules = {
      email: [
        { required: true, message: '请输入验证邮箱号', trigger: 'blur' },
        {
          validator: checkMail,
          message: '以字母、数字、下滑线开头，中间必须包括@符号,@之后需要连接字母、数字、下滑线及点号',
          trigger: 'blur',
        },
      ],
      captcha: [
        { required: true, message: '请输入验证码', trigger: 'blur' },
        {
          validator: checkCaptcha,
          message: '验证码应为6位有效数字',
          trigger: 'blur',
        },
      ],
    };

    const sendVerifyCode = async () => {
      const isLawful = checkMail('', emailInfo.email);
      if (!emailInfo.email) {
        ElMessage({
          type: 'error',
          message: '请输入邮箱号',
        });
      } else {
        if (!isLawful) {
          ElMessage({
            type: 'error',
            message: '邮箱格式错误',
          });
        } else {
          const { code } = await sendRetrievePasswordVerifyCode({
            userEmail: emailInfo.email,
          });
          if (code === 0) {
            isToash.value = true;
            let timeo = 60;
            reSend.value = `重新发送(${timeo})s`;
            timeout.value = setInterval(() => {
              // eslint-disable-next-line no-plusplus
              timeo--;
              if (timeo > 0) {
                reSend.value = `重新发送(${timeo})s`;
              } else {
                timeo = 60;
                isToash.value = false;
                clearInterval(timeout.value);
              }
            }, 1000);
          }
        }
      }
    };

    const submit = () => {
      // eslint-disable-next-line no-unused-expressions
      form.value?.validate(async (valid: boolean) => {
        if (valid) {
          // 讲道理这里需要调一下后端接口判断输入的验证码是否正确，才能放行，目前这里无接口，未进行判断
          const payload = {
            email: emailInfo.email,
            captcha: emailInfo.captcha,
            type: 'password',
          };
          ctx.emit('submit', payload);
        }
      });
    };

    onBeforeUnmount(() => {
      clearInterval(timeout.value);
    });

    return {
      emailInfo,
      form,
      rules,
      isToash,
      reSend,
      emailInfos,
      sendVerifyCode,
      submit,
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
  &-head {
    display: flex;
    justify-content: space-between;
    margin-bottom: 30px;
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
  &-captcha {
    color: #006eff;
    width: 172px;
    height: 48px;
    line-height: 48px;
    border-left: 1px solid #dcdfe6;
    cursor: pointer;
    &__toash {
      color: #aaa;
      pointer-events: none;
    }
  }
  &-btn {
    width: 100%;
    height: 48px;
  }
  .el-form-item {
    margin-bottom: 2em;
  }
}
</style>
