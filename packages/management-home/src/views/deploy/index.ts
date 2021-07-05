export type DeployTableItemStruct = {
  id: number;
  name: string;
  version: string;
  type: number;
  publisher: string;
  publisherID: string;
  applyTime: string;
  publishContent: string;
  publisherName: string;
  reviewer: string;
  reviewerId: string;
  status: number;
  reviewContent: string;
  reviewTime: string;
  rowStatus: number;
};

export type ReviewTableItemStruct = {
  id: number;
  name: string;
  version: string;
  type: number;
  publisher: string;
  publisherID: string;
  applyTime: string;
  publishContent: string;
  reviewer: string;
  reviewerId: string;
  status: number;
  reviewContent: string;
  reviewTime: string;
  rowStatus: number;
};

export const MODULE_TYPE: any = {
  1: '服务',
  2: '应用',
};

export const REVIEW_RESULT: any = {
  0: '不通过',
  1: '通过',
  // 2: ''
};

export const AUDIT_RESULTS: any = {
  0: '未审核',
  1: '未通过',
  2: '通过',
};

export const STATUS: any = {
  0: '未审核',
  1: '通过',
  2: '不通过',
  3: '已发布',
};

export const getModuleType = (type: number) => MODULE_TYPE[type];
export const getReviewResult = (status: number) => REVIEW_RESULT[status];

export const AUDIT_RESULTS_CODE: any = {
  PENDING: 0,
  PASSED: 1,
  FAILED: 2,
  PUBLISHED: 3,
};
