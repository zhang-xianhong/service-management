<template>
  <el-dialog
    :title="title"
    v-model="dialogVisible"
    width="500px"
    @closed="closeDialog"
    :close-on-click-modal="false"
    :destroy-on-close="true"
  >
    <div>
      <el-form :model="formData" ref="diagFormRef" :rules="formRules">
        <el-form-item label="登记账号" prop="username" :label-width="labelWidth">
          <el-input
            v-model.trim="formData.username"
            :disabled="isEdit"
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
            <el-radio label="0">启用</el-radio>
            <el-radio label="-1">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="初始密码" :label-width="labelWidth" v-if="!isEdit">
          <el-tooltip
            content="复制密码，保存后可用新密码登录"
            placement="top"
            effect="light"
            style="margin-right: 5px"
          >
            <svg-icon icon-name="wenhao" icon-class="detail-icons__item"></svg-icon>
          </el-tooltip>
          <el-input v-model.trim="formData.password" disabled style="width: 280px" show-password></el-input>
          <el-button type="text" style="margin-left: 20px" @click="handleCopy">复制</el-button>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer" v-if="!isEdit">
        <el-button type="primary" @click="submitConfigForm">保存</el-button>
        <el-button @click="closeDialog">返回</el-button>
      </span>
      <span class="dialog-footer" v-else>
        <el-button type="primary" @click="enableEdit" v-if="disable">编辑</el-button>
        <el-button type="primary" @click="submitConfigForm" v-else>保存</el-button>
        <el-button @click="closeDialog">返回</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, Ref, ref, inject } from 'vue';
import { checkMail, checkZNName, checkEnName, checkMobile } from '@/utils/validate';
import { generatePasswd, copyFun } from '../utils';
import { checkUserInfo } from '@/api/company/users';

// 定义数据type
interface DialogState {
  title: string;
  disable: boolean;
  isEdit: boolean;
  formData: any;
}
const labelWidth = '100px';

// 手机号校验
const validatorMobilePass = async (rule: any, value: string, callback: Function) => {
  if (!checkMobile(value)) {
    callback(new Error('请输入正确的手机号码'));
  }
  // 继续后台校验
  const { code, data } = await checkUserInfo({
    key: 'phoneNumber',
    value,
  });
  if (code === 0 && data.exist) {
    callback(new Error('手机号已存在'));
  } else {
    callback();
  }
};

// 邮箱校验
const validatorMailPass = async (rule: any, value: string, callback: Function) => {
  if (!checkMail(value)) {
    callback(new Error('请输入正确的邮箱格式'));
  }
  // 继续后台校验
  const { code, data } = await checkUserInfo({
    key: 'primaryMail',
    value,
  });
  if (code === 0 && data.exist) {
    callback(new Error('邮箱已存在'));
  } else {
    callback();
  }
};

// 中文姓名校验
const validatorZNNamePass = (rule: any, value: string, callback: Function) => {
  if (!checkZNName(value)) {
    callback(new Error('请输入长度至少2个最大16个字的中文格式名称'));
  }
  callback();
};

// 英文名称校验
const validatorEnPass = async (rule: any, value: string, callback: Function) => {
  if (!checkEnName(value)) {
    callback(new Error('请输入长度至少2个英文字母的账户名称'));
  }
  // 继续后台校验
  const { code, data } = await checkUserInfo({
    key: 'username',
    value,
  });
  if (code === 0 && data.exist) {
    callback(new Error('账号已存在'));
  } else {
    callback();
  }
};

export default defineComponent({
  name: 'AddPerson',
  setup() {
    const dialogVisible: Ref<boolean> = ref(false);
    const dialogContent: DialogState = reactive({
      title: '新建人员',
      disable: false,
      isEdit: false,
      formData: {
        username: '',
        displayName: '',
        phoneNumber: '',
        primaryMail: '',
        status: '0',
        password: '',
      },
    });
    // 校验规则
    const formRules = {
      username: [
        { required: true, message: '请输入账号', trigger: 'blur' },
        { validator: validatorEnPass, trigger: 'blur' },
      ],
      displayName: [
        { required: true, message: '请输入中文名称', trigger: 'blur' },
        { validator: validatorZNNamePass, trigger: 'blur' },
      ],
      phoneNumber: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        { validator: validatorMobilePass, trigger: 'blur' },
      ],
      primaryMail: [
        { required: true, message: '请输入注册邮箱', trigger: 'blur' },
        { validator: validatorMailPass, trigger: 'blur' },
      ],
      status: [{ required: true, message: '请选择账户状态', trigger: 'change' }],
    };

    // 打开对话框
    const openDialog = (type: string, data: any): void => {
      if (type === 'edit') {
        dialogContent.isEdit = true;
        dialogContent.title = '人员详情';
        dialogContent.disable = true;
        dialogContent.formData = data;
        dialogContent.formData.username = data.userName;
      } else {
        dialogContent.isEdit = false;
        dialogContent.formData.password = generatePasswd(12);
      }
      dialogVisible.value = true;
    };

    // 初始化对话框数据
    function initDialog(): void {
      dialogContent.title = '新建人员';
      dialogContent.disable = false;
      dialogContent.isEdit = false;
      dialogContent.formData = {
        username: '',
        displayName: '',
        phoneNumber: '',
        primaryMail: '',
        status: '-1',
        password: generatePasswd(12),
      };
    }
    // 关闭对话框
    const closeDialog = () => {
      initDialog();
      dialogVisible.value = false;
    };

    // 表单引用
    const diagFormRef: any = ref(null);
    // 新建
    const handleCreate: any = inject('handleCreate');
    // 编辑
    const handleEdit: any = inject('handleEdit');

    // 保存
    async function submitConfigForm() {
      diagFormRef.value.validate((valid: boolean) => {
        if (valid) {
          // 添加
          if (!dialogContent.isEdit) {
            handleCreate(dialogContent.formData);
          } else {
            delete dialogContent.formData.password;
            handleEdit(dialogContent.formData);
          }
          closeDialog();
        }
      });
    }

    // 复制密码
    const handleCopy = () => {
      copyFun(dialogContent.formData.password);
    };

    // 重置密码门
    const handleReset = () => {
      dialogContent.formData.password = '';
    };
    const enableEdit = () => {
      dialogContent.disable = false;
      dialogContent.title = '编辑人员';
    };

    return {
      ...toRefs(dialogContent),
      closeDialog,
      openDialog,
      submitConfigForm,
      dialogVisible,
      initDialog,
      formRules,
      diagFormRef,
      labelWidth,
      handleCopy,
      handleReset,
      enableEdit,
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
</style>
