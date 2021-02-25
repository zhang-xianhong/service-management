import { HttpStatus, Injectable } from '@nestjs/common';
import { Repository, Connection } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiException } from '../../shared/utils/api.exception';
import { CommonCodes } from '../../shared/constants/code';
import { ModelInfoEntity } from './model-info.entity';
import { ModelFieldsEntity } from './model-fields.entity';

@Injectable()
export class ModelService {
  constructor(
    @InjectRepository(ModelInfoEntity)
    private readonly infoRepository: Repository<ModelInfoEntity>,
    @InjectRepository(ModelFieldsEntity)
    private readonly fieldsRepository: Repository<ModelFieldsEntity>,
    private connection: Connection,
  ) {}


  async findById(id: number) {
    const model = await this.infoRepository.findOne({
      where: {
        id,
      },
      relations: ['fields'],
    });
    if (!model) {
      throw new ApiException({
        code: CommonCodes.NOT_FOUND,
        message: '模型不存在',
      }, HttpStatus.NOT_FOUND);
    }
    return model;
  }

  async create(data) {
    const { fields, ...modelData } = data;
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const model: any = await queryRunner.manager.save(this.infoRepository.create(modelData));
      if (fields && Array.isArray(fields)) {
        const fieldsEntities = fields.map(field => this.fieldsRepository.create({
          ...field,
          modelId: model.id,
        }));
        await queryRunner.manager.save(fieldsEntities);
      }
      await queryRunner.commitTransaction();
      return {
        modelId: model.id,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new ApiException({
        code: CommonCodes.CREATED_FAIL,
        message: '创建失败',
      });
    } finally {
      await queryRunner.release();
    }
  }

  // /**
  //  * 创建模型字段
  //  * @param data
  //  */
  // async createField(data) {
  //   const { modelId } = data;
  //   const model = await this.infoRepository.findOne(modelId, {
  //     where: {
  //       isDelete: 0,
  //     },
  //   });
  //   if (!model) {
  //     throw new ApiException({
  //       code: CommonCodes.NOT_FOUND,
  //       message: '模型不存在',
  //     }, HttpStatus.NOT_FOUND);
  //   }
  //   return await this.fieldsRepository.save(data);
  // }
}
