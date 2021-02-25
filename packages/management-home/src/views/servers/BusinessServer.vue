<template>
  <data-list>
    <template v-slot:head>
      <el-row class="business-tooltip">
        <el-button-group class="business-tooltip__operations">
          <el-button type="primary">新增</el-button>
          <el-button>克隆</el-button>
          <el-button>继承</el-button>
          <el-button>启动</el-button>
          <el-button>停止</el-button>
          <el-button>发布</el-button>
          <el-button>删除</el-button>
        </el-button-group>
        <div class="business-tooltip__filters">
          <el-select v-model="selectedCategory" filterable placeholder="请选择分类">
            <el-option
              v-for="(item, index) in categories"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-select v-model="selectedTag" filterable placeholder="请选择标签">
            <el-option v-for="(item, index) in tags" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <el-input
            class="business-tooltip__filters--input"
            placeholder="输入搜索对象名称/标签/分类"
            v-model="inputValue"
            clearable
            suffix-icon="el-icon-search"
          ></el-input>
          <el-popover placement="bottom" trigger="click">
            <template #reference>
              <el-icon class="el-icon-setting"></el-icon>
            </template>
            <el-button class="configuration-button">负责人</el-button>
            <el-button class="configuration-button">分类</el-button>
            <el-button class="configuration-button">标签</el-button>
          </el-popover>
        </div>
      </el-row>
    </template>
    <div>
      <div class="left">left</div>
      <div class="right">right</div>
    </div>
  </data-list>
</template>

<script lang="ts">
import { reactive, toRefs, ref } from 'vue';

interface CategoryState {
  categories: Array<Record<string, any>>;
  selectedCategory: string;
}

interface TagState {
  tags: Array<Record<string, any>>;
  selectedTag: string;
}

export default {
  setup() {
    // 分类相关状态
    const categoryState: CategoryState = reactive({
      categories: [],
      selectedCategory: '',
    });

    // 标签相关状态
    const tagState: TagState = reactive({
      tags: [],
      selectedTag: '',
    });

    // 搜索框输入
    const inputValue = ref('');

    return {
      ...toRefs(categoryState),
      ...toRefs(tagState),
      inputValue,
    };
  },
};
</script>

<style lang="scss" scoped>
.left {
  margin-left: 20px;
}
.right {
  margin-left: auto;
}
.configuration-button {
  width: 125px;
  margin-left: 0px;
  margin-bottom: 10px;
}
.business-tooltip {
  width: 100%;
  display: block;
  &__operations {
    float: left;
  }
  &__filters {
    float: right;
    &--input {
      width: 280px;
      margin-right: 10px;
    }
  }
  div.el-select {
    margin-right: 10px;
  }
}
</style>
