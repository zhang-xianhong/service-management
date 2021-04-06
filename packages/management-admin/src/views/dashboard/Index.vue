<template>
  <div>
    dashboard
    <el-button v-if="$showModule('test')">test</el-button>
    <el-button v-if="$showModule('show')">show</el-button>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'dashboard',
});
</script>

<style scoped></style>
