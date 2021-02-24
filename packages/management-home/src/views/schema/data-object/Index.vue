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
      <el-button icon="el-icon-search" type="primary"></el-button>
    </template>
    <template v-slot:headRight>
      <el-button type="primary">新增</el-button>
    </template>
    <el-table>
      <el-table-column
        fixed
        label="序号"
      >
      </el-table-column>
      <el-table-column
        fixed
        label="对象名称"
      >
      </el-table-column>
      <el-table-column
        label="对象描述"
      >
      </el-table-column>
      <el-table-column
        label="负责人"
      >
      </el-table-column>
      <el-table-column
        label="纯继承"
      >
      </el-table-column>
      <el-table-column
        label="对象基本"
      >
      </el-table-column>
      <el-table-column
        label="分类"
      >
      </el-table-column>
      <el-table-column
        label="标签"
      >
      </el-table-column>
      <el-table-column
        label="创建者"
      >
      </el-table-column>
      <el-table-column
        label="创建时间"
      >
      </el-table-column>
       <el-table-column
        label="修改者"
      >
      </el-table-column>
       <el-table-column
        label="修改时间"
      >
      </el-table-column>
      <el-table-column
        label="修改次数"
      >
      </el-table-column>
      <el-table-column
        label="相似对象"
      >
      </el-table-column>
      <el-table-column
        label="相似度"
      >
      </el-table-column>
      <el-table-column
        label="克隆源"
      >
      </el-table-column>
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
