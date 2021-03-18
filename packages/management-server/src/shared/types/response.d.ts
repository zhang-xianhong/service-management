// 创建成功
export interface Created {
  id: number
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
export interface RowsAndCount<T> {
  count: number
  rows: Array<T>
}
