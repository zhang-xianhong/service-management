import { HttpService, HttpStatus, Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonCodes, ServiceCodes } from 'src/shared/constants/code';
import { ApiException } from 'src/shared/utils/api.exception';
import { Connection, ILike, In, Not, Repository } from 'typeorm';
import { ServicesApiEntity } from './service-api.entity';
import { ServicesDependencyEntity } from './service-dependency.entity';
import { ServicesInfoEntity } from './service-info.entity';
import { BUILD_SERVICE_URL, INIT_SERVICE_URL, SERVICE_SSHURI, GENERATE_SERVICE_REPOSITORY_URL } from 'src/shared/constants/url';
import { isEmpty } from 'src/shared/utils/validator';
import { PlainObject } from 'src/shared/pipes/query.pipe';
import { SocketGateway } from 'src/shared/gateway/socket.gateway';
import { SERVICE_STATUS } from './service-status';
import { WEBSOCKET_EVENT_SERVICE_UPDATE } from 'src/shared/constants/websocket-events';
import { ErrorTypes } from 'src/shared/constants/error';
@Injectable()
export class ServicesService {
  constructor(
    @Inject(Logger)
    private readonly logger: LoggerService,
    @InjectRepository(ServicesInfoEntity)
    private readonly infoRepository: Repository<ServicesInfoEntity>,
    @InjectRepository(ServicesApiEntity)
    private readonly apiRepository: Repository<ServicesApiEntity>,
    @InjectRepository(ServicesDependencyEntity)
    private readonly dependencyRepository: Repository<ServicesDependencyEntity>,
    private connection: Connection,
    private httpService: HttpService,
    private readonly io: SocketGateway,
  ) {}

  /**
   * 获取服务列表
   * @param query
   */
  async findAll(query: any) {
    const where: PlainObject = {
      isDelete: false,
    };
    if (query.classification) {
      where.classification = query.classification;
    }
    if (query.tags) {
      where.tags = query.tags;
    }
    if (query.keyword) {
      where.name = ILike(`%${query.keyword}%`);
    }
    const { conditions = {} } = query;
    conditions.where = where;
    const list =  this.infoRepository.findAndCount(conditions);
    return list;
  }

