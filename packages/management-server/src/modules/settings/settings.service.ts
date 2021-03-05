import { Injectable } from '@nestjs/common';
import { Repository, Connection, ILike } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DataTypesEntity } from './settings-data-types.entity';
import { SettingsTagsEntity } from './settings-tags.entity';
import { PlainObject } from 'src/shared/pipes/query.pipe';
import { ApiException } from 'src/shared/utils/api.exception';
import { CommonCodes } from 'src/shared/constants/code';

@Injectable()
export class SettingsService {
  constructor(
    private connection: Connection,
    @InjectRepository(DataTypesEntity)
    private readonly dataTypesRepository: Repository<DataTypesEntity>,
    @InjectRepository(SettingsTagsEntity)
    private readonly tagsRepository: Repository<SettingsTagsEntity>,
  ) {}

  async findDataTypes() {
    return (await this.dataTypesRepository.find({
      isDelete: false,
    }));
  }

  /**
   * 获取全部
   * @param query
   * @param getTotal
   */
  async findAllTags(query, getTotal = true) {
    const where: PlainObject = {
      isDelete: false,
    };
    if (query.keyword) {
      where.name = ILike(`%${query.keyword}%`);
    }
    if (!getTotal) {
      return await this.tagsRepository.find(where);
    }
    const { conditions } = query;
    conditions.where = where;
    return await this.tagsRepository.findAndCount(conditions);
  }

  /**
   * 创建标签
   * @param postData
   */
  async createTag(postData) {
    const nameExisted = await this.tagsRepository.findOne({
      name: postData.name,
      isDelete: false,
    });
    if (nameExisted) {
      throw new ApiException({
        code: CommonCodes.DATA_EXISTED,
        message: '标签名称已存在',
      });
    }
    const res = await this.tagsRepository.save(postData);
    return {
      tagId: res.id,
    };
  }
}
