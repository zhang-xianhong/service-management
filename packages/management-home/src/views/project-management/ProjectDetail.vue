<template>
  <div
    class="project-detail"
    v-loading="!userProjectList.length"
    element-loading-text="暂无项目，请联系管理员添加项目"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.7)"
  >
    <el-row class="basic-info">
      <div>
        <div class="title">
          项目信息
          <span class="edit-btn" v-if="!editMode && getShowBool('update')" @click="editMode = true">编辑</span>
        </div>
        <basic-info-form
          :project-detail="projectDetail"
          :editMode="editMode"
          @submit="editMode = false"
          @cancel="editMode = false"
        ></basic-info-form>
      </div>
    </el-row>
    <el-row class="user-info">
      <div class="user-tree">
        <el-scrollbar>
          <el-tree
            ref="userTreeRef"
            :data="treeData"
            :default-expand-all="true"
            :expand-on-click-node="false"
            :highlight-current="true"
            node-key="id"
            :current-node-key="currentKey"
            @node-click="nodeClickHandler"
          >
            <template #default="{ node, data }">
              <div class="customNode">
                <svg-icon v-if="node.level < 3" icon-name="folder" icon-class="tree-node-folder"></svg-icon>
                <svg-icon v-if="node.level === 3" icon-name="member" icon-class="tree-node-member"></svg-icon>
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
        <el-table :data="userList" height="100%">
          <el-table-column type="index" width="55"></el-table-column>
          <el-table-column v-for="column in columns" :key="column.prop" v-bind="column"></el-table-column>
          <el-table-column prop="operator" width="55">
            <template #default="{ row, $index }">
              <i class="el-icon-error remove-user-icon" @click="removeUser(row, $index)"></i>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-row>
    <tree-selector
      :option="allDeptUser"
      :checked="selectedUser"
      :not-allow="otherRoleUser"
      optionPlaceholder="请输入部门/人员名称"
      optionLabel="选择人员"
      :role="treeSelectorRole"
      ref="treeSelectorRef"
      @user-changed="reloadUserList"
    ></tree-selector>
  </div>
</template>

<script lang="ts">
import _ from 'lodash/fp';
import { ref, Ref, provide } from 'vue';
import TreeSelector from './components/TreeSelector.vue';
import BasicInfoForm from './components/BasicInfoForm.vue';
import { ElMessageBox } from 'element-plus';
import { getMemberList, getProjectDetail, deleteMember } from '@/api/project/project';
import { getTenentDepartment } from '@/api/tenant';
import { userProjectList } from '@/layout/messageCenter/user-info';
import { getShowBool } from '@/utils/permission-show-module';

