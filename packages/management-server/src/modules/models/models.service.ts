import { Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
import { ApiException } from '../../shared/utils/api.exception';
import { CommonCodes } from '../../shared/constants/code';
import { ModelsInfoModel } from './models-info.model';
import { ModelsFieldsModel } from './models-fields.model';
import { DataTypesModel } from '../settings/settings-data-types.model';
import { DEFAULT_FIELDS, FIELD_TYPE, FIELD_TYPES, FIELD_UUID_NAME } from 'src/shared/constants/field-types';
import { InjectModel } from '@nestjs/sequelize';
import sequelize, { Op, Sequelize } from 'sequelize';
import { ModelInfoDto } from './dto/model-info.dto';
import { Created, Deleted, Rows, Updated } from 'src/shared/types/response';
import { ErrorTypes } from 'src/shared/constants/error';
import { ServicesInfoModel } from '../services/service-info.model';
import { ModelFieldDto } from './dto/model-field.dto';
import { ModelRelationDto } from './dto/model-relation.dto';
import { ModelsRelationModel } from './models-relation.model';
import { lowerCamelToUpperCamel } from 'src/shared/utils/util';

@Injectable()
export class ModelsService {
  constructor(
    @Inject(Logger)
    private readonly logger: LoggerService,
    private sequelize: Sequelize,
    @InjectModel(ModelsInfoModel) private readonly infoRepository: typeof ModelsInfoModel,
    @InjectModel(ModelsFieldsModel) private readonly fieldsRepository: typeof ModelsFieldsModel,
    @InjectModel(ModelsRelationModel) private readonly relationRepository: typeof ModelsRelationModel,
    @InjectModel(DataTypesModel) private readonly dataTypesRepository: typeof DataTypesModel,
    @InjectModel(ServicesInfoModel) private readonly serviceRepository: typeof ServicesInfoModel,
  ) {}

  /**
   * 创建模型
   * @param postData
   * @returns
   */
  async createdModel(postData: ModelInfoDto): Promise<Created> {
    const { name, serviceId } = postData;
    const existModel: ModelsInfoModel = await this.infoRepository.findOne({
      where: {
        name,
        isDelete: false,
      },
    });
    if (existModel) {
      throw new ApiException({
        code: CommonCodes.DATA_EXISTED,
        message: `名称[${name}]已存在`,
      });
    }
    const service: ServicesInfoModel = await this.serviceRepository.findOne({
      where: {
        id: serviceId,
        isDelete: false,
      },
    });
    if (!service) {
      throw new ApiException({
        code: CommonCodes.NOT_FOUND,
        message: 'service不存在',
        error: ErrorTypes.NOT_FOUND,
      });
    }
    const transaction = await this.sequelize.transaction();
    try {
      const res: ModelsInfoModel = await this.infoRepository.create(postData, {
        transaction,
      });
      // 生成默认字段
      await this.createModelDefaultFields(res.id, transaction);
      // 生成配置
      await transaction.commit();
      return {
        id: res.id,
      };
    } catch (error) {
      this.logger.error(error);
      await transaction.rollback();
      throw new ApiException({
        code: CommonCodes.CREATED_FAIL,
        message: '创建失败',
        error,
      });
    }
  }


  /**
   * 通过服务ID获取模型列表
   * @param serviceId
   * @returns
   */
  async findModelsByServiceId(serviceId: number): Promise<{
    models: Rows<ModelsInfoModel>,
    relations: Rows<ModelsRelationModel>
  }> {
    const modelsPromise = this.infoRepository.findAll({
      where: {
        serviceId,
        isDelete: false,
      },
      include: [{
        model: ModelsFieldsModel,
        required: false,
        where: {
          isDelete: false,
        },
        attributes: { exclude: ['isDelete'] },
      }],
    });
    const relationsPromise = this.relationRepository.findAll({
      where: {
        serviceId,
        isDelete: false,
      },
    });

    const [models, relations] = await Promise.all([modelsPromise, relationsPromise]);
    return {
      models,
      relations,
    };
  }


  /**
   * 更新模型
   * @param param0
   * @param id
   * @returns
   */
  async updateModel({ serviceId, ...postData }: ModelInfoDto, id: number): Promise<Updated> {
    const existModel: ModelsInfoModel = await this.infoRepository.findOne({
      where: {
        name: postData.name,
        isDelete: false,
        id: {
          [Op.not]: id,
        },
      },
    });

    if (existModel) {
      throw new ApiException({
        code: CommonCodes.DATA_EXISTED,
        message: `名称[${postData.name}]已存在`,
      });
    }

    await this.infoRepository.update({
      ...postData,
      // 更新版本号和时间
      version: sequelize.literal('version + 1'),
      updateTime: new Date(),
    }, {
      where: {
        id,
        isDelete: false,
      },
    });

    return {
      id,
    };
  }


  /**
   * 删除服务的同时删除Model和相应的Fields
   * 此操作在事务中执行
   * @param serviceId
   * @param transaction
   * @returns
   */
  async deleteModelsByServiceId(serviceId: number, transaction: sequelize.Transaction) {
    const models: Array<{id: number}> = await this.infoRepository.findAll({
      where: {
        serviceId,
      },
      attributes: ['id'],
      transaction,
    });
    const modelIds = models.map(model => model.id);
    const deleteModels = this.infoRepository.update({
      isDelete: true,
    }, {
      where: {
        id: {
          [Op.in]: modelIds,
        },
      },
      transaction,
    });
    const deleteFields = this.fieldsRepository.update({
      isDelete: true,
    }, {
      where: {
        modelId: {
          [Op.in]: modelIds,
        },
      },
      transaction,
    });
    return await Promise.all([deleteModels, deleteFields]);
  }


  /**
   * 删除模型(支持批量)
   * @param modelIds
   * @returns
   */
  async deleteModel(modelIds: number[]): Promise<Deleted> {
    const transaction = await this.sequelize.transaction();
    try {
      await this.infoRepository.update({
        isDelete: true,
      }, {
        where: {
          id: {
            [Op.in]: modelIds,
          },
        },
        transaction,
      });
      await this.fieldsRepository.update({
        isDelete: true,
      }, {
        where: {
          modelId: {
            [Op.in]: modelIds,
          },
        },
        transaction,
      });
      await transaction.commit();
      return {
        ids: modelIds,
      };
    } catch (error) {
      this.logger.error(error);
      await transaction.rollback();
      throw new ApiException({
        code: CommonCodes.DELETED_FAIL,
        message: '删除失败',
      });
    }
  }


  /**
   * 更新或创建字段
   * @param modelId
   * @param fields
   * @returns
   */
  async updateOrCreateFields(modelId: number, fields: ModelFieldDto[]): Promise<ModelsFieldsModel[]> {
    // 创建或更新模型字段
    const newFields = fields.filter(field => field.name !== FIELD_UUID_NAME);
    // 查找是否存在名称冲突的字段
    const currentFields: ModelsFieldsModel[] = await this.fieldsRepository.findAll({
      where: {
        modelId,
      },
      raw: true,
    });
    let conflictName = '';
    const hasNameConflictField: boolean = newFields.some((field) => {
      const sameNameField = currentFields.find(item => item.name === field.name);
      if (sameNameField && Number(field.id) !== Number(sameNameField.id)) {
        conflictName = field.name;
        return true;
      }
      return false;
    });
    if (hasNameConflictField) {
      throw new ApiException({
        code: CommonCodes.DATA_EXISTED,
        message: `名称[${conflictName}]已存在`,
      });
    }
    const fieldsEntities: ModelsFieldsModel[] = await this.createFieldsEntities(newFields, modelId);
    const res: ModelsFieldsModel[] = await this.fieldsRepository.bulkCreate(fieldsEntities, {
      updateOnDuplicate: ['id'],
    });
    return res;
  }

  /**
   * 创建模型关系
   * @param postData
   * @returns
   */
  async createModelRelation(postData: ModelRelationDto): Promise<Created> {
    const transaction = await this.sequelize.transaction();
    try {
      const foreignKey = (await
      this.createModelRelationForeignKey(postData.fromModelId, postData.toModelId, transaction));
      const res = await this.relationRepository.create({
        ...postData,
        byFieldId: foreignKey,
      });
      await transaction.commit();
      return {
        id: res.id,
      };
    } catch (error) {
      this.logger.error(error);
      await transaction.rollback();
      throw new ApiException({
        code: CommonCodes.CREATED_FAIL,
        message: '生成关联关系失败',
        error,
      });
    }
  }


  /**
   * 更新模型关系
   * @param relationId
   * @param postData
   * @returns
   */
  async updateModelRelation(relationId: number,  postData: ModelRelationDto): Promise<Updated> {
    const transaction = await this.sequelize.transaction();
    try {
      const foreignKey = (await
      this.createModelRelationForeignKey(postData.fromModelId, postData.toModelId, transaction));
      await this.relationRepository.update({
        ...postData,
        byFieldId: foreignKey,
      }, {
        where: {
          id: relationId,
        },
      });
      await transaction.commit();
      return {
        id: relationId,
      };
    } catch (error) {
      this.logger.error(error);
      await transaction.rollback();
      throw new ApiException({
        code: CommonCodes.UPDATED_FAIL,
        message: '更新关联关系失败',
        error,
      });
    }
  }


  /**
   * 删除模型关系
   * @param ids
   * @returns
   */
  async deleteModelRelations(ids: number[]): Promise<Deleted> {
    await this.relationRepository.destroy({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
    });
    return {
      ids,
    };
  }


  /**
   * 获取字段类型列表
   */
  private async getDataTypes(isSystem?: boolean) {
    const where: sequelize.WhereOptions = {
      isDelete: false,
    };
    if (typeof isSystem === 'boolean') {
      where.isSystem = isSystem;
    }
    const dataTypes = await this.dataTypesRepository.findAll({
      where,
      raw: true,
    });
    return dataTypes;
  }


  /**
   * 创建模型的默认字段
   * @param modelId
   * @param transaction
   */
  private async createModelDefaultFields(modelId: number, transaction?: sequelize.Transaction): Promise<void>  {
    const fieldTypes: DataTypesModel[] = await this.getDataTypes(true);
    const genFields = DEFAULT_FIELDS.map((field) => {
      const { type, ...keepFields } = field;
      const filedType = fieldTypes.find(item => item.name === type);
      return {
        ...keepFields,
        typeId: filedType.id,
      };
    });
    const fieldsEntities: ModelsFieldsModel[] = await this.createFieldsEntities(genFields, modelId, fieldTypes);
    await this.fieldsRepository.bulkCreate(fieldsEntities, {
      transaction,
    });
  };

  /**
   * 生成表字段
   * @param fields
   * @param modelId
   * @param fieldTypes
   * @returns
   */
  private async createFieldsEntities(fields: Array<unknown>, modelId: number, fieldTypes?: FIELD_TYPE[]):
  Promise<ModelsFieldsModel[]> {
    if (!fieldTypes) {
      // eslint-disable-next-line no-param-reassign
      fieldTypes = await this.getDataTypes();
    }
    const fieldsEntities = fields.map((field: any) => {
      const { typeId } = field;
      const fieldType = fieldTypes.find(item => Number(item.id) === Number(typeId));
      if (!fieldType) {
        throw new ApiException({
          code: CommonCodes.PARAMETER_INVALID,
          message: '无效的字段类型',
        });
      }
      const { type, length } = fieldType;
      return {
        ...field,
        type,
        length,
        typeId,
        modelId,
      };
    });
    return fieldsEntities;
  }

  /**
   * 通过模型ID查找model
   * @param id
   * @returns
   */
  private async findModelById(id: number): Promise<ModelsInfoModel> {
    const model: ModelsInfoModel = await this.infoRepository.findOne({
      where: {
        id,
        isDelete: false,
      },
    });
    if (!model) {
      throw new ApiException({
        code: CommonCodes.NOT_FOUND,
        message: `模型[${id}]不存在`,
        error: ErrorTypes.NOT_FOUND,
      });
    }
    return model;
  }

  /**
   * 创建模型关联外键
   * @param fromId
   * @param toId
   * @param transaction
   * @returns
   */
  private async createModelRelationForeignKey(fromId: number, toId: number, transaction: sequelize.Transaction):
  Promise<string> {
    const [fromModel, toModel] = await Promise.all([this.findModelById(fromId), this.findModelById(toId)]);
    // 外键名称
    const foreignKey = `ref${lowerCamelToUpperCamel(toModel.name)}Id`;
    // 生成外键
    const foreignKeyField: ModelsFieldsModel = await this.fieldsRepository.findOne({
      where: {
        name: foreignKey,
        isDelete: false,
      },
      transaction,
    });
    if (!foreignKeyField) {
      // 生成外键
      const foreignKeyFieldEntity: FIELD_TYPE = {
        name: foreignKey,
        description: `模型”${fromModel.name}“ - ”${toModel.name}“间外键`,
        isSystem: true,
        type: FIELD_TYPES.LONG,
        length: 20,
        typeId: 0,
      };
      await this.fieldsRepository.create({
        ...foreignKeyFieldEntity,
        modelId: fromModel.id,
      }, {
        transaction,
      });
    } else if (foreignKeyField.isDelete) {
      await this.fieldsRepository.update({
        isDelete: false,
      }, {
        where: {
          id: foreignKeyField.id,
        },
        transaction,
      });
    }

    return foreignKey;
  }
}
