import { forwardRef, HttpService, HttpStatus, Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
import { CommonCodes } from 'src/shared/constants/code';
import { ApiException } from 'src/shared/utils/api.exception';
import { ServicesApiModel } from './service-api.model';
import { ServicesDependencyModel } from './service-dependency.model';
import { ServicesInfoModel } from './service-info.model';
import { BUILD_SERVICE_URL, INIT_SERVICE_URL, GENERATE_SERVICE_REPOSITORY_URL, GET_SERVICE_DIFF, SERVICE_SSH_URI, STOP_SERVICE_URL } from 'src/shared/constants/url';
import { PlainObject } from 'src/shared/pipes/query.pipe';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize, Transaction } from 'sequelize';
import { SERVICE_STATUS } from './service-status';
import { ErrorTypes } from 'src/shared/constants/error';
import { SocketGateway } from 'src/shared/gateway/socket.gateway';
import { WEBSOCKET_EVENT_SERVICE_UPDATE } from 'src/shared/constants/websocket-events';
import { ServiceInfoDto } from './dto/service-info.dto';
import { ServiceApisDto } from './dto/service-apis.dto';
import { ModelsService } from '../models/models.service';
import { Created, Deleted, Updated, BulkCreated, Details, Rows, RowsAndCount } from 'src/shared/types/response';
import { ModelsInfoModel } from '../models/models-info.model';
import { ServicesConfigModel } from './service-config.model';
import { ServiceConfigDto } from './dto/service-config.dto';
import { ServicesApiParamModel } from './service-api-param.model';
import { ApiDto } from './dto/api.dto';
import { DEFAULT_APIS } from './default-apis';
import { ModelsRelationModel } from '../models/models-relation.model';
import { escapeLike } from 'src/shared/utils/sql';
import { ServiceStartDto } from './dto/service-actions.dto';
import { getLogName } from './config';
import { FIELD_UUID_NAME } from 'src/shared/constants/field-types';
import { OwnersModel } from '../owners/owners.model';
import { MODULE_TYPE } from '../owners/config';
import { OwnersService } from '../owners/owners.service';
import { isNumeric } from 'src/shared/utils/validator';
@Injectable()
export class ServicesService {
  constructor(
    @Inject(Logger)
    private readonly logger: LoggerService,
    private readonly io: SocketGateway,
    private sequelize: Sequelize,
    private httpService: HttpService,
    @Inject(forwardRef(() => ModelsService))
    private modelsService: ModelsService,
    @InjectModel(ServicesInfoModel) private readonly infoRepository: typeof ServicesInfoModel,
    @InjectModel(ServicesApiModel) private readonly apiRepository: typeof ServicesApiModel,
    @InjectModel(ServicesDependencyModel) private readonly dependencyRepository: typeof ServicesDependencyModel,
    @InjectModel(ServicesConfigModel) private readonly servicesConfigRepository: typeof ServicesConfigModel,
    @InjectModel(ServicesApiParamModel) private readonly apiParamRepository: typeof ServicesApiParamModel,
    private ownerService: OwnersService,
  ) { }

  /**
   * 获取服务列表
   * @param query
   */
  async findAll(query: any): Promise<RowsAndCount<ServicesInfoModel>> {
    const where: any = {
      isDelete: false,
    };
    if (query.classification) {
      const classification = query.classification.split(',');
      where.classification = {
        [Op.or]: classification.map(i => ({
          [Op.like]: escapeLike(i),
        })),
      };
    }
    if (query.tag) {
      where.tags = query.tags;
    }
    if (query.keyword) {
      const likeString = escapeLike(query.keyword);
      where[Op.or] = [
        {
          name: {
            [Op.like]: likeString,
          },
        },
        {
          classification: {
            [Op.like]: likeString,
          },
        },
        {
          tag: {
            [Op.like]: likeString,
          },
        },
      ];
    }
    const { conditions = {} } = query;
    conditions.where = where;
    if (query.all) {
      return await this.infoRepository.findAndCountAll({ where });
    }
    conditions.include = [
      {
        model: OwnersModel,
        where: {
          moduleType: MODULE_TYPE.SERVICE,
        },
        attributes: ['userId'],
        required: false,
      },
    ];
    const { rows, count } = await this.infoRepository.findAndCountAll(conditions);
    const ownerUsers = await this.ownerService.getOwnerUsers(rows);
    return {
      rows,
      count,
      ownerUsers,
    };
  }


