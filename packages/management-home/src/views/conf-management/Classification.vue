<template>
  <div>
    <el-row class="classific-row">
      <el-button type="primary">新增顶级分类</el-button>
      <el-button type="primary">新增子级分类</el-button>
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
        <el-tree :data="treeData" @node-click="handleNodeClick" :filter-node-method="filterNode" ref="tree"></el-tree>
      </el-col>
      <el-col :span="12" v-if="currentNode.id">
        <el-button type="primary">保存</el-button>
        <el-button>删除</el-button>
        <el-form :model="currentNode" label-position="top" :rules="rules" class="form">
          <el-form-item prop="label" label="分类名称">
            <el-input v-model="currentNode.label"></el-input>
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
import * as confApi from '@/api/conf/index';
export default defineComponent({
  name: 'Classification',
  setup() {
    const tree: any = ref(null);
    const filterText = ref('');
    const treeData: Ref<TreeData> = ref([]);
    const allExpanded = ref(false);

    const currentNode = ref({
      id: '',
      name: '',
      history: [],
      detailUrl: '',
    });

    const handleNodeClick = async ({ id = '' }) => {
      const { data } = await confApi.getClassificationById({ id });
      currentNode.value = data;
    };

    const historyList = computed(() =>
      currentNode.value.history.map((item: string, index: number) => `${index}. ${item} \n`).join(''),
    );

    onMounted(async () => {
      const { data } = await confApi.getClassificationList();
      treeData.value = data;
    });

    const filterNode = (value: string, data: any) => {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    };

    const filterTree = () => {
      tree.value.filter(filterText.value);
    };

    const setAllNodeStatue = (status: boolean) => {
      const nodes: Record<string, any> = tree.value.store.nodesMap;
      for (const node of Object.values(nodes)) {
        node.expanded = status;
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
      label: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
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
    };
  },
});
</script>

<style lang="scss" scoped>
.classific-row + .classific-row {
  margin-top: 20px;
  .form {
    margin-top: 20px;
  }
}
</style>
