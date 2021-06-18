<template>
  <el-dialog title="重置密码" v-model="visible" width="500px" :close-on-click-modal="false" :destroy-on-close="true">
    <div>
      <el-form :model="formData" ref="resetForm" :rules="rules">
        <el-form-item label-width="100px" label="重置方式">
          <el-select placeholder="请选择重置密码的方式" v-model="configuraion.current" style="width: 100%">
            <el-option v-for="item in configuraion.options" :key="item.value" :label="item.label" :value="item.value">
              {{ item.label }}
            </el-option>
          </el-select>
        </el-form-item>
        <template v-if="configuraion.isRandom">
          <el-form-item prop="newPassword" label-width="100px">
            <template v-slot:label>
              <span> 新密码 </span>
              <el-tooltip :content="helper" placement="top" effect="light" style="margin-right: 5px">
                <svg-icon icon-name="wenhao" icon-class="detail-icons__item"></svg-icon>
              </el-tooltip>
            </template>

            <el-input v-model.trim="formData.newPassword" placeholder="请输入新的密码" show-password></el-input>
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
import { useResetOptions } from './ResetOptions';
import { generatePasswd, copyFun } from './utils';
import { resetPassWd, sendMailForResetPassword, MailType } from '@/api/company/users';
import { PasswordRules, HELP_MSG } from '@/utils/validate';

// 状态码
enum ResCode {
  Success,
}
// 密码重置
interface ResetFormState {
  newPassword: any[];
}
export default defineComponent({
  name: 'ResetPasswordDialog',
  setup() {
    const visible = ref(false);
    // ----------------------------
    const userId = ref(0);
    const newPassword = ref('');
    const formData = reactive({
      newPassword,
    });
    const rules: ResetFormState = {
      newPassword: PasswordRules,
    };
    const { configuraion } = useResetOptions();
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
    // 保存密码
    const savePassword = () =>
      // 校验密码-》保存密码-》copy 密码

      new Promise<boolean>((resolve, reject) => {
        resetForm.value.validate(async (valid: boolean) => {
          if (valid) {
            const { code } = await resetPassWd({
              userId: userId.value,
              newPassword: newPassword.value,
            });
            if (code === ResCode.Success) {
              // 复制到剪切板上
              handleCopy();
              msgTips('success', '密码重置成功');
              resolve(true);
            } else {
              msgTips('error', '密码重置失败');
              reject(new Error('密码重置失败'));
            }
          } else {
            reject(new Error('校验未通过'));
          }
        });
      });

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
        return true;
      }
      msgTips('error', '重置邮件发送失败');
      return false;
    };
    watch(
      () => configuraion.isRandom,
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
      configuraion.current = '';
    };
    // 每次打开新的对话框重置
    watch(visible, (v) => {
      if (v) {
        resetData();
      }
    });
    //
    const open = (id: number) => {
      userId.value = id;
      visible.value = true;
    };
    const close = () => {
      visible.value = false;
    };
    const submit = async () => {
      try {
        if (configuraion.isRandom) {
          // 提交随机密码
          await savePassword();
        } else {
          // 发送重置邮件
          await sendMail();
        }
      } catch (error) {
        console.log(error);
      } finally {
        visible.value = false;
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
      configuraion,
      handleCopy,
      helper: HELP_MSG,
      resetForm,
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
  right: 50px;
  top: 0;
}
</style>
