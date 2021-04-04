<template>
  <div class="project-detail">
    <el-row class="basic-info">
      <div>
        <div class="title">
          项目信息
          <span class="edit-btn" v-if="!editMode" @click="editMode = true">编辑</span>
        </div>
        <basic-info-form
          :id="id"
          :editMode="editMode"
          @submit="editMode = false"
          @cancel="editMode = false"
        ></basic-info-form>
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
        <el-table :data="userList" height="calc(100% - 50px)">
          <el-table-column type="index" width="55"></el-table-column>
          <el-table-column v-for="column in columns" :key="column.prop" :label="column.label"></el-table-column>
          <el-table-column prop="operator" width="55">
            <template #default="{ row, $index }">
              <i class="el-icon-error" @click="removeUser(row, $index)"></i>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination :hide-on-single-page="false" :total="userList.length"> </el-pagination>
      </div>
    </el-row>
    <tree-selector
      :option="allUser"
      v-model="selectedUser"
      optionPlaceholder="请输入部门/人员名称"
      optionLabel="选择人员"
      valueLabel="A项目-B岗位"
      ref="treeSelectorRef"
    ></tree-selector>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import TreeSelector from './components/TreeSelector.vue';
import BasicInfoForm from './components/BasicInfoForm.vue';
import { ElMessageBox } from 'element-plus';
export default {
  name: 'ProjectDetail',
  props: {
    id: {
      required: true,
    },
  },
  components: { TreeSelector, BasicInfoForm },
  setup() {
    const treeSelectorRef: any = ref(null);
    const editMode = ref(false);

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
      treeSelectorRef.value.show();
    };

    // tree selector数据
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

    // 用户列表
    const userList = ref([]);
    const columns = [
      {
        prop: 'account',
        label: '登录账号',
      },
      {
        prop: 'name',
        label: '姓名',
      },
      {
        prop: 'gender',
        label: '性别',
      },
      {
        prop: 'phone',
        label: '手机',
      },
      {
        prop: 'mail',
        label: '邮箱',
      },
      {
        prop: 'stauts',
        label: '状态',
      },
      {
        prop: 'department',
        label: '部门',
      },
    ];
    const removeUser = (row: any) => {
      ElMessageBox.confirm(`是否将${row.name}从${row.department}中移除？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        //
      });
    };

    return {
      editMode,
      treeData,
      addMember,
      allUser,
      selectedUser,
      userList,
      columns,
      removeUser,
      treeSelectorRef,
    };
  },
};
</script>

<style lang="scss">
.project-detail {
  margin: -20px;
  height: calc(100vh - 130px);
  background: #f2f2f2;
  .basic-info {
    height: 310px;
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
      .el-icon-circle-plus:hover {
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
