import { ref } from 'vue';
export const useForceUpdare = () => {
  const renderKey = ref(0);
  const forceUpdate = () => {
    renderKey.value += 1;
  };
  return {
    renderKey,
    forceUpdate,
  };
};
