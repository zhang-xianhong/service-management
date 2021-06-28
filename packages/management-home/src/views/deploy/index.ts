export type DeployTableItemStruct = {
  id: number;
  createTime: string;
  reviewTime: string;
  applyUser: string;
  reviewUser: string;
  version: string;
  name: string;
  value: string;
  defaultValue: string;
  description: string;
  type: number;
  result: number;
  scope: string;
  enable: string;
  serviceId: string;
  tenantId: number;
  compile: string;
  isDelete: string;
};

export type ReviewTableItemStruct = {
  id: number;
  createTime: string;
  reviewTime: string;
  applyUser: string;
  reviewUser: string;
  version: string;
  name: string;
  value: string;
  defaultValue: string;
  description: string;
  type: number;
  result: number;
  scope: string;
  enable: string;
  serviceId: string;
  tenantId: number;
  review: string;
};

export const MODULE_TYPE: any = {
  0: '服务',
  1: '应用',
};

export const REVIEW_RESULT: any = {
  0: '通过',
  1: '不通过',
};

export const getModuleType = (type: number) => MODULE_TYPE[type];
export const getReviewResult = (result: number) => REVIEW_RESULT[result];
