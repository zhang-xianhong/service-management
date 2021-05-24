<template>
  <div class="user-management">
    <div class="user-headers">
      当前所在企业:（{{ companyName }}）
      <span>管理员帐号</span>
    </div>
    <item
      v-for="(item, index) in Object.keys(managerInfo)"
      :key="index"
      :prop="item"
      :title="fieldTitleConfiguration[item]"
      :value="managerInfo[item]"
    ></item>
    <item prop="password" title="登录密码" value="*********" @modify="onModifyPassword"></item>
  </div>
  <el-dialog
    title="修改密码"
    v-model="passwordModelVisible"
    width="600px"
    @closed="passwordModelVisible = false"
    :close-on-click-modal="false"
  >
    <el-form :model="formData" ref="formRef" :rules="formRules" label-width="100px" label-position="left">
      <el-form-item prop="oldPassword" label="原密码">
        <el-input type="password" v-model="formData.oldPassword" placeholder="请输入原密码" show-password></el-input>
      </el-form-item>
      <el-form-item prop="newPassword" label="新密码">
        <el-input type="password" v-model="formData.newPassword" placeholder="请输入新密码" show-password></el-input>
      </el-form-item>
      <el-form-item prop="confirmPassword" label="确认密码">
        <el-input
          type="password"
          v-model="formData.confirmPassword"
          placeholder="请再次输入新密码"
          show-password
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="form-footer">
        <el-button type="primary" @click="onSave">保存</el-button>
        <el-button @click="onBack">返回</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, Ref, ref, reactive, getCurrentInstance } from 'vue';
import { getProfile, updateProfilePassword } from '@/api/user';
import Item from './components/Item.vue';

interface ManagerInfoInterface {
  account: string;
  displayName: string;
  phoneNumber: string;
  primaryMail: string;
}

export default defineComponent({
  name: 'UserManagement',
  components: {
    Item,
  },
  setup() {
    const instance = getCurrentInstance();
    const companyName: Ref<string> = ref('企业名称');
    const managerInfo: Ref<ManagerInfoInterface> = ref({
      account: '',
      displayName: '',
      phoneNumber: '',
      primaryMail: '',
    });

    const fieldTitleConfiguration = {
      account: '管理员帐号',
      displayName: '管理员姓名',
      phoneNumber: '管理员电话',
      primaryMail: '管理员邮箱',
    };

    const getManagerInfo = async () => {
      const { data } = await getProfile();
      managerInfo.value = data;
    };
    getManagerInfo();

    const passwordModelVisible: Ref<boolean> = ref(false);

    const onModifyPassword = () => {
      passwordModelVisible.value = true;
    };

    const formData = reactive({
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    });

    const formRef: Ref<any> = ref(null);

    // 初始密码校验
    const validatePass = (rule: any, value: string, callback: Function) => {
      if (value !== '') {
        if (value === managerInfo.value.displayName) {
          callback(new Error('密码不能与用户名相同'));
        }
        formRef.value.validateField('confirmPassword');
      }
      callback();
    };

    // 密码再次输入校验
    const checkPasswordValidator = (rule: any, value: string, callback: Function) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else {
        if (value !== formData.newPassword) {
          callback(new Error('两次输入密码不一致'));
        }
        callback();
      }
    };

    const formRules = {
      oldPassword: [
        { required: true, message: '请输入原密码' },
        // TODO:原密码不应该加校验
        // { min: 8, max: 16, message: '密码长度在8到16位', trigger: 'blur' },
        // { pattern: /^[a-zA-Z0-9_]+$/g, message: '包含非法字符，只能输入大小写字母、数字、下划线', trigger: 'blur' },
      ],
      newPassword: [
        { required: true, message: '请输入新密码' },
        { min: 8, max: 16, message: '密码长度在8到16位', trigger: 'blur' },
        {
          pattern: /^(?=.*[A-Z])(?=.*[a-z])[A-Za-z\d]{8,16}$/g,
          message: '包含非法字符，只能输入大小写字母、数字、下划线，且必须包含大、小写字母',
          trigger: 'blur',
        },
        { validator: validatePass, trigger: 'blur' },
      ],
      confirmPassword: [
        { required: true, message: '请再次输入新密码' },
        { validator: checkPasswordValidator, trigger: 'blur' },
      ],
    };

    const onSave = async () => {
      const { code } = await updateProfilePassword(formData);
      if (code === 0) {
        (instance as any).proxy.$message({
          type: 'success',
          message: '保存成功',
        });
        passwordModelVisible.value = false;
      }
    };

    const onBack = () => {
      passwordModelVisible.value = false;
      formData.oldPassword = '';
      formData.newPassword = '';
      formData.confirmPassword = '';
    };

    return {
      companyName,
      managerInfo,
      fieldTitleConfiguration,
      onModifyPassword,
      passwordModelVisible,
      formData,
      formRef,
      formRules,
      onSave,
      onBack,
    };
  },
});
</script>

<style lang="scss" scoped>
.form-footer {
  display: flex;
  justify-content: center;
}
.user-management {
  background-color: #ffffff;
  height: 600px;
  width: 100%;
  padding: 30px 40px;
  .user-headers {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 20px;
    span {
      background: #e6e6e6;
      font-size: 14px;
      font-weight: 400;
      padding: 8px;
    }
  }
  .user-body-form {
    margin: 10px 0;
    .el-form-item--small .el-form-item__content,
    .el-form-item--small .el-form-item__label {
      line-height: 60px;
      height: 60px;
      border-top: solid 1px rgba(0, 0, 0, 0.1);
    }
    .el-form-item--mini.el-form-item,
    .el-form-item--small.el-form-item {
      margin-bottom: 0;
    }
    .el-form-item__label {
      font-size: 12px;
      text-align: left;
    }
    .user-inner-div {
      display: inline-block;
      width: 400px;
      input {
        display: inline-block;
        width: 280px;
        height: 30px;
        line-height: 30px;
        padding-left: 5px;
        border: 1px solid rgba(0, 0, 0, 0.2);
      }
      .el-input--small {
        width: 70%;
        margin-right: 20px;
        height: 30px;
      }
      .el-input--small .el-input__inner {
        height: 28px;
        line-height: 28px;
      }
    }
  }
}
</style>
