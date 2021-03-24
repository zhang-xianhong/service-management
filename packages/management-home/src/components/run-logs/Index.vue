<template>
  <el-dialog v-if="visible" title="运行日志">
    <el-input type="textarea"></el-input>
  </el-dialog>
</template>

<script>
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'RunLogs',
  props: {
    visible: {
      type: Boolean,
      default: () => true,
    },
  },
});
</script>

<style scoped></style>
