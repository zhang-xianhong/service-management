export declare type PageKey = 'page' | 'pageSize';

export interface PageInfo {
  key: PageKey;
  value: number;
}

export interface SortInfo {
  column: object;
  prop: string;
  order: string;
}
