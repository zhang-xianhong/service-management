<template>
  <data-list>
    <template v-slot:head>
        这里是头部
    </template>
    <el-table>

    </el-table>
  </data-list>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'dashboard'
})
</script>
