<template>
  <div class="select-dto__box">
    <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
    <el-tree
      class="filter-tree"
      show-checkbox
      node-key="id"
      highlight-current
      :data="treeData"
      :props="defaultProps"
      :filter-node-method="filterNode"
      ref="treeRef"
    >
    </el-tree>
  </div>
</template>

<script lang="ts">
import { ref } from '@vue/reactivity';
import { computed, defineComponent, watch } from '@vue/runtime-core';
import { ElTree } from 'element-plus';
import { FilterNodeMethodFunction } from 'element-plus/lib/el-tree/src/tree.type';
import { useDtoList } from './dto';

export default defineComponent({
  name: 'SelectDto',
  setup() {
    const defaultProps = {
      children: 'children',
      label: 'name',
    };
    const treeRef = ref<InstanceType<typeof ElTree>>();

    const filterText = ref<string>('');
    const { dtoList } = useDtoList();

    watch(filterText, (text) => treeRef.value?.filter(text));

    const filterNode: FilterNodeMethodFunction = (value, data) => {
      if (!value) return true;
      console.log(data);

      return data.name?.indexOf(value) !== -1;
    };
    const getCheckedNodes = () => treeRef.value?.getCheckedNodes(false, false);

    const treeData = computed(() =>
      dtoList.value?.map((e) => {
        const { list, ...restProperties } = e;
        return {
          ...restProperties,
          children: [...list],
        };
      }),
    );
    return {
      dtoList,
      defaultProps,
      filterText,
      treeRef,
      filterNode,
      treeData,
      getCheckedNodes,
    };
  },
});
</script>
<style lang="scss" scoped>
.select-dto__box {
  min-height: 200px;
}
</style>
