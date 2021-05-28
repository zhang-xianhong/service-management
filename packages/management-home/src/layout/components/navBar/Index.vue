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
      <span
        class="el-dropdown-link"
        v-if="!userCurrentProject.name"
        style="font-size: 14px; margin-right: 10px"
      >
        <i class="el-icon-s-unfold header-title-object-icon3"></i> 暂无项目
      </span>
      <el-dropdown trigger="click" class="header-title" v-else>
        <span class="el-dropdown-link">
          <i class="el-icon-s-unfold header-title-object-icon3"></i>
          {{ userCurrentProject.name }}
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="(project, index) in userProjectList"
              :key="index"
              @click="handleDropClick(project)"
              :icon="project.id === userCurrentProject.id ? 'el-icon-check' : ''"
            >{{ project.name }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-dropdown trigger="click" class="header-title">
        <span class="el-dropdown-link">
          <i class="el-icon-user-solid"></i>
          {{ userInfo.userName }}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <!-- <el-dropdown-item icon="el-icon-edit" v-if="userInfo.admin">用户管理</el-dropdown-item> -->
            <!--            <el-dropdown-item icon="el-icon-map-location">登录地点</el-dropdown-item>-->
            <!--            <el-dropdown-item icon="el-icon-s-custom">我的资产</el-dropdown-item>-->
            <el-dropdown-item icon="el-icon-info" @click="jump2UserCenter">个人中心</el-dropdown-item>
            <el-dropdown-item icon="el-icon-info">关于</el-dropdown-item>
            <el-dropdown-item icon="el-icon-switch-button" @click="handleLogout">登出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, reactive } from 'vue';
// import breadCurmb from '@/components/bread-curmb/Index.vue';
import { userCurrentProject, userProjectList, userInfo } from '@/layout/messageCenter/user-info';
import { postCurrentProject, logout } from '@/api/auth';
import Message from 'element-plus/es/el-message';
import { useRouter } from 'vue-router';

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
    const handleDropClick = (project: any) => {
      if (project.id !== userCurrentProject.value.id) {
        postCurrentProject({ id: project.id }).then(() => {
          userCurrentProject.value = project;
          localStorage.setItem('projectId', project.id);
          window.location.href = '/';
        });
      }
    };

    const router = useRouter();
    const jump2UserCenter = () => {
      router.push('/user-management');
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
    return {
      projectList,
      userCurrentProject,
      userProjectList,
      handleDropClick,
      userInfo,
      handleLogout,
      jump2UserCenter,
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
</style>
