<template>
  <el-dialog
    :title="title"
    v-model="dialogVisible"
    width="500px"
    @closed="closeDialog"
    :close-on-click-modal="false"
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
            content="复制密码，保存后可用密码登录"
            placement="top"
            effect="light"
            style="margin-right: 5px"
          >
            <svg-icon icon-name="wenhao" icon-class="detail-icons__item"></svg-icon>
          </el-tooltip>
          <el-input v-model.trim="formData.password" disabled style="width: 280px" show-password></el-input>
          <el-button type="text" style="margin-left: 20px" @click="handleCopy">复制</el-button>
        </el-form-item>
        <el-form-item label="登录密码" prop="password" :label-width="labelWidth" v-else>
          <el-tooltip
            content="重置密码后复制密码，保存后可用新密码登录"
            placement="top"
            effect="light"
            style="margin-right: 5px"
          >
            <svg-icon icon-name="wenhao" icon-class="detail-icons__item"></svg-icon>
          </el-tooltip>
          <el-input
            v-model.trim="formData.password"
            :disabled="disable"
            placeholder="请输入密码"
            style="width: 280px"
            show-password
          ></el-input>
          <el-button
            type="text"
            style="margin-left: 20px"
            @click="handleReset"
            :disabled="disable"
          >重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer" v-if="!isEdit">
        <el-button type="primary" @click="submitConfigForm">保存&继续添加</el-button>
        <el-button @click="closeDialog">返回</el-button>
      </span>
      <span class="dialog-footer" v-else>
        <el-button type="primary" @click="() => (disable = false)" v-if="disable">编辑</el-button>
        <el-button type="primary" @click="submitConfigForm" v-else>保存</el-button>
        <el-button @click="closeDialog">返回</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, Ref, ref, inject } from 'vue';
import { ElMessage } from 'element-plus';

// 定义数据type
interface DialogState {
  title: string;
  disable: boolean;
  isEdit: boolean;
  formData: any;
}
const labelWidth = '100px';
const defaultPasswd = 'Tt@00000';

// 手机号校验
function checkMobile(value: string): boolean {
  const subValue = value.replace(/[^-|\d]/g, '');
  return /^(1)\d{10}$/.test(subValue);
}
const validatorMobilePass = (rule: any, value: string, callback: Function) => {
  if (!checkMobile(value)) {
    callback(new Error('请输入正确的手机号码'));
  }
  callback();
};

// 邮箱校验
function checkMail(szMail: string): boolean {
  const szReg = /^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/;
  return szReg.test(szMail);
}
const validatorMailPass = (rule: any, value: string, callback: Function) => {
  if (!checkMail(value)) {
    callback(new Error('请输入正确的邮箱格式'));
  }
  callback();
};

// 密码校验
function checkPasswd(passwd: string): boolean {
  const szReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@!^#%&])[A-Za-z\d$@$!%*?&]{8,16}/;
  return szReg.test(passwd);
}
const validatorPasswdPass = (rule: any, value: string, callback: Function) => {
  if (!checkPasswd(value)) {
    callback(new Error('长度在 8 到 16 个字符,至少1个大写字母，1个小写字母，1个数字和1个特殊字符($@$!%*?&)'));
  }
  callback();
};

// 中文校验
function checkZNName(name: string): boolean {
  const szReg = /[\u4e00-\u9fa5]{2,}/;
  return szReg.test(name);
}
const validatorZNNamePass = (rule: any, value: string, callback: Function) => {
  if (!checkZNName(value)) {
    callback(new Error('请输入长度至少2个字的中文格式名称'));
  }
  callback();
};

// 英文名称校验
function checkEnName(name: string): boolean {
  const szReg = /[A-Za-z\d]{2,}/;
  return szReg.test(name);
}
const validatorEnPass = (rule: any, value: string, callback: Function) => {
  if (!checkEnName(value)) {
    callback(new Error('请输入长度至少2个英文字母的账户名称'));
  }
  callback();
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
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { validator: validatorPasswdPass, trigger: 'blur' },
      ],
    };

    // 初始密码生成
    const generatePasswd = (len: number) => {
      let length = Number(len);
      // Limit length
      if (length < 6) {
        length = 6;
      } else if (length > 16) {
        length = 16;
      }
      const passwordArray = ['ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz', '1234567890', '!@#$%^&'];
      const password = [];
      let n = 0;
      for (let i = 0; i < length; i++) {
        // If password length less than 9, all value random
        if (password.length < length - 4) {
          // Get random passwordArray index
          const arrayRandom = Math.floor(Math.random() * 4);
          // Get password array value
          const passwordItem = passwordArray[arrayRandom];
          // Get password array value random index
          // Get random real value
          const item = passwordItem[Math.floor(Math.random() * passwordItem.length)];
          password.push(item);
        } else {
          // If password large then 9, lastest 4 password will push in according to the random password index
          // Get the array values sequentially
          const newItem = passwordArray[n];
          const lastItem = newItem[Math.floor(Math.random() * newItem.length)];
          // Get array splice index
          const spliceIndex = Math.floor(Math.random() * password.length);
          password.splice(spliceIndex, 0, lastItem);
          n = n + 1;
        }
      }
      return password.join('');
    };

    // 打开对话框
    const openDialog = (type: string, data: any): void => {
      if (type === 'edit') {
        dialogContent.isEdit = true;
        dialogContent.disable = true;
        dialogContent.formData = data;
        dialogContent.formData.password = defaultPasswd;
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
            if (dialogContent.formData.password === defaultPasswd) {
              delete dialogContent.formData.password;
            }
            handleEdit(dialogContent.formData);
          }
        }
      });
    }

    // 复制功能
    function copyFun(content: string) {
      const input = document.createElement('input');
      input.setAttribute('readonly', 'readonly');
      document.body.appendChild(input);
      input.setAttribute('value', content);
      input.select();
      if (document.execCommand('copy')) {
        document.execCommand('copy');
        ElMessage({
          type: 'success',
          message: '复制成功!',
        });
      }
      document.body.removeChild(input);
    }

    // 复制密码
    const handleCopy = () => {
      copyFun(dialogContent.formData.password);
    };

    // 重置密码门
    const handleReset = () => {
      dialogContent.formData.password = '';
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
