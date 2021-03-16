<template>
  <div>
    <el-row class="classific-row">
      <el-button type="primary" @click="addTop">新增顶级分类</el-button>
      <el-button type="primary" @click="addChild">新增子级分类</el-button>
      <el-button type="primary">克隆</el-button>
      <el-button type="primary" v-if="!allExpanded" @click="expandAll">展开所有</el-button>
      <el-button type="primary" v-if="allExpanded" @click="collapseAll">折叠所有</el-button>
    </el-row>
    <el-row class="classific-row" :gutter="20">
      <el-col :span="12">
        <el-input
          placeholder="请输入节点名称筛选"
          suffix-icon="el-icon-search"
          @input="filterTree"
          v-model="filterText"
        ></el-input>
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
      </el-col>
      <el-col :span="12" v-if="currentNode.id">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="remove">删除</el-button>
        <el-form :model="currentNode" label-position="top" :rules="rules" class="mt20">
          <el-form-item prop="name" label="分类名称">
            <el-input v-model="currentNode.name"></el-input>
          </el-form-item>
          <el-form-item label="变更历史">
            <el-input type="textarea" :rows="10" :model-value="historyList" disabled></el-input>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, onMounted, computed } from 'vue';
import { TreeData } from 'element-plus/packages/tree/src/tree.type';
import * as confApi from '@/api/settings/classification';
import _ from 'lodash/fp';
import { ElMessage } from 'element-plus';

interface ClassicificNode {
  id: string;
  name: string;
  children?: Array<ClassicificNode>;
  history?: Array<string>;
  detailUrl?: string;
}
const TEMP_KEY = 'temp';
const DEFAULT_NODE_NAME = 'New Node';
export default defineComponent({
  name: 'Classification',
  setup() {
    const tree: any = ref(null);
    const filterText = ref('');
    const treeData: Ref<TreeData> = ref([]);
    const allExpanded = ref(false);

    const currentNode: Ref<ClassicificNode> = ref({
      id: '',
      name: '',
      history: [],
      detailUrl: '',
      children: [],
    });

    const handleNodeClick = async ({ id = '' }) => {
      const { data } = await confApi.getClassificationById({ id });
      currentNode.value = data;
    };

    const historyList = computed(() =>
      currentNode.value.history
        ? currentNode.value.history.map((item: string, index: number) => `${index}. ${item} \n`).join('')
        : [],
    );

    const loadTreeData = async () => {
      const { data } = await confApi.getClassificationList();
      treeData.value = data;
      currentNode.value.id = '';
      currentNode.value.name = '';
    };

    onMounted(loadTreeData);

    const filterNode = (value: string, data: any) => {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    };

    const filterTree = () => {
      _.debounce(500)(tree.value.filter(filterText.value));
    };

    const setAllNodeStatue = (status: boolean) => {
      const nodes: Record<string, any> = tree.value.store.nodesMap;
      for (const node of Object.values(nodes)) {
        node.expanded = status;
      }
    };
    const setOneNodeStatue = (id: string, status: boolean) => {
      const nodes: Record<string, any> = tree.value.store.nodesMap;
      for (const node of Object.values(nodes)) {
        if (node.key === id) {
          node.expanded = status;
          break;
        }
      }
    };
    const expandAll = () => {
      allExpanded.value = true;
      setAllNodeStatue(true);
    };
    const collapseAll = () => {
      allExpanded.value = false;
      setAllNodeStatue(false);
    };

    const rules = {
      name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
    };

    const save = async () => {
      if (currentNode.value.id !== TEMP_KEY) {
        const { code } = await confApi.updateClassification(_.pick(['id', 'name'])(currentNode.value));
        if (code === 0) {
          ElMessage.success('修改分类成功！');
        }
        tree.value.getNode(currentNode.value.id).data.name = currentNode.value.name;
      } else {
        const { code } = await confApi.addClassification(_.pick(['name', 'parentId'])(currentNode.value));
        if (code === 0) {
          ElMessage.success('创建分类成功！');
        }
      }
      loadTreeData();
    };

    const addChild = () => {
      const toSave = tree.value.getNode(TEMP_KEY);
      if (toSave) {
        ElMessage.warning(`请先保存节点${toSave.data.name}`);
        return;
      }
      const parentId = currentNode.value.id;
      const newNodeData = {
        name: DEFAULT_NODE_NAME,
        id: TEMP_KEY,
        parentId,
      };
      tree.value.append(newNodeData, parentId);
      currentNode.value = newNodeData;
      setOneNodeStatue(parentId, true);
      tree.value.setCurrentKey(TEMP_KEY);
    };

    const remove = async () => {
      const { code } = await confApi.deleteClassification(currentNode.value.id);
      if (code === 0) {
        ElMessage.success('删除分类成功！');
      }
      loadTreeData();
    };

    const addTop = () => {
      const toSave = tree.value.getNode(TEMP_KEY);
      if (toSave) {
        ElMessage.warning(`请先保存节点${toSave.data.name}`);
        return;
      }
      const newNodeData = {
        name: DEFAULT_NODE_NAME,
        id: TEMP_KEY,
      };
      tree.value.append(newNodeData, null);
      currentNode.value = newNodeData;
      tree.value.setCurrentKey(TEMP_KEY);
    };

    return {
      tree,
      treeData,
      handleNodeClick,
      currentNode,
      historyList,
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
</style>
