import { ref } from 'vue';
import { getLogRuntime } from '@/api/servers';

export const logDialogVisible = ref(false);
export const logData = ref([] as any);
export const timeout = ref(null as any);
export const realtime = ref('' as any);

export const getLogs = (name = 'sa-operator-adapter') => {
  getLogRuntime(name, realtime.value).then((res) => {
    console.log(res);
    realtime.value = res.data.realtimeTs;
    const dataArr = res.data.businessLogSet.content;
    const narr = [...logData.value, ...dataArr];
    narr.reverse();
    logData.value = narr.splice(0, 50).reverse();
  });
};

export const logSetTimeOut = (name = 'sa-operator-adapter') => {
  logDialogVisible.value = true;
  getLogs(name);
  timeout.value = window.setInterval(() => getLogs(), 5000);
};

export const clearLogInterVal = () => {
  window.clearInterval(timeout.value);
  clearInterval(timeout.value);
  timeout.value = null;
  logDialogVisible.value = false;
  realtime.value = '';
  logData.value = [];
};

export function formatLogData(str: string) {
  return str.replace(/^(\d{4}(-\d{2}){2}\s\d{2}(:\d{2}){2},\d{3})/gm, (a, b) => `<span style="color: red">${b}</span>`);
}
