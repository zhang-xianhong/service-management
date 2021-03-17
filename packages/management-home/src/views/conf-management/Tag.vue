<template>
  <div>
    <el-row>
      <el-col :span="6">
        <el-input
          placeholder="请输入标签名称"
          suffix-icon="el-icon-search"
          @input="filterTag"
          v-model="filterText"
        ></el-input>
      </el-col>
      <el-col :offset="12" :span="6" style="text-align: right;">
        <el-button type="primary">新增</el-button>
        <el-button @click="groupRemove">删除</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-table :data="tagList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column type="index" width="50" />
        <el-table-column v-for="col in columns" :key="col.prop" :prop="col.prop" :label="col.label"></el-table-column>
        <el-table-column prop="operation" width="300">
          <template #default="{ row }">
            <el-button type="primary" @click="detail(row)" size="mini">详情</el-button>
            <el-button type="primary" @click="disabled(row)" size="mini">禁用</el-button>
            <!-- <el-button type="primary" @click="enabled(row)" size="mini">启用</el-button> -->
            <el-button type="primary" @click="rename(row)" size="mini">替换</el-button>
            <el-button @click="remove(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row>
      <el-pagination
        :current-page="page"
        :page-size="pageSize"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handlePageSizeChange"
        @current-change="handlePageChange"
      >
      </el-pagination>
    </el-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { listTags } from '@/api/settings/tags';
import _ from 'lodash/fp';
export default defineComponent({
  name: 'Tag',
  setup() {
    const page = ref(1);
    const total = ref(0);
    const pageSize = ref(10);
    const tagList = ref([]);
    const filterText = ref('');
    const columns = [
      {
        label: '标签名称',
        prop: 'name',
      },
      {
        label: '创建账号',
        prop: 'createUser',
      },
      {
        label: '创建时间',
        prop: 'createTime',
      },
      {
        label: '克隆源',
        prop: 'cloneBy',
      },
    ];
    const handlePageSizeChange = (size: number) => {
      pageSize.value = size;
    };
    const handlePageChange = (curPage: number) => {
      page.value = curPage;
    };
    const getTagList = async () => {
      const { code, data } = await listTags({
        page: page.value,
        pageSize: pageSize.value,
        keyword: filterText.value,
      });
      if (code === 0) {
        total.value = data.count;
        tagList.value = data.rows;
      }
    };
    const filterTag = _.debounce(500)(getTagList);
    // const remove = (row) => {

    // };
    // let selection = [];
    // const handleSelectionChange = (val: any) => {
    //   selection = val;
    // };
    // const groupRemove = () => {

    // };

    onMounted(getTagList);
    return {
      columns,
      page,
      pageSize,
      tagList,
      total,
      handlePageSizeChange,
      handlePageChange,
      getTagList,
      filterText,
      filterTag,
      // handleSelectionChange,
      // remove,
      // groupRemove,
    };
  },
});
</script>

<style lang="sass" scoped></style>
