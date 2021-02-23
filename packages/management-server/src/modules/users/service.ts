import { HttpStatus, Injectable } from '@nestjs/common';
import { Repository, Connection } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './entity';
import { ApiException } from '../../shared/utils/api.exception';
import { CommonCodes, UserCodes } from '../../shared/constants/code';
import { genPassword, validPassword } from '../../shared/utils/password';

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

  async findBy(where: object) {
    return await this.usersRepository.findOne({ where });
  }

  async findById(id: number) {
    const user = await this.findBy({ id });
    if (!user) {
      throw new ApiException({
        code: CommonCodes.NOT_FOUND,
        message: '用户不存在',
      }, HttpStatus.NOT_FOUND);
    }
    delete user.salt;
    delete user.hash;
    return user;
  }

  async create(data) {
    const { username, password } = data;
    const usernameExisted = await this.findBy({ username });
    if (usernameExisted) {
      throw new ApiException({
        code: UserCodes.USERNAME_EXISTED,
        message: '该用户名已被注册',
      });
    }
    const saveData = { ...data };
    const { hash, salt } = genPassword(password);
    saveData.hash = hash;
    saveData.salt = salt;
    const res = await this.usersRepository.save(saveData);
    return {
      id: res.id,
    };
  }

  async login({ username, password }) {
    const user = await this.findBy({ username });
    // 用户不存在或者密码校验失败，都提示用户名密码错误
    const isError = !user || !validPassword(password, user.hash, user.salt);
    if (isError) {
      throw new ApiException({
        code: UserCodes.LOGIN_INVALID,
        message: '用户名或密码错误',
      });
    }
    return {
      id: user.id,
      username: user.username,
    };
  }
}
