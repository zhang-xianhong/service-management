<template>
  <el-tabs v-model="activeName">
    <el-tab-pane label="本地" name="local">
      <span v-if="serviceList.length === 0">请添加服务</span>
      <el-tag v-for="tag in serviceList" :key="tag.id" closable>
        {{ tag.serveName }}
      </el-tag>
      <data-list :show-pagination="false" :show-seting="false">
        <template #headRight>
          <el-button type="primary">添加所有</el-button>
          <el-button>清除所有</el-button>
        </template>
        <template #headLeft>
          <el-select placeholder="请选择分类" v-model="searchCharObj.classChar" style="width: 180px">
            <el-option v-for="(item, index) in classOptions" :key="index" :value="item.value" :label="item.label">
            </el-option>
          </el-select>
          <el-select placeholder="请选择标签" v-model="searchCharObj.labelChar" style="width: 180px">
            <el-option v-for="(item, index) in labelOptions" :key="index" :value="item.value" :label="item.label">
            </el-option>
          </el-select>
          <el-input placeholder="请输入名称" v-model="searchCharObj.nameChar" style="width: 180px"></el-input>
          <el-button icon="el-icon-search"></el-button>
        </template>
        <template #default>
          <el-table>
            <el-table-column property="name" label="服务名称"></el-table-column>
            <el-table-column property="description" label="服务描述"></el-table-column>
            <el-table-column property="sorts" label="分类"></el-table-column>
            <el-table-column property="label" label="标签"></el-table-column>
            <el-table-column property="user" label="所属租户"></el-table-column>
            <el-table-column property="project" label="所属项目"></el-table-column>
            <el-table-column property="modules" label="服务依赖"></el-table-column>
            <el-table-column property="level" label="服务级别"></el-table-column>
            <el-table-column property="changeCount" label="修改次数"></el-table-column>
            <el-table-column property="cloneSort" label="克隆源"></el-table-column>
          </el-table>
        </template>
      </data-list>
    </el-tab-pane>
    <el-tab-pane label="交换" name="change">change</el-tab-pane>
    <el-tab-pane label="交易" name="buy">buy</el-tab-pane>
  </el-tabs>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import DataList from '@/components/dataList/Index.vue';
export default defineComponent({
  name: 'Clone',
  components: {
    DataList,
  },
  setup() {
    const activeName = ref('local');
    const serviceList = ref([
      {
        serveName: 'test1',
        id: 1,
      },
    ]);
    const classOptions = ref([
      {
        label: '公共服务',
        value: 'publicService',
      },
    ]);
    const labelOptions = ref([{
      label: '项目结构配置',
      value: 'statics',
    }]);
    const searchCharObj = reactive({
      classChar: '',
      labelChar: '',
      nameChar: '',
    });
    return {
      activeName,
      serviceList,
      classOptions,
      labelOptions,
      searchCharObj,
    };
  },
});
</script>

<style lang="scss"></style>
