import { Injectable } from '@nestjs/common';
import { Repository, Connection } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './entity';
import { ApiException } from '../../shared/utils/api.exception';
import { UserCodes } from '../../shared/constants/code';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
    private connection: Connection,
  ) {}

  async findAll() {
    return await this.usersRepository.find({ select: ['username', 'id'] });
  }

  async create(data) {
    const { username } = data;
    const user = await this.usersRepository.findOne({ where: { username } });
    if (user) {
      throw new ApiException({
        code: UserCodes.USERNAME_EXISTED,
        message: '该用户名已被注册',
      });
    }

    return await this.usersRepository.save(data);
  }
}
