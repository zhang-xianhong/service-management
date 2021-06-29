<template>
  <el-dialog title="服务依赖" v-model="visible" width="60%" :before-close="handleClose">
    <div class="dialog-service-depend-wrapper">
      <service-depend v-if="visible" />
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import ServiceDepend from '../depend/Index.vue';
export default defineComponent({
  name: 'DependDialog',
  components: {
    ServiceDepend,
  },
  setup() {
    const visible = ref(false);
    const handleClose = () => {
      visible.value = false;
    };
    const handleOpen = () => {
      visible.value = true;
    };
    return {
      visible,
      handleOpen,
      handleClose,
    };
  },
});
</script>
<style lang="scss" scoped>
.dialog-service-depend-wrapper {
  width: 100%;
  height: 600px;
  overflow: hidden;
}
</style>