  /**
   * 通过ID获取服务详情
   * @param id
   */
  async findById(id: number) {
    const service = await this.infoRepository.findOne({
      where: {
        id,
      },
      relations: ['apis', 'dependencies', 'dependencies.service'],
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
   * 创建服务
   * @param data
   * @returns
   */
  async create(data: any) {
    const { apis, dependencies, ...serviceData } = data;
    if (isEmpty(serviceData.name)) {
      throw new ApiException({
        code: ServiceCodes.NAME_INVALID,
        message: '无效的服务名称',
      });
    }
    if (apis && Array.isArray(apis)) {
      const isInvalid = apis.some((api) => {
        if (isEmpty(api.name)) {
          return true;
        }
        return false;
      });
      if (isInvalid) {
        throw new ApiException({
          code: ServiceCodes.NAME_INVALID,
          message: '无效的接口名',
        });
      }
    }
    // 验证是否有同名服务
    const nameExisted = await this.infoRepository.findOne({
      where: {
        name: serviceData.name,
        isDelete: false,
      },
    });

    // 获取最大端口号服务
    const [serviceMaxPort] = await this.infoRepository.find({
      where: {
        isDelete: false,
      },
      order: { serverPort: 'DESC' },
    });
    if (nameExisted) {
      throw new ApiException({
        code: CommonCodes.DATA_EXISTED,
        message: '服务名称已存在',
      });
    }
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // 端口递增
      serviceData.serverPort =  Number(serviceMaxPort?.serverPort) + 1 || 8080;
      const service: any = await queryRunner.manager.save(this.infoRepository.create(serviceData));
      if (apis && Array.isArray(apis)) {
        const apisEntities = apis.map(api => this.apiRepository.create({
          ...api,
          serviceId: service.id,
        }));
        await queryRunner.manager.save(apisEntities);
      }

      if (dependencies && Array.isArray(dependencies)) {
        const dependenciesEntities = dependencies.map(dependency => this.dependencyRepository.create({
          ...dependency,
          dependencyId: dependency.dependencyId,
          serviceId: service.id,
        }));
        await queryRunner.manager.save(dependenciesEntities);
      }
      // 创建物理仓库
      await this.generateServiceRepository({
        projectDesc: data.description,
        projectName: data.name,
        saServiceID: service.id,
      });
      await queryRunner.commitTransaction();
      return {
        serviceId: service.id,
      };
    } catch (error) {
      this.logger.error(error);
      await queryRunner.rollbackTransaction();
      throw new ApiException({
        code: CommonCodes.CREATED_FAIL,
        message: '创建失败',
      });
    } finally {
      await queryRunner.release();
    }
  }

  /**
   *
   * @param data 更新服务
   */
  async update(id: number, data: any) {
    const { apis, dependencies, ...serviceData } = data;
    // 验证是否有同名模块
    const nameExisted = await this.infoRepository.findOne({
      where: {
        name: serviceData.name,
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
      // 更新serviceInfo信息
      await queryRunner.manager.update(ServicesInfoEntity, { id }, serviceData);

      // 更新serviceApi信息
      if (apis && Array.isArray(apis)) {
        await queryRunner.manager.delete(ServicesApiEntity, { serviceId: id });
        const apisEntities = apis.map(api => this.apiRepository.create({
          ...api,
          serviceId: id,
        }));
        await queryRunner.manager.save(apisEntities);
      }

      if (dependencies && Array.isArray(dependencies)) {
        await queryRunner.manager.delete(ServicesDependencyEntity, { serviceId: id });
        const dependenciesEntities = dependencies.map(dependency => this.dependencyRepository.create({
          ...dependency,
          dependencyId: dependency.dependencyId,
          serviceId: id,
        }));
        await queryRunner.manager.save(dependenciesEntities);
      }
      await queryRunner.commitTransaction();
      return {
        serviceId: id,
      };
    } catch (error) {
      this.logger.error(error);
      await queryRunner.rollbackTransaction();
      throw new ApiException({
        code: CommonCodes.UPDATED_FAIL,
        message: '更新失败',
      });
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 删除服务
   * @param id
   */
  async delete(ids: string[]) {
    const deleteIds = ids.filter(id => Number(id));
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // 更新info表数据，isDelete置为ture
      await queryRunner.manager.update(ServicesInfoEntity, {
        id: In(deleteIds),
      }, {
        isDelete: true,
      });
      // 更新api表数据，isDelete置为ture
      await queryRunner.manager.update(ServicesApiEntity, {
        serviceId: In(deleteIds),
      }, {
        isDelete: true,
      });
      // 更新dependency表数据，isDelete置为ture
      await queryRunner.manager.update(ServicesDependencyEntity, {
        serviceId: In(deleteIds),
      }, {
        isDelete: true,
      });
      await queryRunner.commitTransaction();
      return {
        id: In(deleteIds),
      };
    } catch (error) {
      this.logger.error(error);
      await queryRunner.rollbackTransaction();
      throw new ApiException({
        code: CommonCodes.DELETED_FAIL,
        message: '删除失败',
      });
    } finally {
      await queryRunner.release();
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
        await this.update(id, {
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
      const { data } = await this.httpService.get(`${BUILD_SERVICE_URL}?serverId=${serviceId}&ref=${branch}&userId=${userId}`).toPromise();
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
    const service = await this.infoRepository.findOne(serviceId);
    // 初始化成功后, 初始化次数加1
    if (status === SERVICE_STATUS.UN_BUILD) {
      update.initTimes = service.initTimes + 1;
    }
    // 构建成功后, 构建次数加1
    if (status === SERVICE_STATUS.BUILT) {
      update.builtTimes = service.builtTimes + 1;
    }
    await this.infoRepository.update(serviceId, update);
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
  private async getServiceById(id: number) {
    const service = await this.infoRepository.findOne({
      id,
      isDelete: false,
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
