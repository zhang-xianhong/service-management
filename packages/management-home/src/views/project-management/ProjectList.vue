<template>
  <div class="project-list">
    <div class="project-list_title">
      <div class="project-list_left">
        <el-button
          icon="el-icon-plus"
          :type="userInfo.admin ? 'primary' : 'info'"
          @click="addDialogVisible = true"
          style="width: 90px"
          :disabled="!userInfo.admin"
          v-if="getShowBool('add')"
        >
          新建
        </el-button>
      </div>
      <div class="project-list_right">
        <el-input
          placeholder="请输入名称"
          style="width: 500px"
          v-model="pageInfo.keyword"
          suffix-icon="el-icon-search"
          @input="searchProject"
          :disabled="!userProjectList.length"
        ></el-input>
      </div>
    </div>
    <div
      style="background: #fff"
      v-loading="!userProjectList.length"
      element-loading-text="暂无项目，请联系管理员添加项目"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 1)"
    >
      <div class="project-list_content" ref="projectParentDiv" :style="{ paddingLeft: paddings }">
        <project-item
          v-for="item in projectList"
          :data-obj="item"
          :key="item.id"
          @delete-project="deleteProject"
          @reload-projects="getProjectListData"
          :delete-or-not="getShowBool('delete')"
          :update-or-not="getShowBool('update')"
        ></project-item>
        <div v-if="!projectList.length && !loadings" class="placeholders">暂无数据</div>
      </div>
      <packaged-pagination
        v-if="projectList.length"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageInfo.page"
        :page-sizes="[1, 5, 10, 20, 50]"
        :page-size="pageInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageInfo.total"
      ></packaged-pagination>
    </div>
    <el-dialog v-model="addDialogVisible" title="新建项目" width="500px" @close="closeDialog" destroy-on-close>
      <div class="add-project-dialog">
        <el-form :model="projectDetail">
          <el-form-item
            label="项目名称"
            :label-width="labelWidth"
            prop="name"
            :rules="[
              { required: true, message: '请输入英文名称', trigger: 'blur' },
              { min: 3, max: 20, message: '最大不能超过 20 个字符', trigger: 'blur' },
              {
                validator: validatorPass,
                message: '[字母][字母/数字/中横线][字母/数字]（字母为小写）',
                trigger: 'blur',
              },
            ]"
          >
            <el-input v-model="projectDetail.name" @blur="checkEnglishName"></el-input>
          </el-form-item>
          <el-form-item
            label="项目描述"
            :label-width="labelWidth"
            prop="description"
            :rules="[
              { required: true, message: '请输入项目描述', trigger: 'blur' },
              { min: 3, max: 20, message: '请输入3到20个字符', trigger: 'blur' },
            ]"
          >
            <el-input v-model="projectDetail.description"></el-input>
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
            <fetch-owners-select @get-owners="setOwner" :use-project="false"></fetch-owners-select>
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
            <el-radio v-model="projectDetail.status" :label="0">冻结</el-radio>
          </el-form-item>
          <el-form-item label="项目简介" :label-width="labelWidth">
            <el-input v-model="projectDetail.remark" type="textarea" :rows="5"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="project-list-dialog-footer">
        <el-button type="primary" @click="submitProjectDetail" :loading="submitLoading">确定</el-button>
        <el-button @click="closeDialog">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue';
import ProjectItem from '@/views/project-management/components/ProjectItem.vue';
import PackagedPagination from '@/components/pagination/Index.vue';
import { getShowBool } from '@/utils/permission-show-module';
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
import { userProjectList, userInfo } from '@/layout/messageCenter/user-info';

export default defineComponent({
  name: 'ProjectList',
  components: {
    ProjectItem,
    fetchOwnersSelect,
    PackagedPagination,
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
    const loadings = ref(true);

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

    if (userProjectList.value.length) {
      getProjectListData().then(() => {
        loadings.value = false;
      });
    } else {
      loadings.value = false;
    }
    getAllTems();

    const submitLoading = ref(false);
    const submitProjectDetail = () => {
      if (submitLoading.value) {
        return;
      }
      if (!projectDetail.name) {
        return false;
      }
      if (projectDetail.name.length > 20) {
        return false;
      }
      if (!projectDetail.description) {
        return false;
      }
      if (!projectDetail.templateId) {
        return false;
      }
      submitLoading.value = true;
      addProjectData().then(() => {
        pageInfo.page = 1;
        getProjectListData();
        closeDialog();
        window.location.reload();
        submitLoading.value = false;
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

    const validatorPass = (rule: any, value: any, callback: any) => {
      const reg = /^[a-z][a-z0-9-]+[a-z0-9]$/;
      if (!reg.test(value)) {
        callback(new Error(rule.message));
      }
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
      userProjectList,
      userInfo,
      loadings,
      validatorPass,
      getShowBool,
      submitLoading,
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
  }
  &_right {
    flex: 1;
    text-align: right;
  }
  &_content {
    width: 100%;
    padding: 10px;
    margin-top: 10px;
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
  .project-list_content {
    display: flex;
    flex-wrap: wrap;
    min-height: 60px;
    .placeholders {
      width: 100%;
      text-align: center;
      line-height: 60px;
    }
  }
}
.project-list-dialog-footer {
  text-align: center;
}
</style>
