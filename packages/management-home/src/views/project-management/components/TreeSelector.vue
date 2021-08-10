<template>
  <el-dialog v-model="dialogVisible" width="800px">
    <el-row>
      <el-col :span="10" :offset="1">
        <div class="title">加入成员</div>
        <div>
          <div class="field-label">{{ optionLabel }}</div>
          <div class="input-wrapper">
            <el-input
              :placeholder="optionPlaceholder"
              suffix-icon="el-icon-search"
              v-model="searchStr"
              @input="clearAndSearch"
            ></el-input>
          </div>
          <div class="tree-wrapper" v-loading="!searchDone">
            <el-tree
              v-if="!searchStr && dataDone"
              :default-expand-all="false"
              :load="loadNode"
              lazy
              :expand-on-click-node="false"
              :props="treeProps"
            >
              <template #default="{ data, node }">
                <div class="node-bg" :class="{ 'checked-node': data.checked }"></div>
                <el-checkbox
                  v-model="data.checked"
                  :disabled="data.disabled"
                  :indeterminate="data.isIndeterminate"
                  @change="checkUser(data, node)"
                ></el-checkbox>
                <el-tooltip effect="light" :content="data.name + ' ' + (data.roleList || '')" placement="right-end">
                  <span
                    style="
                      z-index: 1;
                      background: transparent;
                      width: 150px;
                      overflow: hidden;
                      white-space: nowrap;
                      text-overflow: ellipsis;
                    "
                    >{{ data.name }}
                    <span class="roleStyle">{{ data.roleList }}</span>
                  </span>
                </el-tooltip>
              </template>
            </el-tree>
            <el-tree
              v-if="searchStr && searchDone"
              :default-expand-all="false"
              :load="loadSearchNode"
              :expand-on-click-node="false"
              lazy
              :props="treeProps"
            >
              <template #default="{ data, node }">
                <el-checkbox
                  v-model="data.checked"
                  :disabled="data.disabled"
                  :indeterminate="data.isIndeterminate"
                  @change="checkUser(data, node)"
                ></el-checkbox>
                {{ data.name }}
              </template>
            </el-tree>
          </div>
        </div>
      </el-col>
      <el-col :span="10" :offset="2">
        <div class="title">已选择({{ selectedUser.length }})</div>
        <div>
          <div class="field-label">{{ valueLabel }}</div>
          <div class="list-wrapper">
            <div v-for="(user, $index) in selectedUser" :key="$index">
              <span>{{ user.displayName || user.name }}</span>
              <el-tooltip effect="light" :content="user.deptName" placement="right-end">
                <span
                  style="
                    width: 130px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    display: inline-block;
                    vertical-align: bottom;
                  "
                  >{{ user.deptName }}</span
                >
              </el-tooltip>
              <i class="el-icon-error" style="float: right" @click="remove(user)"></i>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submit">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts">
