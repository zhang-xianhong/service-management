<template>
  <div class="nav-bar">
    <a class="app-logo">
      <img src="./tencent.png" />
      <span>|</span>
      <img src="./citybase.png" />
    </a>
    <div class="bread-bar"></div>
    <div class="position-right-bar">
      <el-dropdown trigger="click" class="header-title">
        <span class="el-dropdown-link">
          <i class="el-icon-user-solid"></i>
          {{ userInfo?.displayName }}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item icon="el-icon-edit" @click="openPersonalCenter">个人中心</el-dropdown-item>
            <el-dropdown-item icon="el-icon-info" @click="toAboutInfo">关于</el-dropdown-item>
            <el-dropdown-item icon="el-icon-switch-button" @click="handleLogout">登出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <ManageDialog ref="refManageDialog" />
    <el-dialog title="关于" v-model="dialogVisible" width="40%" top="25vh" @close="handleClose">
      <div class="about__divider"></div>
      <div class="about__logo">
        <img src="~@/assets/img/tcloud.png" />
        <div></div>
        <img src="~@/assets/img/citybase.png" />
      </div>
      <div class="about__edition">版本 1.0.0</div>
      <div class="about__footer">Copyright @ 1998 - 2021 Tencent All Rights Reserved 腾讯公司 版权所有</div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { logout } from '@/api/auth';
import { ElMessage } from 'element-plus';
import { defineComponent, reactive, ref, Ref } from 'vue';
import { useRouter } from 'vue-router';
import ManageDialog from './ManageDialog.vue';
// import breadCurmb from '@/components/bread-curmb/Index.vue';
import { userInfo } from '@/layout/messageCenter/user-info';

interface RefDialog {
  openDialog: Function;
  [attr: string]: any;
}
export default defineComponent({
  name: 'navBar',
  components: {
    // breadCurmb,
    ManageDialog,
  },
  setup() {
    const router = useRouter();
    const projectList = reactive([
      {
        id: 1,
        name: '测试项目1',
      },
      {
        id: 2,
        name: '测试项目2',
      },
    ]);
    const refManageDialog: Ref<RefDialog | null> = ref(null);
    const dialogVisible = ref(false);

    const openPersonalCenter = () => {
      router.push('/user-info');
    };

    const toAboutInfo = () => {
      dialogVisible.value = true;
    };

    const handleClose = () => {
      dialogVisible.value = false;
    };

    const openEditDialog = (): void => {
      (refManageDialog.value as RefDialog).openDialog();
    };

    // 关闭对话框
    const closeDialog = () => {
      (refManageDialog.value as RefDialog).closeDialog();
    };
    const handleLogout = () => {
      logout().then((res: any) => {
        const urls = res.data.logoutUrl;
        if (urls) {
          window.location.href = urls;
        } else {
          ElMessage.error('登出失败');
        }
      });
    };
    return {
      userInfo,
      projectList,
      refManageDialog,
      openPersonalCenter,
      toAboutInfo,
      closeDialog,
      openEditDialog,
      handleLogout,
      dialogVisible,
      handleClose,
    };
  },
});
</script>

<style lang="scss">
.nav-bar {
  width: 100%;
  height: 100%;
  color: white;
  background: #101216;
  // line-height: 50px;
  position: relative;
  border-bottom: solid 1px rgba(0, 0, 0, 0.2);
  display: flex;
  padding: 0 20px;
  .app-logo {
    flex-shrink: 0;
    width: 180px;
    display: flex;
    align-items: center;
    justify-content: center;
    > img {
      max-width: 100%;
      height: 45px;
    }
    > span {
      color: #fff;
      font-weight: bolder;
      margin: 0px 20px;
    }
  }
  .bread-bar {
    display: flex;
    align-items: center;
    margin-left: 40px;
  }
  .position-right-bar {
    margin-left: auto;
    display: flex;
    align-items: center;
    .header-title {
      margin-right: 20px;
      color: #fff;
      &-message-icon,
      &-object-icon {
        font-size: 20px;
      }
    }
  }
}
.props-list-item {
  margin-bottom: 10px;
  border-radius: 2px;
  padding: 5px 30px;
  //border: solid 1px rgba(0,0,0,0.2);
  & > span {
    display: inline-block;
    margin-left: 10px;
  }
  &:nth-child(1) {
    margin-top: 10px;
  }
  &:hover {
    background: rgba(0, 0, 0, 0.2);
    cursor: pointer;
  }
}
.about__divider {
  height: 2px;
  background-color: #eee;
}
.about__logo {
  width: 350px;
  height: 80px;
  text-align: center;
  margin: 0 auto;
  > img,
  > div {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  > img:first-child {
    left: 36%;
  }
  > img:last-child {
    left: 64%;
  }
  > div {
    display: inline-block;
    width: 2px;
    height: 28px;
    background-color: #eee;
  }
}
.about__edition {
  margin: 30px 0;
  font-size: 14px;
  font-weight: bolder;
  text-align: center;
}
.about__footer {
  text-align: center;
  font-size: 13px;
  color: #bbb;
}
</style>
