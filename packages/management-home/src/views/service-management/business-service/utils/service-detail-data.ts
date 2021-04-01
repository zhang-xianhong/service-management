import { buildService, getChanges, getChangesApply, startService } from '@/api/servers';
import { ref } from 'vue';
import { logSetTimeOut } from '@/views/service-management/business-service/utils/service-log-data-utils';

export const currentServiceIdForData = ref('' as any);
export const buildServiceData = (branch = 'develop', userId = '123456') =>
  buildService({ serviceId: currentServiceIdForData.value, branch, userId });

export const sqlData = ref([] as any);
export const sqlDialogVisiable = ref(false);
export const getSqlData = () => {
  const id = currentServiceIdForData.value;
  return getChanges(id).then((res) => {
    sqlDialogVisiable.value = true;
    sqlData.value = Object.values(res.data);
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
    const { logName, traceId } = res.data;
    logSetTimeOut(logName, traceId);
  });
};

export const startServiceData = (branch = 'master', userId = '123456') =>
  startService({ serviceId: currentServiceIdForData.value, branch, userId }).then((res) => {
    const { logName, traceId } = res.data;
    logSetTimeOut(logName, traceId);
  });
