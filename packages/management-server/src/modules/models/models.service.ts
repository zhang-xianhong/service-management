import { HttpStatus, Injectable } from '@nestjs/common';
import { Repository, Connection } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiException } from '../../shared/utils/api.exception';
import { CommonCodes } from '../../shared/constants/code';
import { ModelsInfoEntity } from './models-info.entity';
import { ModelsFieldsEntity } from './models-fields.entity';

@Injectable()
export class ModelsService {
  constructor(
    @InjectRepository(ModelsInfoEntity)
    private readonly infoRepository: Repository<ModelsInfoEntity>,
    @InjectRepository(ModelsFieldsEntity)
    private readonly fieldsRepository: Repository<ModelsFieldsEntity>,
    private connection: Connection,
  ) {}


  async findAll(query) {
    const where = {
      isDelete: 0,
    };
    const total = this.infoRepository.count({
      where,
    });
    const list =  this.infoRepository.find({
      ...query,
      where,
    });
    return await Promise.all([total, list]);
  }

  async findAllList(query) {
    const where = {
      isDelete: 0,
    };
    const list = await this.infoRepository.find({
      ...query,
      where,
    });
    return list;
  }

  /**
   * 通过ID获取详情
   * @param id
   */
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
      // 验证是否有同名模块
      const nameExisted = await this.infoRepository.findOne({
        where: {
          name: modelData.name,
        },
      });
      if (nameExisted) {
        throw new ApiException({
          code: CommonCodes.DATA_EXISTED,
          message: '模型名称已存在',
        });
      }
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
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new ApiException({
        code: CommonCodes.CREATED_FAIL,
        message: '创建失败',
      });
    } finally {
      await queryRunner.release();
    }
  }
}
