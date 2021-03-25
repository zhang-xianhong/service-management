import { ref } from 'vue';
import { getLogRuntime } from '@/api/servers';

export const logDialogVisible = ref(false);
export const logData = ref([] as any);
export const timeout = ref(null as any);
export const realtime = ref('' as any);

export const getLogs = (name = 'sa-operator-adapter') => {
  getLogRuntime(name, realtime.value).then((res) => {
    console.log(res);
    realtime.value = res.data.realtimeTS;
    const dataArr = res.data.businessLogSet.content;
    logData.value = [...logData.value, ...dataArr];
  });
};

export const logSetTimeOut = (name = 'sa-operator-adapter') => {
  logDialogVisible.value = true;
  getLogs(name);
  timeout.value = window.setInterval(() => getLogs(name), 5000);
};

export const clearLogInterVal = () => {
  window.clearInterval(timeout.value);
  timeout.value = null;
  logDialogVisible.value = false;
  realtime.value = '';
  logData.value = [];
};
