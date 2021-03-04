import { HttpService, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonCodes } from 'src/shared/constants/code';
import { ApiException } from 'src/shared/utils/api.exception';
import { Connection, Not, Repository } from 'typeorm';
import { ServicesApiEntity } from './service-api.entity';
import { ServicesDependencyEntity } from './service-dependency.entity';
import { ServicesInfoEntity } from './service-info.entity';
import { BUILD_SERVICE_URL, INIT_SERVICE_URL } from 'src/shared/constants/url';
@Injectable()
export class ServicesService {
  constructor(
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
  async findAll(query, where) {
    Object.assign(where, {
      isDelete: 0,
    });
    console.log(where);

    const list =  this.infoRepository.findAndCount({
      ...query,
      where,
    });
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
    // 验证是否有同名服务
    const nameExisted = await this.infoRepository.findOne({
      where: {
        name: serviceData.name,
        isDelete: false,
      },
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
      console.log(error);

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
      console.log(error);

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
        isDelete: 0,
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
      // 更新info表数据，isDelete置为1
      const serviceInfo: any = await queryRunner.manager.update(ServicesInfoEntity, {
        id,
      }, {
        isDelete: true,
      });
      // 更新api表数据，isDelete置为1
      await queryRunner.manager.update(ServicesApiEntity, {
        serviceId: id,
      }, {
        isDelete: true,
      });
      // 更新dependency表数据，isDelete置为1
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
      return await this.httpService.get(`${INIT_SERVICE_URL}${id}`).toPromise();
    } catch (error) {
      throw new ApiException({
        code: CommonCodes.INITIALIZE_FAIL,
        message: '初始化失败',
      });
    }
  }

  /**
   * 构建服务
   * @param id
   */
  async buildService() {
    try {
      return await this.httpService.post(`${BUILD_SERVICE_URL}`, {
        token: '6c850f80c9b1f80b12e0361ef6c36e',
        ref: 'develop',
        applicationName: 'sa',
        projectId: 11,
      }).toPromise();
    } catch (error) {
      console.log('error', error);
      throw new ApiException({
        code: CommonCodes.INITIALIZE_FAIL,
        message: '构建失败',
      });
    }
  }
}
