import { Injectable } from '@nestjs/common';
import { Repository, Connection } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ColumnsEntity } from './settings-columns.entity';
import { DictionariesEntity } from './settings-dictionaries.entity';
import { DataTypesEntity } from './settings-data-types.entity';
import { ApiException } from '../../shared/utils/api.exception';
import { CommonCodes } from '../../shared/constants/code';

@Injectable()
export class SettingsService {
  constructor(
    private connection: Connection,
    @InjectRepository(ColumnsEntity)
    private readonly columnRepository: Repository<ColumnsEntity>,
    @InjectRepository(DictionariesEntity)
    private readonly dictionaryRepository: Repository<DictionariesEntity>,
    @InjectRepository(DataTypesEntity)
    private readonly dataTypesRepository: Repository<DataTypesEntity>,
  ) {}

  // 创建数据类型
  async createDataType({ name, value, description, length }) {
    const valueExisted = await this.dataTypesRepository.findOne({
      where: {
        value,
      },
    });
    if (valueExisted) {
      throw new ApiException({
        code: CommonCodes.DATA_EXISTED,
        message: `value [ ${value} ] 已存在`,
      });
    }
    return (await this.dataTypesRepository.save({
      name,
      value,
      description,
      length,
    }));
  }

  async findDataTypes() {
    return (await this.dataTypesRepository.find());
  }
}
