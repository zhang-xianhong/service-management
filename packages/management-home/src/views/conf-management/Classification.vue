<template>
  <div>
    <el-row class="classific-row page_head-menu">
      <el-button style="width: 120px" type="primary" @click="addTop" v-if="getShowBool('add')">新增顶级分类</el-button>
      <el-button
        style="width: 120px"
        @click="addChild"
        :disabled="currentNode.id === -1 || !treeFirstIdArray.includes(currentNode.id)"
        v-if="getShowBool('update')"
        >新增子级分类</el-button
      >
      <el-button v-if="!allExpanded" @click="expandAll">展开所有</el-button>
      <el-button v-if="allExpanded" @click="collapseAll">折叠所有</el-button>
    </el-row>
    <el-row class="classific-row" :gutter="20">
      <el-col :span="12">
        <el-input
          placeholder="请输入节点名称筛选"
          suffix-icon="el-icon-search"
          @input="filterTree"
          v-model="filterText"
          style="width: 300px"
        ></el-input>
        <el-scrollbar class="tree">
          <el-tree
            ref="tree"
            class="mt20"
            :data="treeData"
            :highlight-current="true"
            node-key="id"
            @node-click="handleNodeClick"
            :filter-node-method="filterNode"
            :props="{ label: 'name' }"
          ></el-tree>
        </el-scrollbar>
      </el-col>
      <el-col :span="12" v-if="~currentNode.id">
        <el-button type="primary" @click="save" v-if="getShowBool('update')">保存</el-button>
        <el-button @click="remove" v-if="getShowBool('delete')">删除</el-button>
        <el-form :model="currentNode" label-position="top" :rules="rules" class="mt20" ref="classFormRef">
          <el-form-item prop="name" label="分类名称">
            <el-input v-model="currentNode.name" :disabled="!getShowBool('update')"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input
              type="textarea"
              :rows="10"
              v-model="currentNode.description"
              :disabled="!getShowBool('update')"
            ></el-input>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, onMounted, getCurrentInstance } from 'vue';
import { TreeData } from 'element-plus/packages/tree/src/tree.type';
import * as confApi from '@/api/settings/classification';
import _ from 'lodash/fp';
import { ElMessageBox, ElMessage } from 'element-plus';
import { getShowBool } from '@/utils/permission-show-module';

