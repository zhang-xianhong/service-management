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
        <el-tab-pane label="开放设置" name="openSet">
          <add-open-set></add-open-set>
        </el-tab-pane>
        <el-tab-pane label="运行参数" name="runParams">
          <add-run-params></add-run-params>
        </el-tab-pane>
        <el-tab-pane label="代码模板" name="codeTemplate">
          <add-code-template></add-code-template>
        </el-tab-pane>
        <el-tab-pane label="高级设置" name="heigherSet">
          <add-heigh-set></add-heigh-set>
        </el-tab-pane>
        <el-tab-pane label="版权信息" name="copyright">
          <add-copyright></add-copyright>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

import AddBaseInfo from '@/views/project-management/add-project/components/AddBaseInfo.vue';
import AddOpenSet from '@/views/project-management/add-project/components/AddOpenSet.vue';
import AddRunParams from '@/views/project-management/add-project/components/AddRunParams.vue';
import AddCodeTemplate from '@/views/project-management/add-project/components/AddCodeTemplate.vue';
import AddHeighSet from '@/views/project-management/add-project/components/AddHeighSet.vue';
import AddCopyright from '@/views/project-management/add-project/components/AddCopyright.vue';

export default defineComponent({
  name: 'addProject',
  components: {
    AddBaseInfo,
    AddOpenSet,
    AddRunParams,
    AddCodeTemplate,
    AddHeighSet,
    AddCopyright,
  },
  setup() {
    const tabActive = ref('baseInfo');
    return {
      tabActive,
    };
  },
});
</script>

<style lang="scss">
.add-project {
  .add-project-btns_container {
    width: 100%;
    height: 60px;
    //background-color: rgba(0,0,0,0.2);
  }
  .add-project-tabs_container {
    width: 100%;
  }
}
</style>
