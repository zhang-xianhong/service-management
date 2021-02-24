<template>
  <div class="nav-bar">
    <a class="app-logo">
      <img src="./logo.png" />
    </a>
    <div class="bread-bar">
      <bread-curmb></bread-curmb>
    </div>
    <div class="position-right-bar">
      <el-dropdown trigger="click" class="header-title">
        <el-badge :value="5" :max="99" class="item">
          <i class="el-icon-message-solid header-title-message-icon"></i>
        </el-badge>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item icon="el-icon-message"
              >升级公告<span
                class="el-badge__content el-badge__content--primary"
                >2</span
              ></el-dropdown-item
            >
            <el-dropdown-item icon="el-icon-s-flag">待办任务</el-dropdown-item>
            <el-dropdown-item icon="el-icon-tickets">待办工单</el-dropdown-item>
            <el-dropdown-item icon="el-icon-date"
              >今日日程<span
                class="el-badge__content el-badge__content--primary"
                >3</span
              ></el-dropdown-item
            >
            <el-dropdown-item icon="el-icon-edit-outline"
              >待批申请</el-dropdown-item
            >
            <el-dropdown-item icon="el-icon-bell">系统通知</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-dropdown trigger="click" class="header-title">
        <span class="el-dropdown-link">
          <i class="el-icon-s-unfold header-title-object-icon3"></i>项目
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="project in projectList"
              :key="project.id"
              >{{ project.name }}</el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-dropdown trigger="click" class="header-title">
        <span class="el-dropdown-link">
          <i class="el-icon-user-solid"></i>
          admin
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item icon="el-icon-edit">用户设置</el-dropdown-item>
            <el-dropdown-item icon="el-icon-map-location"
              >登录地点</el-dropdown-item
            >
            <el-dropdown-item icon="el-icon-s-custom"
              >我的资产</el-dropdown-item
            >
            <el-dropdown-item icon="el-icon-info">关于</el-dropdown-item>
            <el-dropdown-item icon="el-icon-switch-button"
              >登出</el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <!-- <el-popover
        placement="bottom"
        :width="150"
        trigger="click"
        :show-after="50"
        :hide-after="50"
      >
        <template #reference>
          <el-button>aidentao</el-button>
        </template>
        <div>
          <div class="props-list-item">
            <i class="el-icon-s-tools"></i>
            <span>用户设置</span>
          </div>
          <div class="props-list-item">
            <i class="el-icon-s-promotion"></i>
            <span>登录地点</span>
          </div>
          <div class="props-list-item">
            <i class="el-icon-folder"></i>
            <span>我的资产</span>
          </div>
          <div class="props-list-item">
            <i class="el-icon-info"></i>
            <span>关于</span>
          </div>
          <div class="props-list-item">
            <i class="el-icon-lollipop"></i>
            <span>登出</span>
          </div>
        </div>
      </el-popover> -->
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import breadCurmb from '@/components/breadCurmb/Index.vue'

export default defineComponent({
  name: 'navBar',
  components: {
    breadCurmb
  },
  setup () {
    const projectList = reactive([
      {
        id: 1,
        name: '测试项目1'
      },
      {
        id: 2,
        name: '测试项目2'
      }
    ])
    return {
      projectList
    }
  }
})
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
</style>
