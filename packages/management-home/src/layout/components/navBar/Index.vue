<template>
  <div class="nav-bar">
    <a class="app-logo">
      <img src="./logo.png">
    </a>
    <div class="bread-bar">
      <bread-curmb></bread-curmb>
    </div>
    <div class="position-right-bar">
      <el-popover
        placement="bottom"
        :width="180"
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
      </el-popover>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import breadCurmb from '@/components/breadCurmb/Index.vue'

export default defineComponent({
  name: 'navBar',
  components: {
    breadCurmb
  }
})
</script>

<style lang="scss">
.nav-bar{
  width: 100%;
  height: 100%;
  color: white;
  line-height: 50px;
  position: relative;
  border-bottom: solid 1px rgba(0,0,0,0.2);
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
  .bread-bar{
    display: flex;
    align-items: center;
    margin-left: 40px;
  }
  .position-right-bar{
    margin-left: auto;
  }
}
.props-list-item{
  margin-bottom: 10px;
  border-radius: 2px;
  padding: 5px 30px;
  //border: solid 1px rgba(0,0,0,0.2);
  &>span{
    display: inline-block;
    margin-left: 10px;
  }
  &:nth-child(1){
    margin-top: 10px;
  }
  &:hover{
    background: rgba(0,0,0,0.2);
    cursor: pointer;
  }
}
</style>
