// 除了常规的内置错误外，增加一些错误类型
// 前端可根据response.error 来做一些逻辑
// 比如，当请求失败时，只处理类型为 InvalidParameter 的错误
/**
 * @example
 * if (code === 0) {
 *  // 成功逻辑
 * } else {
 *    if (error === 'Invalid Parameter') {
 *      throw message; // 此时的错误全部为请求参数类型类错误
 *    } else {
 *      alert('服务器异常，请稍后重试')
 *    }
 * }
 */

export enum ErrorTypes {
  // 未授权
  UNAUTHORIZED = 'Unauthorized',
  // 被禁用
  FORBIDDEN = 'Forbidden',
  // 无效的参数
  INVALID_PARAMETER = 'Invalid Parameter',
  // 已过期的
  EXPIRED = 'Expired',
  // 服务错误
  INTERNAL_SERVER_ERROR = 'Internal Server Error',
}
