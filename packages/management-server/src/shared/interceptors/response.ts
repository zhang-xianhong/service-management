import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
        code: 0,
        data,
        message: 'successful',
        status: HttpStatus.OK,
        timestamp: Date.now(),
      })));
  }
}
