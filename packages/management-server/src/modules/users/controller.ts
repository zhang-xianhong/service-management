import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UsersService } from './service';
import { QueryPipe, SearchQuery } from '../../shared/pipes/query';
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
    return await this.usersService.create(postData);
  }
}
