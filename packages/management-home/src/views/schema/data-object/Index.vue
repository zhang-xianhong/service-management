<template>
  <data-list
  :loading="loading"
  :total="total"
  :page="searchParams.page"
  :pageSize="searchParams.pageSize"
  @page-change="handlePageChange">
    <template v-slot:headLeft>
      <el-select v-model="searchParams.category" placeholder="请选择">
      </el-select>
       <el-select v-model="searchParams.tags" placeholder="请选择">
      </el-select>
      <el-input v-model="searchParams.keyword" placeholder="请输入关键字"/>
      <el-button icon="el-icon-search"></el-button>
    </template>
    <template v-slot:headRight>
      <el-button type="primary">新增</el-button>
    </template>
    <el-table>

    </el-table>
  </data-list>
</template>
<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import { PageInfo } from '@/types/dataList'
export default defineComponent({
  name: 'dashboard',
  setup () {
    const loading = ref(true)
    const total = ref(1000)
    const searchParams = reactive({
      category: '',
      tags: [],
      keyword: '',
      page: 1,
      pageSize: 10
    })
    const handlePageChange = ({ key, value }: PageInfo) => {
      searchParams[key] = value
      console.log(searchParams)
    }
    setTimeout(() => {
      loading.value = false
    }, 3000)
    return {
      loading,
      total,
      searchParams,
      handlePageChange
    }
  }
})
</script>
