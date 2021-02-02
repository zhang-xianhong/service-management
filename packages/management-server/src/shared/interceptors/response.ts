import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonCodes } from '../constants/code';

export interface Response<T> {
  code: number
  data: T
  message: string
  httpStatus: number
  timestamp: number
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    // Rest默认POST请求使用201
    // 无论是POST请求还是GET请求，统一把HTTP状态码改为200
    context.switchToHttp()
      .getResponse()
      .status(HttpStatus.OK);
    return next
      .handle()
      .pipe(map(data => ({
        code: CommonCodes.SUCCESSFUL,
        data,
        message: 'successful',
        httpStatus: HttpStatus.OK,
        timestamp: Date.now(),
      })));
  }
}
