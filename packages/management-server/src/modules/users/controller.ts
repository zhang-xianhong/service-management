import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UsersService } from './service';
import { QueryPipe, SearchQuery } from '../../shared/pipes/query';
import { isEmpty } from '../../shared/utils/validator';
import { ApiException } from '../../shared/utils/api.exception';
import { UserCodes } from '../../shared/constants/code';
@Controller('users')

export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get()
  async findAll(@Query(new QueryPipe()) query: SearchQuery) {
    console.log(query);
    const list = await this.usersService.findAll();
    return {
      list,
      count: 0,
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
}
