import {  Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
import {  VersionControlModel } from './version-control.model';
import { InjectModel } from '@nestjs/sequelize';
import sequelize, { Sequelize  } from 'sequelize';
import { MODULE_TYPE } from './config';
import { PlainObject } from 'src/shared/pipes/query.pipe';
import { ApiException } from 'src/shared/utils/api.exception';
import { CommonCodes } from 'src/shared/constants/code';

interface GhostVersions {
  preGhostVersion: number
  newGhostVersion: number
}
@Injectable()
export class VersionControlService {
  constructor(
    @Inject(Logger)
    private readonly logger: LoggerService,
    private sequelize: Sequelize,
    @InjectModel(VersionControlModel) private readonly repository: typeof VersionControlModel,
  ) { }

  /**
   * 创建版本控制
   * @param postData
   * @param transaction
   * @returns
   */
  async createVersion(postData: PlainObject, transaction?: sequelize.Transaction): Promise<number> {
    const res = await this.repository.create(postData, {
      transaction,
    });
    return res.id;
  }

  /**
   * 获取即时版本
   * @param moduleType
   * @param moduleId
   * @param transaction
   * @returns
   */
  async findAndUpdateGhostVersion(
    moduleType: MODULE_TYPE,
    moduleId: number,
    transaction: sequelize.Transaction,
  ): Promise<GhostVersions> {
    const version = await this.repository.findOne({
      where: {
        moduleType,
        moduleId,
      },
      transaction,
    });
    if (!version) {
      throw new ApiException({
        code: CommonCodes.NOT_FOUND,
        message: '版本控制不存在',
      });
    }
    const newGhostVersion = version.ghostVersion + 1;
    await this.repository.update({
      ghostVersion: newGhostVersion,
    }, {
      where: {
        id: version.id,
      },
      transaction,
    });
    return {
      preGhostVersion: version.ghostVersion,
      newGhostVersion,
    };
  }
}
