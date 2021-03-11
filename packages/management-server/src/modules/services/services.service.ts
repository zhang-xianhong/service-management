import { HttpService, HttpStatus, Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonCodes, ServiceCodes } from 'src/shared/constants/code';
import { ApiException } from 'src/shared/utils/api.exception';
import { Connection, ILike, Not, Repository } from 'typeorm';
import { ServicesApiEntity } from './service-api.entity';
import { ServicesDependencyEntity } from './service-dependency.entity';
import { ServicesInfoEntity } from './service-info.entity';
import { BUILD_SERVICE_URL, INIT_SERVICE_URL, SERVICE_SSHURI } from 'src/shared/constants/url';
import { isEmpty } from 'src/shared/utils/validator';
import { PlainObject } from 'src/shared/pipes/query.pipe';
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

  async create(data: any) {
    const { apis, dependencies, ...serviceData } = data;
    if (isEmpty(serviceData.name)) {
      throw new ApiException({
        code: ServiceCodes.NAME_INVALID,
        message: '无效的服务名称',
      });
    }
    if (apis && Array.isArray(apis)) {
      const isInvalid = apis.some((service) => {
        if (isEmpty(service.name)) {
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
  async delete(id: number) {
    const service = await this.infoRepository.findOne({
      where: {
        id,
        isDelete: false,
      },
    });
    if (!service) {
      throw new ApiException({
        code: CommonCodes.NOT_FOUND,
        message: '服务不存在',
      }, HttpStatus.NOT_FOUND);
    }
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // 更新info表数据，isDelete置为ture
      const serviceInfo: any = await queryRunner.manager.update(ServicesInfoEntity, {
        id,
      }, {
        isDelete: true,
      });
      // 更新api表数据，isDelete置为ture
      await queryRunner.manager.update(ServicesApiEntity, {
        serviceId: id,
      }, {
        isDelete: true,
      });
      // 更新dependency表数据，isDelete置为ture
      await queryRunner.manager.update(ServicesDependencyEntity, {
        serviceId: id,
      }, {
        isDelete: true,
      });
      await queryRunner.commitTransaction();
      return {
        affected: serviceInfo.affected,
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
    try {
      const { data }: any = await this.httpService.get(`${INIT_SERVICE_URL}${id}`).toPromise();
      if (data?.code === 0) {
        const { data: { sshURI } } = data;
        this.update(id, {
          deposit: `${SERVICE_SSHURI}${sshURI}`,
          status: 1,
        });
        return true;
      }
      throw new ApiException({
        code: CommonCodes.INITIALIZE_FAIL,
        message: data.message,
      }, HttpStatus.BAD_REQUEST);
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
    try {
      const { data } =  await this.httpService.get(`${BUILD_SERVICE_URL}?serverId=${serviceId}&ref=${branch}&userId=${userId}`).toPromise();
      if (data?.code === 0) {
        return data.data;
      }
      throw new ApiException({
        code: CommonCodes.BUILD_FAIL,
        message: data.message,
      });
    } catch (error) {
      this.logger.error(error);
      throw new ApiException({
        code: CommonCodes.BUILD_FAIL,
        message: '服务构建失败',
        error,
      }, HttpStatus.BAD_REQUEST);
    }
  }
}
