import router from '../router';
import { useStore } from 'vuex';

export const showModule = (perName?: string): boolean => {
  const store = useStore();
  const currentRouter = router.currentRoute.value.name as string | symbol | number;
  const permissions = store.getters['user/permission'];
  console.log(permissions, 'this is currentname');
  if (perName && permissions[currentRouter]) {
    return !!permissions[currentRouter].includes(perName);
  }
  return false;
};
