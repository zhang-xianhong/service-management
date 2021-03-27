import { forwardRef, HttpStatus, Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import sequelize, { Op, Sequelize } from 'sequelize';
import { ApiException } from 'src/shared/utils/api.exception';
import { CommonCodes } from 'src/shared/constants/code';
import { FIELD_UUID, FIELD_UUID_NAME } from 'src/shared/constants/field-types';
import { Created, Deleted, Rows, Updated } from 'src/shared/types/response';
import { ErrorTypes } from 'src/shared/constants/error';
import { lowerCamelToUpperCamel } from 'src/shared/utils/util';
import { DataTypesModel } from '../settings/settings-data-types.model';
import { ModelsInfoModel } from './models-info.model';
import { ModelsFieldsModel } from './models-fields.model';
import { ServicesInfoModel } from '../services/service-info.model';
import { ModelsRelationModel } from './models-relation.model';
import { ModelInfoDto } from './dto/model-info.dto';
import { ModelFieldDto } from './dto/model-field.dto';
import { ModelRelationDto } from './dto/model-relation.dto';
import { PlainObject } from 'src/shared/pipes/query.pipe';
import { ServicesService } from '../services/services.service';
import { isNumeric } from 'src/shared/utils/validator';

@Injectable()
export class ModelsService {
  constructor(
    @Inject(Logger)
    private readonly logger: LoggerService,
    @Inject(forwardRef(() => ServicesService))
    private servicesService: ServicesService,
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
      await this.servicesService.addServiceDefaultApis(serviceId, res, transaction);
      await transaction.commit();
      return {
        id: res.id,
      };
    } catch (error) {
      this.logger.error(error);
      await transaction.rollback();
      if (error instanceof ApiException) {
        throw error;
      }
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
   * 删除服务的同时删除Model和相应的Fields和relation
   * 此操作在事务中执行
   * @param serviceId
   * @param transaction
   * @returns
   */
  async deleteModelsByServiceId(serviceId: number, transaction: sequelize.Transaction): Promise<any> {
    const models: Array<{id: number}> = await this.infoRepository.findAll({
      where: {
        serviceId,
      },
      attributes: ['id'],
      transaction,
    });
    const modelIds: number[] = models.map(model => model.id);
    // 不需要单独提交事务
    const unNeedTransaction = true;
    return this.deleteModel(modelIds, transaction, unNeedTransaction);
  }


  /**
   * 删除模型(支持批量)
   * @param modelIds
   * @returns
   */
  async deleteModel(
    modelIds: number[],
    transactionArg?: sequelize.Transaction,
    unNeedTransaction?: Boolean,
  ): Promise<Deleted> {
    const transaction = transactionArg ||  await this.sequelize.transaction();
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
      await this.relationRepository.update({
        isDelete: true,
      }, {
        where: {
          [Op.or]: [
            {
              fromModelId: {
                [Op.in]: modelIds,
              },
            },
            {
              toModelId: {
                [Op.in]: modelIds,
              },
            },
          ],
        },
        transaction,
      });
      await Promise.all(modelIds.map(modelId => this.servicesService.deleteServiceApis(modelId, transaction)));
      !unNeedTransaction && await transaction.commit();
      return {
        ids: modelIds,
      };
    } catch (error) {
      this.logger.error(error);
      !unNeedTransaction && await transaction.rollback();
      if (error instanceof ApiException) {
        throw error;
      }
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
  async updateOrCreateFields(modelId: number, fields: ModelFieldDto[]): Promise<number[]> {
    const currentFields: ModelsFieldsModel[] = await this.fieldsRepository.findAll({
      where: {
        modelId,
      },
    });
    // 是否与系统字段冲突
    let conflictName = '';
    const hasNameConflictField: boolean = fields.some((field) => {
      const sameNameField = currentFields.find(item => item.name === field.name);
      if (sameNameField && sameNameField.isSystem === true) {
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
    const transaction = await this.sequelize.transaction();
    try {
      // 先删除非系统字段
      await this.fieldsRepository.destroy({
        where: {
          modelId,
          isSystem: false,
        },
        transaction,
      });
      // 重新创建字段
      const newFields = fields.map((field) => {
        let { defaultValue } = field;
        if (defaultValue === 'null') {
          defaultValue = null;
        } else if (isNumeric(defaultValue)) {
          defaultValue = Number(defaultValue);
        }
        return {
          ...field,
          modelId,
          defaultValue,
        };
      });
      const res = await this.fieldsRepository.bulkCreate(newFields);
      await transaction.commit();
      return res.map(item => item.id);
    } catch (error) {
      this.logger.error(error);
      await transaction.rollback();
      if (error instanceof ApiException) {
        throw error;
      }
      throw new ApiException({
        code: CommonCodes.CREATED_FAIL,
        message: '创建失败',
      });
    }
  }


  /**
   * 创建模型关系
   * @param postData
   * @returns
   */
  async createModelRelation(postData: ModelRelationDto): Promise<Created> {
    const { fromModelId, toModelId, serviceId } = postData;
    const sameRelation: ModelsRelationModel = await this.relationRepository.findOne({
      where: {
        fromModelId,
        toModelId,
        serviceId,
      },
    });
    if (sameRelation) {
      return {
        id: sameRelation.id,
      };
    }
    const transaction = await this.sequelize.transaction();
    try {
      const foreignKeyId = (await
      this.createModelRelationForeignKey(postData.fromModelId, postData.toModelId, transaction));
      const res = await this.relationRepository.create({
        ...postData,
        byFieldId: foreignKeyId,
      });
      await transaction.commit();
      return {
        id: res.id,
      };
    } catch (error) {
      this.logger.error(error);
      await transaction.rollback();
      if (error instanceof ApiException) {
        throw error;
      }
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
    const relation = await this.relationRepository.findOne({
      where: {
        id: relationId,
        isDelete: false,
      },
    });
    if (!relation) {
      throw new ApiException({
        code: CommonCodes.NOT_FOUND,
        message: '关系不存在',
      }, HttpStatus.NOT_FOUND);
    }
    const transaction = await this.sequelize.transaction();
    try {
      const foreignKey = (await
      this.createModelRelationForeignKey(postData.fromModelId, postData.toModelId, transaction));
      // 删除无用的外键
      if (relation.byFieldId !== foreignKey) {
        await this.fieldsRepository.destroy({
          where: {
            id: relation.byFieldId,
          },
          transaction,
        });
      }
      // // 删除
      await this.relationRepository.update({
        ...postData,
        byFieldId: foreignKey,
        updateTime: new Date(),
      }, {
        where: {
          id: relationId,
        },
        transaction,
      });
      await transaction.commit();
      return {
        id: relationId,
      };
    } catch (error) {
      this.logger.error(error);
      await transaction.rollback();
      if (error instanceof ApiException) {
        throw error;
      }
      throw new ApiException({
        code: CommonCodes.UPDATED_FAIL,
        message: '更新模型关系失败',
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
    const transaction = await this.sequelize.transaction();
    try {
      const relations = await this.relationRepository.findAll({
        where: {
          id: {
            [Op.in]: ids,
          },
        },
        raw: true,
        transaction,
      });
      const foreignKeyIds = Array.from(new Set(relations.map(item => item.byFieldId)));
      // 删除关系
      await this.relationRepository.destroy({
        where: {
          id: {
            [Op.in]: ids,
          },
        },
        transaction,
      });
      // 删除外键
      await this.fieldsRepository.update({
        isDelete: true,
      }, {
        where: {
          id: {
            [Op.in]: foreignKeyIds,
          },
        },
      });
      await transaction.commit();
      return {
        ids,
      };
    } catch (error) {
      this.logger.error(error);
      await transaction.rollback();
      if (error instanceof ApiException) {
        throw error;
      }
      throw new ApiException({
        code: CommonCodes.DELETED_FAIL,
        message: '删除关联关系失败',
        error,
      });
    }
  }


  /**
   * 创建模型的默认字段
   * @param modelId
   * @param transaction
   */
  private async createModelDefaultFields(modelId: number, transaction?: sequelize.Transaction):
  Promise<ModelsFieldsModel>  {
    const fieldEntity = await this.buildSystemField(modelId, true, transaction);
    return await this.fieldsRepository.create(fieldEntity);
  };


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
  Promise<number> {
    const [fromModel, toModel] = await Promise.all([this.findModelById(fromId), this.findModelById(toId)]);
    // 外键名称
    const foreignKey = `ref${lowerCamelToUpperCamel(toModel.name)}Id`;
    // 生成外键
    let foreignKeyField: ModelsFieldsModel = await this.fieldsRepository.findOne({
      where: {
        name: foreignKey,
        isDelete: false,
      },
      transaction,
    });
    if (!foreignKeyField) {
      const fieldEntity = await this.buildSystemField(fromModel.id, false, transaction);
      fieldEntity.name = foreignKey;
      fieldEntity.description = `模型“${fromModel.name}” - “${toModel.name}”间外键`;
      foreignKeyField = await this.fieldsRepository.create(fieldEntity, {
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
    return foreignKeyField.id;
  }


  /**
   * 构造系统默认字段
   * @param modelId
   * @param isUUID
   * @param transaction
   * @returns
   */
  private async buildSystemField(modelId: number, isUUID?: boolean, transaction?: sequelize.Transaction) {
    const uuidType = await this.dataTypesRepository.findOne({
      where: {
        name: FIELD_UUID_NAME,
        isSystem: true,
      },
      transaction,
    });
    if (!uuidType) {
      throw new ApiException({
        code: CommonCodes.NOT_FOUND,
        message: '系统类型[UUID]不存在',
      }, HttpStatus.NOT_FOUND);
    }
    const fieldEntity: PlainObject = isUUID ? {
      ...FIELD_UUID,
      description: uuidType.description,
    } : {};
    fieldEntity.typeId = uuidType.id;
    fieldEntity.isSystem = true;
    fieldEntity.modelId = modelId;
    return fieldEntity;
  }
}
