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
          <span class="edit-btn" v-if="!editMode && getShowBool('update') && include" @click="editMode = true"
            >编辑</span
          >
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
        <div class="user-tree-top">
          <el-input
            suffix-icon="el-icon-search"
            placeholder="请输角色名称"
            v-model="userInput"
            @input="filterRoleAndUser"
          ></el-input>
          <div class="user-tree-btn">
            <el-button type="primary" @click="DialogVisible = true">新建</el-button>
            <el-button @click="closeUserTree" :disabled="isDeleteVisible">删除</el-button>
          </div>
        </div>
        <el-tree
          ref="userTreeRef"
          :data="treeData"
          :expand-on-click-node="false"
          :highlight-current="true"
          node-key="id"
          :current-node-key="currentKey"
          @node-click="nodeClickHandler"
        >
          <template #default="{ node, data }">
            <div class="customNode">
              <svg-icon v-if="node.level < 2" icon-name="folder" icon-class="tree-node-folder"></svg-icon>
              <svg-icon v-if="node.level === 2" icon-name="member" icon-class="tree-node-member"></svg-icon>
              <span>
                {{ node.label }}
                <el-popover
                  placement="bottom-start"
                  :width="300"
                  :height="200"
                  trigger="click"
                  :visible="editPopBoxVisible[String(data.id)]"
                >
                  <el-form :model="userTreeInput" ref="roleRef" v-if="editPopBoxVisible[String(data.id)]">
                    <el-form-item
                      prop="roles"
                      :rules="[
                        { required: true, message: '角色不能为空', trigger: 'blur' },
                        { min: 1, max: 20, message: '超过字数限制，最多不能超过20个字符', trigger: 'blur' },
                        { validator: validatorTagsPass, trigger: 'blur' },
                      ]"
                    >
                      <el-input
                        v-model="userTreeInput.roles"
                        autocomplete="off"
                        placeholder="新建的一个自定义角色"
                        clearable
                      ></el-input>
                    </el-form-item>
                    <div style="float: right">
                      <el-button type="text" @click="editBoxsave(String(data.id))" :loading="submitting"
                        >保存</el-button
                      >
                      <el-button type="text" @click="cancel(String(data.id))">取消</el-button>
                    </div>
                  </el-form>
                  <template #reference>
                    <el-button
                      type="text"
                      class="el-icon-edit"
                      @click="handleEditRole(data)"
                      v-show="node.level === 1 && !data.isSystem"
                    ></el-button>
                  </template>
                </el-popover>
              </span>
              <i
                v-if="node.level === 1"
                class="el-icon-circle-plus"
                style="float: right"
                @click.stop="addMember(node, data)"
              ></i>
            </div>
          </template>
        </el-tree>
      </div>
      <el-dialog title="新建角色" v-model="DialogVisible" width="500px" @closed="cancel">
        <el-form :model="form" ref="formRef">
          <el-form-item
            label="角色名称"
            label-width="80px"
            prop="name"
            :rules="[
              { required: true, message: '角色不能为空', trigger: 'blur' },
              { min: 1, max: 20, message: '超过字数限制，最多不能超过20个字符', trigger: 'blur' },
              { validator: validatorTagsPass, trigger: 'blur' },
            ]"
          >
            <el-input ref="tagName" v-model.trim="form.name" autocomplete="off" placeholder="请输入角色名称"></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button type="primary" @click="save" size="mini" :loading="submitting">确定</el-button>
            <el-button @click="cancel">取消</el-button>
          </div>
        </template>
      </el-dialog>
      <div class="user-table">
        <h2>{{ currentNode?.label || '--' }}</h2>
        <el-tabs v-model="activeTab">
          <el-tab-pane label="成员列表" name="userList">
            <el-table :data="userList">
              <el-table-column type="index" width="55"></el-table-column>
              <el-table-column v-for="column in columns" :key="column.prop" v-bind="column"></el-table-column>
              <el-table-column prop="operator" width="55" v-if="getShowBool('update') && include">
                <template #default="{ row }">
                  <i class="el-icon-error remove-user-icon" @click="removeUser(row)"></i>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="角色权限" name="roleList">
            <div class="roleAuthStyle">
              <el-row>
                <el-button type="primary" @click="handleEdit" v-if="isEdit" :disabled="editDisable">编辑</el-button>
                <el-button type="primary" @click="confirm" v-show="!isEdit">确定</el-button>
                <el-button @click="handleCancel" v-show="!isEdit">取消</el-button>
              </el-row>
              <el-row>
                <el-col>
                  <el-row v-for="item in authRoleList" :key="item.id">
                    <span class="auth-model"> {{ item.name }}</span>
                    <el-checkbox
                      class="auth-model"
                      v-model="checkAll[String(item.id)]"
                      @change="handleCheckAllChange(item)"
                      :indeterminate="isIndeterminate[String(item.id)]"
                      :disabled="isEdit"
                    >
                      全选
                    </el-checkbox>
                    <el-checkbox-group
                      v-model="checkedItem[String(item.id)]"
                      @change="handleCheckedItemsChange(item)"
                      :disabled="isEdit"
                    >
                      <el-checkbox v-for="subItem in item.modules" :label="subItem.id" :key="subItem.name">
                        {{ subItem.name }}
                        <el-tooltip
                          v-if="subItem.id === 22"
                          effect="light"
                          content="服务操作包含初始化、同步配置、发版、启动、停止、查看日志"
                          placement="top-start"
                        >
                          <i class="el-icon-question"></i>
                        </el-tooltip>
                      </el-checkbox>
                    </el-checkbox-group>
                  </el-row>
                </el-col>
              </el-row>
            </div>
          </el-tab-pane>
        </el-tabs>
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
import { debounce } from 'lodash';
import { ref, Ref, provide, onMounted, getCurrentInstance } from 'vue';
import TreeSelector from './components/TreeSelector.vue';
import BasicInfoForm from './components/BasicInfoForm.vue';
import {
  getRoleList,
  getProjectDetail,
  deleteMember,
  getRoleAuthList,
  updateRole,
  getAuthByRoleId,
  deleteRole,
  addRole,
  checkRoleRule,
  ModRoleName,
} from '@/api/project/project';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getTenantDepartment } from '@/api/tenant';
import { userInfo, userProjectList } from '@/layout/messageCenter/user-info';
import { getShowBool } from '@/utils/permission-show-module';

