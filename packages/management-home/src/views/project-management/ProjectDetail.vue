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
      <div class="user-tree" v-loading="loadings">
        <div class="user-tree-top">
          <el-input suffix-icon="el-icon-search" placeholder="请输入角色/人员名称" v-model="userInput"></el-input>
          <div class="user-tree-btn">
            <el-button type="primary" @click="DialogVisible = true" v-if="getShowBool('updateRole')">新建</el-button>
            <el-button @click="closeUserTree" :disabled="isDeleteVisible" v-if="getShowBool('updateRole')"
              >删除</el-button
            >
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
          :filter-node-method="filterNode"
        >
          <template #default="{ node, data }">
            <div class="customNode">
              <div class="content-style">
                <svg-icon
                  v-if="node.level < 2 && getShowBool('updateMember')"
                  icon-name="folder"
                  icon-class="tree-node-folder"
                ></svg-icon>
                <svg-icon
                  v-if="node.level === 2 && getShowBool('updateRole')"
                  icon-name="member"
                  icon-class="tree-node-member"
                ></svg-icon>
                {{ node.label }}
              </div>
              <div>
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
                        { min: 1, max: 20, message: '最多不能超过20个字符', trigger: 'blur' },
                        {
                          pattern: /^[^\s]*$/g,
                          message: '不能包含空格',
                          trigger: 'blur',
                        },
                        { validator: validatorRolePass, trigger: 'blur' },
                      ]"
                    >
                      <el-input v-model="userTreeInput.roles" autocomplete="off" clearable></el-input>
                    </el-form-item>
                    <div style="float: right">
                      <el-button type="text" @click="editBoxsave(data)" :loading="submitting">保存</el-button>
                      <el-button type="text" @click="cancel(String(data.id))">取消</el-button>
                    </div>
                  </el-form>
                  <template #reference>
                    <span>
                      <i
                        type="text"
                        class="el-icon-edit"
                        @click="handleEditRole(data)"
                        v-if="node.level === 1 && !data.isSystem && getShowBool('updateRole')"
                      ></i>
                    </span>
                  </template>
                </el-popover>
              </div>
            </div>
          </template>
        </el-tree>
      </div>
      <el-dialog title="新建角色" v-model="DialogVisible" width="500px" @closed="cancel" :destroy-on-close="true">
        <el-form :model="form" ref="formRef">
          <el-form-item
            label="角色名称"
            label-width="80px"
            prop="name"
            :rules="[
              { required: true, message: '角色不能为空', trigger: 'blur' },
              { min: 1, max: 20, message: '最多不能超过20个字符', trigger: 'blur' },
              {
                pattern: /^[^\s]*$/g,
                message: '不能包含空格',
                trigger: 'blur',
              },
              { validator: validatorRolePass, trigger: 'blur' },
            ]"
          >
            <el-input ref="tagName" v-model="form.name" autocomplete="off" placeholder="请输入角色名称"></el-input>
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
            <el-button
              type="primary"
              @click="addMember"
              :disabled="addUserBtnStatus"
              v-if="getShowBool('updateMember')"
            >
              加入成员
            </el-button>
            <el-table :data="userList">
              <el-table-column type="index" width="55"></el-table-column>
              <el-table-column v-for="column in columns" :key="column.prop" v-bind="column"></el-table-column>
              <el-table-column label="操作" prop="operator" width="55" v-if="getShowBool('updateMember')">
                <template #default="{ row }">
                  <el-button type="text" @click="removeUser(row)" v-if="getShowBool('updateMember')"> 移除 </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="角色权限" name="roleList">
            <div class="roleAuthStyle">
              <el-row v-if="getShowBool('updateRole')">
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
                      全部
                    </el-checkbox>
                    <el-checkbox-group
                      v-model="checkedItem[String(item.id)]"
                      @change="handleCheckedItemsChange(item)"
                      :disabled="isEdit"
                    >
                      <el-checkbox v-for="subItem in item.children" :label="subItem.id" :key="subItem.name">
                        {{ subItem.name }}
                        <el-tooltip
                          v-if="subItem.id === 22"
                          effect="light"
                          :content="subItem.description"
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
import { provide } from 'vue';
import TreeSelector from './components/TreeSelector.vue';
import BasicInfoForm from './components/BasicInfoForm.vue';
import detail from './detail';
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
    return {
      ...detail(props),
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
      display: flex;
      .el-icon-edit {
        visibility: hidden;
      }
      &:hover {
        .el-icon-edit {
          visibility: visible;
        }
      }
      .svg-icon {
        margin-right: 0.5em;
        &.tree-node-folder {
          color: #66bbff;
        }
      }
      .content-style {
        width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .el-icon-circle-plus {
      font-size: 18px !important;
      &:hover {
        color: #333;
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
}
</style>
<style lang="scss" scoped>
.roleAuthStyle {
  padding: 10px;
  color: #444;
  .auth-model {
    display: inline-block;
    min-width: 60px;
  }
  ::v-deep .el-checkbox-group {
    font-size: 0;
    width: 800px;
    overflow: auto;
    .el-checkbox__label {
      display: inline-block;
      min-width: 120px;
    }
    .el-checkbox {
      margin: 0;
    }
  }
}
</style>
