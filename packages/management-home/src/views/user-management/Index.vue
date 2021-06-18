<template>
  <div class="user-management">
    <div class="user-headers">当前所在企业： {{ tenantDetail.name }}</div>
    <div class="user-body-form">
      <el-form :model="userSetInfo" label-width="150px">
        <el-form-item v-for="(item, index) in props" :key="item" :label="labels[index]">
          <div class="user-inner-div">
            <input
              v-model.trim="userSetInfo[item]"
              :style="{ borderColor: statusArr[index] ? 'rgba(0,0,0,0.2)' : 'transparent' }"
              :readonly="!statusArr[index]"
            />
          </div>
          <template v-if="index !== 0">
            <template v-if="index !== 4">
              <el-button type="text" v-if="!statusArr[index]" @click="checkStatus(index)">修改</el-button>
              <span v-else>
                <el-button type="text" @click="save(index, item)">保存</el-button>
                <el-button type="text" @click="cancel(index, item)">取消</el-button>
              </span>
            </template>
            <template v-else>
              <el-button type="text" @click="reWritePass()">修改密码</el-button>
            </template>
          </template>
        </el-form-item>
      </el-form>
    </div>

    <el-dialog title="修改密码" v-model="dialogFormVisible" width="500px" destroy-on-close>
      <el-form :model="passForm" ref="formRef" :rules="formRules">
        <el-form-item label="原始密码" label-width="80px" prop="oldPassword">
          <el-input v-model="passForm.oldPassword" autocomplete="off" type="password"></el-input>
        </el-form-item>
        <el-form-item label="新密码" label-width="80px" prop="newPassword">
          <el-input v-model="passForm.newPassword" autocomplete="off" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" label-width="80px" prop="confirmPassword">
          <el-input v-model="passForm.confirmPassword" autocomplete="off" type="password"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer" style="width: 100%; text-align: center; display: inline-block">
          <el-button type="primary" @click="sendPass">保存</el-button>
          <el-button @click="dialogFormVisible = false">返回</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, watch } from 'vue';
import { userInfo } from '@/layout/messageCenter/user-info';
import { getUserProfile, updateUserPassword, updateUserProfile } from '@/api/auth';
import { ElMessage } from 'element-plus';
import { getTenantDetail } from '@/api/tenant';

export default defineComponent({
  name: 'UserManagement',
  setup() {
    const userSetInfo = reactive({} as any);
    const userRelease = reactive({} as any);
    const statusArr = ref([false, false, false, false, false]);
    const props = ['userName', 'displayName', 'phoneNumber', 'primaryMail', 'password'];
    const labels = ['用户账号', '用户姓名', '联系电话', '电子邮箱', '用户密码'];

    getUserProfile().then((res) => {
      res.data.password = '******';
      Object.keys(res.data).forEach((x, i) => {
        userSetInfo[x] = Object.values(res.data)[i];
        userRelease[x] = Object.values(res.data)[i];
      });
    });

    const checkStatus = (index: number) => {
      statusArr.value[index] = !statusArr.value[index];
    };
    const save = (id: number, prop: string) => {
      if (!userSetInfo[prop]) {
        return ElMessage.error(`${labels[id]} 不得为空！`);
      }
      if (userSetInfo.displayName.length > 20) {
        return ElMessage.warning('用户姓名不能超过20个字符');
      }
      const item = {} as any;
      item[prop] = userSetInfo[prop];
      updateUserProfile(item).then((res) => {
        if (res.code === 0) {
          checkStatus(id);
        }
      });
    };
    const cancel = (id: number, prop?: string) => {
      checkStatus(id);
      if (prop) {
        (userSetInfo[prop] as any) = userRelease[prop] as any;
      }
    };

    const dialogFormVisible = ref(false);
    const passForm = reactive({} as any);
    const reWritePass = () => {
      dialogFormVisible.value = true;
    };
    const formRef = ref(null as any);
    const sendPass = () => {
      let viva = true;
      formRef.value.validate((res: any) => {
        viva = res;
      });
      if (viva) {
        updateUserPassword({ ...passForm }).then((res) => {
          dialogFormVisible.value = false;
          if (res.code === 0) {
            ElMessage.success('修改成功');
          }
        });
      }
    };
    // 初始密码校验
    const validatePass = (rule: any, value: string, callback: Function) => {
      if (value !== '') {
        if (value === userSetInfo.value.displayName) {
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
        if (value !== passForm.newPassword) {
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
          pattern: /^(?=.*[a-z])(?=.*[A-Z])[A-Za-z\d（!@#$%^&)]{8,16}/,
          message: '只能输入大小写字母、数字、下划线，且必须包含大、小写字母',
          trigger: 'blur',
        },
        { validator: validatePass, trigger: 'blur' },
      ],
      confirmPassword: [
        { required: true, message: '请再次输入新密码' },
        { validator: checkPasswordValidator, trigger: 'blur' },
      ],
    };
    watch(dialogFormVisible, (nn) => {
      if (!nn) {
        passForm.oldPassword = '';
        passForm.newPassword = '';
        passForm.confirmPassword = '';
      }
    });
    const tenantDetail = ref({} as any);
    const getDetail = async () => {
      const { data } = await getTenantDetail();
      tenantDetail.value = data;
      console.log(data);
    };
    getDetail();

    return {
      userInfo,
      userSetInfo,
      statusArr,
      checkStatus,
      save,
      cancel,
      props,
      labels,
      reWritePass,
      dialogFormVisible,
      passForm,
      sendPass,
      formRules,
      formRef,
      tenantDetail,
    };
  },
});
</script>

<style lang="scss">
.user-management {
  background-color: #ffffff;
  height: 600px;
  width: 100%;
  padding: 30px 40px;
  .user-headers {
    font-size: 15px;
    font-weight: 600;
    margin-bottom: 20px;
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
