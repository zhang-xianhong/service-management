export interface TreeDataSourceType {
  label: string;
  [attr: string]: any;
}

export interface TreeDataType {
  loading: boolean;
  treeDataSource: Array<TreeDataSourceType>;
  isSel: boolean;
  currentNodeData: any;
  currentNodeUsers: any;
  [attr: string]: any;
}

export interface TableDataType {
  total: number;
  searchProps: {
    page: number;
    pageSize: number;
    keyword: string;
  };
  tableDataSource: any;
}

// 状态码
export enum ResCode {
  Success,
}

// 账户状态
export enum UserStatus {
  禁用 = -1,
  启用 = 0,
}
