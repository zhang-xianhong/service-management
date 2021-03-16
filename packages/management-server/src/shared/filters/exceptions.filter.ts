// 异常捕获过滤器
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Logger } from 'winston';
import { HEADER_TRACE_NAME } from '../constants';
import { ErrorTypes } from '../constants/error';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const isHttpError = exception instanceof HttpException;
    const status = isHttpError ? (exception as HttpException).getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const traceId = response.get(HEADER_TRACE_NAME);
    const path = request.url;
    let error: any;
    let message: string;
    let code: number = HttpStatus.INTERNAL_SERVER_ERROR;
    let stack: any;
    console.log(exception);
    // 处理HTTP异常
    if (isHttpError) {
      const httpException = exception as HttpException;
      const exceptionRes: any = httpException.getResponse();
      error = exceptionRes.error || httpException.name;
      message = exceptionRes.message;
      code = exceptionRes.code || HttpStatus.BAD_REQUEST;
    } else {
      // 其他异常
      const httpException = exception as Error;
      error = httpException.name || ErrorTypes.INTERNAL_SERVER_ERROR;
      message = httpException.message || exception as string;
      stack = httpException.stack;
    }

    const errorInfo = {
      error,
      code,
      message,
      path,
      stack,
      traceId,
    };

    // 日志记录
    this.logger.error(`[${traceId}][${status}]: ${JSON.stringify(errorInfo)}`);

    // response 返回
    response.status(status).json({
      code,
      error,
      message: String(message),
      httpStatus: status,
      timestamp: Date.now(),
    });
  }
}
