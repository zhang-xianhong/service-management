import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import sequelize, { Op, Sequelize } from 'sequelize';
import { isUndefined } from 'src/shared/utils/validator';
import { UsersService } from '../users/users.service';
import { MODULE_TYPE } from './config';
import { OwnersModel } from './owners.model';

@Injectable()
export class OwnersService {
  constructor(
    private readonly logger: Logger,
    private readonly sequelize: Sequelize,
    @InjectModel(OwnersModel)
    private readonly repository: typeof OwnersModel,
    private readonly usersService: UsersService,
  ) {}

  /**
   * 更新模块的owners
   * @param moduleType
   * @param moduleId
   * @param ownerIds
   * @param transaction
   */
  async updateOwners(
    moduleType: MODULE_TYPE,
    moduleId: number,
    ownerIds: number[] | string,
    transaction?: sequelize.Transaction,
  ) {
    console.log(ownerIds);
    if (isUndefined(ownerIds)) {
      return;
    }
    if (typeof ownerIds === 'string') {
      // eslint-disable-next-line no-param-reassign
      ownerIds = ownerIds.split(',') as unknown as number[];
    }
    if (Array.isArray(ownerIds)) {
      // eslint-disable-next-line no-param-reassign
      ownerIds = Array.from(new Set(ownerIds));
    }
    try {
      // 先删除
      await this.repository.destroy({
        where: {
          moduleType,
          moduleId,
        },
        transaction,
      });
      // 后新增
      const owners = ownerIds.map(userId => ({
        moduleType,
        moduleId,
        userId,
      }));
      await this.repository.bulkCreate(owners);
    } catch (error) {
      throw error;
    }
  }

  /**
   * 删除操作
   * @param moduleType
   * @param moduleIds
   * @param transaction
   */
  async deleteOwners(moduleType: MODULE_TYPE, moduleIds: number[],  transaction?: sequelize.Transaction) {
    await this.repository.destroy({
      where: {
        moduleType,
        moduleId: {
          [Op.in]: moduleIds,
        },
      },
      transaction,
    });
  }


  /**
   * 获取owner用户
   * @param rows
   * @returns
   */
  async getOwnerUsers(rows: any[]) {
    const userIds = [];
    rows.forEach((row) => {
      row.owners.map(owner => userIds.push(owner.userId));
    });
    const ids = Array.from(new Set(userIds));
    if (!ids.length) {
      return [];
    }
    return await this.usersService.fetchUsersByUserIds(ids);
  }
}
