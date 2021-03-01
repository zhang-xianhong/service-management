<template>
  <div class="form-panel">
    <slot />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'FormPanel',
});
</script>
<style lang="scss">
.form-panel {
  .el-input,
  .el-select {
    max-width: 400px;
  }
}
</style>
