import { ref } from 'vue';
import request from '@/utils/request';
import { AxiosResponse } from 'axios';

export const serveList = ref([]);

export function getServeList(page: number, pageSize: number) {
  console.log(123);
  request
    .get('services', {
      params: {
        page,
        pageSize,
      },
    })
    .then((res: AxiosResponse) => {
      serveList.value = res.data;
    });
}

export function deleteServe(id: string | number) {
  return request.post(`services/delete/${id}`).then((res) => {
    console.log(res, 'this is delete');
  });
}
