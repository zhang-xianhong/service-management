import { ref } from 'vue';
export const useForceUpdate = () => {
  const renderKey = ref(0);
  const forceUpdate = () => {
    renderKey.value += 1;
  };
  return {
    renderKey,
    forceUpdate,
  };
};
