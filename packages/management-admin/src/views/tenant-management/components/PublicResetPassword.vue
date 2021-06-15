<template>
  <el-dialog title="重置密码" v-model="visible" width="500px" :close-on-click-modal="false" :destroy-on-close="true">
    <div>
      <el-form :model="formData" ref="resetForm" :rules="rules">
        <el-form-item label-width="100px" label="重置方式">
          <el-select placeholder="请选择重置密码的方式" v-model="configuration.current" style="width: 100%">
            <el-option v-for="item in configuration.options" :key="item.value" :label="item.label" :value="item.value">
              {{ item.label }}
            </el-option>
          </el-select>
        </el-form-item>
        <template v-if="configuration.isRandom">
          <el-form-item prop="newPassword" label-width="100px">
            <template v-slot:label>
              <span> 新密码 </span>
              <el-tooltip :content="helper" placement="top" effect="light" style="margin-right: 5px">
                <svg-icon icon-name="wenhao" icon-class="detail-icons__item"></svg-icon>
              </el-tooltip>
            </template>

            <el-input
              v-if="formData.newPassword"
              v-model.trim="formData.newPassword"
              placeholder="请输入新的密码"
              show-password
            ></el-input>
            <el-button type="text" @click="handleCopy" class="btn-copy">复制</el-button>
          </el-form-item>
        </template>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="submit">保存</el-button>
        <el-button @click="cancel">返回</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, watch, getCurrentInstance } from 'vue';
import { useResetOptions } from '../utils/ResetOptions';
import { generatePasswd, copyFun } from '@/utils';
import { resetPassWd, sendMailForResetPassword, MailType } from '@/api/tenant';
// 状态码
enum ResCode {
  Success,
}
// 密码重置
interface ResetFormState {
  newPassword: any[];
}
// 自定义密码校验  长度在 8 到 16 个字符,只能输入大小写字母、数字、特殊字符（(!@#$%^&),至少1个大写字母，1个小写字母
function checkPasswd(passwd: string): boolean {
  const szReg = /^(?=.*[a-z])(?=.*[A-Z])[A-Za-z\d（!@#$%^&)]{8,16}/;
  return szReg.test(passwd);
}
const HELP_MSG = '长度在 8 到 16 个字符,只能输入大小写字母、数字、特殊字符（(!@#$%^&),至少1个大写字母，1个小写字母';
// 密码校验
const validatorPasswdPass = (rule: any, value: string, callback: Function) => {
  if (!checkPasswd(value)) {
    callback(new Error(HELP_MSG));
  }
  callback();
};

export default defineComponent({
  name: 'PublicResetPassword',
  setup() {
    const visible = ref(false);
    const userId = ref(0);
    const newPassword = ref('');
    const formData = reactive({
      newPassword,
    });
    const rules: ResetFormState = {
      newPassword: [
        { required: true, message: '请输入新的密码', trigger: 'blur' },
        { validator: validatorPasswdPass, trigger: 'blur' },
      ],
    };
    const { configuration } = useResetOptions();
    const resetForm: any = ref(null);
    // 获取组件实例
    const instance = getCurrentInstance();

    const msgTips = (type: string, content: string) => {
      (instance as any).proxy.$message({
        type,
        message: content,
      });
    };
    // 复制密码
    const handleCopy = () => {
      copyFun(newPassword.value);
    };
    // 打开重置密码弹框
    const handleResetPasswd = (id: number) => {
      userId.value = id;
      visible.value = true;
    };
    const open = (id: number) => {
      userId.value = id;
      visible.value = true;
    };
    const close = () => {
      visible.value = false;
    };
    // 保存密码
    const savePassword = () => {
      // 校验密码-》保存密码-》copy 密码
      // eslint-disable-next-line no-unused-expressions
      resetForm.value?.validate(async (valid: boolean) => {
        if (valid) {
          const { code } = await resetPassWd({
            userId: userId.value,
            newPassword: newPassword.value,
          });
          if (code === ResCode.Success) {
            // 复制到剪切板上
            handleCopy();
            // msgTips('success', '密码重置成功');
          } else {
            msgTips('error', '密码重置失败');
          }
          close();
        }
      });
    };
    // 发送邮件
    // 发送邮件
    const sendMail = async () => {
      const RESET_PASSWORD_PATH = '/reset-password';
      const { code } = await sendMailForResetPassword({
        type: MailType.resetPassword,
        userId: userId.value,
        url: new URL(RESET_PASSWORD_PATH, window.location.origin),
      });
      if (code === ResCode.Success) {
        msgTips('success', '重置邮件已发送到邮箱，请及时更新');
      } else {
        msgTips('error', '重置邮件发送失败');
      }
      close();
    };
    watch(
      () => configuration.isRandom,
      (v) => {
        if (v) {
          // 如果当前选择的是随机密码
          newPassword.value = generatePasswd(12);
        } else {
          newPassword.value = '';
        }
      },
    );
    const resetData = () => {
      configuration.current = '';
    };
    // 每次打开新的对话框重置
    watch(visible, (v) => {
      if (v) {
        resetData();
      }
    });

    const submit = () => {
      if (!configuration.current) {
        msgTips('error', '请选择重置密码方式');
        return;
      }
      if (configuration.isRandom) {
        // 提交随机密码
        savePassword();
      } else {
        // 发送重置邮件
        sendMail();
      }
    };

    const cancel = () => {
      close();
    };
    return {
      visible,
      open,
      close,
      submit,
      cancel,
      userId,
      formData,
      rules,
      configuration,
      handleCopy,
      helper: HELP_MSG,
      resetForm,
      handleResetPasswd,
    };
  },
});
</script>

<style lang="scss" scoped>
.dialog-footer {
  width: 100%;
  display: block;
  text-align: center;
  margin-bottom: 20px;
}
.btn-copy {
  position: absolute;
  right: 35px;
  top: 0;
}
</style>
