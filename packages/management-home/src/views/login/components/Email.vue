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
        <el-input v-model="emailInfo.email" placeholder="请输入您要找登录密码的邮箱号"></el-input>
      </el-form-item>
      <el-form-item prop="captcha">
        <el-input v-model="emailInfo.captcha" placeholder="请输入验证码">
          <template #suffix
            ><div class="email-captcha" :class="{ 'email-captcha__toash': isToash }" @click="sendVerifyCode">发送验证码</div></template
          >
        </el-input>
      </el-form-item>
      <el-form-item>
        <!-- <el-button class="email-btn" type="primary" @click="$emit('submit', 'password')">确定</el-button> -->
        <el-button class="email-btn" type="primary" @click="submit">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { ElMessage } from 'element-plus';
import { defineComponent, PropType, WritableComputedRef, computed, reactive, ref, SetupContext, onBeforeUnmount } from 'vue';

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

    const checkMail = (rule: any, szMail: string): boolean => {
      // const reg = /^[A-Za-z0-9]+([_.][A-Za-z0-9]+)*@([A-Za-z0-9-]+\.)+[A-Za-z]{2,6}$/;
      const reg = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/;
      return reg.test(szMail);
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
      captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
    };

    const sendVerifyCode = () => {
      // TODO 这里需要调接口 获取返回的验证码并保存下来
      // const backcaptcha = 获取的验证码；
      console.log(emailInfo.email); // 获取邮箱号
      console.log('发送验证码');
      const isLawful = checkMail('', emailInfo.email);
      if (!isLawful) {
        console.log('邮箱格式错误');
        ElMessage({
          type: 'error',
          message: '邮箱格式错误',
        });
      } else {
        isToash.value = true;
        timeout.value = setTimeout(() => {
          console.log('islawful', isLawful);
          isToash.value = false;
        }, 5000);
      }
    };

    const submit = () => {
      // eslint-disable-next-line no-unused-expressions
      form.value?.validate(async (valid: boolean) => {
        if (valid) {
          // const { code } = await
          if (emailInfo.captcha !== '123456') {
            console.log('dosomething');
            ElMessage({
              type: 'error',
              message: '验证码错误',
            });
          } else {
            console.log('email', emailInfo.email);
            const payload = {
              email: emailInfo.email,
              type: 'password',
            };
            ctx.emit('submit', payload);
          }
        }
      });
    };

    onBeforeUnmount(() => {
      clearTimeout(timeout.value);
      console.log('clearTimeout');
    });

    return {
      emailInfo,
      form,
      rules,
      isToash,
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
      color: #dcdfe6;
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
