import { Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
import { ApiException } from '../../shared/utils/api.exception';
import { CommonCodes } from '../../shared/constants/code';
import { ModelsInfoModel } from './models-info.model';
import { ModelsFieldsModel } from './models-fields.model';
import { DataTypesModel } from '../settings/settings-data-types.model';
import { FIELD_TYPE, FIELD_UUID_NAME,  MODEL_DEFAULT_FIELDS_NAMES } from 'src/shared/constants/field-types';
import { InjectModel } from '@nestjs/sequelize';
import sequelize, { Op, Sequelize } from 'sequelize';
import { ModelInfoDto } from './dto/model-info.dto';
import { Created, Deleted, Rows, Updated } from 'src/shared/types/response';
import { ErrorTypes } from 'src/shared/constants/error';
import { ServicesInfoModel } from '../services/service-info.model';
import { ModelFieldDto } from './dto/model-field.dto';

@Injectable()
export class ModelsService {
  constructor(
    @Inject(Logger)
    private readonly logger: LoggerService,
    private sequelize: Sequelize,
    @InjectModel(ModelsInfoModel) private readonly infoRepository: typeof ModelsInfoModel,
    @InjectModel(ModelsFieldsModel) private readonly fieldsRepository: typeof ModelsFieldsModel,
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
  async findModelsByServiceId(serviceId: number): Promise<Rows<ModelsInfoModel>> {
    return await this.infoRepository.findAll({
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
   * 更新模型字段
   * 1.删除原有的
   * 2.创建新的
   * @param modelId
   * @param fields
   * @returns
   */
  async updateModelFields(modelId: number, fields: ModelFieldDto[]): Promise<ModelsFieldsModel[]> {
    // 先删除再创建
    const transaction = await this.sequelize.transaction();
    try {
      await this.fieldsRepository.destroy({
        where: {
          modelId,
          name: {
            // UUID类型的不删除
            [Op.not]: FIELD_UUID_NAME,
          },
        },
        transaction,
      });
      const newFields = fields.filter(field => field.name !== FIELD_UUID_NAME);
      const fieldsEntities = await this.createFieldsEntities(newFields, modelId);
      const res = await this.fieldsRepository.bulkCreate(fieldsEntities, {
        transaction,
      });
      await transaction.commit();
      return res;
    } catch (error) {
      this.logger.error(error);
      await transaction.rollback();
      throw new ApiException({
        code: CommonCodes.UPDATED_FAIL,
        message: '保存字段失败',
        error,
      });
    }
  }

  /**
   * 获取字段类型列表
   */
  private async getDataTypes() {
    const dataTypes = await this.dataTypesRepository.findAll({
      where: {
        isDelete: false,
      },
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
    const defaultFields: DataTypesModel[] = await this.dataTypesRepository.findAll({
      where: {
        name: {
          [Op.in]: MODEL_DEFAULT_FIELDS_NAMES,
        },
        isSystem: true,
      },
    });
    const genFields = defaultFields.map(field => ({
      name: field.name,
      description: field.description,
      typeId: field.id,
    }));
    const fieldsEntities: ModelsFieldsModel[] = await this.createFieldsEntities(genFields, modelId, defaultFields);
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
      if (fieldType.name === FIELD_UUID_NAME) {
        fieldType.isKey = true;
        fieldType.extra = 'auto_increment';
        fieldType.isUnique = true;
        fieldType.isIndex = true;
      }
      const { type, extra, length, isKey } = fieldType;
      return {
        ...newField,
        type,
        extra,
        length,
        isKey,
        typeId,
        modelId,
      };
    });
    return fieldsEntities;
  }
}