/* eslint-disable no-param-reassign */
import _ from 'lodash/fp';
import { computed, inject, ref, Ref, watchEffect, nextTick } from 'vue';
import { updateRoleMembers } from '@/api/project/project';
export default {
  name: 'TreeSelector',
  props: {
    option: {
      required: true,
      type: Array,
    },
    optionLabel: {
      required: true,
      type: String,
    },
    optionPlaceholder: {
      required: true,
      type: String,
    },
    role: {
      required: true,
      type: Object,
    },
    checked: {
      required: false,
      type: Array,
      default: () => [],
    },
    notAllow: {
      required: false,
      type: Array,
      default: () => [],
    },
  },
  emits: ['userChanged'],
  setup(props: any, context: any) {
    const dialogVisible = ref(false);
    const projectId = inject('projectId') as string;
    const searchStr = ref('');
    const selectedUser: Ref<Array<any>> = ref([]);
    const show = () => {
      dialogVisible.value = true;
    };
    const treeProps = {
      label: 'name',
      children: 'children',
      isLeaf: 'isLeaf',
    };
    const dataDone = ref(true);
    const syncStatus = (node: any) => {
      if (node.parent) {
        node.parent.checked = false;
        node.parent.isIndeterminate = false;
        if (
          _.some((item: any) => item.isIndeterminate || item.checked)(node.parent._children || node.parent.children)
        ) {
          node.parent.isIndeterminate = true;
        }
        if (_.every({ checked: true })(node.parent._children || node.parent.children)) {
          node.parent.checked = true;
          node.parent.isIndeterminate = false;
        }
        if (_.some({ disabled: true, checked: false })(node.parent._children || node.parent.children)) {
          node.parent.disabled = true;
        }
        syncStatus(node.parent);
      }
    };
    const valueLabel = computed(() => `${props.option[0]?.name} - ${props.role?.label}`);
    const setChecked = (treeOption: Array<any>, ids: Array<number>, notAllowIds: Array<number>) => {
      treeOption.forEach((treeNode: any) => {
        if (treeNode.isLeaf) {
          treeNode.isIndeterminate = false;
          treeNode.checked = ids.includes(treeNode.id);
          treeNode.disabled = treeNode.checked;
        } else {
          setChecked(treeNode._children, ids, notAllowIds);
        }
        syncStatus(treeNode);
      });
    };
    let copyOption: any;
    watchEffect(() => {
      dataDone.value = false;
      const selectedUserId = _.map('id')(props.checked);
      const notAllowUserId = _.map('id')(props.notAllow);
      selectedUser.value = [];
      copyOption = _.cloneDeep(props.option);
      setChecked(copyOption, selectedUserId, notAllowUserId);
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
    const checkSingle = (user: any) => {
      const { checked } = user;
      if (checked) {
        selectedUser.value = _.concat(selectedUser.value, user);
      } else {
        selectedUser.value = _.reject({ id: user.id })(selectedUser.value);
      }
      syncStatus(user);
    };
    const checkGroup = async (group: any) => {
      let hasCheckedDisabled = false;
      let hasUncheckedDisabled = false;
      const disabledNodes: any[] = [];
      const getEditableMember = (nodeGroup: any, members: Array<any>) => {
        nodeGroup.forEach((treeNode: any) => {
          if (treeNode.disabled) {
            if (treeNode.checked) {
              hasCheckedDisabled = true;
            } else {
              hasUncheckedDisabled = true;
            }
            disabledNodes.push(treeNode);
            return;
          }
          treeNode.checked = group.checked;
          if (treeNode.isLeaf) {
            members.push(treeNode);
          } else {
            getEditableMember(treeNode.children || treeNode._children, members);
          }
        });
      };
      const groupMembers: any[] = [];
      getEditableMember(group.children || group._children, groupMembers);
      if (!group.checked) {
        selectedUser.value = _.differenceBy('id')(selectedUser.value)(groupMembers);
        group.isIndeterminate = hasCheckedDisabled;
      } else {
        selectedUser.value = _.unionBy('id')(selectedUser.value)(groupMembers);
        group.isIndeterminate = hasUncheckedDisabled;
        group.checked = !hasUncheckedDisabled;
      }
      syncStatus(group);
      disabledNodes.forEach(syncStatus);
    };
    const checkUser = (user: any) => {
      if (!user.isLeaf) {
        checkGroup(user);
      } else {
        checkSingle(user);
      }
    };
    const submit = async () => {
      const { code } = await updateRoleMembers({
        projectId,
        roleId: props.role.id,
        userIds: _.map('id')(selectedUser.value.concat(props.checked)),
      });
      if (code === 0) {
        dialogVisible.value = false;
        context.emit('userChanged', props.role);
      }
    };
    const cancel = () => {
      dialogVisible.value = false;
      context.emit('userChanged', props.role);
    };

    const searchResult: Ref<any> = ref([]);
    const searchDone = ref(true);

    const search = _.debounce(500)(async () => {
      if (!searchStr.value) return;
      const userArr: any[] = [];
      const deptArr: any[] = [];
      const getSearchRes = (searchStr: string, users: any[], depts: any[], nodeList: any[]) => {
        nodeList.forEach((node: any) => {
          if (RegExp(searchStr).test(node.name)) {
            if (node.isLeaf) {
              users.push(node);
            } else {
              depts.push(node);
            }
          }
          node.isLeaf || getSearchRes(searchStr, users, depts, node.children || node._children);
        });
      };
      getSearchRes(searchStr.value, userArr, deptArr, copyOption);
      searchResult.value = [...userArr, ...deptArr];
      searchDone.value = true;
    });
    const clearAndSearch = () => {
      searchDone.value = !searchStr.value;
      searchResult.value = [];
      search();
    };
    const loadSearchNode = (node: any, resolve: Function) => {
      if (node.level === 0) {
        resolve(searchResult.value);
      } else {
        resolve(node.data._children);
      }
    };

    const remove = (user: any) => {
      user.checked = false;
      syncStatus(user);
      selectedUser.value = _.reject({ id: user.id })(selectedUser.value);
    };

    return {
      dialogVisible,
      show,
      loadNode,
      treeProps,
      checkUser,
      selectedUser,
      submit,
      cancel,
      valueLabel,
      searchStr,
      clearAndSearch,
      remove,
      dataDone,
      loadSearchNode,
      searchDone,
    };
  },
};
</script>

<style lang="scss" scoped>
.title {
  margin-top: -20px;
  margin-bottom: 20px;
  font-size: 15px;
  font-weight: 700;
  color: #000;
}
.field-label {
  text-align: center;
  border: 1px solid #ccc;
  border-bottom: none;
  padding: 5px 0;
  font-weight: 600;
  color: #888;
}
.input-wrapper {
  border: 1px solid #ccc;
  border-bottom: none;
  &:deep(input) {
    border: none;
  }
}
.tree-wrapper {
  border: 1px solid #ccc;
  height: 35vh;
  color: #444;
  overflow: auto;
}
.list-wrapper {
  color: #444;
  border: 1px solid #ccc;
  height: calc(35vh + 34px);
  overflow: auto;
  & > div {
    padding: 5px 10px;
    height: 32px;
    border-bottom: 1px solid #ccc;
    cursor: pointer;
    &:hover {
      background: #f5f7fa;
    }
    span,
    i {
      line-height: 22px;
    }
    i {
      font-size: 18px;
      &:hover {
        color: $danger;
      }
    }
    i:hover {
      color: $danger;
    }
    span + span {
      margin-left: 10px;
      color: #888;
    }
  }
}
.dialog-footer {
  text-align: center;
}
.node-bg {
  display: none;
}
.checked-node {
  display: block;
  position: absolute;
  height: 26px;
  background: #f5f7fa;
  left: 0;
  right: 0;
}
.tree-wrapper:deep(.el-tree-node__expand-icon) {
  z-index: 1;
}
.roleStyle {
  color: #999;
}
</style>
