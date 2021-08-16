import { getLastVersion } from '@/api/servers';
import { Ref } from 'vue';
export const DEFAULT_VERSION = 'v1.0.0';

export interface ServiceSnapshot {
  id: number;
  snapshotNo: string;
  serviceName: string;
  serviceNameZh: string;
  serviceVersion: string;
  status: number;
  description: string;
  codeInfoId: number;
  commitId: string;
  level: number;
  classification: string;
  tag: string;
  developer: string;
  dmlScript: string;
  ddlScript: string;
}

export const useServiceVersion = (id: number, lastVersion: Ref<string | undefined>) => {
  const fetchLastVersion = async () => {
    try {
      const { code, data } = await getLastVersion(id);
      if (code === 0) {
        // eslint-disable-next-line no-param-reassign
        lastVersion.value = data.serviceVersion;
      }
    } catch (error) {
      console.log(error);
    }
  };

  fetchLastVersion();
};
