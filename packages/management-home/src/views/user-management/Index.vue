<template>
  <div class="user-management">
    <div class="user-headers">当前所在企业： {{ userInfo.dept }}</div>
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
          <el-button type="text" v-if="!statusArr[index]" @click="checkStatus(index)">修改</el-button>
          <span v-else>
            <el-button type="text" @click="save(index, item)">保存</el-button>
            <el-button type="text" @click="cancel(index, item)">取消</el-button>
          </span>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import { userInfo } from '@/layout/messageCenter/user-info';
import { getUserProfile, updateUserProfile } from '@/api/auth';

export default defineComponent({
  name: 'UserManagement',
  setup() {
    const userSetInfo = reactive({} as any);
    const userRelease = reactive({} as any);
    const statusArr = ref([false, false, false, false, false]);
    const props = ['displayName', 'userName', 'phoneNumber', 'primaryMail', 'password'];
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
      console.log(id, prop);
      const item = {};
      item[prop] = userSetInfo[prop];
      updateUserProfile(item).then(() => {
        checkStatus(id);
      });
    };
    const cancel = (id: number, prop?: string) => {
      checkStatus(id);
      if (prop) {
        userSetInfo[prop] = userRelease[prop];
      }
    };

    return {
      userInfo,
      userSetInfo,
      statusArr,
      checkStatus,
      save,
      cancel,
      props,
      labels,
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
