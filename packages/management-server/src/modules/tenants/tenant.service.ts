import { HttpService, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize, Transaction } from 'sequelize';
import { CommonCodes, StatusCodes } from 'src/shared/constants/code';
// import { CREATE_IDAAS_TENANT } from 'src/shared/constants/url';
import { Deleted, Updated } from 'src/shared/types/response';
import { ApiException } from 'src/shared/utils/api.exception';
import { escapeLike } from 'src/shared/utils/sql';
import { UsersService } from '../users/users.service';
import { TenantUpdateInfoDto } from './dto/tenant-update-info.dto';
import { TenantContactModel } from './tenant-contact.model';
import { TenantInfoModel } from './tenant-info.model';
import { TenantManagerModel } from './tenant-manager.model';

@Injectable()
export class TenantService {
  constructor(
    private sequelize: Sequelize,
    private httpService: HttpService,
    private userService: UsersService,
    private readonly logger: Logger,
    @InjectModel(TenantInfoModel)
    private readonly tenantRepository: typeof TenantInfoModel,
    @InjectModel(TenantContactModel)
    private readonly contactRepository: typeof TenantContactModel,
    @InjectModel(TenantManagerModel)
    private readonly managerRepository: typeof TenantManagerModel,
  ) { }

  async findAll(query) {
    const where: any = {
      isDelete: false,
    };
    if (query.name) {
      where.name = {
        [Op.like]: escapeLike(query.name),
      };
    }
    const { conditions = {} } = query;
    conditions.where = where;
    conditions.include = [{
      model: TenantContactModel,
      required: false,
      attributes: { exclude: ['isDelete'] },
    }, {
      model: TenantManagerModel,
      required: false,
      attributes: { exclude: ['isDelete'] },
    }];
    return await this.tenantRepository.findAndCountAll(conditions);
  }

  async findById(id: string) {
    const tenant = await this.tenantRepository.findOne({
      where: {
        id,
        isDelete: false,
      },
      include: [{
        model: TenantContactModel,
        required: false,
        attributes: { exclude: ['isDelete'] },
      }, {
        model: TenantManagerModel,
        required: false,
        attributes: { exclude: ['isDelete'] },
      }],
    });
    if (!tenant) {
      throw new ApiException({
        code: CommonCodes.NOT_FOUND,
        message: '租户不存在',
      }, HttpStatus.NOT_FOUND);
    }
    return tenant;
  }

  async createTenant(data): Promise<any> {
    const { contact, manager, ...infoData } = data;
    // 验证是否有同名租户
    const tenant: TenantInfoModel = await this.tenantRepository.findOne({
      where: {
        name: infoData.name,
        isDelete: false,
      },
    });
    if (tenant) {
      throw new ApiException({
        code: CommonCodes.DATA_EXISTED,
        message: '租户名称已存在',
      });
    }
    const managerInfo: TenantManagerModel = await this.managerRepository.findOne({
      where: {
        account: manager.account,
        isDelete: false,
      },
    });
    if (managerInfo) {
      throw new ApiException({
        code: CommonCodes.DATA_EXISTED,
        message: '租户管理员账号已存在',
      });
    }
    const transaction: Transaction = await this.sequelize.transaction();
    try {
      // 添加租户基本信息
      const res = await this.tenantRepository.create(infoData, { transaction });
      // 添加租户联系人
      await this.contactRepository.create(
        {
          ...contact,
          tenantId: res.id,
        },
        {
          transaction,
        },
      );
      // 添加租户管理员
      await this.managerRepository.create(
        {
          ...manager,
          tenantId: res.id,
        },
        {
          transaction,
        },
      );
      await transaction.commit();
      return {
        id: res.id,
      };
      // 创建iDaas租户 需等待java接口联调
      // const { data } = await this.httpService.post(`${CREATE_IDAAS_TENANT}/${res.id}`).toPromise();
      // if (data?.code === 0) {
      //   await transaction.commit();
      //   return {
      //     id: res.id,
      //     idaas: data.data,
      //   };
      // }
      // throw data.message;
    } catch (error) {
      this.logger.error(error);
      await transaction.rollback();
      throw new ApiException({
        code: CommonCodes.CREATED_FAIL,
        message: '新增租户失败',
      });
    }
  }

