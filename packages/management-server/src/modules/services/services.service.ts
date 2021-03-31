import { forwardRef, HttpService, HttpStatus, Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
import { CommonCodes } from 'src/shared/constants/code';
import { ApiException } from 'src/shared/utils/api.exception';
import { ServicesApiModel } from './service-api.model';
import { ServicesDependencyModel } from './service-dependency.model';
import { ServicesInfoModel } from './service-info.model';
import { BUILD_SERVICE_URL, INIT_SERVICE_URL, GENERATE_SERVICE_REPOSITORY_URL } from 'src/shared/constants/url';
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
import { ServiceBuildDto } from './dto/service-actions.dto';
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
    return await this.infoRepository.findAndCountAll(conditions);
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
      }],
    });
    if (!service) {
      throw new ApiException({
        code: CommonCodes.NOT_FOUND,
        message: '服务不存在',
      }, HttpStatus.NOT_FOUND);
    }
    const { config, ...restConfig } = (service.toJSON() as PlainObject);
    return {
      ...restConfig,
      config: config?.config,
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
    const { name } = data;
    const { dependencies = [], ...serviceData } = data;
    // 验证是否有同名服务
    const service: ServicesInfoModel = await this.infoRepository.findOne({
      where: {
        name,
        isDelete: false,
      },
    });
    if (service) {
      throw new ApiException({
        code: CommonCodes.DATA_EXISTED,
        message: '服务名称已存在',
      });
    }

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
   *
   * @param data 更新服务
   */
  async updateService(id: number, data: any): Promise<Updated> {
    const { dependencies = [], ...serviceData } = data;
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
      const service: ServicesInfoModel = await this.infoRepository.findOne<ServicesInfoModel>({
        where: {
          name: data.name,
          isDelete: false,
          id: [Op.notIn[id]],
        },
      });
      if (service) {
        throw new ApiException({
          code: CommonCodes.DATA_EXISTED,
          message: '模型名称已存在',
        });
      }
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
   * 初始化服务
   * @param serviceId
   * @returns
   */
  async initializeService(serviceId: number): Promise<PlainObject> {
    await this.httpService.get(`${INIT_SERVICE_URL}/${serviceId}`).toPromise();
    try {
      const { data } = await this.httpService.get(`${INIT_SERVICE_URL}/${serviceId}`).toPromise();
      if (data?.code === 0) {
        return data.data;
      }
      throw data.message;
    } catch (error) {
      this.logger.error(error);
      throw new ApiException({
        code: CommonCodes.BUILD_FAIL,
        message: '服务构建失败',
        error: error.message || error,
      }, HttpStatus.BAD_REQUEST);
    }
  }


  /**
   * 服务构建
   * @param params
   * @returns
   */
  async buildService(params: ServiceBuildDto): Promise<{traceId: string}> {
    const { serviceId, branch: ref, userId } = params;
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
        };
      }
      throw data.message;
    } catch (error) {
      this.logger.error(error);
      throw new ApiException({
        code: CommonCodes.BUILD_FAIL,
        message: '服务构建失败',
        error: error.message || error,
      });
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
    const service: ServicesInfoModel = await this.infoRepository.findOne({
      where: {
        serviceId,
      },
    });
    // 初始化成功后, 初始化次数加1
    if (status === SERVICE_STATUS.UN_BUILD) {
      update.initTimes = service.initTimes + 1;
    }
    // 构建成功后, 构建次数加1
    if (status === SERVICE_STATUS.BUILT) {
      update.builtTimes = service.builtTimes + 1;
    }
    await this.infoRepository.update(update, {
      where: {
        serviceId,
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
}
