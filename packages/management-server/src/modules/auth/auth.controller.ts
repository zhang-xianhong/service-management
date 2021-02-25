import { Controller, Request, Post, UseGuards, Get } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { RedisService } from 'nestjs-redis';
import { Public } from '../../shared/decorators/auth.decorator';
import { REDIS_TOKEN_PREFIX } from './constants';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}
  @Public()
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    const { user } = req;
    const payload = { username: user.username, uid: user.id };
    const expiresIn = 1 * 60 * 60 * 1000; // 一小时过期
    const token = this.jwtService.sign(payload, {
      expiresIn,
    });
    const redis = await this.redisService.getClient();
    const key = REDIS_TOKEN_PREFIX + user.id;
    await redis.setex(key, expiresIn / 1000, token);
    return {
      token,
      expiresIn,
      type: 'Bearer',
    };
  }

  /**
   * 退出登录
   * @param req
   */
  @Post('logout')
  async logout(@Request() req) {
    const { user } = req;
    const redis = await this.redisService.getClient();
    const key = REDIS_TOKEN_PREFIX + user.uid;
    const res = await redis.del(key);
    if (res === 1) {
      return null;
    }
    throw new Error('退出失败');
  }


  @Get('me')
  async getTokenInfo() {}
}
