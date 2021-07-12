import router from '../router';
import { useStore } from 'vuex';
import { userMenus } from '@/layout/messageCenter/user-info';

export const showModule = (perName?: string): boolean => {
  const store = useStore();
  const currentRouter = router.currentRoute.value.name as string | symbol | number;
  const permissions = store.getters['user/permission'];
  if (perName && permissions[currentRouter]) {
    return !!permissions[currentRouter].includes(perName);
  }
  return false;
};

export const getShowBool = (id: string | number) => {
  const currentId = localStorage.getItem('currentPathId');
  if (currentId && currentId !== 'undefined') {
    console.log(id, userMenus.value[currentId].includes(id), '1234567890');
    return userMenus.value[currentId].includes(id);
  }
  console.log(currentId, id, '0987654321');
  return false;
};
