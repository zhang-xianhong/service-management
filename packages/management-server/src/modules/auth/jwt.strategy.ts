import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';
import { jwtConstants, REDIS_TOKEN_PREFIX } from './constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly redisService: RedisService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }


  async validate(payload: any) {
    const user = { ...payload };
    const redis = await this.redisService.getClient();
    const key = REDIS_TOKEN_PREFIX + user.uid;
    const redisToken = await redis.get(key);
    user.token = redisToken;
    return user;
  }
}
