import { ref } from 'vue';
import { getServiceList, deleteService } from '@/api/servers';
import { ElMessage } from 'element-plus';

export const serveList = ref([]);

export function getServeListForTable(page: number, pageSize: number) {
  const params = {
    page,
    pageSize,
  };
  getServiceList(params).then((res) => {
    serveList.value = res.data;
  });
}

export function deleteServe(id: string) {
  return deleteService(id).then((res) => {
    console.log(res);
    ElMessage.success('删除成功！');
  });
}
