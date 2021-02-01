import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonCodes } from '../constants/code';

export interface Response<T> {
  data: T;
  httpStatus: Number;
  message: string
}

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
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
