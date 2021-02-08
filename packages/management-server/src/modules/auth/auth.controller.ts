import { Controller, Get, Post, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { isPublic } from '../../shared/common/decorators/roles.decorator';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 登录测试
  @isPublic()
  @Post('/auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
  // 测试登录后才可访问的接口，在需要的地方使用守卫，可保证必须携带token才能访问
  @Get('me')
  getProfile(@Request() req) {
    return req.user;
  }
}
