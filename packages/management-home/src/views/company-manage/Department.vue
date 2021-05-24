<template>
  <div class="dept">
    <el-row>
      <el-col :span="10" style="text-align: left">
        <el-button
          type="primary"
          style="width: 90px"
          @click="handleAddDept"
          :disabled="currentNodeData.id === 0 || !isSel"
          >添加子部门</el-button
        >
        <el-button @click="handleDel" :disabled="!isSel">删除</el-button>
      </el-col>
      <el-col :offset="10" :span="4" style="text-align: right">
        <el-input
          placeholder="请输入用户姓名"
          suffix-icon="el-icon-search"
          @input="filterAccount"
          v-model="searchProps.keyword"
        ></el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6" style="background: #fff">
        <div class="user-tree" v-loading="loading">
          <el-scrollbar>
            <el-tree
              ref="userTreeRef"
              node-key="id"
              v-if="dataDone"
              :highlight-current="true"
              :expand-on-click-node="false"
              :default-expand-all="false"
              :load="loadNode"
              draggable
              lazy
              @node-click="nodeClickHandle"
              :props="treeProps"
            >
              <template #default="{ data }">
                <div>
                  <svg-icon v-if="data._children" icon-name="folder" icon-class="tree-node-folder"></svg-icon>
                  <svg-icon v-else icon-name="person" icon-class="tree-node-folder"></svg-icon>
                  <span style="z-index: 1; background: transparent; margin-right: 5px">{{ data.name }}</span>
                  <el-dropdown v-if="data._children && data.id !== 0">
                    <span class="el-dropdown-link">
                      <i class="el-icon-more" style="transform: rotate(90deg)"></i>
                    </span>
                    <template #dropdown>
                      <el-dropdown-menu icon="el-icon-plus">
                        <el-dropdown-item @click="handleRename(data)">重命名</el-dropdown-item>
                        <el-dropdown-item
                          @click="handleUpMove(data)"
                          v-if="data.id !== 0 && data.parent && data.parent.id !== 0"
                          >上移一层</el-dropdown-item
                        >
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </div>
              </template>
            </el-tree>
          </el-scrollbar>
        </div>
      </el-col>
      <el-col :offset="1" :span="16">
        <el-row>
          {{
            currentNodeData.name
              ? currentNodeData._children
                ? currentNodeData.name
                : currentNodeData.parent.name
              : '--'
          }}
        </el-row>
        <el-row>
          <el-button @click="handleAddPerson" :disabled="!isSel">添加成员</el-button>
        </el-row>
        <el-row width="100%">
          <el-table :data="tableDataSource" style="width: 100%">
            <el-table-column type="index" label="序号" width="50" />
            <el-table-column label="登录账号" prop="userName"></el-table-column>
            <el-table-column label="姓名" prop="displayName"></el-table-column>
            <el-table-column label="性别" prop="gender" width="50"></el-table-column>
            <el-table-column label="手机" prop="phoneNumber" width="200"></el-table-column>
            <el-table-column label="邮箱" prop="primaryMail"></el-table-column>
            <el-table-column label="状态" prop="status" width="100"></el-table-column>
            <el-table-column label="操作" width="100">
              <template #default="scope">
                <el-button type="primary" size="mini" @click="handleDelPerson(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <packaged-pagination
            v-if="total"
            :current-page="searchProps.page"
            :page-size="searchProps.pageSize"
            :page-sizes="[10, 20, 50]"
            layout="sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handlePageSizeChange"
            @current-change="handlePageChange"
          ></packaged-pagination>
        </el-row>
      </el-col>
    </el-row>
    <TreeSelector
      :option="queryUserListData"
      :checked="selectedUser"
      :not-allow="otherRoleUser"
      optionPlaceholder="请输入人员名称"
      optionLabel="选择人员"
      :role="treeSelectorRole"
      ref="treeSelectorDept"
      @user-changed="reloadUserList"
    ></TreeSelector>
    <el-dialog
      title="添加子部门"
      v-model="dialogVisible"
      width="500px"
      @closed="closeDialog"
      :close-on-click-modal="false"
    >
      <div>
        <el-form :model="formData" ref="deptDiagFormRef" :rules="formRules">
          <el-form-item label="部门名称" prop="deptName" label-width="100px">
            <el-input v-model.trim="formData.deptName" placeholder="请输入部门中文名称"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="submitConfigForm">保存</el-button>
          <el-button @click="closeDialog">返回</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, ref, Ref, getCurrentInstance, watchEffect, nextTick } from 'vue';
