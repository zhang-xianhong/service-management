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
import { FIELD_DEFAULT_VERSION } from './config';
import { ModelsFieldsHistoryModel } from './models-fields-history.model';
import { MODULE_TYPE } from '../version-control/config';
import { VersionControlService } from '../version-control/version-control.service';

interface CompareFieldsResult {
  created?: any[]
  updated?: any[]
  removed?: any[]
  // 保持不变的
  kept?: any[]
}
@Injectable()
export class ModelsService {
  // 允许变更的字段，用于对比
  private readonly COMPARE_FIELDS = ['name', 'description'];

  constructor(
    @Inject(Logger)
    private readonly logger: LoggerService,
    @Inject(forwardRef(() => ServicesService))
    private servicesService: ServicesService,
    @Inject(forwardRef(() => VersionControlService))
    private versionService: VersionControlService,
    private sequelize: Sequelize,
    @InjectModel(ModelsInfoModel) private readonly infoRepository: typeof ModelsInfoModel,
    @InjectModel(ModelsFieldsModel) private readonly fieldsRepository: typeof ModelsFieldsModel,
    @InjectModel(ModelsRelationModel) private readonly relationRepository: typeof ModelsRelationModel,
    @InjectModel(ModelsFieldsHistoryModel) private readonly historyRepository: typeof ModelsFieldsHistoryModel,
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
      // TODO 创建模型的版本控制
      // 创建字段的版本控制
      await this.versionService.createVersion({
        moduleType: MODULE_TYPE.MODEL_FIELD,
        moduleId: res.id,
        serviceId,
        ghostVersion: FIELD_DEFAULT_VERSION,
      }, transaction);
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
  async updateOrCreateFields(modelId: number, serviceId: number, fields: ModelFieldDto[]): Promise<any> {
    const currentFields: ModelsFieldsModel[] = await this.fieldsRepository.findAll({
      where: {
        modelId,
      },
    });
    // 是否与现有字段名称冲突
    let conflictName = '';
    const hasNameConflictField: boolean = fields.some((field) => {
      const sameNameField = currentFields.find(item => item.name === field.name);
      if (sameNameField
        && (sameNameField.isSystem === true || Number(field.id) !== Number(sameNameField.id))) {
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
    const sourceFields = currentFields.filter(field => !field.isSystem);
    const newFields = fields.map(field => ({
      modelId,
      ...field,
    }));
    const { created, updated, removed } = await this.compareFields(modelId, newFields, sourceFields);
    // 没有做任何操作，无用的保存
    if (!created.length && !updated.length && !removed.length) {
      return true;
    }
    const transaction = await this.sequelize.transaction();
    try {
      await this.updateModelFieldsAndHistory(
        serviceId,
        modelId,
        { created, updated, removed },
        transaction, currentFields,
      );
      await transaction.commit();
      return true;
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
      await this.updateModelFieldsAndHistory(serviceId, fromModelId, {}, transaction);
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
  async updateModelRelation(relationId: number, postData: ModelRelationDto): Promise<Updated> {
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
    // 防止无效的更新
    if (relation.fromModelId === postData.fromModelId
      && relation.toModelId === postData.toModelId
      && relation.relationType === postData.relationType) {
      return {
        id: relationId,
      };
    }
    const transaction = await this.sequelize.transaction();
    try {
      // 创建新外键
      const foreignKey = (await
      this.createModelRelationForeignKey(postData.fromModelId, postData.toModelId, transaction));
      // 创建外键后更新字段历史
      await this.updateModelFieldsAndHistory(relation.serviceId, postData.fromModelId, {}, transaction);
      // 删除无用的外键
      if (relation.byFieldId !== foreignKey) {
        await this.fieldsRepository.destroy({
          where: {
            id: relation.byFieldId,
          },
          transaction,
        });
        // 删除外键后更新字段历史
        await this.updateModelFieldsAndHistory(relation.serviceId, relation.fromModelId, {}, transaction);
      }
      // 更新模型关系
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
      await this.fieldsRepository.destroy({
        where: {
          id: {
            [Op.in]: foreignKeyIds,
          },
        },
      });
      // 删除外键后更新字段历史
      const historyPromises = relations.map(relation => this.updateModelFieldsAndHistory(
        relation.serviceId,
        relation.fromModelId,
        {},
        transaction,
      ));
      await Promise.all(historyPromises);
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
    const fieldEntity = await this.buildSystemField(fromModel.id, false, transaction);
    fieldEntity.name = foreignKey;
    fieldEntity.description = `模型“${fromModel.name}” - “${toModel.name}”间外键`;
    const foreignKeyField = await this.fieldsRepository.create(fieldEntity, {
      transaction,
    });
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


  /**
   * 对比字段变更
   * @param modelId
   * @param newFields
   * @param sourceFields
   * @returns
   */
  private async compareFields(modelId: number, newFields: any[] = [], sourceFields?: any[]):
  Promise<CompareFieldsResult> {
    const originFields = sourceFields || await this.fieldsRepository.findAll({
      where: {
        modelId,
        isSystem: false,
      },
      raw: true,
    });
    const created = [];
    const mayUpdated = [];
    const updated = [];
    const kept = [];
    newFields.forEach((newField) => {
      if (newField.id) {
        // 说明它可能是更新的
        mayUpdated.push(newField);
      } else {
        // 新增的
        created.push(newField);
      }
    });
    const removed = originFields
      .filter(originField => !mayUpdated.find(newField => Number(newField.id) === Number(originField.id)));
    mayUpdated.forEach((field) => {
      const originField = originFields.find(originField => Number(field.id) === Number(originField.id));
      if (!originField) {
        throw new ApiException({
          code: CommonCodes.PARAMETER_INVALID,
          message: '无效的字段ID',
        });
      }
      const isUpdate = this.COMPARE_FIELDS.some(key => field[key] !== originField[key]);
      if (isUpdate) {
        updated.push(field);
      } else {
        kept.push(field);
      }
    });
    return {
      created,
      updated,
      removed,
      kept,
    };
  }


  /**
   * 批量更新字段
   * @param fields
   * @param transaction
   * @returns
   */
  private async bulkUpdateFields(fields: any[], transaction: sequelize.Transaction) {
    const promises = fields.map((field) => {
      const updatedValue = { ...field, updateTime: new Date() };
      delete updatedValue.id;
      return this.fieldsRepository.update(updatedValue, {
        where: {
          id: field.id,
        },
        transaction,
      });
    });
    return await Promise.all(promises);
  }


  private async updateModelFieldsAndHistory(
    serviceId: number,
    modelId: number,
    { created = [], updated = [], removed = [] }: CompareFieldsResult,
    transaction: sequelize.Transaction,
    sourceFields?: ModelsFieldsModel[],
  ) {
    const currentFields: ModelsFieldsModel[] = sourceFields || await this.fieldsRepository.findAll({
      where: {
        modelId,
      },
    });
    try {
      // 获取上一个ghostVersion
      const { preGhostVersion } = await this.versionService.findAndUpdateGhostVersion(
        MODULE_TYPE.MODEL_FIELD,
        modelId,
        transaction,
      );
      // 2. 备份字段到历史表
      await this.historyRepository.create({
        serviceId,
        modelId,
        fieldVersion: preGhostVersion,
        content: currentFields,
      }, {
        transaction,
      });
      // 2. 创建新字段
      const createdFields = created?.map(field => ({
        ...field,
        modelId,
      }));
      createdFields?.length && await this.fieldsRepository.bulkCreate(createdFields);
      // 3. 删除被删除字段
      const removedFieldIds = removed?.map(field => field.id);
      removedFieldIds?.length && await this.fieldsRepository.destroy({
        where: {
          id: {
            [Op.in]: removedFieldIds,
          },
        },
      });
      // 4. 更新字段
      updated?.length && await this.bulkUpdateFields(updated, transaction);
      return true;
    } catch (error) {
      throw error;
    }
  }
}
