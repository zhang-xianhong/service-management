import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    console.log('路由守卫', context);
    // TODO. 鉴权逻辑
    return true;
    // throw new UnauthorizedException({
    //   message: '未登录',
    //   error: 'Unauthorized',
    //   code: 4001,
    // });
  }
}
