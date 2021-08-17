<template>
  <div class="nav-bar">
    <a class="app-logo">
      <img src="./logo.png" />
    </a>
    <div class="bread-bar">
      <!--      <bread-curmb></bread-curmb>-->
    </div>
    <div class="position-right-bar">
      <el-dropdown v-if="false" trigger="click" class="header-title">
        <el-badge :value="5" :max="99" class="item">
          <i class="el-icon-message-solid header-title-message-icon"></i>
        </el-badge>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item icon="el-icon-message">
              升级公告
              <span class="el-badge__content el-badge__content--primary">2</span>
            </el-dropdown-item>
            <el-dropdown-item icon="el-icon-s-flag">待办任务</el-dropdown-item>
            <el-dropdown-item icon="el-icon-tickets">待办工单</el-dropdown-item>
            <el-dropdown-item icon="el-icon-date">
              今日日程
              <span class="el-badge__content el-badge__content--primary">3</span>
            </el-dropdown-item>
            <el-dropdown-item icon="el-icon-edit-outline">待批申请</el-dropdown-item>
            <el-dropdown-item icon="el-icon-bell">系统通知</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <template v-if="showProjectSelect">
        <span class="el-dropdown-link" v-if="!userCurrentProject.name" style="font-size: 14px; margin-right: 10px">
          <i class="el-icon-s-unfold header-title-object-icon3"></i> 暂无项目
        </span>
        <el-dropdown trigger="click" class="header-title" v-else>
          <span class="el-dropdown-link">
            <svg-icon icon-name="project-list" style="margin-right: 2px; vertical-align: bottom"></svg-icon>
            {{ userCurrentProject.name }}
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="(project, index) in userProjectList"
                :key="index"
                @click="handleDropClick(project)"
                :icon="project.id === userCurrentProject.id ? 'el-icon-check' : ''"
              >
                {{ project.name }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
      <el-dropdown trigger="click" class="header-title">
        <span class="el-dropdown-link">
          <i class="el-icon-user-solid" style="margin-right: 2px"></i>
          {{ userInfo.displayName }}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item icon="el-icon-user" @click="jump2UserCenter">个人中心</el-dropdown-item>
            <el-dropdown-item icon="el-icon-info" @click="toAboutInfo">关于</el-dropdown-item>
            <el-dropdown-item icon="el-icon-switch-button" @click="handleLogout">登出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <el-dialog title="关于" v-model="dialogVisible" width="600px" top="25vh" @close="handleClose">
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
import { computed, defineComponent, onBeforeUnmount, reactive, ref } from 'vue';
// import breadCurmb from '@/components/bread-curmb/Index.vue';
import { userCurrentProject, userProjectList, userInfo } from '@/layout/messageCenter/user-info';
import { postCurrentProject, logout } from '@/api/auth';
import Message from 'element-plus/es/el-message';
import { useRoute, useRouter } from 'vue-router';
import { alloverEdit, currentids } from '@/layout/messageCenter/routerRef';
import { ElMessageBox } from 'element-plus';

export default defineComponent({
  name: 'navBar',
  components: {
    // breadCurmb,
  },
  setup() {
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
    const route = useRoute();
    const handleDropClick = async (project: any) => {
      if (project.id !== userCurrentProject.value.id) {
        if (alloverEdit.value) {
          const res = await ElMessageBox.confirm('即将切换项目，正在编辑的内容将无法保存，是否切换?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'error',
          });
          console.log(res, 'this is awaitData');
        }
        alloverEdit.value = false;
        postCurrentProject({ id: project.id }).then(() => {
          userCurrentProject.value = project;
          localStorage.setItem('projectId', project.id);
          const { meta, fullPath } = route;
          if (meta.checkPath) {
            if (meta.checkPath === 'current') {
              window.location.href = fullPath;
            } else {
              window.location.href = (meta.activeMenu as string) || '/';
            }
          } else {
            window.location.href = '/';
          }
        });
      }
    };
    const dialogVisible = ref(false);

    const router = useRouter();
    const jump2UserCenter = () => {
      router.push('/user-management');
    };

    const toAboutInfo = () => {
      dialogVisible.value = true;
    };

    const handleClose = () => {
      dialogVisible.value = false;
    };

    let intervalLogout = null as any;

    const handleLogout = () => {
      logout().then((res: any) => {
        const urls = res.data.logoutUrl;
        if (urls) {
          window.location.href = urls;
        } else {
          Message.error('登出失败');
        }
      });
    };
    onBeforeUnmount(() => {
      if (intervalLogout) {
        clearInterval(intervalLogout);
        intervalLogout = null;
      }
    });

    const showProjectSelect = computed(() => {
      const arr = [3, 4, 10, 11, 12, 17, 18, 19, 20, 25, 26, 27, 28];
      return !arr.includes(currentids.value);
    });
    return {
      projectList,
      userCurrentProject,
      userProjectList,
      handleDropClick,
      userInfo,
      handleLogout,
      jump2UserCenter,
      toAboutInfo,
      dialogVisible,
      handleClose,
      showProjectSelect,
    };
  },
});
</script>

<style lang="scss">
.nav-bar {
  width: 100%;
  height: 100%;
  color: white;
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
.el-dropdown-link {
  &:hover {
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
.el-dialog {
  font-weight: bolder;
}
</style>
