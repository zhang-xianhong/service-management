import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UsersService } from '../users/service';
import { AuthService } from './service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService, private readonly usersService: UsersService) {
    super();
  }

  /**
   * 校验
   * @param username
   * @param password
   */
  async validate(username: string, password: string): Promise<any> {
    const user = await this.usersService.login({ username, password });
    return user;
  }
}