  /**
   * 通过ID获取服务详情
   * @param id
   */
  async findById(id: number): Promise<Details<any>> {
    const service: ServicesInfoModel = await this.infoRepository.findOne({
      where: {
        id,
        isDelete: false,
      },
      include: [{
        model: ServicesDependencyModel,
        required: false,
        attributes: { exclude: ['isDelete'] },
      }, {
        model: ServicesConfigModel,
        required: false,
        attributes: { exclude: ['isDelete'] },
      },
      {
        model: OwnersModel,
        where: {
          moduleType: MODULE_TYPE.SERVICE,
        },
        attributes: ['userId'],
        required: false,
      }],
    });
    if (!service) {
      throw new ApiException({
        code: CommonCodes.NOT_FOUND,
        message: '服务不存在',
      }, HttpStatus.NOT_FOUND);
    }
    const { config, ...restConfig } = (service.toJSON() as PlainObject);
    const ownerUsers = await this.ownerService.getOwnerUsers([service]);
    return {
      ...restConfig,
      config: config?.config,
      sshHost: SERVICE_SSH_URI,
      ownerUsers,
    };
  }


  /**
   * 根据服务id获取服务模型数据
   * @param serviceId
   */
  async getModelsByServiceId(serviceId: number): Promise<{
    models: Rows<ModelsInfoModel>,
    relations: Rows<ModelsRelationModel>
  }> {
    return await this.modelsService.findModelsByServiceId(serviceId);
  }


  /**
   * 根据服务id获取接口数据
   * @param serviceId
   */
  async getApisByServiceId(serviceId: number): Promise<Rows<any>> {
    const apis: ServicesApiModel[] = await this.apiRepository.findAll({
      where: {
        serviceId,
        isDelete: false,
      },
      order: [['id', 'ASC']],
      attributes: { exclude: ['isDelete'] },
      include: [{
        model: ModelsInfoModel,
        required: false,
        attributes: ['name'],
      },
      {
        model: ServicesApiParamModel,
        required: false,
        attributes: { exclude: ['isDelete'] },
      }],
    });
    const apisData = apis.map((api) => {
      const { model, ...apiData } = (api.toJSON() as PlainObject);
      return {
        ...apiData,
        modelName: model.name,
      };
    });
    return apisData;
  }


  /**
   * 创建服务
   * @param data
   * @returns
   */
  async createService(data: ServiceInfoDto): Promise<Created> {
    const { name, dependencies = [], owner, ...serviceData } = data;
    // 验证是否有同名服务
    await this.checkServiceNameUsable(name);

    // 获取最大端口号服务
    const [maxPortService]: ServicesInfoModel[] = await this.infoRepository.findAll({
      where: {
        isDelete: false,
      },
      order: [['serverPort', 'DESC']],
    });
    const transaction: Transaction = await this.sequelize.transaction();
    try {
      serviceData.serverPort = Number(maxPortService?.serverPort) + 1 || 8080;
      const service: ServicesInfoModel = await this.infoRepository.create(serviceData, { transaction });
      // 同步owner
      await this.ownerService.updateOwners(MODULE_TYPE.SERVICE, service.id, owner, transaction);
      if (dependencies && Array.isArray(dependencies)) {
        const dependenciesEntities = dependencies.map(dependency => ({
          dependencyId: dependency.id,
          serviceId: service.id,
        }));
        await this.dependencyRepository.bulkCreate(dependenciesEntities, { transaction });
      }
      await transaction.commit();
      return {
        id: service.id,
      };
    } catch (error) {
      this.logger.error(error);
      await transaction.rollback();
      throw new ApiException({
        code: CommonCodes.CREATED_FAIL,
        message: '服务创建失败',
      });
    }
  }


