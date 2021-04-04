export enum SERVICE_STATUS {
  // 未初始化
  UNINITIALIZED = 0,
  // 应用中
  APPLYING = 10,
  // 应用变更成功
  APPLY_SUCCESS,
  // 应用变更失败
  APPLY_FAILED,
  // 启动中
  STARTING = 20,
  // 启动成功
  START_START,
  // 启动失败
  START_FAILED,
  // 启动中
  STOPPING = 30,
  // 启动成功
  STOP_START,
  // 启动失败
  STOP_FAILED,
};
