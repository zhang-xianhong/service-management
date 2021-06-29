export type DeployTableItemStruct = {
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
  0: '服务',
  1: '应用',
};

export const REVIEW_RESULT: any = {
  0: '不通过',
  1: '通过',
};

export const getModuleType = (type: number) => MODULE_TYPE[type];
export const getReviewResult = (status: number) => REVIEW_RESULT[status];
