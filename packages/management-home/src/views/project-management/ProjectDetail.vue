<template>
  <div class="project-detail">
    <el-row class="basic-info">
      <div>
        <div class="title">
          项目信息
          <span class="edit-btn" v-if="!editMode" @click="editMode = true">编辑</span>
        </div>
        <el-form inline label-width="80px" :model="formData">
          <el-form-item label="项目名称">
            <div v-if="!editMode" class="form-content">{{ detailInfo.name }}</div>
            <el-input class="form-content" v-if="editMode" v-model="formData.name"></el-input>
          </el-form-item>
          <el-form-item label="项目描述">
            <div v-if="!editMode" class="form-content">{{ detailInfo.description }}</div>
            <el-input class="form-content" v-if="editMode" v-model="formData.description"></el-input>
          </el-form-item>
          <el-form-item label="代码模板">
            <div v-if="!editMode" class="form-content">{{ detailInfo.template }}</div>
            <el-select class="form-content" v-if="editMode" v-model="formData.template"></el-select>
          </el-form-item>
          <el-form-item label="负 责 人">
            <div v-if="!editMode" class="form-content">{{ detailInfo.owner }}</div>
            <el-input class="form-content" v-if="editMode" v-model="formData.owner"></el-input>
          </el-form-item>
          <el-form-item label="项目级别">
            <div v-if="!editMode" class="form-content">{{ getLabel(detailInfo.level)(projectLevels) }}</div>
            <el-radio-group class="form-content" v-if="editMode" v-model="formData.level">
              <el-radio v-for="level in projectLevels" :key="level.value" :label="level.value">{{
                level.label
              }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="项目简介">
            <div v-if="!editMode" class="form-content multiline">
              {{ detailInfo.remark }}
            </div>
            <el-input
              class="form-content"
              type="textarea"
              :rows="4"
              v-if="editMode"
              v-model="formData.remark"
            ></el-input>
          </el-form-item>
          <el-form-item label="项目状态">
            <div v-if="!editMode" class="form-content">{{ getLabel(detailInfo.status)(statusOptions) }}</div>
            <el-radio-group class="form-content" v-if="editMode" v-model="formData.status">
              <el-radio v-for="status in statusOptions" :key="status.value" :label="status.value">{{
                status.label
              }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div style="text-align: center;" v-if="editMode">
          <el-button @click="save" type="primary">保存</el-button>
          <el-button @click="cancel">取消</el-button>
        </div>
      </div>
    </el-row>
    <el-row class="user-info">
      <div class="user-tree">
        <el-scrollbar>
          <el-tree :data="treeData" :default-expand-all="true">
            <template #default="{ node, data }">
              <div class="customNode">
                <i v-if="node.level < 3" class="el-icon-folder"></i>
                <span>{{ node.label }}</span>
                <i
                  v-if="node.level === 2"
                  class="el-icon-circle-plus"
                  style="float: right"
                  @click.stop="addMember(node, data)"
                ></i>
              </div>
            </template>
          </el-tree>
        </el-scrollbar>
      </div>
      <div class="user-table">
        <el-table></el-table>
      </div>
    </el-row>
    <tree-selector
      :option="allUser"
      v-model="selectedUser"
      optionPlaceholder="请输入部门/人员名称"
      optionLabel="选择人员"
      valueLabel="A项目-B岗位"
    ></tree-selector>
  </div>
</template>

<script lang="ts">
import _ from 'lodash/fp';
import { reactive, ref } from 'vue';
import { getProjectDetail } from '@/api/project/project';
import TreeSelector from './components/TreeSelector.vue';
export default {
  name: 'ProjectDetail',
  props: {
    id: {
      required: true,
    },
  },
  components: { TreeSelector },
  setup(props: any) {
    const editMode = ref(false);
    const detailInfo = reactive({
      name: '',
      description: '',
      template: '',
      owner: '',
      level: '',
      remark: '',
      status: '',
    });
    const formData = reactive({
      name: '',
      description: '',
      template: '',
      owner: '',
      level: '',
      remark: '',
      status: '',
    });
    const projectLevels = [
      {
        value: 0,
        label: '通用级',
      },
      {
        value: 1,
        label: '行业级',
      },
      {
        value: 2,
        label: '租户级',
      },
    ];
    const statusOptions = [
      {
        value: 0,
        label: '启用',
      },
      {
        value: 1,
        label: '冻结',
      },
    ];
    const getLabel = (id: any) => (collection: Array<any>) =>
      _.flow(_.find({ value: id }), _.property('label'))(collection);

    // 初始化项目信息
    const getProjectInfo = async () => {
      const { code, data } = await getProjectDetail(props.id);
      if (code === 0) {
        Object.assign(detailInfo, data);
        Object.assign(formData, data);
      }
    };
    getProjectInfo();

    // 表单操作
    const save = () => {
      //
    };
    const cancel = () => {
      editMode.value = false;
      Object.assign(formData, detailInfo);
    };

    // 用户树
    const treeData = ref([
      {
        label: '测试项目',
        children: [
          {
            label: '项目经理',
            children: [],
          },
          {
            label: '产品',
            children: [],
          },
          {
            label: '研发',
            children: [],
          },
          {
            label: '测试',
            children: [],
          },
          {
            label: '运维',
            children: [],
          },
        ],
      },
    ]);
    const addMember = () => {
      //
    };
    const allUser = [
      {
        label: '腾云西子',
        children: [
          {
            label: 'A部门',
            children: [],
          },
          {
            label: 'V部门',
            children: [],
          },
          {
            label: 'B部门',
            children: [],
          },
          {
            label: 'D部门',
            children: [],
          },
        ],
      },
    ];
    const selectedUser = [
      {
        label: '东尼大木',
        department: '有关组织',
      },
    ];

    return {
      editMode,
      detailInfo,
      formData,
      getLabel,
      projectLevels,
      statusOptions,
      save,
      cancel,
      treeData,
      addMember,
      allUser,
      selectedUser,
    };
  },
};
</script>

<style lang="scss" scoped>
.project-detail {
  margin: -20px;
  height: calc(100vh - 130px);
  background: #f2f2f2;
  .basic-info {
    height: 310px;
    margin-bottom: 20px;
    background: white;
    padding: 20px;
    &:deep(label) {
      text-align: justify;
      text-justify: inter-word;
    }
    &:deep(.el-form-item) {
      height: 32px;
    }
    .form-content {
      width: calc(50vw - 300px);
      &.multiline {
        height: 100px;
        overflow: auto;
      }
    }
    & > div {
      font-size: 14px;
      height: 100%;
      .title {
        font-size: 16px;
        font-weight: 700;
        height: 38px;
        line-height: 18px;
      }
      .edit-btn {
        float: right;
        font-weight: normal;
        font-size: 13px;
        color: #006eff;
        cursor: pointer;
      }
    }
  }
  .user-info {
    height: calc(100% - 320px);
  }
  .user-tree {
    width: 300px;
    margin-right: 20px;
    background: white;
    padding: 20px;
    .customNode {
      width: 100%;
      &:deep(.el-icon-circle-plus):hover {
        color: $primary;
      }
    }
  }
  .user-table {
    width: calc(100% - 320px);
    background: white;
  }
}
</style>
