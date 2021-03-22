<template>
  <div :style="`width: ${width}; height: ${height}; position: relative;`">
    <el-table :data="fields" :height="height">
      <el-table-column type="selection" width="45"></el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="name" label="属性名称">
        <template #default="{ row }">
          <el-input v-model="row.name"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="属性描述">
        <template #default="{ row }">
          <el-input v-model="row.description"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="数据类型">
        <template #default="{ row }">
          <el-select v-model="row.description"></el-select>
        </template>
      </el-table-column>
      <el-table-column prop="notNull" label="非空" width="60">
        <template #default="{ row }">
          <el-checkbox v-model="row.notNull"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column prop="isUnique" label="唯一" width="60">
        <template #default="{ row }">
          <el-checkbox v-model="row.isUnique"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column prop="isIndex" label="索引" width="60">
        <template #default="{ row }">
          <el-checkbox v-model="row.isIndex"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column prop="isParticipleSupport" label="分词" width="60">
        <template #default="{ row }">
          <el-checkbox v-model="row.isParticipleSupport"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column prop="isPinyinSupport" label="拼音" width="60">
        <template #default="{ row }">
          <el-checkbox v-model="row.isPinyinSupport"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column prop="operations" label="操作" width="180">
        <template #default="{ $index }">
          <el-button @click="add($index)" class="operator">添加</el-button>
          <el-button @click="remove($index)" class="operator" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { defineComponent, ref, watchEffect } from 'vue';
export default defineComponent({
  name: 'ColumnForm',
  props: {
    modelValue: {
      type: Array,
      required: true,
    },
    width: {
      type: [Number, String],
      required: true,
    },
    height: {
      type: [Number, String],
      required: true,
    },
  },
  setup(props) {
    const fields = ref([]);
    watchEffect(() => {
      fields.value = props.modelValue;
    });
    const add = (index) => {
      fields.value.splice(index + 1, 0, {
        name: '',
        description: '',
        type: '',
      });
    };
    const remove = (index) => {
      fields.value.splice(index, 1);
    };
    return {
      fields,
      add,
      remove,
    };
  },
});
</script>

<style lang="scss" scoped>
.operator {
  cursor: pointer;
  & + & {
    margin-left: 10px;
  }
}
</style>
