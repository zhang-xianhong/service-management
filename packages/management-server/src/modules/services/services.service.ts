import { HttpService, HttpStatus, Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
import { CommonCodes } from 'src/shared/constants/code';
import { ApiException } from 'src/shared/utils/api.exception';
import { ServicesApiModel } from './service-api.model';
import { ServicesDependencyModel } from './service-dependency.model';
import { ServicesInfoModel } from './service-info.model';
import { BUILD_SERVICE_URL, INIT_SERVICE_URL, SERVICE_SSHURI, GENERATE_SERVICE_REPOSITORY_URL } from 'src/shared/constants/url';
import { PlainObject } from 'src/shared/pipes/query.pipe';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize, Transaction } from 'sequelize';
import { SERVICE_STATUS } from './service-status';
import { ErrorTypes } from 'src/shared/constants/error';
import { SocketGateway } from 'src/shared/gateway/socket.gateway';
import { WEBSOCKET_EVENT_SERVICE_UPDATE } from 'src/shared/constants/websocket-events';
import { ServiceDependencyDto } from './dto/service-dependency.dto';
import { ServiceInfoDto } from './dto/service-info.dto';
import { ServiceApiDto } from './dto/service-api.dto';
import { ModelsService } from '../models/models.service';
import { Created, Deleted, Updated, BulkCreated, Details, Rows, RowsAndCount } from 'src/shared/types/response';
import { ModelsInfoModel } from '../models/models-info.model';
import { ServicesConfigModel } from './service-config.model';
import { ServiceConfigDto } from './dto/service-config.dto';
@Injectable()
export class ServicesService {
  constructor(
    @Inject(Logger)
    private readonly logger: LoggerService,
    private readonly io: SocketGateway,
    private sequelize: Sequelize,
    private httpService: HttpService,
    private modelsService: ModelsService,
    @InjectModel(ServicesInfoModel) private readonly infoRepository: typeof ServicesInfoModel,
    @InjectModel(ServicesApiModel) private readonly apiRepository: typeof ServicesApiModel,
    @InjectModel(ServicesDependencyModel) private readonly dependencyRepository: typeof ServicesDependencyModel,
    @InjectModel(ServicesConfigModel) private readonly servicesConfigRepository: typeof ServicesConfigModel,
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
          [Op.like]: `%${i}%`,
        })),
      };
    }
    if (query.tag) {
      where.tags = query.tags;
    }
    if (query.keyword) {
      where[Op.or] = [
        {
          name: {
            [Op.like]: `%${query.keyword}%`,
          },
        },
        {
          classification: {
            [Op.like]: `%${query.keyword}%`,
          },
        },
        {
          tag: {
            [Op.like]: `%${query.keyword}%`,
          },
        },
      ];
    }
    const { conditions = {} } = query;
    conditions.where = where;
    return await this.infoRepository.findAndCountAll(conditions);
  }

  /**
   * 通过ID获取服务详情
   * @param id
   */
  async findById(id: number): Promise<Details<ServicesInfoModel>> {
    const service: ServicesInfoModel = await this.infoRepository.findOne({
      where: {
        id,
      },
      include: [{
        model: ServicesApiModel,
        required: false,
        attributes: { exclude: ['isDelete'] },
      }, {
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
    return service;
  }

  /**
   * 根据服务id获取服务模型数据
   * @param serviceId
   */
  async getModelsByServiceId(serviceId: number): Promise<Rows<ModelsInfoModel>> {
    return await this.modelsService.findModelsByServiceId(serviceId);
  }

  /**
   * 创建服务
   * @param data
   * @returns
   */
  async createService(data: ServiceInfoDto): Promise<Created> {
    const { name } = data;
    const { dependencies, ...serviceData } = data;
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
      const config: ServicesConfigModel = await this.servicesConfigRepository.findOne({
        where: {
          serviceId,
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
      });
    }
  }
  /**
   * 添加服务依赖
   * @param serviceId
   * @param data
   */
  async addServiceDependencies(serviceId: number, data: ServiceDependencyDto[]): Promise<BulkCreated> {
    const transaction: Transaction = await this.sequelize.transaction();
    try {
      await this.dependencyRepository.destroy({
        where: {
          serviceId,
        },
        transaction,
      });
      const dependenciesEntities = data.map(dependency => ({
        dependencyId: dependency.id,
        serviceId,
      }));
      const res = await this.dependencyRepository.bulkCreate(dependenciesEntities, { transaction });
      await transaction.commit();
      return {
        ids: res.map(item => item.id),
      };
    } catch (error) {
      this.logger.error(error);
      await transaction.rollback();
      throw new ApiException({
        code: CommonCodes.CREATED_FAIL,
        message: '保存服务依赖失败',
      });
    }
  }
  /**
   * 添加/更新服务接口
   * @param serviceId
   * @param data
   * @returns
   */
  async addServiceApis(serviceId: number, data: ServiceApiDto[]): Promise<BulkCreated> {
    const transaction: Transaction = await this.sequelize.transaction();
    try {
      await this.apiRepository.destroy<ServicesApiModel>({
        where: {
          serviceId,
        },
        transaction,
      });
      const apisEntities = data.map(api => ({
        ...api,
        serviceId,
      }));
      const res: ServicesApiModel[] =  await this.apiRepository.bulkCreate(apisEntities, { transaction });
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
      });
    }
  }

  /**
   *
   * @param data 更新服务
   */
  async updateService(id: number, data: any): Promise<Updated> {
    const { dependencies, ...serviceData } = data;
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
    const transaction: Transaction = await this.sequelize.transaction();
    try {
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
      });
    }
  }

  /**
   * 删除服务
   * @param id
   */
  async delete(ids: number[]): Promise<Deleted> {
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
        }, transaction,
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
      // 删除服务相关模型信息
      await Promise.all(ids.map(id => this.modelsService.deleteModelsByServiceId(Number(id), transaction)));
      await transaction.commit();
      return {
        ids: deleteIds,
      };
    } catch (err) {
      // 一旦发生错误，事务会回滚
      await transaction.rollback();
      throw new ApiException({
        code: CommonCodes.DELETED_FAIL,
        message: '服务删除失败',
      });
    }
  }

  /**
   * 调用后端接口，初始化服务
   * @param id
   */
  async initService(id: number) {
    const service = await this.getServiceById(id);
    if (service.status !== SERVICE_STATUS.UNINITIALIZED
      && service.status !== SERVICE_STATUS.INITIALIZATION_FAILED) {
      throw new ApiException({
        code: CommonCodes.PARAMETER_INVALID,
        message: '当前服务不能初始化',
      });
    }
    try {
      const { data }: any = await this.httpService.get(`${INIT_SERVICE_URL}${id}`).toPromise();
      if (data?.code === 0) {
        const { data: { sshURI } } = data;
        await this.updateService(id, {
          deposit: `${SERVICE_SSHURI}${sshURI}`,
          status: SERVICE_STATUS.INITIALIZING,
        });
        return true;
      }
      throw data.message;
    } catch (error) {
      this.logger.error(error);
      throw new ApiException({
        code: CommonCodes.INITIALIZE_FAIL,
        message: '服务初始化失败',
        error,
      }, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * 构建服务
   * @param id
   */
  async buildService(data: any) {
    const { serviceId, branch, userId } = data;
    const service = await this.getServiceById(serviceId);
    if (service.status !== SERVICE_STATUS.BUILD_FAILED
      && service.status !== SERVICE_STATUS.UN_BUILD) {
      throw new ApiException({
        code: CommonCodes.PARAMETER_INVALID,
        message: '当前服务不能构建',
      });
    }
    try {
      const { data } = await this.httpService.get(`${BUILD_SERVICE_URL}?serviceId=${serviceId}&ref=${branch}&userId=${userId}`).toPromise();
      if (data?.code === 0) {
        await this.updateServiceStatus(serviceId, SERVICE_STATUS.BUILDING);
        return data.data;
      }
      throw data.message;
    } catch (error) {
      this.logger.error(error);
      throw new ApiException({
        code: CommonCodes.BUILD_FAIL,
        message: '服务构建失败',
        error,
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
        error,
      }, HttpStatus.BAD_REQUEST);
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
