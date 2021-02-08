import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard, IAuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());
    const guard = RolesGuard.getAuthGuard(isPublic);
    return guard.canActivate(context);
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  private static getAuthGuard(isPublic: boolean): IAuthGuard {
    if (isPublic) {
      return new (AuthGuard('local'))();
    }
    return new (AuthGuard('jwt'))();
  }
}
