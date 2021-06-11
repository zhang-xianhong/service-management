<template>
  <div>
    <el-dialog
      title="重置密码"
      v-model="resetDialogVisible"
      width="500px"
      @closed="closeResetDialog"
      :close-on-click-modal="false"
      :destroy-on-close="true"
    >
      <div>
        <el-form :model="resetFormData" ref="resetDiagFormRef" :rules="resetFormRules">
          <el-form-item label="新密码" prop="newPassword" label-width="100px" style="position: relative">
            <el-input v-model.trim="resetFormData.newPassword" placeholder="请输入新的密码" show-password></el-input>
            <el-button v-if="resetFormData.newPassword" type="text" @click="handleCopy" class="btn-copy"
              >复制</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="submitResetForm">保存</el-button>
          <el-button @click="closeResetDialog">返回</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, getCurrentInstance, toRefs } from 'vue';
import { copyFun, generatePasswd } from '@/utils';
import { resetPassWd } from '@/api/tenant';
import { checkPasswd } from '@/utils/validate';

// 密码重置
interface ResetFormState {
  newPassword: any[];
}
const passwdMsg = '长度在 8 到 16 个字符,只能输入大小写字母、数字、特殊字符（(!@#$%^&),至少1个大写字母，1个小写字母';
// 密码校验
const validatorPasswdPass = (rule: any, value: string, callback: Function) => {
  if (!checkPasswd(value)) {
    callback(new Error(passwdMsg));
  }
  callback();
};
const resetFormRules: ResetFormState = {
  newPassword: [
    { required: true, message: '请输入新的密码', trigger: 'blur' },
    { validator: validatorPasswdPass, trigger: 'blur' },
  ],
};

export default defineComponent({
  name: 'PrivateResetPassword',
  setup() {
    // 获取组件实例
    const instance = getCurrentInstance();

    // 提示信息
    function msgTips(type: string, content: string) {
      (instance as any).proxy.$message({
        type,
        message: content,
      });
    }

    // 重置密码
    const resetDialog = reactive({
      resetDialogVisible: false,
      resetFormData: {
        newPassword: generatePasswd(12),
        userId: 0,
      },
    });
    // 复制密码
    const handleCopy = () => {
      const { newPassword } = resetDialog.resetFormData;
      copyFun(newPassword);
    };
    // 重置密码
    const handleResetPasswd = (id: number) => {
      resetDialog.resetFormData.userId = id;
      resetDialog.resetDialogVisible = true;
    };
    // 关闭重置密码
    const closeResetDialog = () => {
      resetDialog.resetDialogVisible = false;
    };
    const resetDiagFormRef: any = ref(null);
    const submitResetForm = () => {
      resetDiagFormRef.value.validate(async (valid: boolean) => {
        if (valid) {
          const { userId, newPassword } = resetDialog.resetFormData;
          const { code } = await resetPassWd({
            userId,
            newPassword,
          });
          if (code === 0) {
            // 复制到剪切板上
            handleCopy();
            // msgTips('success', '密码重置成功');
          } else {
            msgTips('error', '密码重置失败');
          }
          closeResetDialog();
        }
      });
    };

    return {
      ...toRefs(resetDialog),
      handleResetPasswd,
      closeResetDialog,
      submitResetForm,
      resetFormRules,
      resetDiagFormRef,
      passwdMsg,
      handleCopy,
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
