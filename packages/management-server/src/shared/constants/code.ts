/**
 * 业务状态码
 * 除成功外，其他都是5位数字，按模块分类
 * 根据不同模块，起始数字不同，具体业务依次递增
 * ------------------------------------
 * 模块              | Code
 * ------------------------------------
 * 通用              | 1XXXX
 * ------------------------------------
 * 用户              | 2XXXX
 * ------------------------------------
 * 业务1             | 3XXXX
 * ------------------------------------
 * 业务10            | 11XXX
 * ------------------------------------
 */

// 通用模块
export enum CommonCodes {
  // 成功的
  SUCCESSFUL = 0,
  // 未登录
  TOKEN_EMPTY = 10001,
  // token过期
  TOKEN_EXPIRED = 10002,
  // token无效
  TOKEN_INVALID = 10003,
  // 未找到
  NOT_FOUND = 10004,
  // 创建失败
  CREATED_FAIL = 10005,
  // 参数错误
  PARAMETER_INVALID = 10006,
  // 数据已存在
  DATA_EXISTED = 10007
}

// 用户模块
export enum UserCodes {
  // 名称已存在
  USERNAME_EXISTED = 20001,
  // 邮箱已存在
  EMAIL_EXISTED = 20002,
  // 名称无效
  USERNAME_INVALID = 20003,
  // 密码无效
  PASSWORD_INVALID = 20004,
  // 登录无效, 用户名或密码错误
  LOGIN_INVALID = 20005
}

// 模型模块
export enum ModelCodes {
  // 名称已存在
  NAME_EXISTED = 30001,
  // 名称无效
  NAME_INVALID = 30002,
  // 无效的modelId
  MODEL_ID_INVALID = 30003
}


// 设置模块