interface ClassicificNode {
  id: number;
  name: string;
  children?: Array<ClassicificNode>;
  description?: Array<string>;
  parentId: number;
}
const NULL_KEY = -1;
const TEMP_KEY = 0;
const DEFAULT_NODE_NAME = 'New Node';
export default defineComponent({
  name: 'Classification',
  setup() {
    const tree: any = ref(null);
    const treeData: Ref<TreeData> = ref([]);
    const treeFirstIdArray = ref([] as any);
    const allExpanded = ref(false);
    // 获取组件实例
    const instance = getCurrentInstance();
    const currentNode: Ref<ClassicificNode> = ref({
      id: -1,
      name: '',
      detailUrl: '',
      children: [],
      parentId: -1,
    });

    const loadTreeData = async () => {
      const { data } = await confApi.getClassificationList();
      treeData.value = data;
      treeFirstIdArray.value = data.map((x: any) => x.id);
      currentNode.value.id = NULL_KEY;
      currentNode.value.name = '';
    };

    // 过滤
    const filterText = ref('');
    const filterTree = () => {
      tree.value.filter(filterText.value);
    };
    const filterNode = (value: string, data: any) => {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    };

    // 控制展开状态
    const setAllNodeStatue = (status: boolean) => {
      const nodes: Record<string, any> = tree.value.store.nodesMap;
      for (const node of Object.values(nodes)) {
        node.expanded = status;
      }
    };
    const setOneNodeStatue = (id: string | number, status: boolean) => {
      const nodes: Record<string, any> = tree.value.store.nodesMap;
      for (const node of Object.values(nodes)) {
        if (node.key === id) {
          node.expanded = status;
          break;
        }
      }
    };

    // 添加顶级分类
    const addTop = () => {
      const toSave = tree.value.getNode(TEMP_KEY);
      if (toSave?.key === TEMP_KEY) {
        ElMessage.warning(`请先保存节点${toSave.data.name}`);
        return;
      }
      const newNodeData = {
        name: DEFAULT_NODE_NAME,
        id: 0,
        parentId: TEMP_KEY,
      };
      tree.value.append(newNodeData, null);
      currentNode.value = newNodeData;
      tree.value.setCurrentKey(TEMP_KEY);
    };

    // 添加叶子节点分类
    const addChild = () => {
      const toSave = tree.value.getNode(TEMP_KEY);
      if (toSave?.key === TEMP_KEY) {
        ElMessage.warning(`请先保存节点${toSave.data.name}`);
        return;
      }
      const parentId = currentNode.value.id;
      const newNodeData = {
        name: DEFAULT_NODE_NAME,
        id: 0,
        parentId,
      };
      tree.value.append(newNodeData, parentId);
      currentNode.value = newNodeData;
      setOneNodeStatue(parentId, true);
      tree.value.setCurrentKey(TEMP_KEY);
    };

    // 全部展开/折叠
    const expandAll = () => {
      allExpanded.value = true;
      setAllNodeStatue(true);
    };
    const collapseAll = () => {
      allExpanded.value = false;
      setAllNodeStatue(false);
    };

    // 点击节点显示表单
    const handleNodeClick = async (data: any) => {
      // 判断是否有顶级没有保存
      const toSave = tree.value.getNode(TEMP_KEY);
      if (toSave) {
        ElMessage.warning(`请先保存节点${toSave.data.name}`);
      } else {
        currentNode.value = data;
      }
    };
    // 编辑表单
    const rules = {
      name: [
        { required: true, message: '请输入分类名称', trigger: 'blur' },
        { min: 1, max: 20, message: '名称过长，最多不超过20个字符' },
      ],
      description: [{ min: 1, max: 255, message: '描述过长，最多不超过225个字符' }],
    };
    const classFormRef: Ref<any> = ref(null);
    const save = () => {
      classFormRef.value.validate(async (valid: boolean) => {
        if (valid) {
          if (currentNode.value.id) {
            const { code } = await confApi.updateClassification(
              _.pick(['id', 'name', 'description'])(currentNode.value),
            );
            if (code === 0) {
              ElMessage.success('修改分类成功！');
            }
            tree.value.getNode(currentNode.value.id).data.name = currentNode.value.name;
          } else {
            const params = _.pick(['name', 'description'])(currentNode.value);
            if (currentNode.value.parentId !== TEMP_KEY) {
              params.parentId = currentNode.value.parentId;
            }
            const { code } = await confApi.addClassification(params);
            if (code === 0) {
              ElMessage.success('创建分类成功！');
            }
          }
          const toSave = tree.value.getNode(TEMP_KEY);
          if (toSave) {
            tree.value.remove(toSave);
          }
          loadTreeData();
        }
      });
    };

    const remove = async () => {
      ElMessageBox.confirm(`是否删除选中分类?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const { code } = await confApi.deleteClassification(currentNode.value.id);
          if (code === 0) {
            (instance as any).proxy.$message({
              type: 'success',
              message: '删除成功',
            });
            loadTreeData();
          } else {
            (instance as any).proxy.$message({
              type: 'error',
              message: '删除失败',
            });
          }
        })
        .catch(() => false);
    };

    onMounted(loadTreeData);
    return {
      tree,
      treeData,
      handleNodeClick,
      currentNode,
      filterNode,
      filterTree,
      filterText,
      allExpanded,
      expandAll,
      collapseAll,
      rules,
      save,
      remove,
      addChild,
      addTop,
      getShowBool,
      treeFirstIdArray,
      classFormRef,
    };
  },
});
</script>

<style lang="scss" scoped>
.classific-row + .classific-row {
  margin-top: 20px;
}
.mt20 {
  margin-top: 20px;
}
.tree {
  height: calc(100vh - 250px);
}
.el-row {
  margin-bottom: 10px;
}
</style>
