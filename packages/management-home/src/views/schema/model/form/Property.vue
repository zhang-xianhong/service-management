<template>
  <el-table :data="properties" max-height="400" border style="width: 100%">
    <el-table-column prop="index" label="序号" fixed width="80">
      <template #default="scope">
        {{ scope.$index + 1 }}
      </template>
    </el-table-column>
    <el-table-column prop="name" label="属性名称" fixed min-width="100">
      <template #default="scope">
        <el-input v-model="scope.row.name" />
      </template>
    </el-table-column>
    <el-table-column prop="description" label="属性描述" min-width="100">
      <template #default="scope">
        <el-input v-model="scope.row.description" />
      </template>
    </el-table-column>
    <el-table-column prop="type" label="数据类型" min-width="100">
      <template #default="scope">
        <el-input v-model="scope.row.type" />
      </template>
    </el-table-column>
    <el-table-column prop="notNull" label="非空" width="70">
      <template #default="scope">
        <el-checkbox v-model="scope.row.notNull" />
      </template>
    </el-table-column>
    <el-table-column prop="notNull" label="唯一" width="70">
      <template #default="scope">
        <el-checkbox v-model="scope.row.notNull" />
      </template>
    </el-table-column>
    <el-table-column prop="notNull" label="索引" width="70">
      <template #default="scope">
        <el-checkbox v-model="scope.row.notNull" />
      </template>
    </el-table-column>
    <el-table-column prop="notNull" label="分词" width="70">
      <template #default="scope">
        <el-checkbox v-model="scope.row.notNull" />
      </template>
    </el-table-column>
    <el-table-column prop="notNull" label="拼音" width="70">
      <template #default="scope">
        <el-checkbox v-model="scope.row.notNull" />
      </template>
    </el-table-column>
    <el-table-column prop="description" label="关联数据对象" min-width="100">
      <template #default="scope">
        <el-input v-model="scope.row.description" />
      </template>
    </el-table-column>
    <el-table-column prop="opt" label="" align="center" fixed="right" width="50">
      <a class="action">
        <i class="el-icon-delete"></i>
      </a>
    </el-table-column>
  </el-table>
</template>
<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import { Columns } from './property-columns';
export default defineComponent({
  name: 'ModelProperty',
  setup() {
    const properties = reactive([
      {
        name: 'test',
      },
    ]);
    const columns = ref(Columns);
    return {
      properties,
      columns,
    };
  },
});
</script>
<style lang="scss" scoped>
.action {
  font-size: 18px;
  cursor: pointer;
}
</style>
