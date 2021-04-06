// 项目基本
export enum PROJECT_LEVEL {
  // 通用
  COMMON = 1,
  // 行业
  INDUSTRY,
  // 租户
  TENANT
}

// 项目状态
export enum PROJECT_STATUS {
  // 禁用
  DISABLED = 0,
  // 启用
  ENABLED = 1,
}

// 许可类型
export enum PROJECT_LICENSE {
  // 永久
  PERMANENT = 0,
  // 租用
  LEASE = 1
}
