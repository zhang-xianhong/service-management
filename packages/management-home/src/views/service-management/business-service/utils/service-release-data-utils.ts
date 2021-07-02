import { ref } from 'vue';

export const releaseDialogVisible = ref(false);

export const release = () => {
  releaseDialogVisible.value = !releaseDialogVisible.value;
};

export const closeReleaseDialog = () => {
  releaseDialogVisible.value = false;
};
