import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonCodes } from 'src/shared/constants/code';
import { ApiException } from 'src/shared/utils/api.exception';
import { Connection, Repository } from 'typeorm';
import { ServicesApiEntity } from './services-api.entity';
import { ServicesDependencyEntity } from './services-dependency.entity';
import { ServicesInfoEntity } from './services-info.entity';

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
    const { apis, dependencies, ...serviceData } = data;
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
          serviceId: service.id,
        }));
        await queryRunner.manager.save(apisEntities);
      }

      if (dependencies && Array.isArray(dependencies)) {
        await queryRunner.manager.delete(ServicesDependencyEntity, { serviceId: id });
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
        isDelete: 1,
      });
      // 更新api表数据，isDelete置为1
      await queryRunner.manager.update(ServicesApiEntity, {
        serviceId: id,
      }, {
        isDelete: 1,
      });
      // 更新dependency表数据，isDelete置为1
      await queryRunner.manager.update(ServicesDependencyEntity, {
        serviceId: id,
      }, {
        isDelete: 1,
      });
      await queryRunner.commitTransaction();
      return {
        affected: serviceInfo.affected,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new ApiException({
        code: CommonCodes.CREATED_FAIL,
        message: '删除失败',
      });
    } finally {
      await queryRunner.release();
    }
  }
}