  /**
   * 修改租户信息
   * @param id
   * @param data
   * @returns
   */
  async updateTenant(id: number, data: TenantUpdateInfoDto): Promise<Updated> {
    const transaction: Transaction = await this.sequelize.transaction();
    try {
      const existTenant: TenantInfoModel = await this.tenantRepository.findOne({
        where: {
          id,
          isDelete: false,
          status: StatusCodes.STATUS_AVAILABLE,
        },
      });
      if (!existTenant) {
        throw new ApiException({
          code: CommonCodes.NOT_FOUND,
          message: '租户不存在',
        });
      }
      await this.tenantRepository.update(data, {
        where: {
          id,
        },
        transaction,
      });
      await transaction.commit();
      return {
        id,
      };
    } catch (error) {
      this.logger.error(error);
      await transaction.rollback();
      throw new ApiException({
        code: CommonCodes.UPDATED_FAIL,
        message: '租户更新失败',
        error: error.message || error,
      });
    }
  }

  /**
   * 删除租户
   * @param id
   * @returns
   */
  async deleteTenant(id: number): Promise<Deleted> {
    try {
      const existTenant: TenantInfoModel = await this.tenantRepository.findOne({
        where: {
          id,
          isDelete: false,
        },
      });
      if (!existTenant) {
        throw new ApiException({
          code: CommonCodes.NOT_FOUND,
          message: '租户不存在',
        });
      }
      if (existTenant.status === StatusCodes.STATUS_AVAILABLE) {
        throw new ApiException({
          code: CommonCodes.DELETED_FAIL,
          message: '使用中租户不可删除！',
        });
      }
      await this.tenantRepository.update({
        isDelete: true,
      }, {
        where: {
          id,
        },
      });
      return {
        ids: [id],
      };
    } catch (error) {
      this.logger.error(error);
      throw new ApiException({
        code: CommonCodes.DELETED_FAIL,
        message: '租户删除失败',
        error: error.message || error,
      });
    }
  }

  /**
   * 冻结租户
   * @param id
   * @returns
   */
  async freezeTenant(id: number): Promise<Updated> {
    try {
      const existTenant: TenantInfoModel = await this.tenantRepository.findOne({
        where: {
          id,
          isDelete: false,
        },
      });
      if (!existTenant) {
        throw new ApiException({
          code: CommonCodes.NOT_FOUND,
          message: '租户不存在',
        });
      }
      await this.tenantRepository.update({
        status: StatusCodes.STATUS_UNAVAILABLE,
      }, {
        where: {
          id,
        },
      });
      return {
        id,
      };
    } catch (error) {
      this.logger.error(error);
      throw new ApiException({
        code: CommonCodes.UPDATED_FAIL,
        message: '租户冻结失败',
        error: error.message || error,
      });
    }
  }
  /**
   * 启用租户
   * @param id
   * @returns
   */
  async enableTenant(id: number): Promise<Updated> {
    try {
      const existTenant: TenantInfoModel = await this.tenantRepository.findOne({
        where: {
          id,
          isDelete: false,
        },
      });
      if (!existTenant) {
        throw new ApiException({
          code: CommonCodes.NOT_FOUND,
          message: '租户不存在',
        });
      }
      await this.tenantRepository.update({
        status: StatusCodes.STATUS_AVAILABLE,
      }, {
        where: {
          id,
        },
      });
      return {
        id,
      };
    } catch (error) {
      this.logger.error(error);
      throw new ApiException({
        code: CommonCodes.UPDATED_FAIL,
        message: '租户冻结失败',
        error: error.message || error,
      });
    }
  }

  /**
   * 获取租户部门树
   * @param tenantId
   * @param deptId
   * @param level
   * @returns
   */
  async getDepartmentTree(tenantId: number, deptId = 0, level = 0) {
    const tenantRequest = Number(deptId) === 0 ? this.tenantRepository.findOne({
      where: {
        id: tenantId,
        isDelete: false,
      },
    }) : Promise.resolve(null);
    const departmentTreeRequest = this.userService.fetchDepartmentTree(deptId, level);
    const [tenant, department] = await Promise.all([tenantRequest, departmentTreeRequest]);
    const res = {
      tenant,
      ...department,
    };
    return res;
  }
}
