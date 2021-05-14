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
                  <svg-icon
                    v-if="node.level === 3"
                    icon-name="member"
                    icon-class="tree-node-member"
                  ></svg-icon>
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
                <el-button type="primary" size="mini" @click="handleDel(scope.row)">删除</el-button>
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
      optionPlaceholder="请输入部门/人员名称"
      optionLabel="选择人员"
      ref="treeSelectorRef"
    ></TreeSelector>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, ref, Ref } from 'vue';
import _ from 'lodash/fp';
import { getTenentDepartment } from '@/api/tenant';
import TreeSelector from './components/TreeSelector.vue';

interface TreeDataSourceType {
  label: string;
  [attr: string]: any;
};

interface TreeDataType {
  currentKey: string;
  treeDataSource: Array<TreeDataSourceType>;
}

export default defineComponent({
  name: "Department",
  components: { TreeSelector },
  setup() {
    const treeData: TreeDataType = reactive({
      currentKey: '',
      treeDataSource: [{
        id: 1,
        label: '一级 1',
        children: [{
          id: 4,
          label: '二级 1-1',
          children: [{
            id: 9,
            label: '三级 1-1-1'
          }, {
            id: 10,
            label: '三级 1-1-2'
          }]
        }]
      }, {
        id: 2,
        label: '一级 2',
        children: [{
          id: 5,
          label: '二级 2-1'
        }, {
          id: 6,
          label: '二级 2-2'
        }]
      }, {
        id: 3,
        label: '一级 3',
        children: [{
          id: 7,
          label: '二级 3-1'
        }]
      }]
    })

    const tableData = reactive({
      total: 0,
      searchProps: {
        page: 1,
        pageSize: 10
      },
      tableDataSource: []
    });

    const treeSelectorRef: any = ref(null);
    const editMode = ref(false);
    const selectedUser: Ref<Array<any>> = ref([]);
    const userTreeRef: any = ref(null);
    // tree selector数据
    const allDeptUser: Ref<Array<any>> = ref([]);
    const treeSelectorRole = ref({});
    const otherRoleUser: Ref<Array<any>> = ref([]);

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
      console.log('添加子部门')
    };

    // 删除
    const handleDel = (data: any): void => {
      console.log('删除', data)
    };

    // 添加人员
    const handleAddPerson = (node: any, data: any): void => {
      selectedUser.value = _.intersectionBy('id')(allUsers.value)(data.children);
      otherRoleUser.value = _.differenceBy('id')(allUsers.value)(data.children);
      treeSelectorRef.value.show();
    };

    // 重命名
    const handleRename = (): void => {
      console.log('重命名')
    };

    // 上移
    const handleUpMove = (): void => {
      console.log('上移一层')
    };

    function nodeClickHandle(): void {
      console.log('获取node节点')
    };
    return {
      ...toRefs(tableData),
      ...toRefs(treeData),
      handleAddDept,
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
    }
  },
})
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
