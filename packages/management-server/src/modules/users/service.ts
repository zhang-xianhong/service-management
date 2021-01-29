import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository, Connection } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
    private connection: Connection,
  ) {}

  async findAll() {
    // throw 123;
    throw ReferenceError('123');
    // throw new HttpException({
    //   message: '该用户名已被注册',
    //   error: '无效的参数.',
    //   code: 50000,
    // }, HttpStatus.BAD_REQUEST);
    // return await this.usersRepository.find({ select: ['username', 'id'] });
  }

  async create(data) {
    const { username } = data;
    const user = await this.usersRepository.findOne({ where: { username } });
    if (user) {
      throw new HttpException({
        message: '该用户名已被注册',
        error: '无效的参数.',
      }, HttpStatus.BAD_REQUEST);
    }

    return await this.usersRepository.save(data);
  }
}
