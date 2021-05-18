<template>
  <div class="dept">
    <el-row>
      <el-col :span="10" style="text-align: left">
        <el-button type="primary" style="width: 90px" @click="handleAddDept">添加子部门</el-button>
        <el-button @click="handleDel">删除</el-button>
      </el-col>
      <el-col :offset="10" :span="4" style="text-align: right">
        <el-input placeholder="请输入键名称" suffix-icon="el-icon-search"></el-input>
        <!-- <span class="el-icon-setting"></span> -->
      </el-col>
    </el-row>
    <el-row style="background: #fff">
      <el-col :span="4" style="text-align: left">
        <div class="user-tree">
          <el-scrollbar>
            <el-tree
              ref="userTreeRef"
              :data="treeDataSource"
              :default-expand-all="true"
              :expand-on-click-node="false"
              :highlight-current="true"
              node-key="id"
              :current-node-key="currentKey"
              @node-click="nodeClickHandle"
            >
              <template #default="{ node }">
                <div class="customNode">
                  <svg-icon v-if="node.level < 3" icon-name="folder" icon-class="tree-node-folder"></svg-icon>
                  <svg-icon v-if="node.level === 3" icon-name="member" icon-class="tree-node-member"></svg-icon>
                  <span>{{ node.label }}</span>
                  <!-- <i
                    v-if="node.level === 2"
                    class="el-icon-circle-plus"
                    style="float: right"
                    @click.stop="handleAddPerson(node, data)"
                  ></i>-->
                </div>
              </template>
            </el-tree>
          </el-scrollbar>
        </div>
      </el-col>
      <el-col :span="20" style="text-align: left">
        <el-row>C部门</el-row>
        <el-row>
          <el-button @click="handleAddPerson">添加成员</el-button>
        </el-row>
        <el-row width="100%">
          <el-table :data="tableDataSource" style="width: 100%">
            <el-table-column type="index" label="序号" width="50" />
            <el-table-column label="登录账号" prop="userName"></el-table-column>
            <el-table-column label="姓名" prop="displayName"></el-table-column>
            <el-table-column label="性别" prop="gender"></el-table-column>
            <el-table-column label="手机" prop="phoneNumber"></el-table-column>
            <el-table-column label="邮箱" prop="primaryMail"></el-table-column>
            <el-table-column label="状态" prop="status"></el-table-column>
            <el-table-column label="操作" width="300">
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
          ></packaged-pagination>
        </el-row>
      </el-col>
    </el-row>
    <TreeSelector
      :option="allDeptUser"
      :checked="selectedUser"
      :not-allow="otherRoleUser"
      optionPlaceholder="请输入部门/人员名称"
      optionLabel="选择人员"
      :role="treeSelectorRole"
      ref="treeSelectorRef"
      @user-changed="reloadUserList"
    ></TreeSelector>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, ref, Ref, getCurrentInstance } from 'vue';
import _ from 'lodash/fp';
import { getMemberList } from '@/api/project/project';
import { getTenentDepartment } from '@/api/tenant';
import TreeSelector from './components/TreeSelector.vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { delUser } from '@/api/company/users';

interface TreeDataSourceType {
  label: string;
  [attr: string]: any;
}

interface TreeDataType {
  currentKey: string;
  treeDataSource: Array<TreeDataSourceType>;
}

