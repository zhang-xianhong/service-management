import { HttpStatus, Injectable } from '@nestjs/common';
import { Repository, Connection } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiException } from '../../shared/utils/api.exception';
import { CommonCodes } from '../../shared/constants/code';
import { ServicesEntity } from './services.entity';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(ServicesEntity)
    private readonly repository: Repository<ServicesEntity>,
    private connection: Connection,
  ) {}


  async findById(id: number) {
    const model = await this.repository.findOne({
      where: {
        id,
      },
    });
    if (!model) {
      throw new ApiException({
        code: CommonCodes.NOT_FOUND,
        message: '服务不存在',
      }, HttpStatus.NOT_FOUND);
    }
    return model;
  }
}
