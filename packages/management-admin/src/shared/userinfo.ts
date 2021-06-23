import { getProfile } from '@/api/user';
import { userInfo } from '@/layout/messageCenter/user-info';

export const getUser = async () => {
  try {
    const { data } = await getProfile();
    userInfo.value = data || {};
  } catch (error) {
    console.log(error);
  }
};
