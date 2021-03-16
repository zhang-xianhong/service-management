<template>
  <div class="categories-container" @click="openSelection">
    <el-tag v-for="item in selectedOptions" :key="item.id" mini closable>
      {{ item.name }}
    </el-tag>
    <i
      class="el-icon-arrow-down categories-container__arrow"
      :class="{ 'categories-container__arrow--active': isShow }"
    />
  </div>
  <div v-if="isShow" class="categories-selection" v-bind="$attrs">
    <el-input class="categories-selection__input" placeholder="请输入关键字过滤" v-model="filterText"></el-input>
    <el-tree
      ref="treeRef"
      :data="options"
      :props="{ label: 'name' }"
      :filter-node-method="filterNode"
      @node-click="handleNodeClicker"
    >
    </el-tree>
  </div>
</template>

<script lang="ts">
import { ref, reactive, onMounted, watch, watchEffect, SetupContext } from 'vue';
import { getAllCategories } from '@/api/settings/categories';

export default {
  name: 'CategoriesSelection',
  props: {
    modelValue: {
      type: Array,
      default: () => [],
    },
  },
  setup(props: any, ctx: SetupContext) {
    const treeRef: any = ref(null);

    // 分类选项
    const options: any[] = reactive([]);

    const categories: any[] = [];

    function handleOptions(options: any) {
      options.forEach((option: any) => {
        if (option.children && option.children.length) {
          handleOptions(option.children);
        }
        categories.push(option);
      });
    }

    watchEffect(() => {
      handleOptions(options);
    });

    onMounted(async () => {
      const { data } = await getAllCategories();
      options.push(...data);
    });

    // 下拉选择框是否显示
    const isShow = ref(false);
    function openSelection() {
      isShow.value = !isShow.value;
    }

    const selectedKeys: string[] = reactive(props.modelValue || []);

    const selectedOptions: any[] = reactive([]);

    watch(
      () => selectedKeys.length,
      () => {
        const selectedOptionIds = selectedOptions.map((item: any) => item.id);
        categories.forEach((item: any) => {
          if (selectedKeys.indexOf(item.id) !== -1 && selectedOptionIds.indexOf(item.id) === -1) {
            selectedOptions.push(item);
          }
        });
      },
    );

    function handleNodeClicker(data: any) {
      if (selectedKeys.indexOf(data.id) === -1) {
        selectedKeys.push(data.id);
      }
      ctx.emit('update:modelvalue', selectedKeys);
    }

    // 树节点过滤
    const filterText = ref('');

    watch(
      () => filterText.value,
      () => {
        treeRef.value.filter(filterText.value);
      },
    );

    function filterNode(value: string, data: any) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    }

    return {
      isShow,
      treeRef,
      options,
      filterText,
      handleNodeClicker,
      openSelection,
      filterNode,
      selectedOptions,
      selectedKeys,
    };
  },
};
</script>

<style lang="scss" scoped>
.categories-container {
  width: 392px;
  height: 32px;
  line-height: 32px;
  vertical-align: middle;
  position: relative;
  border: 1px solid rgb(220, 223, 230);
  border-radius: 4px;
  padding: 0px 30px 0px 15px;
  &__arrow {
    color: rgb(220, 223, 230);
    position: absolute;
    top: 7px;
    right: 8px;
    &--active {
      transform: rotate(180deg);
    }
  }
}
.categories-selection {
  position: absolute;
  border: 1px solid $disableColor;
  z-index: 1001;
  padding: 5px;
  background: #fff;
  &__input {
    margin-bottom: 5px;
  }
}
</style>
