<template>
  <el-dialog
    :title="title"
    v-model="dialogVisible"
    width="600px"
    @closed="closeDialog"
    :close-on-click-modal="false"
  >
    <div class="add-config-set">
      <el-form :model="formData" ref="diagFormRef" :rules="formRules">
        <el-form-item label="账号" prop="userName" :label-width="labelWidth">
          <el-input v-model.trim="formData.userName" disabled placeholder="请输入英文登录账号，创建后不可修改"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="displayName" :label-width="labelWidth">
          <el-input v-model.trim="formData.displayName" disabled placeholder="请输入中文姓名"></el-input>
        </el-form-item>
        <el-form-item label="电话号码" prop="phoneNumber" :label-width="labelWidth">
          <el-input v-model.trim="formData.phoneNumber" :disabled="disable" placeholder="请输入电话号码"></el-input>
        </el-form-item>
        <el-form-item label="登陆邮箱" prop="primaryMail" :label-width="labelWidth">
          <el-input v-model.trim="formData.primaryMail" :disabled="disable" placeholder="请输入注册邮箱"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="passWd" :label-width="labelWidth">
          <el-input placeholder="请输入密码" v-model="formData.passWd" show-password :disabled="disable"></el-input>
        </el-form-item>
        <el-form-item label="再次输入密码" prop="rPassWd" :label-width="labelWidth">
          <el-input
            placeholder="请再次输入密码"
            v-model="formData.rPassWd"
            show-password
            :disabled="disable"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="submitConfigForm" v-if="!disable">提交</el-button>
        <el-button @click="closeDialog" v-if="!disable">关闭</el-button>
        <el-button type="primary" @click="() => disable = false" v-else>修改</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, Ref, ref, getCurrentInstance } from 'vue';
import { getUserInfo, updateUserInfo } from '@/api/user';
const RES_CODE: any = {
  success: 0
};
// 定义数据type
interface DialogState {
  title: string;
  disable: boolean;
  isEdit: boolean;
  formData: any;
}
const labelWidth: string = "100px";
export default defineComponent({
  name: 'ManageDialog',
  setup() {
    const dialogVisible: Ref<boolean> = ref(false);
    const dialogContent: DialogState = reactive({
      title: '用户管理',
      disable: false,
      isEdit: false,
      formData: {
        userName: '',
        displayName: '',
        phoneNumber: '',
        primaryMail: '',
        passWd: '',
        rPassWd: ''
      }
    });
    // 校验规则
    const formRules = {
      phoneNumber: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
      primaryMail: [{ required: true, message: '请输入注册邮箱', trigger: 'blur' }],
      passWd: [{ required: true, message: '请输入密码', trigger: 'blur' }],
      rPassWd: [{ required: true, message: '请再次输入密码', trigger: 'blur' }],
    };
    const instance = getCurrentInstance();
    // 获取人员信息
    const getInfo = async () => {
      const { code, data } = await getUserInfo();
      if (code === RES_CODE.success) {
        dialogContent.formData = data.rows && data.rows[0];
      } else {
        (instance as any).proxy.$message({
          type: 'error',
          message: '获取人员信息失败',
        });
      }
    };

    // 打开对话框
    const openDialog = (): void => {
      dialogContent.isEdit = true;
      dialogContent.disable = true;
      getInfo();
      dialogVisible.value = true;
    }

    // 初始化对话框数据
    function initDialog(): void {
      dialogContent.disable = true;
      dialogContent.isEdit = true;
    }
    // 关闭对话框
    const closeDialog = () => {
      initDialog();
      dialogVisible.value = false;
    }

    // 表单引用
    const diagFormRef: any = ref({});
    // 保存
    async function submitConfigForm() {
      diagFormRef.value.validate(async (valid: boolean) => {
        if (valid) {
          const { code } = await updateUserInfo();
          if (code === RES_CODE.success) {
            closeDialog();
            (instance as any).proxy.$message({
              type: 'success',
              message: '修改成功',
            });
          } else {
            (instance as any).proxy.$message({
              type: 'error',
              message: '修改失败',
            });
          }
        }
      });
    }
    return {
      ...toRefs(dialogContent),
      closeDialog,
      openDialog,
      submitConfigForm,
      dialogVisible,
      formRules,
      diagFormRef,
      labelWidth
    }
  }
})
</script>
<style lang="scss" scoped>
.dialog-footer {
  width: 100%;
  display: block;
  text-align: center;
  margin-bottom: 20px;
}
</style>
