import { ref } from 'vue';

export const releaseDialogVisible = ref(false);

export const release = () => {
  releaseDialogVisible.value = true;
};

export const closeReleaseDialog = () => {
  releaseDialogVisible.value = false;
};
