<template>
  <el-dialog title="服务依赖" v-model="visible" width="60%" :before-close="handleClose">
    <div class="dialog-service-depend-wrapper">
      <service-depend ref="serviceDependRef" />
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts">
import { defineComponent, ref, nextTick } from 'vue';
import ServiceDepend from '../depend/Index.vue';
export default defineComponent({
  name: 'DependDialog',
  components: {
    ServiceDepend,
  },
  setup() {
    const visible = ref(false);
    const serviceDependRef = ref(null as any);
    const handleClose = () => {
      visible.value = false;
    };
    const handleOpen = () => {
      visible.value = true;
      nextTick(() => {
        serviceDependRef.value.render(true);
      });
    };
    return {
      visible,
      handleOpen,
      handleClose,
      serviceDependRef,
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
