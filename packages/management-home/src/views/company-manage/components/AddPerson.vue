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
        <el-form-item label="登记账号" prop="userName" :label-width="labelWidth">
          <el-input
            v-model.trim="formData.userName"
            :disabled="disable"
            placeholder="请输入英文登录账号，创建后不可修改"
          ></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="displayName" :label-width="labelWidth">
          <el-input v-model.trim="formData.displayName" :disabled="disable" placeholder="请输入中文姓名"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phoneNumber" :label-width="labelWidth">
          <el-input
            v-model.trim="formData.phoneNumber"
            :disabled="disable"
            placeholder="请输入中国大陆手机号"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="primaryMail" :label-width="labelWidth">
          <el-input v-model.trim="formData.primaryMail" :disabled="disable" placeholder="请输入注册邮箱"></el-input>
        </el-form-item>
        <el-form-item label="账号状态" prop="status" :label-width="labelWidth">
          <el-radio-group v-model="formData.status" :disabled="disable">
            <el-radio label="1">启用</el-radio>
            <el-radio label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="submitConfigForm" v-if="!disable">保 存</el-button>
        <el-button type="primary" @click="() => disable = false" v-else>编辑</el-button>
        <el-button @click="closeDialog">返回</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, Ref, ref, inject } from 'vue';

// 定义数据type
interface DialogState {
  title: string;
  disable: boolean;
  isEdit: boolean;
  formData: any;
}
const labelWidth: string = "100px";
export default defineComponent({
  name: 'AddPerson',
  setup() {
    const dialogVisible: Ref<boolean> = ref(false);
    const dialogContent: DialogState = reactive({
      title: '新建人员',
      disable: false,
      isEdit: false,
      formData: {
        userName: '',
        displayName: '',
        phoneNumber: '',
        primaryMail: '',
        status: '0'
      }
    });
    // 校验规则
    const formRules = {
      userName: [{ required: true, message: '请输入账号', trigger: 'blur' }],
      displayName: [{ required: true, message: '请输入名称', trigger: 'blur' }],
      phoneNumber: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
      primaryMail: [{ required: true, message: '请输入注册邮箱', trigger: 'blur' }],
      status: [{ required: true, message: '请选择账户状态', trigger: 'change' }]
    };

    // 打开对话框
    const openDialog = (type: string, data: any): void => {
      if (type === "edit") {
        dialogContent.isEdit = true;
        dialogContent.disable = true;
        dialogContent.formData = data;
      } else {
        dialogContent.isEdit = false;
      }
      dialogVisible.value = true;
    }

    // 初始化对话框数据
    function initDialog(): void {
      dialogContent.title = '新建人员';
      dialogContent.disable = false;
      dialogContent.isEdit = false;
      dialogContent.formData = {
        userName: '',
        displayName: '',
        phoneNumber: '',
        primaryMail: '',
        status: '0'
      }
    }
    // 关闭对话框
    const closeDialog = () => {
      initDialog();
      dialogVisible.value = false;
    }

    // 表单引用
    const diagFormRef: any = ref({});
    // 新建
    const handleCreate: any = inject('handleCreate');
    // 编辑
    const handleEdit: any = inject('handleEdit');

    // 保存
    async function submitConfigForm() {
      diagFormRef.value.validate(async (valid: boolean) => {
        if (valid) {
          // 添加
          if (!dialogContent.isEdit) {
            handleCreate(dialogContent.formData);
          } else {
            handleEdit(dialogContent.formData);
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
