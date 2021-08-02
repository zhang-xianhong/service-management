<template>
  <el-dialog v-model="showDtoList">
    <DtoList ref="dtoListRef" selectable></DtoList>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="onConfirmSelect">确定</el-button>
        <el-button @click="closeDtoList">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { ref } from '@vue/reactivity';
import { defineComponent } from '@vue/runtime-core';
import DtoList from './DtoList.vue';
export default defineComponent({
  name: 'DtoListDialog',
  components: {
    DtoList,
  },
  emits: ['on-confirm'],
  setup(props, ctx) {
    const dtoListRef = ref<InstanceType<typeof DtoList>>();

    const showDtoList = ref<boolean>(false);
    const openDtoList = () => {
      showDtoList.value = true;
    };

    const closeDtoList = () => {
      showDtoList.value = false;
    };

    const onConfirmSelect = () => {
      const selected = dtoListRef.value?.getSelectedData();
      ctx.emit('on-confirm', selected);
      closeDtoList();
    };

    return {
      showDtoList,
      dtoListRef,
      openDtoList,
      closeDtoList,
      onConfirmSelect,
      openDialog: openDtoList, // 对外统一接口
      closeDialog: closeDtoList,
    };
  },
});
</script>

<style scoped>
.create-dto__bth {
  margin-bottom: 1em;
}
</style>