import _ from 'lodash/fp';
import { getTenentDepartment, createDept, delDept, delUser, updateDept } from '@/api/company/dept';
import { getUserList } from '@/api/company/users';
import TreeSelector from './components/TreeSelector.vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { debounce } from 'lodash';
import PackagedPagination from '@/components/pagination/Index.vue';

interface TreeDataSourceType {
  label: string;
  [attr: string]: any;
}

interface TreeDataType {
  loading: boolean;
  treeDataSource: Array<TreeDataSourceType>;
  isSel: boolean;
  currentNodeData: any;
  currentNodeUsers: any;
  [attr: string]: any;
}

interface TableDataType {
  total: number;
  searchProps: {
    page: number;
    pageSize: number;
    keyword: string;
  };
  tableDataSource: any;
}
// 账户状态
enum UserStatus {
  禁用 = -1,
  启用 = 0,
}
enum GenderLabel {
  男,
  女,
}
// 状态码
enum ResCode {
  Success,
}

// 中文校验
function checkZNName(name: string): boolean {
  const szReg = /[\u4e00-\u9fa5]{2,255}/;
  return szReg.test(name);
}
const validatorZNNamePass = (rule: any, value: string, callback: Function) => {
  if (!checkZNName(value)) {
    callback(new Error('请输入长度至少2最大255个字的中文格式名称'));
  }
  callback();
};
const treeProps = {
  label: 'name',
  children: 'children',
  isLeaf: 'isLeaf',
};
export default defineComponent({
  name: 'Department',
  components: { TreeSelector, PackagedPagination },
  setup() {
    const treeData: TreeDataType = reactive({
      loading: false,
      currentNodeData: {},
      currentNode: {},
      currentNodeUsers: [],
      isSel: false,
      treeDataSource: [
        {
          label: '云智中心',
          _children: [],
        },
      ],
    });

    const tableData: TableDataType = reactive({
      total: 0,
      searchProps: {
        page: 1,
        pageSize: 10,
        keyword: '',
      },
      tableDataSource: [],
    });
    const queryUserListData: Ref<Array<any>> = ref([]);
    const treeSelectorDept: Ref<any> = ref(null);
    const editMode = ref(false);
    const selectedUser: Ref<Array<any>> = ref([]);
    const userTreeRef: any = ref(null);
    // tree selector数据
    const allDeptUser: Ref<Array<any>> = ref([]);
    const treeSelectorRole: any = ref({});
    const otherRoleUser: Ref<Array<any>> = ref([]);
    // 获取组件实例
    const instance = getCurrentInstance();
    const dialogVisible: Ref<boolean> = ref(false);

    const formData = reactive({
      isEdit: false,
      deptName: '',
    });
    // 编辑的数据
    const editFormData = ref();

    // 所有的人员
    const allUsers = ref([]);
    // 当前node节点下的人
    // const currentNodeUsers = ref([]);

    // 校验规则
    const formRules = {
      deptName: [
        { required: true, message: '请输入部门中文名称', trigger: 'blur' },
        { validator: validatorZNNamePass, trigger: 'blur' },
      ],
    };
    // 提示信息
    function msgTips(type: string, content: string) {
      (instance as any).proxy.$message({
        type,
        message: content,
      });
    }
    // 获取部门数据
    const initDepartments = async () => {
      treeData.loading = true;
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
        allUsers.value = data.users.map((user: any) => ({
          ...user,
          status: UserStatus[user.status as 0 | -1],
          gender: GenderLabel[user.gender as 0 | 1],
        }));
        treeData.loading = false;
      }
    };

    // 初始化表格数据
    const initTableData = () => {
      tableData.total = 0;
      tableData.searchProps = {
        page: 1,
        pageSize: 10,
        keyword: '',
      };
      treeData.currentNodeData = {};
      tableData.tableDataSource = [];
    };

    initDepartments();

    // 删除人员
    const handleDelPerson = (data: any): void => {
      const currentDept = treeData.currentNodeData._children
        ? treeData.currentNodeData
        : treeData.currentNodeData.parent;
      ElMessageBox.confirm(`是否将【${data.displayName || data.name}】从【${currentDept.name}】删除?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          // 待传参
          const { code } = await delUser({ userIds: [data.id] });
          if (code === ResCode.Success) {
            msgTips('success', '删除成功');
            initDepartments();
            initTableData();
          } else {
            msgTips('error', '删除失败');
          }
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '已取消操作',
          });
        });
    };

    // 删除部门和人员
    const handleDel = () => {
      if (treeData.currentNodeData._children) {
        if (treeData.currentNodeData._children.length) {
          msgTips('warning', '该部门下有子节点，无法删除！');
          return;
        }
        // 判断部门中是否有人员
        // 获取当前选中的节点
        ElMessageBox.confirm(`是否删除已选项?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(async () => {
            // 删除部门
            const { id } = treeData.currentNodeData;
            const { code } = await delDept({ id });
            if (code === ResCode.Success) {
              msgTips('success', '删除成功');
              initDepartments();
              initTableData();
            } else {
              msgTips('error', '删除失败');
            }
          })
          .catch(() => {
            ElMessage({
              type: 'info',
              message: '已取消操作',
            });
          });
      } else {
        // 删除人员
        handleDelPerson(treeData.currentNodeData);
      }
    };

    // 查询租户下所有的用户
    const queryUserList = async () => {
      const { code, data } = await getUserList({
        keyword: '',
        page: 1,
        pageSize: 50000,
      });
      if (code !== ResCode.Success) {
        msgTips('error', '获取人员列表失败');
      } else {
        const { rows } = data;
        queryUserListData.value = rows.map((item: any) => {
          const { id, displayName } = item;
          return {
            name: displayName,
            id,
            isLeaf: true,
          };
        });
      }
    };

    // 添加人员
    const handleAddPerson = (): void => {
      // 获取当前选中部门的节点id
      treeSelectorRole.value = treeData.currentNode;
      treeSelectorDept.value.show();
      queryUserList();
    };

    // 重命名
    const handleRename = (data: any): void => {
      editFormData.value = { ...data };
      formData.isEdit = true;
      formData.deptName = data.name;
      dialogVisible.value = true;
    };

    // 上移
    const handleUpMove = async (data: any) => {
      const { id, parent, name } = data;
      const { code } = await updateDept({
        id,
        deptName: name,
        parentId: parent.parent.id,
      });
      if (code === ResCode.Success) {
        msgTips('success', '上移成功');
        initDepartments();
      } else {
        msgTips('error', '上移失败');
      }
    };

    const reloadUserList = async () => {
      initDepartments();
      initTableData();
    };

    // 获取当前table列表数据
    const getCurrentTableData = (data: any, page: number, pageSize: number) => {
      tableData.total = data.length;
      const pageMaxCount = page * pageSize;
      const startIndex = (page - 1) * pageSize;
      const endIndex = page * pageSize - 1;
      if (pageMaxCount < tableData.total) {
        tableData.tableDataSource = data.slice(startIndex, endIndex);
      } else {
        tableData.tableDataSource = data.slice(startIndex, pageMaxCount - 1);
      }
    };

    function nodeClickHandle(data: any, node: any): void {
      console.log('当前节点', node);
      console.log('当前节点数据', data);
      // 首节点不做选中
      treeData.isSel = data.id !== 0;
      treeData.currentNodeData = data;
      treeData.currentNode = node;
      const { page, pageSize } = tableData.searchProps;
      if (!data._children) {
        return;
      }
      if (data.id === 0) {
        // 表格数据清空
        getCurrentTableData([], page, pageSize);
        return;
      }
      const resData = _.intersectionWith((node: any, user: any) => node.id === user.id)(allUsers.value)(
        node.data._children,
      );
      treeData.currentNodeUsers = resData;
      getCurrentTableData(resData, page, pageSize);
    }
    // 初始化添加部门表单数据
    const initFormData = () => {
      formData.isEdit = false;
      formData.deptName = '';
    };

    // 添加子部门
    const handleAddDept = (): void => {
      // 判断当前选中的是不是部门
      if (!treeData.currentNodeData._children) {
        msgTips('warning', '请选中一个部门！');
      } else {
        dialogVisible.value = true;
      }
    };
    // 关闭dialog
    const closeDialog = () => {
      initFormData();
      dialogVisible.value = false;
    };
    const deptDiagFormRef: any = ref(null);
    // 提交添加 & 修改部门
    const submitConfigForm = () => {
      deptDiagFormRef.value.validate(async (valid: boolean) => {
        if (valid) {
          let res;
          if (formData.isEdit) {
            const { id, parent } = editFormData.value;
            res = await updateDept({
              parentId: parent ? parent.id : 0,
              deptName: formData.deptName,
              id,
            });
          } else {
            const { id } = treeData.currentNodeData;
            res = await createDept({
              deptName: formData.deptName,
              parentId: id,
            });
          }
          const { code } = res;
          if (code === ResCode.Success) {
            msgTips('success', `${formData.isEdit ? '编辑' : '添加'}成功！`);
            initDepartments();
            closeDialog();
          } else {
            msgTips('error', `${formData.isEdit ? '编辑' : '添加'}失败！`);
          }
        }
      });
    };

    // 加载node节点数据
    const dataDone = ref(true);
    let copyOption: any;
    watchEffect(() => {
      dataDone.value = false;
      selectedUser.value = [];
      copyOption = _.cloneDeep(allDeptUser.value);
      nextTick(() => {
        dataDone.value = true;
      });
    });
    const loadNode = (node: any, resolve: Function) => {
      if (node.level === 0) {
        resolve(copyOption);
      } else {
        resolve(node.data._children);
      }
    };

    // 查询
    const serchUserList = () => {
      const { keyword, pageSize, page } = tableData.searchProps;
      // 获取当前的所有人员数据
      const filterRes = treeData.currentNodeUsers.filter((subItem: any) => subItem.displayName.includes(keyword));
      treeData.currentNodeUsers = filterRes;
      getCurrentTableData(filterRes, page, pageSize);
    };
    const filterAccount = debounce(serchUserList, 1000);

    // 页面size改变
    const handlePageSizeChange = (data: any) => {
      const { page } = tableData.searchProps;
      getCurrentTableData(treeData.currentNodeUsers, page, data);
    };
    // 页面改变
    const handlePageChange = (data: any) => {
      const { pageSize } = tableData.searchProps;
      getCurrentTableData(treeData.currentNodeUsers, data, pageSize);
    };
    return {
      ...toRefs(tableData),
      ...toRefs(treeData),
      allDeptUser,
      treeSelectorDept,
      editMode,
      userTreeRef,
      treeSelectorRole,
      selectedUser,
      otherRoleUser,
      dialogVisible,
      formData,
      formRules,
      deptDiagFormRef,
      treeProps,
      dataDone,
      filterAccount,
      queryUserListData,
      handleAddDept,
      handleDelPerson,
      handleDel,
      handleAddPerson,
      handleRename,
      handleUpMove,
      nodeClickHandle,
      reloadUserList,
      closeDialog,
      submitConfigForm,
      loadNode,
      handlePageSizeChange,
      handlePageChange,
    };
  },
});
</script>

<style lang="scss">
.dept {
  height: calc(100vh - 130px);
  .user-tree {
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
.svg-icon {
  margin-right: 0.5em;
  &.tree-node-folder {
    color: #66bbff;
  }
}
</style>
