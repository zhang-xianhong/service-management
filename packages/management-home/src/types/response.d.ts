// 成功时的response响应
export interface SuccessResponse<T> {
  code: number;
  data: T;
  message: string;
  httpStatus: number;
  timestamp: number;
}

// 失败时的response响应
export interface FailResponse {
  code: number;
  error: string;
  message: string;
  httpStatus: number;
  timestamp: number;
}

// 数据类型为DataList时
export interface DataListResponse extends Response {
  data: {
    list: Array<any>;
    total: number;
  };
}
