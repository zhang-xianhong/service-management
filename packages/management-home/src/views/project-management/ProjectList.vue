<template>
  <div class="project-list">
    <div class="project-list_title">
      <div class="project-list_left">
        <el-button icon="el-icon-plus" type="primary" @click="addDialogVisible = true">新建</el-button>
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
    <el-dialog v-model="addDialogVisible" title="新建项目" width="500px">
      <div class="add-project-dialog">
        <el-form :model="projectDetail">
          <el-form-item
            label="项目名称"
            :label-width="labelWidth"
            prop="name"
            :rules="[{ required: true, message: '请输入英文名称', trigger: 'blur' }]"
          >
            <el-input v-model="projectDetail.name"> </el-input>
          </el-form-item>
          <el-form-item
            label="项目描述"
            :label-width="labelWidth"
            prop="name"
            :rules="[{ required: true, message: '请输入英文名称', trigger: 'blur' }]"
          >
            <el-input v-model="projectDetail.description"> </el-input>
          </el-form-item>
          <el-form-item
            label="代码模板"
            :label-width="labelWidth"
            :rules="[{ required: true, message: '请选择代码模板', trigger: 'blur' }]"
          >
            <el-select v-model="projectDetail.templateId" placeholder="请选择代码模板" default-first-option>
              <el-option
                v-for="(item, index) in codeTemplateList"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="负责人" :label-width="labelWidth">
            <el-select v-model="projectDetail.owner" placeholder="请选择负责人">
              <el-option
                v-for="(item, index) in persons"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="项目级别" :label-width="labelWidth">
            <el-radio v-model="projectDetail.level" label="1">统一</el-radio>
            <el-radio v-model="projectDetail.level" label="2">行业</el-radio>
            <el-radio v-model="projectDetail.level" label="3">租户</el-radio>
          </el-form-item>
          <el-form-item label="项目状态" :label-width="labelWidth">
            <el-radio v-model="projectDetail.status" label="1">启用</el-radio>
            <el-radio v-model="projectDetail.status" label="0">禁用</el-radio>
          </el-form-item>
          <el-form-item label="项目简介" :label-width="labelWidth">
            <el-input v-model="projectDetail.remark" type="textarea" :rows="5"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitProjectDetail">确定</el-button>
        <el-button @click="closeDialog">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import ProjectItem from '@/views/project-management/components/ProjectItem.vue';

import { getProjectListData, projectDetail } from '@/views/project-management/utils/project-data-utils';

export default defineComponent({
  name: 'ProjectList',
  components: {
    ProjectItem,
  },
  data() {
    return {
      labelWidth: '80px',
    };
  },
  setup() {
    const addDialogVisible = ref(false);
    const codeTemplateList = ref([] as any);
    const persons = ref([] as any);
    getProjectListData();
    const submitProjectDetail = () => {
      console.log(projectDetail, 11111);
    };
    const closeDialog = () => {
      addDialogVisible.value = false;
    };
    return {
      addDialogVisible,
      projectDetail,
      codeTemplateList,
      persons,
      submitProjectDetail,
      closeDialog,
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
  .add-project-dialog {
    width: 80%;
    margin-left: 10%;
    .el-input--small .el-input__inner {
      height: 32px;
      line-height: 32px;
      width: 288px;
    }
  }
  .dialog-footer {
    text-align: center;
  }
}
</style>
