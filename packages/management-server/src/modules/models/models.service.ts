import { HttpStatus, Injectable } from '@nestjs/common';
import { Repository, Connection, Not } from 'typeorm';
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

  /**
   * 获取全部
   * @param query
   * @param getTotal
   */
  async findAll(query, getTotal = true) {
    const where = {
      isDelete: 0,
    };
    if (getTotal) {
      return await this.infoRepository.findAndCount({
        ...query,
        where,
      });
    }
    return await this.infoRepository.find({
      ...query,
      where,
    });
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

  /**
   * 创建模型
   * @param data
   */
  async create(data) {
    const { fields, ...modelData } = data;
    // 验证是否有同名模块
    const nameExisted = await this.infoRepository.findOne({
      where: {
        name: modelData.name,
        isDelete: false,
      },
    });
    if (nameExisted) {
      throw new ApiException({
        code: CommonCodes.DATA_EXISTED,
        message: '模型名称已存在',
      });
    }
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
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new ApiException({
        code: CommonCodes.CREATED_FAIL,
        message: '创建失败',
        stack: error.stack,
      });
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 更新模型
   * @param data
   */
  async updateModel(id, data) {
    const modelExisted = await this.infoRepository.findOne({
      where: {
        id,
        isDelete: false,
      },
    });
    if (!modelExisted) {
      throw new ApiException({
        code: CommonCodes.NOT_FOUND,
        message: '模型不存在',
      });
    }
    const { fields, ...modelData } = data;
    // 验证是否有同名模块
    const nameExisted = await this.infoRepository.findOne({
      where: {
        name: modelData.name,
        isDelete: false,
        id: Not(id),
      },
    });
    if (nameExisted) {
      throw new ApiException({
        code: CommonCodes.DATA_EXISTED,
        message: '模型名称已存在',
      });
    }

    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 删除原有的fields
      await queryRunner.manager.delete(ModelsFieldsEntity, {
        modelId: id,
      });
      // 更新model
      await queryRunner.manager.update(ModelsInfoEntity, id, {
        ...modelData,
        updateTime: new Date(),
      });
      // 生成新的fields
      if (fields && Array.isArray(fields)) {
        const fieldsEntities = fields.map(field => this.fieldsRepository.create({
          ...field,
          modelId: id,
        }));
        await queryRunner.manager.save(fieldsEntities);
      }
      await queryRunner.commitTransaction();
      return {
        modelId: id,
      };
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new ApiException({
        code: CommonCodes.CREATED_FAIL,
        message: '更新失败',
        stack: error.stack,
      });
    } finally {
      await queryRunner.release();
    }
  }
}
