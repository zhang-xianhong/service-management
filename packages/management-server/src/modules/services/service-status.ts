export enum SERVICE_STATUS {
  // 未初始化
  UNINITIALIZED = 0,
  // 初始化中
  INITIALIZING,
  // 已初始化，未构建
  UN_BUILD,
  // 构建中
  BUILDING,
  // 已构建
  BUILT,
  // 初始化失败
  INITIALIZATION_FAILED,
  // 构建失败
  BUILD_FAILED,
};
