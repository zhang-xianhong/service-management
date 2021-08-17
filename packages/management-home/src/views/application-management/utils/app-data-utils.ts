/* eslint-disable no-param-reassign */
import { getAllServiceList } from '@/api/servers';
import { ref } from 'vue';

export const allService = ref([] as any);

export function getAllService() {
  return getAllServiceList({}).then((res) => {
    if (res?.data?.rows) {
      allService.value = res.data.rows;
    } else {
      allService.value = [];
    }
  });
};
