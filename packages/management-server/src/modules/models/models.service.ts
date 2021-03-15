import { HttpStatus, Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
import { ApiException } from '../../shared/utils/api.exception';
import { CommonCodes } from '../../shared/constants/code';
import { ModelsInfoModel } from './models-info.entity';
import { ModelsFieldsModel } from './models-fields.entity';
import { PlainObject } from 'src/shared/pipes/query.pipe';
import { DataTypesModel } from '../settings/settings-data-types.entity';
import { FIELD_TYPE, SYSTEM_FIELD_TYPES } from 'src/shared/constants/field-types';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize } from 'sequelize';
@Injectable()
export class ModelsService {
  constructor(
    @Inject(Logger)
    private readonly logger: LoggerService,
    private sequelize: Sequelize,
    @InjectModel(ModelsInfoModel) private readonly infoRepository: typeof ModelsInfoModel,
    @InjectModel(ModelsFieldsModel) private readonly fieldsRepository: typeof ModelsFieldsModel,
    @InjectModel(DataTypesModel) private readonly dataTypesRepository: typeof DataTypesModel,
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
      where.tags = {
        [Op.like]: `%${query.tags}%`,
      };
    }
    if (query.keyword) {
      where.name = {
        [Op.like]: `%${query.keyword}%`,
      };
    }
    const { conditions = {} } = query;
    conditions.where = where;
    if (query.getFields) {
      conditions.relations = ['fields'];
    }
    if (!getTotal) {
      conditions.select = ['id', 'name', 'description'];
      return await this.infoRepository.findAll(conditions);
    }
    return await this.infoRepository.findAndCountAll(conditions);
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
      include: [{
        model: ModelsFieldsModel,
        attributes: { exclude: ['isDelete'] },
      }],
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
    const transaction = await this.sequelize.transaction();
    try {
      delete modelData.id;
      const model: any = await this.infoRepository.create(modelData, {
        transaction,
      });
      const fieldsEntities = await this.createFieldsEntities(fields, model.id);
      // 生成新的fields
      if (fieldsEntities) {
        await this.fieldsRepository.create(fieldsEntities, {
          transaction,
        });
      }
      await transaction.commit();
      return {
        modelId: model.id,
      };
    } catch (error) {
      await transaction.rollback();
      this.logger.error(error);
      throw new ApiException({
        code: CommonCodes.UPDATED_FAIL,
        message: '新增失败',
        stack: error.stack,
      });
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
        id: { [Op.notIn]: id },
      },
    });
    if (nameExisted) {
      throw new ApiException({
        code: CommonCodes.DATA_EXISTED,
        message: '模型名称已存在',
      });
    }

    const transaction = await this.sequelize.transaction();
    try {
      // 删除原有的fields
      await this.fieldsRepository.destroy({
        where: { modelId: id },
        transaction,
      });
      // 更新model
      await this.fieldsRepository.update({
        ...modelData,
        updateTime: new Date(),
        version: currentModel.version + 1,
      }, {
        where: { id },
        transaction });
      const fieldsEntities = await this.createFieldsEntities(fields, id);
      // 生成新的fields
      if (fieldsEntities) {
        await this.fieldsRepository.create(fieldsEntities, {
          transaction,
        });
      }
      await transaction.commit();
      return {
        modelId: id,
      };
    } catch (error) {
      this.logger.error(error);
      throw new ApiException({
        code: CommonCodes.UPDATED_FAIL,
        message: '更新失败',
        stack: error.stack,
      });
    }
  }

  /**
   * 删除模型
   * 支持批量删除
   * @param id
   */
  async deleteModel(deleteIds: string[]) {
    const transaction = await this.sequelize.transaction();
    try {
      // 将关联fields设置为删除状态
      await this.fieldsRepository.update({
        isDelete: true,
      }, {
        where: {
          modelId: {
            [Op.in]: deleteIds,
          },
        },
        transaction,
      });

      // 更新model为删除状态
      await this.infoRepository.update({
        isDelete: true,
      }, {
        where: {
          id: {
            [Op.in]: deleteIds,
          },
        },
        transaction,
      });
      await transaction.commit();
      return {
        deleted: deleteIds,
      };
    } catch (error) {
      this.logger.error(error);
      await transaction.rollback();
      throw new ApiException({
        code: CommonCodes.DELETED_FAIL,
        message: '删除失败',
        stack: error.stack,
      });
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
    const dataTypes = await this.dataTypesRepository.findAll({
      where: {
        isDelete: false,
      },
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
      const fieldsEntities = fields.map((field: any) => {
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
