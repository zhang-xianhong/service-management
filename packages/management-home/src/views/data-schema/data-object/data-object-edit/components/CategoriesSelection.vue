<template>
  <div class="categories-selection" v-bind="$attrs">
    <el-input placeholder="请输入关键字过滤" v-model="filterText"></el-input>
    <el-tree :data="options" :props="{ label: 'name' }" :filter-node-method="filterNode" ref="treeRef"> </el-tree>
  </div>
</template>

<script lang="ts">
import { ref, reactive, onMounted, watch } from 'vue';
import { getAllCategories } from '@/api/settings/categories';

export default {
  name: 'CategoriesSelection',
  props: {
    modelValue: {
      type: String,
      default: '',
    },
  },
  setup() {
    const treeRef: any = ref(null);
    const filterText = ref('');

    watch(
      () => filterText.value,
      () => {
        treeRef.value.filter(filterText.value);
      },
    );

    const options: any[] = reactive([]);

    onMounted(async () => {
      const { data } = await getAllCategories();
      options.push(...data);
    });

    function filterNode(value: string, data: any) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    }

    return {
      treeRef,
      filterText,
      filterNode,
      options,
    };
  },
};
</script>

<style lang="scss" scoped>
.categories-selection {
  position: absolute;
}
</style>
