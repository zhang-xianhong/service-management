import { buildService, getChanges, getChangesApply, startService, stopService } from '@/api/servers';
import { ref } from 'vue';
import { logSetTimeOut } from '@/views/service-management/business-service/utils/service-log-data-utils';
import Message from 'element-plus/es/el-message';
export const thenRefresh = ref(false);

export const currentServiceIdForData = ref('' as any);
export const buildServiceData = (branch = 'develop', userId = '123456') =>
  buildService({ serviceId: currentServiceIdForData.value, branch, userId });

export const sqlData = ref([] as any);
export const sqlLoadings = ref(true);
export const sqlDialogVisiable = ref(false);
export const getSqlData = () => {
  const id = currentServiceIdForData.value;
  return getChanges(id)
    .then((res) => {
      sqlDialogVisiable.value = true;
      if (res.data) {
        sqlData.value = Object.values(res.data).map((x: any) => x.replace(/\n\t?/gm, '<br/>'));
      }
      thenRefresh.value = !thenRefresh.value;
      sqlLoadings.value = false;
    })
    .catch(() => {
      sqlLoadings.value = false;
    });
};

export const clearSql = () => {
  sqlDialogVisiable.value = false;
  sqlData.value = '';
};
export const getTreaceId = () => {
  clearSql();
  const id = currentServiceIdForData.value;
  return getChangesApply(id).then((res) => {
    if (res?.data) {
      const { logName, traceId } = res.data;
      logSetTimeOut(logName, traceId);
      thenRefresh.value = !thenRefresh.value;
    }
  });
};

export const startServiceData = (branch = 'master', userId = '123456') =>
  startService({ serviceId: currentServiceIdForData.value, branch, userId }).then((res) => {
    const { logName, traceId } = res.data;
    thenRefresh.value = !thenRefresh.value;
    logSetTimeOut(logName, traceId);
  });

export const stopServiceData = () => {
  stopService({ serviceId: currentServiceIdForData.value })
    .then((res) => {
      if (res.code === 200) {
        Message.success('停止成功');
      }
    })
    .catch((e) => {
      console.log(e);
    });
};