  /**
   * 添加服务配置
   * @param serviceId
   * @param data
   */
  async addServiceConfig(data: ServiceConfigDto): Promise<Created> {
    const { serviceId } = data;
    try {
      const service: ServicesInfoModel = await this.infoRepository.findOne({
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
      const config: ServicesConfigModel = await this.servicesConfigRepository.findOne({
        where: {
          serviceId,
          isDelete: false,
        },
      });
      if (config) {
        await this.servicesConfigRepository.update(data, {
          where: {
            serviceId,
          },
        });
        return {
          id: config.id,
        };
      }
      const res: ServicesConfigModel = await this.servicesConfigRepository.create(data);
      return {
        id: res.id,
      };
    } catch (error) {
      this.logger.error(error);
      throw new ApiException({
        code: CommonCodes.CREATED_FAIL,
        message: '保存服务配置失败',
        error: error.message || error,
      });
    }
  }


  /**
   * 添加服务默认接口
   * @param serviceId
   * @param data
   */
  async addServiceDefaultApis(
    serviceId: number,
    modelInfo: ModelsInfoModel,
    transaction: Transaction,
  ): Promise<BulkCreated> {
    try {
      const defaultApis = DEFAULT_APIS.map(api => ({
        ...api,
        isSystem: 1,
        modelId: modelInfo.id,
        serviceId,
      }));
      const res = await Promise.all(defaultApis.map(item => this.addServiceApiParams(item, transaction)));
      return {
        ids: res.map(item => item.id),
      };
    } catch (error) {
      this.logger.error(error);
      throw new ApiException({
        code: CommonCodes.CREATED_FAIL,
        message: '保存服务默认接口失败',
        error: error.message || error,
      });
    }
  }


  /**
   * 删除服务默认接口
   * @param serviceId
   * @param data
   */
  async deleteServiceApis(
    modelId: number,
    transaction: Transaction,
  ) {
    try {
      const apis: ServicesApiModel[] = await this.apiRepository.findAll({
        where: {
          modelId,
          isDelete: false,
        },
      });
      await Promise.all(apis.map(item => this.apiParamRepository.destroy({
        where: {
          serviceApiId: item.id,
        },
        transaction,
      })));
      await this.apiRepository.destroy<ServicesApiModel>({
        where: {
          modelId,
        },
        transaction,
      });
    } catch (error) {
      this.logger.error(error);
      throw new ApiException({
        code: CommonCodes.CREATED_FAIL,
        message: '删除服务接口失败',
        error: error.message || error,
      });
    }
  }


  /**
   * 添加/更新服务接口
   * @param serviceId
   * @param data
   * @returns
   */
  async addServiceApis(serviceId: number, data: ServiceApisDto): Promise<BulkCreated> {
    const transaction: Transaction = await this.sequelize.transaction();
    const { apis = [] } = data;
    try {
      const service: ServicesInfoModel = await this.infoRepository.findOne({
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
      // 校验接口名称是否有重复
      apis.reduce((prev, item) => {
        if (prev.includes(item.name)) {
          throw new ApiException({
            code: CommonCodes.PARAMETER_INVALID,
            message: `存在名称[${item.name}]相同的接口`,
          });
        }
        prev.push(item.name);
        return prev;
      }, []);

      // 系统接口
      const systemApis: ServicesApiModel[] = await this.apiRepository.findAll({
        where: {
          serviceId,
          isSystem: true,
        },
      });
      // 是否与系统接口重复
      let conflictName = '';
      const hasNameConflictApi: boolean = apis.some((api) => {
        const sameNameApi = systemApis.find(item => item.name === api.name);
        if (sameNameApi) {
          conflictName = api.name;
          return true;
        }
        return false;
      });
      if (hasNameConflictApi) {
        throw new ApiException({
          code: CommonCodes.DATA_EXISTED,
          message: `接口名称[${conflictName}]已存在`,
        });
      }

      const oldApis: ServicesApiModel[] = await this.apiRepository.findAll({
        where: {
          serviceId,
          isSystem: false,
        },
      });
      // 删除旧接口参数
      await Promise.all(oldApis.map(item => this.apiParamRepository.destroy({
        where: {
          serviceApiId: item.id,
        },
        transaction,
      })));
      // 删除非系统生产接口
      await this.apiRepository.destroy<ServicesApiModel>({
        where: {
          serviceId,
          isSystem: false,
        },
        transaction,
      });
      const apisEntities = apis.filter(item => !item.isSystem).map(api => ({
        ...api,
        serviceId,
      }));
      const res = await Promise.all(apisEntities.map(item => this.addServiceApiParams(item, transaction)));
      await transaction.commit();
      return {
        ids: res.map(item => item.id),
      };
    } catch (error) {
      this.logger.error(error);
      await transaction.rollback();
      throw new ApiException({
        code: CommonCodes.CREATED_FAIL,
        message: '保存服务接口失败',
        error: error.message || error,
      });
    }
  }


  /**
   * 添加接口参数
   * @param data
   * @returns
   */
  async addServiceApiParams(data: ApiDto, transaction: Transaction): Promise<Created> {
    try {
      const { params = [], ...apiData } = data;
      const res: ServicesApiModel = await this.apiRepository.create(apiData, { transaction });
      await this.apiParamRepository.destroy<ServicesApiParamModel>({
        where: {
          serviceApiId: res.id,
        },
        transaction,
      });
      // todo 校验GET请求不能添加request_body参数类型
      if (Array.isArray(params) && params.length) {
        const paramsEntities = params.map(param => ({
          ...param,
          serviceApiId: res.id,
        }));
        await this.apiParamRepository.bulkCreate(paramsEntities, { transaction });
      }

      return {
        id: res.id,
      };
    } catch (error) {
      this.logger.error(error);
      throw new ApiException({
        code: CommonCodes.CREATED_FAIL,
        message: '保存接口参数失败',
        error: error.message || error,
      });
    }
  }

  /**
   *更新服务
   * @param data
   */
  async updateService(id: number, data: any): Promise<Updated> {
    const { name, dependencies = [], owner, ...serviceData } = data;
    const transaction: Transaction = await this.sequelize.transaction();
    try {
      const serviceInfo: ServicesInfoModel = await this.infoRepository.findOne({
        where: {
          id,
          isDelete: false,
        },
      });
      if (!serviceInfo) {
        throw new ApiException({
          code: CommonCodes.NOT_FOUND,
          message: 'service不存在',
          error: ErrorTypes.NOT_FOUND,
        });
      }
      // 验证是否有同名模块
      await this.checkServiceNameUsable(name, id);
      // 同步owner
      await this.ownerService.updateOwners(MODULE_TYPE.SERVICE, id, owner, transaction);
      await this.infoRepository.update(serviceData, {
        where: { id },
        transaction,
      });
      await this.dependencyRepository.destroy({
        where: {
          serviceId: id,
        },
        transaction,
      });
      const dependenciesEntities = dependencies.map(dependency => ({
        dependencyId: dependency.id,
        serviceId: id,
      }));
      await this.dependencyRepository.bulkCreate(dependenciesEntities, { transaction });
      await transaction.commit();
      return {
        id,
      };
    } catch (error) {
      this.logger.error(error);
      await transaction.rollback();
      throw new ApiException({
        code: CommonCodes.UPDATED_FAIL,
        message: '服务更新失败',
        error: error.message || error,
      });
    }
  }


  /**
   * 删除服务
   * @param id
   */
  async deleteServices(ids: number[]): Promise<Deleted> {
    const transaction: Transaction = await this.sequelize.transaction();
    try {
      const deleteIds: number[] = ids.filter(id => Number(id));
      // 同步owner
      await this.ownerService.deleteOwners(MODULE_TYPE.SERVICE, deleteIds, transaction);
      // 更新info表数据，isDelete置为true
      await this.infoRepository.update({
        isDelete: true,
      }, {
        where: {
          id: { [Op.in]: deleteIds },
        },
        transaction,
      });
      // 更新api表数据，isDelete置为true
      await this.apiRepository.update({
        isDelete: true,
      }, {
        where: {
          serviceId: { [Op.in]: deleteIds },
        },
        transaction,
      });
      // 更新dependency表数据，isDelete置为true
      await this.dependencyRepository.update({
        isDelete: true,
      }, {
        where: {
          serviceId: { [Op.in]: deleteIds },
        },
        transaction,
      });
      // 更新config表数据，isDelete置为true
      await this.servicesConfigRepository.update({
        isDelete: true,
      }, {
        where: {
          serviceId: { [Op.in]: deleteIds },
        },
        transaction,
      });
      // 删除服务相关模型信息
      await Promise.all(ids.map(id => this.modelsService.deleteModelsByServiceId(Number(id), transaction)));
      await transaction.commit();
      return {
        ids: deleteIds,
      };
    } catch (error) {
      this.logger.error(error);
      // 一旦发生错误，事务会回滚
      await transaction.rollback();
      throw new ApiException({
        code: CommonCodes.DELETED_FAIL,
        message: '服务删除失败',
      }, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * 启动服务
   * @param params
   * @returns
   */
  async startService(params: ServiceStartDto): Promise<{traceId: string, logName: string}> {
    const { serviceId, branch: ref = 'master', userId } = params;
    await this.verifyEmptyModel(serviceId);
    try {
      const { data } = await this.httpService.get(BUILD_SERVICE_URL, {
        params: {
          serviceId,
          ref,
          userId,
        },
      }).toPromise();
      if (data?.code === 0) {
        return {
          traceId: data.data,
          logName: getLogName(SERVICE_STATUS.STARTING),
        };
      }
      throw data.message;
    } catch (error) {
      this.logger.error(error);
      throw new ApiException({
        code: CommonCodes.BUILD_FAIL,
        message: '启动服务失败',
        error: error?.message || error,
      }, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * 停止服务
   * @param serviceId
   * @returns
   */
  async stopService(serviceId: number) {
    try {
      const service = await this.getServiceById(serviceId);
      const { data } = await this.httpService.get(STOP_SERVICE_URL, {
        params: {
          name: service.name,
        },
      }).toPromise();
      if (!data?.error) {
        return {
          traceId: data.data,
          logName: getLogName(SERVICE_STATUS.STOPPING),
        };
      }
      throw data.error;
    } catch (error) {
      this.logger.error(error);
      throw new ApiException({
        code: CommonCodes.PARAMETER_INVALID,
        message: '停止服务失败',
        error: error?.message || error,
      }, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * 获取服务变更记录
   * @param serviceId
   * @returns
   */
  async getServiceModelChanges(serviceId: number): Promise<any[]> {
    try {
      const { data } = await this.httpService.get(GET_SERVICE_DIFF, {
        params: {
          serviceId,
        },
      }).toPromise();
      if (data?.code === 0) {
        return data.data;
      }
      throw data.message;
    } catch (error) {
      this.logger.error(error);
      throw new ApiException({
        code: CommonCodes.FETCH_FAIL,
        message: '获取服务变更失败',
        error: error.message || error,
      }, HttpStatus.BAD_REQUEST);
    }
  }


  /**
   * 服务应用变更
   * @param serviceId
   * @returns
   */
  async applyChanges(serviceId: number) {
    const service = await this.getServiceById(serviceId);
    await this.verifyEmptyModel(serviceId);
    const { status } = service;
    if (status === SERVICE_STATUS.APPLYING
      || status ===  SERVICE_STATUS.STARTING
      || status === SERVICE_STATUS.STOPPING) {
      throw new ApiException({
        code: CommonCodes.UPDATED_FAIL,
        message: '当前服务不允许应用配置',
      }, HttpStatus.BAD_REQUEST);
    }
    try {
      const { data } = await this.httpService.get(`${INIT_SERVICE_URL}/${serviceId}`).toPromise();
      if (data?.code === 0) {
        if (service.status === 0) {
          await this.infoRepository.update({
            deposit: data.webURI,
          }, {
            where: {
              id: service.id,
            },
          });
        }
        return {
          logName: getLogName(service.status),
          ...data.data,
        };
      }
      throw data.message;
    } catch (error) {
      this.logger.error(error);
      throw new ApiException({
        code: CommonCodes.BUILD_FAIL,
        message: '应用配置失败',
        error: error.message || error,
      }, HttpStatus.BAD_REQUEST);
    }
  }


  /**
   * 创建服务物理项目仓库
   */
  async generateServiceRepository({
    projectDesc,
    projectName,
    saServiceID,
  }) {
    try {
      const { data } = await this.httpService.post(GENERATE_SERVICE_REPOSITORY_URL, {
        projectDesc,
        projectName,
        saServiceID,
      }).toPromise();
      if (data?.code === 0) {
        return data.data;
      }
      throw data.message;
    } catch (error) {
      this.logger.error(error);
      throw new ApiException({
        code: CommonCodes.BUILD_FAIL,
        message: '创建服务仓库失败',
        error: error.message || error,
      });
    }
  }


  /**
   * 更新服务状态
   * @param serviceId
   * @param status
   */
  async updateServiceStatus(serviceId: number, status: SERVICE_STATUS) {
    const update: PlainObject = {
      status,
    };
    // const service: ServicesInfoModel = await this.infoRepository.findOne({
    //   where: {
    //     serviceId,
    //   },
    // });
    // // 初始化成功后, 初始化次数加1
    // if (status === SERVICE_STATUS.UN_BUILD) {
    //   update.initTimes = service.initTimes + 1;
    // }
    // // 构建成功后, 构建次数加1
    // if (status === SERVICE_STATUS.BUILT) {
    //   update.builtTimes = service.builtTimes + 1;
    // }
    await this.infoRepository.update(update, {
      where: {
        id: serviceId,
      },
    });
    // 推送消息到前端
    this.io.sendMessage(WEBSOCKET_EVENT_SERVICE_UPDATE, {
      serviceId,
      status,
    });
    return {
      serviceId,
      status,
    };
  }

  /**
   * 校验名称唯一性
   * @param name
   * @param id
   * @returns
   */
  async checkServiceNameUsable(name: string, id?: number) {
    const where: PlainObject = {
      name,
      isDelete: false,
    };
    if (isNumeric(id) && id > 0) {
      where.id = {
        [Op.not]: id,
      };
    }
    const project = await this.infoRepository.findOne({
      where,
    });
    if (project) {
      throw new ApiException({
        code: CommonCodes.DATA_EXISTED,
        message: `服务名称[${name}]已存在`,
      });
    }
    return {
      usable: true,
    };
  }

  /**
   * 根据服务ID获取服务
   * @param id
   * @returns
   */
  private async getServiceById(id: number): Promise<Details<ServicesInfoModel>> {
    const service: ServicesInfoModel = await this.infoRepository.findOne({
      where: {
        id,
        isDelete: false,
      },
    });
    if (!service) {
      throw new ApiException({
        code: CommonCodes.NOT_FOUND,
        message: '服务不存在',
        error: ErrorTypes.NOT_FOUND,
      }, HttpStatus.NOT_FOUND);
    }
    return service;
  }


  /**
   * 应用配置等操作时判断fields是否只有一个ID字段
   * @param serviceId
   */
  private async verifyEmptyModel(serviceId: number): Promise<boolean> {
    const { models } = await this.modelsService.findModelsByServiceId(serviceId);
    let modelName = '';
    const isEmptyModel = models.some((model) => {
      const fields = model.fields as any;
      const hasExceptIdField = fields.length > 1
      && (fields).some(field => !field.isSystem || field.name !== FIELD_UUID_NAME);
      if (!hasExceptIdField) {
        modelName = model.name;
      }
      return !hasExceptIdField;
    });
    if (isEmptyModel) {
      throw new ApiException({
        code: CommonCodes.PARAMETER_INVALID,
        message: `请为模型[${modelName}]至少添加一个非[${FIELD_UUID_NAME}]属性`,
      });
    }
    return false;
  }
}
