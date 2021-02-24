<template>
  <div class="add-project">
    <div class="add-project-btns_container">
      <el-button type="primary">保存</el-button>
      <el-button>取消</el-button>
    </div>
    <div class="add-project-tabs_container">
      <el-tabs :active-name="tabActive">
        <el-tab-pane label="基本信息" name="baseInfo">
          <add-base-info></add-base-info>
        </el-tab-pane>
        <el-tab-pane label="开放设置" name="openSet">开放设置</el-tab-pane>
        <el-tab-pane label="运行参数" name="runParams">运行参数</el-tab-pane>
        <el-tab-pane label="代码模板" name="codeTemplate">代码模板</el-tab-pane>
        <el-tab-pane label="高级设置" name="heigherSet">高级设置</el-tab-pane>
        <el-tab-pane label="版权信息" name="copyright">版权信息</el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

import AddBaseInfo from '@/views/projectManagement/components/AddBaseInfo.vue'

export default defineComponent({
  name: 'addProject',
  components: {
    AddBaseInfo
  },
  setup () {
    const tabActive = ref('baseInfo')
    return {
      tabActive
    }
  }
})
</script>

<style lang="scss">
.add-project{
  .add-project-btns_container{
    width: 100%;
    height: 60px;
    //background-color: rgba(0,0,0,0.2);
  }
  .add-project-tabs_container{
    width: 100%;
  }
}
</style>
