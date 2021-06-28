<template>
  <div>
    <el-row>
      <el-col :span="6" style="text-align: left"></el-col>
      <el-col :offset="12" :span="6" style="text-align: right">
        <el-input
          placeholder="请输入服务名称"
          suffix-icon="el-icon-search"
          @input="handlerSearch"
          v-model="searchProps.keyword"
        ></el-input>
      </el-col>
    </el-row>
    <list-wrap>
    </list-wrap>  
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';
interface TableState {
  tableData: Array<object>;
  loading: boolean;
  total: number;
  searchProps: {
    keyword: string;
    page: number;
    pageSize: number;
    sortField: string;
    sortType: 'ascending' | 'descending';
  };
}
export default defineComponent({
  components: {},
  setup() {
    // 表单相关状态
    const tableState: TableState = reactive({
      tableData: [],
      loading: false,
      total: 0,
      searchProps: {
        keyword: '',
        status: null,
        auditResults: null,
        page: 1,
        pageSize: 10,
        sortField: 'createTime',
        sortType: 'descending',
      },
    });

    const handlerSearch = () => {}
  

    return {
      ...toRefs(tableState),
      handlerSearch
    }
  },
});
</script>
