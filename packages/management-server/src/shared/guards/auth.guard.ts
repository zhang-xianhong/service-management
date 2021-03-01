import {  ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { TokenExpiredError } from 'jsonwebtoken';
import { ErrorTypes } from '../constants/error';
import { IS_PUBLIC_KEY } from '../decorators/auth.decorator';
import { ApiException } from '../utils/api.exception';
import { CommonCodes } from '../constants/code';
import { ExtractJwt } from 'passport-jwt';

@Injectable()
export class AuthorityGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context) {
    let isInvalid = false;
    if (err || info || !user) {
      if (info && info instanceof TokenExpiredError) {
        throw new ApiException({
          code: CommonCodes.TOKEN_EXPIRED,
          message: 'token已过期',
          error: ErrorTypes.UNAUTHORIZED,
        }, HttpStatus.UNAUTHORIZED);
      }
      isInvalid = true;
    } else {
      const req = context.getRequest();
      const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
      if (user.token !== token) {
        isInvalid = true;
      }
    }
    if (isInvalid) {
      throw new ApiException({
        code: CommonCodes.TOKEN_INVALID,
        message: '无效的token',
        error: ErrorTypes.UNAUTHORIZED,
      }, HttpStatus.UNAUTHORIZED);
    }
    return user;
  }
}
