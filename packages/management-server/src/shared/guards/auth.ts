import { CanActivate, ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { CommonCodes } from '../constants/code';
import { ErrorTypes } from '../constants/error';
import { ApiException } from '../utils/api.exception';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    // TODO. 鉴权逻辑. 暂时先默认有token
    if (!request.get('token')) {
      return true;
    }
    throw new ApiException({
      message: '未登录',
      code: CommonCodes.TOKEN_EMPTY,
      error: ErrorTypes.UNAUTHORIZED,
    }, HttpStatus.UNAUTHORIZED);
  }
}