const userStatus = {
  '-1': '冻结',
  0: '启用',
};
const genderLabel = {
  0: '男',
  1: '女',
};
// 状态码
enum ResCode {
  Success,
}
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

    const formRef: any = ref(null);
    const roleRef: any = ref(null);
    const tagName: any = ref(null as any);
    const DialogVisible = ref(false);
    const form = ref({
      name: '',
    });
    const submitting = ref(false);
    const visible = ref(false);
    const iconEdit = ref(false);
    const currentNodeData: any = ref();
    const isDeleteVisible: Ref<boolean> = ref(true);
    const currentNode: any = ref();

    // 用户树
    const treeData: Ref<any> = ref([
      {
        label: '',
        children: [],
      },
    ]);
    let treeAllData: any = [];
    const editPopBoxVisible: any = ref({});
    const currentKey = ref('');
    const treeSelectorRole = ref({});

    const userTreeInput = ref({
      roles: '',
    });
    const userInput = ref('');

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
      const { code, data } = await getRoleList({
        projectId: props.id,
      });
      if (code === 0) {
        allUsers.value = data.users.map((user: any) => ({
          ...user,
          status: userStatus[user.status as 0 | -1],
          gender: genderLabel[user.gender as 0 | 1],
        }));
        // roleId： 6是项目负责人；7是访客 不显示
        const noPaRoles = data.roles.filter((x: any) => x.roleId !== 6 && x.roleId !== 7);
        treeData.value = _.flow(
          _.reject({ isOwnerRole: true }),
          _.map((role: any) => ({
            id: role.roleId,
            label: role.name,
            isSystem: role.isSystem,
            children: _.map((userId: any) => {
              const user: any = _.find({ id: userId })(data.users);
              return {
                label: user?.displayName,
                id: user?.id,
              };
            })(role.userIds),
          })),
        )(noPaRoles);
        console.log('treeData.value', treeData.value);
        treeAllData = [...treeData.value];

        const res: any = {};
        treeData.value.forEach((item: any) => {
          res[String(item.id)] = false;
        });
        editPopBoxVisible.value = res;
        userList.value = [];
      }
    };
    initUserList();

    const reloadUserList = async (s: any) => {
      await initUserList();
      if (s?.id) {
        userTreeRef.value.setCurrentKey(s.id);
        const treeUser: any = _.find({ id: s.id })(treeData.value[0].children);
        userList.value = _.intersectionWith((node: any, user: any) => node.id === user.id)(allUsers.value)(
          treeUser.children,
        );
      } else {
        userList.value = allUsers.value;
      }
    };

    const removeUser = (row: any) => {
      ElMessageBox.confirm(
        `是否将 ${currentNodeData.value.label} 从 ${currentNode.value.parent.data.label} 中移除？`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        },
      ).then(async () => {
        const { code } = await deleteMember({
          ids: row ? [] : [currentNode.value?.data?.id],
          projectId: props.id,
          roleId: row ? '' : currentNode.value.parent?.data?.id,
        });
        if (code === 0) reloadUserList({ id: currentNodeData.value.label });
      });
    };
    // 初始化项目信息
    const projectDetail = ref({});
    const include = ref(true);
    const getProjectInfo = async () => {
      const { code, data } = await getProjectDetail(props.id);
      if (code === 0) {
        const projectInfo = data;
        projectInfo.templateId = data.template.id;
        projectInfo.templateName = data.template.name;
        projectDetail.value = projectInfo;
        // treeData.value[0].label = data.name;
        const userArr = projectInfo.owners.map((x: any) => x.userId);
        include.value = userInfo.value.admin || userArr.includes(userInfo.value.userId);
      }
    };
    getProjectInfo();

    // 获取组件实例
    const instance = getCurrentInstance();
    // 提示信息
    function msgTips(type: string, content: string) {
      (instance as any).proxy.$message({
        type,
        message: content,
      });
    }

    // 选中角色的权限点信息
    const checkedItem: any = ref({});
    // 获取角色对应权限点
    const getAuth = async (node: any) => {
      // 获取当前选中节点数据
      let roleId: number;
      const { level, data, parent } = node;
      if (level === 1) {
        roleId = data.id;
      } else {
        roleId = parent.data.id;
      }
      try {
        const { code, data } = await getAuthByRoleId({ roleId, projectId: props.id });
        if (code === ResCode.Success) {
          const { moduleIds } = data;
          const checkObj: any = {};
          Object.entries(checkedItem.value).forEach((item: any) => {
            checkObj[item[0]] = moduleIds;
          });
          checkedItem.value = checkObj;
        } else {
          msgTips('error', '获取角色的权限数据失败');
        }
      } catch (error) {
        console.log('获取角色', error);
      }
    };

    const editDisable: Ref<boolean> = ref(true);
    const isEdit: Ref<boolean> = ref(true);
    // 初始化
    // const roleAuthInit = () => {
    //   const checkObj: any = {};
    //   Object.entries(checkedItem.value).forEach((item: any) => {
    //     checkObj[item[0]] = [];
    //   });
    //   checkedItem.value = checkObj;
    //   editDisable.value = true;
    // };

    const nodeClickHandler = async (data: any, node: any) => {
      currentNodeData.value = data;
      currentNode.value = node;
      if (node.level === 1) {
        userList.value = _.intersectionWith((node: any, user: any) => node.id === user.id)(allUsers.value)(
          node.data.children,
        );
      } else {
        userList.value = _.intersectionWith((node: any, user: any) => node.id === user.id)(allUsers.value)([node.data]);
      }
      // 判断是否可编辑 to-do
      isEdit.value = true;
      if (data.isSystem || node.level === 2) {
        editDisable.value = true;
      } else {
        editDisable.value = false;
      }
      if (data.isSystem) {
        isDeleteVisible.value = true;
      } else {
        isDeleteVisible.value = false;
      }
      getAuth(node);
    };

    const initDepartments = async () => {
      const { code, data } = await getTenantDepartment({ deptId: 0, level: 9 });
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

    // tab切换菜单
    const activeTab = ref('userList');
    // 权限角色数据
    const authRoleList: Ref<any> = ref([]);
    // 选中所有
    const checkAll: any = ref({});
    const isIndeterminate: any = ref({});

    // 获取项目角色权限列表
    const getRoleAuthListData = async () => {
      const { data, code } = await getRoleAuthList();
      if (code === 0) {
        authRoleList.value = data;
        data.forEach((item: any) => {
          checkedItem.value[String(item.id)] = [];
          isIndeterminate.value[String(item.id)] = true;
          checkAll.value[String(item.id)] = false;
        });
      }
    };

    // 更新角色权限
    const updateRoleData = async () => {
      let moduleIds: number[] = [];
      // 获取权限点
      Object.values(checkedItem.value).forEach((item: any) => {
        moduleIds = [...moduleIds, ...item];
      });
      // 去重
      moduleIds = [...new Set(moduleIds)];
      // 获取当前选中节点数据
      const { data } = currentNode.value;
      const roleId = data.id;
      try {
        const { code } = await updateRole({
          roleId,
          moduleIds,
          projectId: props.id,
        });
        if (code === ResCode.Success) {
          msgTips('success', '编辑成功');
        } else {
          msgTips('error', '编辑失败');
        }
      } catch (error) {
        console.log(error);
      }
    };

    // 全选
    const handleCheckAllChange = (data: any) => {
      const { id, modules } = data;
      const selId = String(id);
      // 查找id
      const selData = modules.map((item: any) => item.id);
      checkedItem.value[selId] = checkAll.value[selId] ? selData : [];
      isIndeterminate.value[selId] = false;
    };

    // 单选
    const handleCheckedItemsChange = (data: any) => {
      const { id, modules } = data;
      const selId = String(id);
      const checkedCount = checkedItem.value[selId].length;
      checkAll.value[selId] = checkedCount === modules.length;
      isIndeterminate.value[selId] = checkedCount > 0 && checkedCount < modules.length;
    };

    // 确定
    const confirm = () => {
      // 校验 至少要选中一项权限点
      const isEmpty = Object.values(checkedItem.value).find((item: any) => item.length > 0);
      if (!isEmpty) {
        msgTips('warning', '权限不能为空');
        return;
      }
      // 调用更新权限接口
      updateRoleData();
      isEdit.value = true;
    };

    // 编辑
    const handleEdit = () => {
      isEdit.value = false;
    };

    // 取消
    const handleCancel = () => {
      isEdit.value = true;
    };

    // 搜索
    const search = (keyword: string) => {
      // 过滤当前的角色
      if (!keyword.trim()) {
        treeData.value = treeAllData;
      } else {
        // 过滤角色
        const roleList = treeAllData.filter((subItem: any) => subItem.label.includes(keyword.trim()));
        treeData.value = roleList;
      }
    };
    const filterRoleAndUser = debounce(search, 500);

    onMounted(() => {
      getRoleAuthListData();
    });

    // 新建角色 提交取消表单
    const validatorTagsPass = async (rule: any, value: string, callback: Function) => {
      const { code, data } = await checkRoleRule({
        name: value,
        projectId: props.id,
      });
      if (code === 0 && data === null) {
        callback(new Error('名称已存在!'));
      }
      callback();
    };

    // 对话框确认
    const save = () => {
      if (submitting.value || form.value.name.length > 25 || form.value.name.length < 1) {
        return;
      }
      console.log(form.value.name);
      formRef.value.validate(async (isValid: boolean) => {
        if (isValid) {
          submitting.value = true;
          try {
            const { code } = await addRole({ name: form.value.name, projectId: props.id });
            if (code === 0) {
              ElMessage({
                type: 'success',
                message: '添加成功',
              });
            } else {
              ElMessage({
                type: 'error',
                message: '添加失败',
              });
            }
            DialogVisible.value = false;
            submitting.value = false;
            initUserList();
          } catch (e) {
            ElMessage.error(e);
            submitting.value = false;
          }
        }
      });
    };

    // 对话框取消
    const cancel = (id: any) => {
      DialogVisible.value = false;
      form.value.name = '';
      userTreeInput.value.roles = '';
      editPopBoxVisible.value[id] = false;
      formRef.value.resetFields();
      roleRef.value.resetFields();
    };

    // 修改角色名称
    const editBoxsave = (id: any) => {
      roleRef.value.validate(async (isValid: boolean) => {
        if (isValid) {
          submitting.value = true;
          try {
            const { code } = await ModRoleName({
              name: userTreeInput.value.roles,
              roleId: currentNodeData.value.id,
              projectId: props.id,
            });
            if (code === 0) {
              ElMessage({
                type: 'success',
                message: '修改成功',
              });
            } else {
              ElMessage({
                type: 'error',
                message: '修改失败',
              });
            }
            userTreeInput.value.roles = '';
            editPopBoxVisible.value[id] = false;
            submitting.value = false;
            initUserList();
          } catch (e) {
            ElMessage.error(e);
            submitting.value = false;
          }
        }
      });
    };

    // 删除警告弹框
    const closeUserTree = () => {
      const rowId = currentNodeData.value.id;
      if (currentNode.value.level === 2) {
        removeUser(false);
        return;
      }
      if (!currentNodeData.value.children.length) {
        ElMessageBox.confirm(`删除【${currentNodeData.value.label}】 角色`, {
          confirmButtonText: '我知道了',
          showCancelButton: false,
          type: 'warning',
        }).then(async () => {
          const { code } = await deleteRole({
            roleId: rowId,
            projectId: props.id,
          });
          if (code === 0) reloadUserList({ id: rowId });
        });
      } else {
        ElMessageBox.confirm(
          `删除该角色前请先移除【${currentNodeData.value.label}】下的人员`,
          `删除 【${currentNodeData.value.label} 】角色`,
          {
            confirmButtonText: '我知道了',
            showCancelButton: false,
            type: 'warning',
          },
        );
      }
    };

    const handleEditRole = (data: any) => {
      Object.keys(editPopBoxVisible.value).forEach((key: any) => {
        editPopBoxVisible.value[key] = false;
      });
      editPopBoxVisible.value[String(data.id)] = true;
    };
    document.onclick = (data: any) => {
      console.log('点击', data);
    };
    return {
      closeUserTree,
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
      include,
      activeTab,
      authRoleList,
      handleCheckAllChange,
      checkAll,
      checkedItem,
      handleCheckedItemsChange,
      isIndeterminate,
      confirm,
      isEdit,
      handleEdit,
      handleCancel,
      editDisable,
      isDeleteVisible,
      userTreeInput,
      userInput,
      DialogVisible,
      form,
      formRef,
      roleRef,
      tagName,
      submitting,
      visible,
      iconEdit,
      save,
      cancel,
      filterRoleAndUser,
      editPopBoxVisible,
      editBoxsave,
      validatorTagsPass,
      currentNode,
      handleEditRole,
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
  //margin: -20px;
  height: calc(100vh - 130px);
  background: #f2f2f2;
  .basic-info {
    min-height: 300px;
    margin-bottom: 20px;
    background: white;
    padding: 20px;
    .el-form-item {
      min-height: 32px;
      height: auto;
    }
    .form-content {
      width: calc(50vw - 300px);
      &.multiline {
        height: auto;
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
    display: flex;
  }
  .user-tree {
    width: 300px;
    margin-right: 20px;
    background: white;
    padding: 20px;
    .user-tree-btn {
      margin: 10px;
    }
    .customNode {
      font-size: 12px;
      width: 100%;
      .el-icon-edit {
        visibility: hidden;
      }
      &:hover {
        .el-icon-edit {
          visibility: visible;
        }
      }
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
    padding: 10px;
    background: white;
    .remove-user-icon {
      font-size: 1.5em;
      &:hover {
        cursor: pointer;
        color: $danger;
      }
    }
  }
  .roleAuthStyle {
    padding: 10px;
    color: #444;
    .auth-model {
      display: inline-block;
      min-width: 60px;
      margin-right: 20px;
    }
  }
  .right-box {
    height: calc(100% - 320px);
    display: flex;
  }
}
</style>
