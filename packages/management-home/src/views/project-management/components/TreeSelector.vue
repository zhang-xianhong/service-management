<template>
  <el-dialog v-model="dialogVisible" width="800px">
    <el-row>
      <el-col :span="10" :offset="1">
        <div class="title">添加人员</div>
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
            <el-tree v-if="!searchStr" :default-expand-all="false" :load="loadNode" lazy :props="treeProps">
              <template #default="{ data }">
                <el-checkbox
                  v-model="checkedUser[data.id]"
                  @change="checkUser(data)"
                  v-if="data.isLeaf"
                  style="margin-left: -1em;"
                ></el-checkbox>
                {{ data.name }}
              </template>
            </el-tree>
            <el-tree
              v-if="searchStr && searchDone"
              :default-expand-all="false"
              :load="loadSearchNode"
              lazy
              :props="treeProps"
            >
              <template #default="{ data }">
                <el-checkbox
                  v-model="checkedUser[data.id]"
                  @change="checkUser(data)"
                  v-if="data.isLeaf"
                  style="margin-left: -1em;"
                ></el-checkbox>
                {{ data.name }}
              </template>
            </el-tree>
          </div>
        </div>
      </el-col>
      <el-col :span="10" :offset="2">
        <div class="title">已选择({{ modelValue.length }})</div>
        <div>
          <div class="field-label">{{ valueLabel }}</div>
          <div class="list-wrapper">
            <div v-for="(user, $index) in modelValue" :key="$index">
              <span>{{ user.displayName }}</span>
              <span>{{ user.deptName }}</span>
              <i class="el-icon-error" style="float: right;" @click="remove(user)"></i>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import _ from 'lodash/fp';
import { computed, inject, ref, Ref } from 'vue';
import { getTenentDepartment, queryInTenant } from '@/api/tenant';
import { updateMembers } from '@/api/project/project';
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
    modelValue: {
      required: true,
      type: Array,
    },
    role: {
      required: true,
      type: Object,
    },
  },
  emits: ['userChanged', 'update:modelValue'],
  setup(props: any, context: any) {
    const dialogVisible = ref(false);
    const projectId = inject('projectId') as string;
    const searchStr = ref('');
    const show = () => {
      dialogVisible.value = true;
    };
    const treeProps = {
      label: 'name',
      children: 'children',
      isLeaf: 'isLeaf',
    };
    const valueLabel = computed(() => `${props.option[0].name} - ${props.role.label}`);
    const loadNode = async (node: any, resolve: Function) => {
      if (node.level === 0) {
        resolve(props.option);
      }
      if (node.level === 1) {
        resolve(node.data._children);
      }
      if (node.level > 1) {
        const { code, data } = await getTenentDepartment({ deptId: node.data.value });
        if (code === 0) {
          const children = _.concat(
            data.users.map((user: any) => ({ ...user, name: user.displayName, isLeaf: true })),
            _.map((dept: any) => ({
              value: dept.deptId,
              name: dept.deptName,
              isLeaf: false,
            }))(data.depts),
          );
          resolve(children);
        } else {
          resolve([]);
        }
      }
    };
    const checkedUser = computed(() => {
      const checked: Record<string, boolean> = {};
      props.modelValue.forEach((user: any) => {
        checked[user.id] = true;
      });
      return checked;
    });
    const checkUser = (user: any) => {
      const checked = _.find({ id: user.id })(props.modelValue);
      if (!checked) {
        context.emit('update:modelValue', _.concat(props.modelValue, user));
      } else {
        context.emit('update:modelValue', _.reject({ id: user.id })(props.modelValue));
      }
    };
    const submit = async () => {
      const { code } = await updateMembers({
        projectId,
        projectRoleId: props.role.id,
        members: _.map('id')(props.modelValue),
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

    const loadSearchNode = async (node: any, resolve: Function) => {
      if (node.level === 0) {
        const searchTreeRes = _.concat(
          searchResult.value.users.map((user: any) => ({ ...user, name: user.displayName, isLeaf: true })),
          _.map((dept: any) => ({
            value: dept.deptId,
            name: dept.deptName,
            isLeaf: false,
          }))(searchResult.value.departments),
        );
        resolve(searchTreeRes);
      }
      if (node.level > 0) {
        const { code, data } = await getTenentDepartment({ deptId: node.data.value });
        if (code === 0) {
          const children = _.concat(
            data.users.map((user: any) => ({ ...user, name: user.displayName, isLeaf: true })),
            _.map((dept: any) => ({
              value: dept.deptId,
              name: dept.deptName,
              isLeaf: false,
            }))(data.depts),
          );
          resolve(children);
        } else {
          resolve([]);
        }
      }
    };
    const search = _.debounce(500)(async () => {
      if (!searchStr.value) return;
      const { code, data } = await queryInTenant({ keyword: searchStr.value });
      if (code === 0) {
        searchResult.value = data;
        searchDone.value = true;
      }
    });
    const clearAndSearch = () => {
      if (searchStr.value.length) {
        searchDone.value = false;
      } else {
        searchDone.value = true;
      }
      searchResult.value = [];
      search();
    };

    const remove = (user: any) => {
      context.emit('update:modelValue', _.reject({ id: user.id })(props.modelValue));
    };

    return {
      dialogVisible,
      show,
      loadNode,
      treeProps,
      checkedUser,
      checkUser,
      submit,
      cancel,
      valueLabel,
      searchStr,
      clearAndSearch,
      searchDone,
      loadSearchNode,
      remove,
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
</style>
