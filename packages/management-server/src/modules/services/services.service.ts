import { HttpService, HttpStatus, Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
import { CommonCodes, ServiceCodes } from 'src/shared/constants/code';
import { ApiException } from 'src/shared/utils/api.exception';
import { ServicesApiModel } from './service-api.entity';
import { ServicesDependencyModel } from './service-dependency.entity';
import { ServicesInfoModel } from './service-info.entity';
import { INIT_SERVICE_URL, SERVICE_SSHURI } from 'src/shared/constants/url';
import { isEmpty } from 'src/shared/utils/validator';
import { PlainObject } from 'src/shared/pipes/query.pipe';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize } from 'sequelize';
@Injectable()
export class ServicesService {
  constructor(
    @Inject(Logger)
    private readonly logger: LoggerService,
    private sequelize: Sequelize,
    @InjectModel(ServicesInfoModel) private readonly infoRepository: typeof ServicesInfoModel,
    @InjectModel(ServicesApiModel) private readonly apiRepository: typeof ServicesApiModel,
    @InjectModel(ServicesDependencyModel) private readonly dependencyRepository: typeof ServicesDependencyModel,
    private httpService: HttpService,
  ) { }

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
      where.name = { [Op.like]: `%${query.keyword}%` };
    }
    const { conditions = {} } = query;
    conditions.where = where;
    const list = this.infoRepository.findAndCountAll(conditions);
    return list;
  }

  /**
   * 通过ID获取服务详情
   * @param id
   */
  async findById(id: number) {
    console.log(typeof ServicesApiModel);

    const service = await this.infoRepository.findOne({
      where: {
        id,
      },
      // include: [{
      //   model: ServicesApiModel,
      //   attributes: { exclude: ['isDelete'] },
      // }],
      // include: [ServicesApiModel],
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
    const [serviceMaxPort] = await this.infoRepository.findAll({
      where: {
        isDelete: false,
      },
      order: [['serverPort', 'DESC']],
    });
    if (nameExisted) {
      throw new ApiException({
        code: CommonCodes.DATA_EXISTED,
        message: '服务名称已存在',
      });
    }
    try {
      await this.sequelize.transaction(async (t) => {
        const transactionHost = { transaction: t };

        serviceData.serverPort = Number(serviceMaxPort?.serverPort) + 1 || 8080;
        const service: any = await this.infoRepository.create(serviceData, transactionHost);
        if (apis && Array.isArray(apis)) {
          const apisEntities = apis.map(api => ({
            ...api,
            serviceId: service.id,
          }));
          await this.apiRepository.bulkCreate(apisEntities, transactionHost);
        }

        if (dependencies && Array.isArray(dependencies)) {
          const dependenciesEntities = dependencies.map(dependency => ({
            ...dependency,
            dependencyId: dependency.dependencyId,
            serviceId: service.id,
          }));
          console.log(dependenciesEntities);
          await this.dependencyRepository.bulkCreate(dependenciesEntities, transactionHost);
        }
      });
    } catch (err) {
      // 一旦发生错误，事务会回滚
    }
  }

  /**
   *
   * @param data 更新服务
   */
  async update(id: number, data: any) {
    const { apis, dependencies, ...serviceData } = data;
    // 验证是否有同名模块
    const nameExisted = await this.infoRepository.findOne<ServicesInfoModel>({
      where: {
        name: serviceData.name,
        isDelete: false,
        id: [Op.notIn[id]],
      },
    });
    if (nameExisted) {
      throw new ApiException({
        code: CommonCodes.DATA_EXISTED,
        message: '模型名称已存在',
      });
    }
    try {
      await this.sequelize.transaction(async (t) => {
        const transactionHost = { transaction: t };

        // 更新serviceApi信息
        if (apis && Array.isArray(apis)) {
          await this.apiRepository.destroy<ServicesApiModel>({
            where: {
              serviceId: id,
            },
          });
          const apisEntities = apis.map(api => (
            {
              ...api,
              serviceId: id,
            }
          ));
          await this.apiRepository.bulkCreate(apisEntities, transactionHost);
        }

        if (dependencies && Array.isArray(dependencies)) {
          await this.dependencyRepository.destroy({
            where: {
              serviceId: id,
            },
          });
          const dependenciesEntities = dependencies.map(dependency => ({
            ...dependency,
            dependencyId: dependency.dependencyId,
            serviceId: id,
          }));
          await this.dependencyRepository.bulkCreate(dependenciesEntities, transactionHost);
        }
      });
    } catch (err) {
      // 一旦发生错误，事务会回滚
    }
  }

  /**
   * 删除服务
   * @param id
   */
  async delete(ids: string[]) {
    const transaction = await this.sequelize.transaction();
    try {
      const deleteIds = ids.filter(id => Number(id));
      // 更新info表数据，isDelete置为ture
      await this.infoRepository.update({
        isDelete: true,
      }, {
        where: {
          id: { [Op.in]: deleteIds },
        },
        transaction,
      });
      // 更新api表数据，isDelete置为ture
      await this.apiRepository.update({
        isDelete: true,
      }, {
        where: {
          serviceId: { [Op.in]: deleteIds },
        }, transaction,
      });
      // 更新dependency表数据，isDelete置为ture
      await this.dependencyRepository.update({
        isDelete: true,
      }, {
        where: {
          serviceId: { [Op.in]: deleteIds },
        }, transaction,
      });
      await transaction.commit();
      return {
        id: deleteIds,
      };
    } catch (err) {
      // 一旦发生错误，事务会回滚
      await transaction.rollback();
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
}
