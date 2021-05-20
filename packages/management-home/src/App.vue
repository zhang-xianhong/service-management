<template>
  <div class="apps">
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { getUserInfo } from '@/api/auth';
import { userCurrentProject, userInfo, userMenus, userProjectList } from '@/layout/messageCenter/user-info';
import { resetPremissionRouter } from '@/router';
import { routerLoading } from '@/layout/messageCenter/routerRef';

export default defineComponent({
  setup() {
    const loadings = ref(true);
    let localsid = localStorage.getItem('projectId') as any;
    localsid = Number.isNaN(Number(localsid)) ? 0 : Number(localsid);
    getUserInfo({ projectId: localsid }).then((res) => {
      const { info, projects } = res.data;
      const { userAuth } = info;
      userInfo.value = info;
      const menuObj = {} as any;
      userAuth.forEach((x: any) => {
        menuObj[x.id] = [];
        if (x.modules) {
          x.modules.forEach((y: any) => {
            if (y.code) {
              menuObj[x.id] = [...y.code.split('-'), ...menuObj[x.id]];
            }
          });
        }
        menuObj[x.id] = [...new Set(menuObj[x.id])];
      });
      userMenus.value = menuObj;
      userProjectList.value = projects;
      resetPremissionRouter();
      loadings.value = false;
      routerLoading.value = false;
      if (projects.length) {
        const includes = localsid && projects.map((x: any) => x.id).includes(localsid);
        if (!includes) {
          // eslint-disable-next-line prefer-destructuring
          userCurrentProject.value = projects[0];
          localStorage.setItem('projectId', projects[0].id);
          window.location.href = '/';
        } else {
          projects.forEach((x: any) => {
            if (localsid === x.id) {
              userCurrentProject.value = x;
            }
          });
        }
      }
    });

    return {
      userInfo,
      loadings,
    };
  },
});
</script>

<style lang="scss">
* {
  box-sizing: border-box;
}
html,
body {
  width: 100vw;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  margin: 0;
  padding: 0;
}
#app {
  font-family: 'Microsoft YaHei', 'PingFang SC', 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;

  //el样式修改
  .el-button {
    border-radius: 0;
  }
  .el-button--primary {
    background-color: #006eff;
    border-color: #006eff;
  }
  .el-input__inner,
  .el-input-group__append,
  .el-popover.el-popper,
  .el-cascader .el-input .el-input__inner,
  .el-input--small .el-input__inner,
  .el-dialog,
  .el-input-group__prepend {
    border-radius: 0;
  }
  .el-form-item__label {
    font-size: 12px;
  }
  .el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label {
    &::before {
      content: '';
    }
    &::after {
      content: '*';
      color: #f56c6c;
      margin-left: 4px;
    }
  }
}
.apps {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

a {
  text-decoration: none;
  color: #006eff;
}
.el-message--error,
.el-message--success,
.el-message--warn {
  z-index: 3000 !important;
}
</style>

<style lang="scss" module>
.normal {
  background-color: #0abf5b;
}
.warning {
  background-color: #ff9d00;
}
.error {
  background-color: #e54545;
}
.primary {
  background-color: #006eff;
}
#nprogress .bar {
  background-image: linear-gradient(to right, red, blue);
  height: 8px !important;
}
</style>
