import _ from 'lodash/fp';
import { ref, Ref, onMounted, getCurrentInstance, watch, nextTick } from 'vue';
import {
  getRoleList,
  getProjectDetail,
  updateRoleMembers,
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
import { getTreeArr } from './utils/project-data-utils';
import { USER_STATUS, RES_CODE, PL_ROLE_ID, VISITOR_ROLE_ID, MAX_USER_COUNT } from './utils/constant';

interface PropType {
  id: string;
}
export default function (props: PropType) {
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
  const loadings = ref(true);
  const addUserBtnStatus = ref(true);
  // 编辑角色原始值
  let editOldData = '';
  // 用户树
  const treeData: Ref<any> = ref([
    {
      label: '',
      children: [],
    },
  ]);
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
      prop: 'roles',
      label: '角色',
    },
  ];
  const userRoleList: any = ref([]);
  const initDepartments = async () => {
    const { code, data } = await getTenantDepartment({ deptId: 0, level: 9 });
    const { userRoles = [] } = data;
    userRoleList.value = userRoles;
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
          _.map((user: any) => {
            let roleString = '';
            const res = userRoles.find((item: any) => item.userId === user.id);
            if (res) {
              roleString = res.roleList.map((item: any) => item.roleName).join(', ');
            }
            return {
              id: user.id,
              name: user.displayName,
              deptName: parentNode.name,
              parent: parentNode,
              isLeaf: true,
              roleList: roleString,
            };
          }),
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

  const allUsers = ref([]);
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
      const userArr = projectInfo?.owners?.map((x: any) => x.userId) || [];
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
  // 权限角色数据
  const authRoleList: Ref<any> = ref([]);
  // 初始化多选数据
  const initCheckData = () => {
    const checkData: any = {};
    Object.entries(checkedItem.value).forEach((item: any) => {
      checkData[item[0]] = [];
    });
    return checkData;
  };

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
      if (code === RES_CODE.Success) {
        const { moduleIds } = data;
        const checkObj = initCheckData();
        // 处理权限点
        moduleIds.forEach((moduleItem: any) => {
          authRoleList.value.forEach((roleItem: any) => {
            const { children } = roleItem;
            const existData: any = children.find((authItem: any) => authItem.id === moduleItem);
            if (typeof existData !== 'undefined') {
              checkObj[String(roleItem.id)].push(moduleItem);
            }
          });
        });
        checkedItem.value = checkObj;
      } else {
        msgTips('error', '获取角色的权限数据失败');
      }
    } catch (error) {
      console.log('获取角色', error);
    }
  };
  // 初始化选中的角色树节点
  function initNodeSel() {
    // 默认选中项目负责人节点
    userTreeRef.value.setCurrentKey(PL_ROLE_ID, true);
    currentNode.value = userTreeRef.value.getNode(PL_ROLE_ID);
    currentNodeData.value = currentNode.value.data;
    const treeUser: any = _.find({ id: PL_ROLE_ID })(treeData.value);
    userList.value = _.intersectionWith((node: any, user: any) => node.id === user.id)(allUsers.value)(
      treeUser?.children || [],
    );
    addUserBtnStatus.value = false;
    getAuth(currentNode.value);
  }

  // 初始化人员列表
  const initUserList = async () => {
    await initDepartments();
    const { code, data } = await getRoleList({
      projectId: props.id,
    });
    if (code === 0) {
      allUsers.value = data.users.map((user: any) => {
        let userRoles: any = [];
        const userRolesInfo = userRoleList.value.find((item: any) => item.userId === user.id);
        if (userRolesInfo?.roleList) {
          userRoles = userRolesInfo.roleList.map((rolePoint: any) => rolePoint.roleName);
        }
        return {
          ...user,
          status: USER_STATUS[user.status as 0 | -1],
          roles: userRoles.join(', '),
        };
      });
      // roleId： 6是项目负责人；7是访客 不显示
      const noPaRoles = data.roles.filter((x: any) => x.roleId !== VISITOR_ROLE_ID);
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
      const res: any = {};
      treeData.value.forEach((item: any) => {
        res[String(item.id)] = false;
      });

      // 排序treeData
      const bkData = treeData.value.splice(4, 2);
      const { children } = bkData[1];
      if (children.length > MAX_USER_COUNT) {
        children.length = MAX_USER_COUNT;
      }
      treeData.value.splice(0, 0, bkData[1], bkData[0]);
      editPopBoxVisible.value = res;
      userList.value = [];
      loadings.value = false;
      nextTick(initNodeSel);
    }
  };
  initUserList();

  // 刷新角色树人员
  const reloadUserList = async (s: any) => {
    await initUserList();
    if (s?.id) {
      userTreeRef.value.setCurrentKey(s.id, true);
      currentNode.value = userTreeRef.value.getNode(s.id);
      currentNodeData.value = currentNode.value.data;
      const treeUser: any = _.find({ id: s.id })(treeData.value);
      userList.value = _.intersectionWith((node: any, user: any) => node.id === user.id)(allUsers.value)(
        treeUser?.children || [],
      );
    } else {
      userList.value = allUsers.value;
    }
  };
  const editDisable: Ref<boolean> = ref(true);
  const isEdit: Ref<boolean> = ref(true);
  const nodeClickHandler = async (data: any, node: any) => {
    currentNodeData.value = data;
    currentNode.value = node;
    if (node.level === 1) {
      addUserBtnStatus.value = false;
      userList.value = _.intersectionWith((node: any, user: any) => node.id === user.id)(allUsers.value)(
        node.data.children,
      );
    } else {
      addUserBtnStatus.value = true;
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
  const otherRoleUser: Ref<Array<any>> = ref([]);
  const addMember = () => {
    // 判断当前是否是项目负责人
    const { id, children } = currentNodeData.value;
    if (id === PL_ROLE_ID && children.length >= MAX_USER_COUNT) {
      msgTips('warning', '最多只能添加10个项目负责人');
      return;
    }
    treeSelectorRole.value = currentNodeData.value;
    selectedUser.value = _.intersectionBy('id')(allUsers.value)(currentNodeData.value.children);
    otherRoleUser.value = _.differenceBy('id')(allUsers.value)(currentNodeData.value.children);
    treeSelectorRef.value.show();
  };

  // tab切换菜单
  const activeTab = ref('userList');
  // 选中所有
  const checkAll: any = ref({});
  const isIndeterminate: any = ref({});

  // 获取项目角色权限列表
  const getRoleAuthListData = async () => {
    const { data, code } = await getRoleAuthList();
    if (code === 0) {
      const resData: any = getTreeArr({ key: 'id', pKey: 'moduleParentId', data });
      authRoleList.value = resData;
      resData.forEach((item: any) => {
        checkedItem.value[String(item.id)] = [];
        isIndeterminate.value[String(item.id)] = true;
        checkAll.value[String(item.id)] = false;
      });
    }
  };

  // 初始化角色权限
  const initRoleAuth = () => {
    const checkObj = initCheckData();
    checkedItem.value = checkObj;
    editDisable.value = true;
    isEdit.value = true;
    currentNode.value = {};
  };

  // 移除人员
  const removeUser = (row: any) => {
    ElMessageBox.confirm(
      `是否将 ${row ? row.displayName : currentNodeData.value.label} 从 ${
        currentNode.value.level === 1 ? currentNode.value.label : currentNode.value.parent.data.label
      } 中移除？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      },
    ).then(async () => {
      let users: any;
      let roleId: number;
      if (row && currentNode.value.level === 1) {
        users = currentNodeData.value?.children;
        roleId = currentNode.value?.data?.id;
      } else {
        users = currentNode.value.parent.data?.children;
        roleId = currentNode.value.parent?.data?.id;
      }
      const removeUserId = row ? row.id : currentNodeData.value.id;
      const updateUsers = users.filter((user: any) => user.id !== removeUserId).map((user: any) => user.id);
      const { code } = await updateRoleMembers({
        userIds: updateUsers,
        projectId: props.id,
        roleId,
      });
      if (code === 0) {
        initRoleAuth();
        reloadUserList({ id: currentNodeData.value.label });
      }
    });
  };

  // 更新角色权限
  const updateRoleData = async () => {
    let moduleIds: number[] = [];
    // 获取权限点
    Object.values(checkedItem.value).forEach((item: any) => {
      moduleIds = [...moduleIds, ...item];
    });
    // 获取当前选中节点数据
    const { data } = currentNode.value;
    const roleId = data.id;
    try {
      const { code } = await updateRole({
        roleId,
        moduleIds,
        projectId: props.id,
      });
      if (code === RES_CODE.Success) {
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
    const { id, children } = data;
    const selId = String(id);
    // 查找id
    const selData = children.map((item: any) => item.id);
    checkedItem.value[selId] = checkAll.value[selId] ? selData : [];
    isIndeterminate.value[selId] = false;
  };

  // 单选
  const handleCheckedItemsChange = (data: any) => {
    const { id, children } = data;
    const selId = String(id);
    const checkedCount = checkedItem.value[selId]?.length;
    checkAll.value[selId] = checkedCount === children.length;
    isIndeterminate.value[selId] = checkedCount > 0 && checkedCount < children.length;
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

  // 新建角色 提交取消表单
  const validatorRolePass = async (rule: any, value: string, callback: Function) => {
    // 如果是修改
    if (!(editOldData && editOldData === value)) {
      const { code, data } = await checkRoleRule({
        name: value,
        projectId: props.id,
      });
      if (code === 0 && !data) {
        callback(new Error('该角色名称已存在!'));
      }
    }
    callback();
  };

  // 对话框确认
  const save = () => {
    if (submitting.value || form.value.name.length > 25 || form.value.name.length < 1) {
      return;
    }
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
  };

  // 修改角色名称
  const editBoxsave = (data: any) => {
    const ids = String(data.id);
    if (userTreeInput.value.roles === editOldData) {
      userTreeInput.value.roles = '';
      editPopBoxVisible.value[ids] = false;
      return;
    }
    roleRef.value.validate(async (isValid: boolean) => {
      if (isValid) {
        submitting.value = true;
        try {
          const { code } = await ModRoleName({
            name: userTreeInput.value.roles,
            roleId: data.id,
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
          editPopBoxVisible.value[ids] = false;
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
      ElMessageBox.confirm(`是否删除【${currentNodeData.value.label}】角色？`, '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const { code } = await deleteRole({
          roleId: rowId,
          projectId: props.id,
        });
        if (code === 0) {
          initRoleAuth();
        }
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
    userTreeInput.value.roles = data.label;
    editOldData = data.label;
  };

  // 成员和角色过滤
  const filterNode = (value: any, data: any) => {
    if (!value) return true;
    return data.label.indexOf(value) !== -1;
  };

  watch(userInput, (newValue: string) => {
    userTreeRef.value.filter(newValue);
  });
  onMounted(() => {
    getRoleAuthListData();
  });
  return {
    loadings,
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
    editPopBoxVisible,
    editBoxsave,
    validatorRolePass,
    currentNode,
    handleEditRole,
    addUserBtnStatus,
    filterNode,
  };
}
