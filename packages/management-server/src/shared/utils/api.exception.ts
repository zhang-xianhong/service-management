import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorTypes } from '../constants/error';

export interface ApiExceptionInfo {
  // 业务错误码
  code: number
  // 错误类型
  error?: ErrorTypes | Error
  // 具体错误信息
  message?: string
  stack?: any
}

/**
 * 统一封装Api异常接口
 *
 * @example
 * throw new ApiException({
 *  code: 5000,
 *  message: '该手机号码已存在'
 * })
 *
 */
export class ApiException extends HttpException {
  constructor({ code, error, message, stack }: ApiExceptionInfo, status: HttpStatus = HttpStatus.UNPROCESSABLE_ENTITY) {
    super({
      code,
      error: error || ErrorTypes.INVALID_PARAMETER,
      stack,
      message: message || 'bad request',
    }, status);
  }
}
