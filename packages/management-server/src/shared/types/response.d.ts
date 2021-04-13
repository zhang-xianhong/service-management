import { PlainObject } from '../pipes/query.pipe';

// 创建成功
export interface Created {
  id: number
}

export interface BulkCreated {
  ids: number[]
}
// 更新成功
export interface Updated {
  id: number
}

// 删除成功
export interface Deleted {
  ids: number[]
}

// 列表返回
export type Rows<T> = Array<T>;

// 详情
export type Details<T> = T;

// 列表返回(带分页)
export interface RowsAndCount<T> extends PlainObject {
  count: number
  rows: Rows<T>
}
