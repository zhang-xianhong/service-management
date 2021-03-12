import { HttpStatus, Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
import { Repository, Connection, Not, ILike, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiException } from '../../shared/utils/api.exception';
import { CommonCodes } from '../../shared/constants/code';
import { ModelsInfoEntity } from './models-info.entity';
import { ModelsFieldsEntity } from './models-fields.entity';
import { PlainObject } from 'src/shared/pipes/query.pipe';
import { DataTypesEntity } from '../settings/settings-data-types.entity';
import { FIELD_TYPE, SYSTEM_FIELD_TYPES } from 'src/shared/constants/field-types';
@Injectable()
export class ModelsService {
  constructor(
    @Inject(Logger)
    private readonly logger: LoggerService,
    @InjectRepository(ModelsInfoEntity)
    private readonly infoRepository: Repository<ModelsInfoEntity>,
    @InjectRepository(ModelsFieldsEntity)
    private readonly fieldsRepository: Repository<ModelsFieldsEntity>,
    @InjectRepository(DataTypesEntity)
    private readonly dataTypesEntity: Repository<DataTypesEntity>,
    private connection: Connection,
  ) {}

  /**
   * 获取全部
   * @param query
   * @param getTotal
   */
  async findAll(query, getTotal = true) {
    const where: PlainObject = {
      isDelete: false,
    };
    if (query.classification) {
      where.classification = query.classification;
    }
    if (query.tags) {
      where.tags = ILike(`%${query.tags}%`);
    }
    if (query.keyword) {
      where.name = ILike(`%${query.keyword}%`);
    }
    const { conditions = {} } = query;
    conditions.where = where;
    if (query.getFields) {
      conditions.relations = ['fields'];
    }
    if (!getTotal) {
      conditions.select = ['id', 'name', 'description'];
      return await this.infoRepository.find(conditions);
    }
    return await this.infoRepository.findAndCount(conditions);
  }

  /**
   * 通过ID获取详情
   * @param id
   */
  async findById(id: number) {
    const model = await this.infoRepository.findOne({
      where: {
        id,
        isDelete: false,
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
  async create(data: PlainObject) {
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
      delete modelData.id;
      const model: any = await queryRunner.manager.save(this.infoRepository.create(modelData));
      const fieldsEntities = await this.createFieldsEntities(fields, model.id);
      // 生成新的fields
      if (fieldsEntities) {
        await queryRunner.manager.save(fieldsEntities);
      }
      await queryRunner.commitTransaction();
      return {
        modelId: model.id,
      };
    } catch (error) {
      this.logger.error(error);
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
  async updateModel(id: number, data: PlainObject) {
    const currentModel = await this.findModelById(id);
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
        version: currentModel.version + 1,
      });
      const fieldsEntities = await this.createFieldsEntities(fields, id);
      console.log(fieldsEntities);
      // 生成新的fields
      if (fieldsEntities) {
        await queryRunner.manager.save(fieldsEntities);
      }
      await queryRunner.commitTransaction();
      return {
        modelId: id,
      };
    } catch (error) {
      this.logger.error(error);
      await queryRunner.rollbackTransaction();
      throw new ApiException({
        code: CommonCodes.UPDATED_FAIL,
        message: '更新失败',
        stack: error.stack,
      });
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 删除模型
   * 支持批量删除
   * @param id
   */
  async deleteModel(deleteIds: string[]) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // 将关联fields设置为删除状态
      await queryRunner.manager.update(ModelsFieldsEntity, {
        modelId: In(deleteIds),
      }, {
        isDelete: true,
      });
      // 更新model为删除状态
      await queryRunner.manager.update(ModelsInfoEntity, {
        id: In(deleteIds),
      }, {
        isDelete: true,
      });
      await queryRunner.commitTransaction();
      return {
        deleted: deleteIds,
      };
    } catch (error) {
      this.logger.error(error);
      await queryRunner.rollbackTransaction();
      throw new ApiException({
        code: CommonCodes.DELETED_FAIL,
        message: '删除失败',
        stack: error.stack,
      });
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 通过ID查找模型
   * @param id
   */
  private async findModelById(id: number) {
    const model = await this.infoRepository.findOne({
      where: {
        id,
        isDelete: false,
      },
    });
    if (!model) {
      throw new ApiException({
        code: CommonCodes.NOT_FOUND,
        message: '模型不存在',
      });
    }
    return model;
  }

  /**
   * 获取字段类型列表
   */
  private async getDataTypes() {
    const dataTypes = await this.dataTypesEntity.find({
      isDelete: false,
    });
    return [...SYSTEM_FIELD_TYPES, ...dataTypes];
  }

  /**
   * 生成表字段
   * @param fields
   * @param modelId
   */
  private async createFieldsEntities(fields: Array<unknown>, modelId: number) {
    const fieldTypes = (await this.getDataTypes()) as FIELD_TYPE[];
    if (fields && Array.isArray(fields)) {
      const fieldsEntities = fields.map((field) => {
        const newField = { ...field };
        delete newField.id;
        const { typeId } = newField;
        const fieldType = fieldTypes.find(item => Number(item.id) === Number(typeId));
        if (!fieldType) {
          throw new ApiException({
            code: CommonCodes.PARAMETER_INVALID,
            message: '无效的字段类型',
          });
        }
        const { type, extra, length, isKey } = fieldType;
        return this.fieldsRepository.create({
          ...newField,
          type,
          extra,
          length,
          isKey,
          typeId,
          modelId,
        });
      });
      return fieldsEntities;
    }
    return null;
  }
}