interface TableDataType {
  total: number;
  searchProps: {
    page: number;
    pageSize: number;
  };
  tableDataSource: any;
}
const userStatus = {
  '-1': '冻结',
  0: '启用',
};
const genderLabel = {
  0: '男',
  1: '女',
};
const RES_CODE: any = {
  success: 0,
};
export default defineComponent({
  name: 'Department',
  components: { TreeSelector },
  setup() {
    const treeData: any = reactive({
      currentKey: '',
      currentNodeData: {},
      currentNode: {},
      treeDataSource: [
        {
          label: '云智中心',
          children: [],
        },
      ],
    });

    const tableData: TableDataType = reactive({
      total: 0,
      searchProps: {
        page: 1,
        pageSize: 10,
      },
      tableDataSource: [],
    });

    const treeSelectorRef: any = ref(null);
    const editMode = ref(false);
    const selectedUser: Ref<Array<any>> = ref([]);
    const userTreeRef: any = ref(null);
    // tree selector数据
    const allDeptUser: Ref<Array<any>> = ref([]);
    const treeSelectorRole: any = ref({});
    const otherRoleUser: Ref<Array<any>> = ref([]);
    // 获取组件实例
    const instance = getCurrentInstance();

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
    const allUsers = ref([]);

    // 添加子部门
    const handleAddDept = (): void => {
      // 判断当前选中的是不是部门
      if (!treeData.currentNode.isLeaf) {
        (instance as any).proxy.$message({
          type: 'warning',
          message: '请选中部门！',
        });
      } else {
        (instance as any).proxy.$message({
          type: 'success',
          message: '添加成功！',
        });
      }
    };
    const handleDel = () => {
      // 判断当前选中的是不是部门
      // if (!treeData.currentNode.isLeaf) {
      //     (instance as any).proxy.$message({
      //       type: 'warning',
      //       message: '请选中部门！',
      //     });
      //   } else {
      //     (instance as any).proxy.$message({
      //       type: 'success',
      //       message: '添加成功！',
      //     });
      //   }
      // 获取当前选中的节点
      ElMessageBox.confirm(`是否删除已选项?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          // 待传参
          const { code } = await delUser(treeData.currentNodeData);
          if (code === RES_CODE.success) {
            (instance as any).proxy.$message({
              type: 'success',
              message: '删除成功',
            });
            initDepartments();
          } else {
            (instance as any).proxy.$message({
              type: 'error',
              message: '删除失败',
            });
          }
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '已取消操作',
          });
        });
    };
    // 删除
    const handleDelPerson = (data: any): void => {
      ElMessageBox.confirm(`是否删除已选项?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          // 待传参
          const { code } = await delUser(data);
          if (code === RES_CODE.success) {
            (instance as any).proxy.$message({
              type: 'success',
              message: '删除成功',
            });
            initDepartments();
          } else {
            (instance as any).proxy.$message({
              type: 'error',
              message: '删除失败',
            });
          }
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '已取消操作',
          });
        });
    };

    // 添加人员
    const handleAddPerson = (): void => {
      // 获取当前选中部门的节点id
      treeSelectorRole.value = treeData.currentNodeData;
      treeSelectorRef.value.show();
    };

    // 重命名
    const handleRename = (): void => {
      console.log('重命名');
    };

    // 上移
    const handleUpMove = (): void => {
      console.log('上移一层');
    };
    const userList: Ref<any[]> = ref([]);

    function nodeClickHandle(data: any, node: any): void {
      treeData.currentNodeData = data;
      treeData.currentNode = node;
      if (node.level === 1) {
        tableData.tableDataSource = allUsers.value;
      }
      if (node.level === 2) {
        tableData.tableDataSource = _.intersectionWith((node: any, user: any) => node.id === user.id)(allUsers.value)(
          node.data.children,
        );
      }
    }

    const initUserList = async () => {
      const { code, data } = await getMemberList({
        projectId: '',
      });
      if (code === 0) {
        allUsers.value = data.users.map((user: any) => ({
          ...user,
          status: userStatus[user.status as 0 | -1],
          gender: genderLabel[user.gender as 0 | 1],
        }));
        treeData.treeDataSource[0].children = _.flow(
          _.reject({ isOwnerRole: true }),
          _.map((role: any) => ({
            id: role.id,
            label: role.role.name,
            children: _.map((member: any) => {
              const user: any = _.find({ id: member.userId })(data.users);
              return {
                label: user.displayName,
                id: user.id,
              };
            })(role.members),
          })),
        )(data.roles);
        userList.value = [];
      }
    };
    initUserList();

    const reloadUserList = async (role: any) => {
      console.log('role1111', role);
      await initUserList();
      userTreeRef.value.setCurrentKey(role.id);
      const treeUser: any = _.find({ id: role.id })(treeData.treeDataSource[0].children);
      userList.value = _.intersectionWith((node: any, user: any) => node.id === user.id)(allUsers.value)(
        treeUser.children,
      );
    };

    return {
      ...toRefs(tableData),
      ...toRefs(treeData),
      handleAddDept,
      handleDelPerson,
      handleDel,
      handleAddPerson,
      handleRename,
      handleUpMove,
      nodeClickHandle,
      allDeptUser,
      treeSelectorRef,
      editMode,
      userTreeRef,
      treeSelectorRole,
      selectedUser,
      otherRoleUser,
      reloadUserList,
    };
  },
});
</script>

<style lang="scss">
.dept {
  height: calc(100vh - 130px);
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