const userStatus = {
  '-1': '冻结',
  0: '启用',
};
const genderLabel = {
  0: '男',
  1: '女',
};
export default {
  name: 'ProjectDetail',
  props: {
    id: {
      required: true,
    },
  },
  components: { TreeSelector, BasicInfoForm },
  setup(props: any) {
    provide('projectId', props.id);
    const treeSelectorRef: any = ref(null);
    const editMode = ref(false);
    const selectedUser: Ref<Array<any>> = ref([]);
    const userTreeRef: any = ref(null);

    // 用户树
    const treeData: Ref<any> = ref([
      {
        label: '',
        children: [],
      },
    ]);
    const currentKey = ref('');
    const treeSelectorRole = ref({});

    // tree selector数据
    const allDeptUser: Ref<Array<any>> = ref([]);

    // 用户列表
    const userList: Ref<any[]> = ref([]);
    const columns = [
      {
        prop: 'userName',
        label: '登录账号',
      },
      {
        prop: 'displayName',
        label: '姓名',
      },
      {
        prop: 'gender',
        label: '性别',
        width: '60',
      },
      {
        prop: 'phoneNumber',
        label: '手机',
      },
      {
        prop: 'primaryMail',
        label: '邮箱',
      },
      {
        prop: 'status',
        label: '状态',
        width: '60',
      },
      {
        prop: 'deptName',
        label: '部门',
      },
    ];

    const allUsers = ref([]);
    const initUserList = async () => {
      const { code, data } = await getMemberList({
        projectId: props.id,
      });
      if (code === 0) {
        allUsers.value = data.users.map((user: any) => ({
          ...user,
          status: userStatus[user.status as 0 | -1],
          gender: genderLabel[user.gender as 0 | 1],
        }));
        const noPaRoles = data.roles.filter((x: any) => x.code !== 'PA');
        treeData.value[0].children = _.flow(
          _.reject({ isOwnerRole: true }),
          _.map((role: any) => ({
            id: role.id,
            label: role.name,
            children: _.map((member: any) => {
              const user: any = _.find({ id: member.userId })(data.users);
              return {
                label: user.displayName,
                id: user.id,
              };
            })(role.members),
          })),
        )(noPaRoles);
        userList.value = [];
      }
    };
    initUserList();

    const reloadUserList = async (role: any) => {
      await initUserList();
      userTreeRef.value.setCurrentKey(role.id);
      const treeUser: any = _.find({ id: role.id })(treeData.value[0].children);
      userList.value = _.intersectionWith((node: any, user: any) => node.id === user.id)(allUsers.value)(
        treeUser.children,
      );
    };
    const removeUser = (row: any) => {
      ElMessageBox.confirm(`是否将${row.displayName}从${row.deptName}中移除？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const { code } = await deleteMember({
          projectId: Number(props.id),
          roleId: userTreeRef.value.getCurrentKey(),
          ids: [row.id],
        });
        if (code === 0) reloadUserList({ id: userTreeRef.value.getCurrentKey() });
      });
    };
    // 初始化项目信息
    const projectDetail = ref({});
    const getProjectInfo = async () => {
      const { code, data } = await getProjectDetail(props.id);
      if (code === 0) {
        const projectInfo = data;
        projectInfo.templateId = data.template.id;
        projectInfo.templateName = data.template.name;
        projectDetail.value = projectInfo;
        treeData.value[0].label = data.name;
      }
    };
    getProjectInfo();

    const nodeClickHandler = (data: any, node: any) => {
      if (node.level === 1) {
        userList.value = allUsers.value;
      }
      if (node.level === 2) {
        userList.value = _.intersectionWith((node: any, user: any) => node.id === user.id)(allUsers.value)(
          node.data.children,
        );
      }
    };

    const initDepartments = async () => {
      const { code, data } = await getTenentDepartment({ deptId: 0, level: 9 });
      if (code === 0) {
        const deptTree = [
          {
            name: data.tenant.name,
            _children: [],
            id: 0,
            isLeaf: false,
          },
        ];
        const setChildren = (parentNode: any, allData: any) => {
          const childrenUser = _.flow(
            _.filter({ deptId: parentNode.id }),
            _.map((user: any) => ({
              id: user.id,
              name: user.displayName,
              deptName: parentNode.name,
              parent: parentNode,
              isLeaf: true,
            })),
          )(allData.users);
          const childrenDept = _.flow(
            _.filter({ parentId: parentNode.id }),
            _.map((dept: any) => ({
              id: dept.deptId,
              name: dept.deptName,
              parent: parentNode,
              isLeaf: false,
            })),
          )(allData.depts);
          childrenDept.forEach((dept: any) => {
            setChildren(dept, allData);
          });
          // eslint-disable-next-line no-param-reassign
          parentNode._children = [...childrenUser, ...childrenDept];
        };
        setChildren(deptTree[0], data);
        allDeptUser.value = deptTree;
      }
    };
    initDepartments();
    const otherRoleUser: Ref<Array<any>> = ref([]);
    const addMember = (node: any, data: any) => {
      treeSelectorRole.value = data;
      selectedUser.value = _.intersectionBy('id')(allUsers.value)(data.children);
      otherRoleUser.value = _.differenceBy('id')(allUsers.value)(data.children);
      treeSelectorRef.value.show();
    };

    return {
      userTreeRef,
      editMode,
      treeData,
      addMember,
      treeSelectorRole,
      allDeptUser,
      selectedUser,
      userList,
      columns,
      removeUser,
      treeSelectorRef,
      projectDetail,
      nodeClickHandler,
      initUserList,
      currentKey,
      reloadUserList,
      otherRoleUser,
      userProjectList,
      getShowBool,
    };
  },
};
</script>

<style lang="scss">
.project-detail {
  .el-form-item__content,
  .el-form-item__label {
    font-size: 12px;
  }
  margin: -20px;
  height: calc(100vh - 130px);
  background: #f2f2f2;
  .basic-info {
    height: 300px;
    margin-bottom: 20px;
    background: white;
    padding: 20px;
    .el-form-item {
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
      font-size: 12px;
      height: 100%;
      .title {
        font-weight: 700;
        height: 38px;
        line-height: 18px;
      }
      .edit-btn {
        float: right;
        font-weight: normal;
        font-size: 12px;
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
      font-size: 12px;
      width: 100%;
      .el-icon-circle-plus {
        font-size: 18px;
        &:hover {
          color: #333;
        }
      }
      .svg-icon {
        margin-right: 0.5em;
        &.tree-node-folder {
          color: #66bbff;
        }
      }
    }
  }
  .user-table {
    width: calc(100% - 320px);
    background: white;
    .remove-user-icon {
      font-size: 1.5em;
      &:hover {
        cursor: pointer;
        color: $danger;
      }
    }
  }
}
</style>
