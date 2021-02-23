<template>
  <data-list>
    <template v-slot:head>
      头
    </template>
    <el-table>

    </el-table>
    <template v-slot:foot>
      <el-pagination
        :current-page="10"
        :page-sizes="[100, 200, 300, 400]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="4000">
      </el-pagination>
    </template>
  </data-list>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'dashboard'
})
</script>
