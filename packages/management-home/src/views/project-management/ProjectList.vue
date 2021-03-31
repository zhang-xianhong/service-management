<template>
  <div class="project-list">
    <div class="project-list_title">
      <div class="project-list_left">
        <el-button icon="el-icon-plus" type="primary">新建</el-button>
      </div>
      <div class="project-list_right">
        <el-input placeholder="请输入名称" style="width: 260px">
          <template #append>
            <el-button icon="el-icon-search"></el-button>
          </template>
        </el-input>
      </div>
    </div>
    <div class="project-list_content">
      <project-item></project-item>
    </div>
    <el-dialog v-model="addDialogVisible" title="新建项目"></el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import ProjectItem from '@/views/project-management/components/ProjectItem.vue';
export default defineComponent({
  name: 'ProjectList',
  components: {
    ProjectItem,
  },
  setup() {
    const addDialogVisible = ref(true);
    return {
      addDialogVisible,
    };
  },
});
</script>

<style lang="scss">
.project-list {
  width: 100%;
  &_title {
    width: 100%;
    display: flex;
  }
  &_left {
    flex: 1;
    padding-left: 10px;
  }
  &_right {
    flex: 1;
    text-align: right;
  }
  &_content {
    width: 100%;
    padding: 10px;
    margin-top: 15px;
  }
}
</style>
