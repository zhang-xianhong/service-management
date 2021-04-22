<template>
  <div class="project-list">
    <div class="project-list_title">
      <div class="project-list_left">
        <el-button icon="el-icon-plus" type="primary" @click="addDialogVisible = true">新建</el-button>
      </div>
      <div class="project-list_right">
        <el-input
          placeholder="请输入名称"
          style="width: 500px"
          v-model="pageInfo.keyword"
          suffix-icon="el-icon-search"
          @input="searchProject"
        >
        </el-input>
      </div>
    </div>
    <div class="project-list_content" ref="projectParentDiv" :style="{ paddingLeft: paddings }">
      <project-item
        v-for="item in projectList"
        :data-obj="item"
        :key="item.id"
        @delete-project="deleteProject"
        @reload-projects="getProjectListData"
      ></project-item>
    </div>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageInfo.page"
      :page-sizes="[1, 5, 10, 20, 50]"
      :page-size="pageInfo.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pageInfo.total"
    >
    </el-pagination>
    <el-dialog v-model="addDialogVisible" title="新建项目" width="500px" @close="closeDialog" destroy-on-close>
      <div class="add-project-dialog">
        <el-form :model="projectDetail">
          <el-form-item
            label="项目名称"
            :label-width="labelWidth"
            prop="name"
            :rules="[{ required: true, message: '请输入英文名称', trigger: 'blur' }]"
          >
            <el-input v-model="projectDetail.name" @blur="checkEnglishName"> </el-input>
          </el-form-item>
          <el-form-item
            label="项目描述"
            :label-width="labelWidth"
            prop="name"
            :rules="[{ required: true, message: '请输入项目描述', trigger: 'blur' }]"
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
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="负责人" :label-width="labelWidth">
            <fetch-owners-select @get-owners="setOwner"></fetch-owners-select>
          </el-form-item>
          <el-form-item
            label="项目级别"
            :label-width="labelWidth"
            :rules="[{ required: true, message: '请输入项目级别', trigger: 'blur' }]"
          >
            <el-radio v-model="projectDetail.level" :label="1">通用级</el-radio>
            <el-radio v-model="projectDetail.level" :label="2">行业级</el-radio>
            <el-radio v-model="projectDetail.level" :label="3">租户级</el-radio>
          </el-form-item>
          <el-form-item
            label="许可类型"
            :label-width="labelWidth"
            :rules="[{ required: true, message: '请输入项目级别', trigger: 'blur' }]"
          >
            <el-radio v-model="projectDetail.license" :label="0">永久</el-radio>
            <el-radio v-model="projectDetail.license" :label="1">租用</el-radio>
          </el-form-item>
          <el-form-item label="项目状态" :label-width="labelWidth">
            <el-radio v-model="projectDetail.status" :label="1">启用</el-radio>
            <el-radio v-model="projectDetail.status" :label="0">禁用</el-radio>
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
import { defineComponent, onMounted, ref, watch } from 'vue';
import ProjectItem from '@/views/project-management/components/ProjectItem.vue';

import {
  getProjectListData,
  projectDetail,
  projectList,
  addProjectData,
  getAllTems,
  codeTemplateList,
  deleteProject,
  pageInfo,
} from '@/views/project-management/utils/project-data-utils';
import Message from 'element-plus/es/el-message';
import fetchOwnersSelect from '@/components/fetchOwnersSelect/Index.vue';
import { projectNameTest } from '@/api/project/project';

export default defineComponent({
  name: 'ProjectList',
  components: {
    ProjectItem,
    fetchOwnersSelect,
  },
  data() {
    return {
      labelWidth: '80px',
    };
  },
  setup() {
    const addDialogVisible = ref(false);
    const persons = ref([] as any);
    const projectParentDiv = ref(null as any);

    const closeDialog = () => {
      addDialogVisible.value = false;
      const keys = Object.keys(projectDetail);
      keys.forEach((x) => {
        projectDetail[x] = '';
      });
      projectDetail.license = 1;
      projectDetail.level = 3;
      projectDetail.status = 1;
    };

    getProjectListData();
    getAllTems();

    const submitProjectDetail = () => {
      if (!projectDetail.name) {
        return Message.error('项目名称不得为空');
      }
      if (!projectDetail.description) {
        return Message.error('项目描述不得为空');
      }
      if (!projectDetail.templateId) {
        return Message.error('代码模板不得为空');
      }
      addProjectData().then(() => {
        pageInfo.page = 1;
        getProjectListData();
        closeDialog();
      });
    };

    const handleSizeChange = (res: number) => {
      pageInfo.pageSize = res;
      pageInfo.page = 1;
      getProjectListData();
    };
    const handleCurrentChange = (res: number) => {
      pageInfo.page = res;
      getProjectListData();
    };
    const searchProject = () => {
      pageInfo.page = 1;
      getProjectListData();
    };
    const setOwner = (res: string) => {
      projectDetail.owner = res;
    };

    watch(
      () => projectParentDiv,
      (nn: any) => {
        console.log(nn, 'div变化了');
      },
    );
    const paddings = ref('0px');
    const getPaddings = () => {
      const width = projectParentDiv.value.clientWidth - 20;
      paddings.value = `${Math.abs((width % 290) / 2) - 10}px`;
    };
    onMounted(() => {
      getPaddings();
      window.onresize = () => {
        getPaddings();
      };
    });
    const checkEnglishName = () => {
      console.log(projectDetail.name);
      if (!projectDetail.name) {
        return;
      }
      projectNameTest({ name: projectDetail.name });
    };
    return {
      addDialogVisible,
      projectDetail,
      codeTemplateList,
      persons,
      submitProjectDetail,
      closeDialog,
      projectList,
      deleteProject,
      handleSizeChange,
      handleCurrentChange,
      pageInfo,
      searchProject,
      getProjectListData,
      setOwner,
      projectParentDiv,
      paddings,
      checkEnglishName,
    };
  },
});
</script>

<style lang="scss">
.project-list {
  width: 100%;
  &_title {
    width: 100%;
    margin-bottom: 10px;
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
  .project-list_content {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
