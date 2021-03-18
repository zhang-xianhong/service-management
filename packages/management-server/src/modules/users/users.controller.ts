import { Body, Controller, Get, Param, Post, Query, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { QueryPipe, SearchQuery } from '../../shared/pipes/query.pipe';
import { isEmpty } from '../../shared/utils/validator';
import { ApiException } from '../../shared/utils/api.exception';
import { UserCodes } from '../../shared/constants/code';
@Controller('users')

export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * 获取个人信息
   * @param req
   */
  @Get('me')
  async findOneByToken(@Request() req) {
    const { user } = req;
    const res = await this.usersService.findById(user.uid);
    return res;
  }

  /**
   * 获取指定用户信息
   * @param param0
   */
  @Get(':id')
  async findOneById(@Param() { id }) {
    const res = await this.usersService.findById(Number(id));
    return res;
  }

  @Get()
  async findAll(@Query(new QueryPipe()) query: SearchQuery) {
    const { count, rows } = await this.usersService.findAll(query);
    return {
      list: rows,
      total: count,
    };
  }

  @Post()
  async create(@Body() postData) {
    const { username, password } = postData;
    if (isEmpty(username)) {
      throw new ApiException({
        code: UserCodes.USERNAME_INVALID,
        message: '名称不能为空',
      });
    }
    if (isEmpty(password)) {
      throw new ApiException({
        code: UserCodes.PASSWORD_INVALID,
        message: '密码不能为空',
      });
    }
    return await this.usersService.create(postData);
  }

  @Post('login')
  async login(@Body() postData) {
    const { username, password } = postData;
    if (isEmpty(username)) {
      throw new ApiException({
        code: UserCodes.USERNAME_INVALID,
        message: '名称不能为空',
      });
    }
    if (isEmpty(password)) {
      throw new ApiException({
        code: UserCodes.PASSWORD_INVALID,
        message: '密码不能为空',
      });
    }
    return await this.usersService.login({ username, password });
  }
}
