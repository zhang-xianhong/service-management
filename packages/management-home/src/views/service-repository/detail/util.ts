import { SYSTEM_APIS } from '@/views/service-management/api/config';

export interface ServiceInfo {
  name: string;
  zhName: string;
  level: number;
  type: string;
  origin: string;
  developer: string;
  platformShareType: string;
  serviceVersion: string;
  classification: string;
  tags: string;
  tenantId: number | string;
  apiList: any[];
  models: any[];
}

/**
 * 服务详情
 * @param data
 */
export const parseServiceInfo = (data: any, apiList: any[]): ServiceInfo => ({
  name: data.baseInfo.name,
  zhName: data.baseInfo.description,
  level: 1,
  type: '业务服务',
  origin: '',
  developer: '',
  platformShareType: '---',
  serviceVersion: data.baseInfo.serviceVersion,
  classification: data.baseInfo.classification,
  tags: data.baseInfo.tag,
  tenantId: '',
  apiList: [...(apiList || []), ...SYSTEM_APIS],
  models: data.models,
});

/**
 * 仓库详情
 */
export const parseRepositoryInfo = (data: any): ServiceInfo => ({
  name: data.serviceName,
  zhName: data.serviceNameZh,
  level: data.snapshotInfo.level,
  type: '业务服务',
  origin: '',
  developer: data.snapshotInfo.developer,
  platformShareType: data.platformShareType,
  serviceVersion: data.snapshotInfo.serviceVersion,
  classification: data.snapshotInfo.classification,
  tags: data.snapshotInfo.tag,
  tenantId: data.tenantId,
  apiList: [
    ...(JSON.parse(data.snapshotInfo.config || '{}').serviceApis?.map((item: any) => item) || []),
    ...SYSTEM_APIS,
  ],
  models: JSON.parse(data.snapshotInfo.config || '{}').modelInfos?.map((item: any) => item) || [],
});
