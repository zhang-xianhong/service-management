import { ref } from 'vue';
import request from '@/utils/request';
import { AxiosResponse } from 'axios';

export const serveList = ref([]);

export function getServeList(page: number, pageSize: number) {
  request
    .get('services', {
      params: {
        page,
        pageSize,
      },
    })
    .then((res: AxiosResponse) => {
      console.log(res);
      serveList.value = res.data.list;
    });
}
