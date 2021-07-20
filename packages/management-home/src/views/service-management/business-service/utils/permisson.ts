import { computed, InjectionKey, provide, readonly, Ref } from 'vue';

// 服务来源 1自研 2引用 3克隆不改名称 4克隆改名称',
export const enum SERVICE_SOURCE {
  SELF_DEVELOPMENT = 1,
  REFRENCE,
  CLONE,
  CLONE_RNAME,
}

// 服务来源名称
export const SERVICE_SOURCE_NAME: any = {
  1: '自研',
  2: '引用',
  3: '克隆',
  4: '克隆(重命名)',
};

export interface ServiceInfo {
  id: number;
  updateTime: string;
  createTime: string;
  createUser: null;
  updateUser: null;
  isDelete: boolean;
  version: number;
  projectId: number;
  name: string;
  url: string;
  serverPort: number;
  deployId: null;
  moduleDependencyId: null;
  deposit: string;
  status: number;
  description: string;
  detail: null;
  isAllByExtend: null;
  extendVersion: null;
  classification: string;
  tag: string;
  initTimes: number;
  codeQuality: string;
  serviceRank: string;
  serviceApiUrl: string;
  druidUrl: string;
  startTime: null;
  cloneBy: string;
  repositoryId: null;
  lastSyncTime: string;
  serviceVersion: string;
  serviceVersionType: number;
  serviceSource: number;
  owners: any[];
  dependencies: any[];
  config: Config;
  sshHost: string;
  ownerUsers: any[];
}

export interface Config {
  coordinate: Coordinate;
}

export interface Coordinate {
  '225': The225;
}

export interface The225 {
  x: number;
  y: number;
  temp: boolean;
}
export const isRefrence: InjectionKey<Ref<boolean>> = Symbol('is-refrence');

export const useCheckRefrenceService = (info: Ref<ServiceInfo>) => {
  const isRefrenceService = computed(() => {
    const alowed = [SERVICE_SOURCE.REFRENCE, SERVICE_SOURCE.CLONE, SERVICE_SOURCE.CLONE_RNAME];
    return alowed.includes(info.value.serviceSource);
  });

  provide(isRefrence, readonly(isRefrenceService));
  return {
    isRefrenceService,
  };
};
