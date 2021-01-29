import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './service';
@Controller('users')

export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get()
  async findAll() {
    const list = await this.usersService.findAll();
    return {
      list,
      count: 0,
    };
  }
  @Post()
  async create(@Body() postData = {}) {
    return await this.usersService.create(postData);
  }
}
