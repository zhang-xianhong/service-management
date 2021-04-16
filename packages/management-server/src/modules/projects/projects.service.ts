import {
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  LoggerService,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize } from 'sequelize';
import { CommonCodes } from 'src/shared/constants/code';
import { PlainObject } from 'src/shared/pipes/query.pipe';
import { Created, Deleted, Updated } from 'src/shared/types/response';
import { ApiException } from 'src/shared/utils/api.exception';
import { escapeLike } from 'src/shared/utils/sql';
import { isEmpty, isNumeric, isUndefined } from 'src/shared/utils/validator';
import { FilesService } from '../files/files.service';
import { MODULE_TYPE } from '../owners/config';
import { OwnersModel } from '../owners/owners.model';
import { OwnersService } from '../owners/owners.service';
import { SettingsService } from '../settings/settings.service';
import { SettingsRolesModel } from '../settings/settings_roles.model';
import { UsersService } from '../users/users.service';
import { MembersDto } from './dto/member.dto';
import { ProjectDto, ProjectUpdateDto } from './dto/project.dto';
import { ProjectsMembersModel } from './projects-members.model';
import { ProjectsRolesModel } from './projects-roles.model';
import { ProjectsModel } from './projects.model';

@Injectable()
export class ProjectsService {
  constructor(
    @Inject(Logger)
    private readonly logger: LoggerService,
    @InjectModel(ProjectsModel)
    private readonly repository: typeof ProjectsModel,
    @InjectModel(ProjectsRolesModel)
    private readonly rolesRepository: typeof ProjectsRolesModel,
    @InjectModel(ProjectsMembersModel)
    private readonly membersRepository: typeof ProjectsMembersModel,
    private readonly settingsService: SettingsService,
    private readonly sequelize: Sequelize,
    private readonly userService: UsersService,
    private readonly fileService: FilesService,
    private readonly ownerService: OwnersService,
  ) {}

  /**
   * 获取项目列表
   * @param query
   */
  async findAll(query: any, getTotal = true): Promise<any> {
    const where: any = {
      isDelete: false,
    };

    if (query.keyword) {
      const likeString = escapeLike(query.keyword);
      where[Op.or] = [
        {
          name: {
            [Op.like]: likeString,
          },
        },
        {
          description: {
            [Op.like]: likeString,
          },
        },
      ];
    }

    const { conditions = {} } = query;
    conditions.where = where;
    if (!getTotal) {
      const rows = await this.repository.findAll({ where });
      return await this.getProjectRowsAfterFileKeyToUrl(rows);
    }
    conditions.include = [
      {
        model: OwnersModel,
        where: {
          moduleType: MODULE_TYPE.PROJECT,
        },
        attributes: ['userId'],
        required: false,
      },
    ];
    const { rows, count } = await this.repository.findAndCountAll(conditions);
    const ownerUsers = await this.ownerService.getOwnerUsers(rows);
    return {
      rows: await this.getProjectRowsAfterFileKeyToUrl(rows),
      count,
      ownerUsers,
    };
  }

  /**
   * 通过ID查找
   * @param id
   * @returns
   */
  async findOne(id: number) {
    const project: ProjectsModel = await this.repository.findOne({
      where: {
        id,
        isDelete: false,
      },
      include: [
        {
          model: OwnersModel,
          where: {
            moduleType: MODULE_TYPE.PROJECT,
          },
          attributes: ['userId'],
          required: false,
        },
      ],
    });
    if (!project) {
      throw new ApiException(
        {
          code: CommonCodes.NOT_FOUND,
          message: '项目不存在',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    const res: PlainObject = project.toJSON();
    try {
      res.template = await this.settingsService.findTemplateById(project.templateId);
    } catch (error) {
      res.template = {};
    }
    res.ownerUsers = await this.ownerService.getOwnerUsers([res]);
    return res;
  }

  /**
   * 创建项目
   * @param postData
   * @returns
   */
  async createProject(postData: ProjectDto): Promise<Created> {
    await this.checkNameUsable(postData.name);
    const transaction = await this.sequelize.transaction();
    const { owner, ...saveData } = postData;
    try {
      const res = await this.repository.create(saveData, {
        transaction,
      });
      if (!isUndefined(owner)) {
        await this.ownerService.updateOwners(
          MODULE_TYPE.PROJECT,
          res.id,
          owner,
          transaction,
        );
      }
      const settingsRoles = await this.settingsService.findAllProjectRoles(transaction);
      const projectRolesEntities: Array<PlainObject> = settingsRoles.map(role => ({
        settingsRoleId: role.id,
        projectId: res.id,
        isOwnerRole: role.isOwner,
      }));
      // 同步为项目创建初始角色
      const roles = await this.rolesRepository.bulkCreate(projectRolesEntities, {
        returning: true,
      });
      // 同步将负责人塞入负责人角色
      if (!isEmpty(owner)) {
        const ownerRole = roles.find(item => item.isOwnerRole);
        const memberModels = Array.from(new Set(owner.split(','))).map(item => ({
          userId: item,
          projectRoleId: ownerRole?.id,
          projectId: res.id,
        }));
        await this.membersRepository.bulkCreate(memberModels, {
          transaction,
        });
      }
      await transaction.commit();
      return {
        id: res.id,
      };
    } catch (error) {
      this.logger.error(error);
      await transaction.rollback();
      if (error instanceof ApiException) {
        throw error;
      }
      throw new ApiException({
        code: CommonCodes.CREATED_FAIL,
        error,
        message: '创建失败',
      });
    }
  }

  /**
   * 更新项目
   * @param postData
   * @returns
   */
  async updateProject(
    id: number,
    postData: ProjectUpdateDto,
  ): Promise<Updated> {
    const { name } = postData;
    if (name) {
      await this.checkNameUsable(name, id);
    }
    const { owner, ...saveData } = postData;
    const transaction = await this.sequelize.transaction();
    try {
      if (!isUndefined(owner)) {
        await this.ownerService.updateOwners(
          MODULE_TYPE.PROJECT,
          id,
          owner,
          transaction,
        );
      }
      await this.repository.update(
        {
          ...saveData,
          updateTime: new Date(),
        },
        {
          where: {
            id,
          },
          transaction,
        },
      );
      const ownerRole = await this.rolesRepository.findOne({
        where: {
          isOwnerRole: true,
          projectId: id,
        },
        transaction,
      });
      // 删除相应owner members
      await this.membersRepository.destroy({
        where: {
          projectId: id,
          projectRoleId: ownerRole.id,
        },
        transaction,
      });
      // 添加新的owner member成员
      if (!isEmpty(owner)) {
        const memberModels = Array.from(new Set(owner.split(','))).map(item => ({
          userId: item,
          projectRoleId: ownerRole?.id,
          projectId: id,
        }));
        await this.membersRepository.bulkCreate(memberModels, {
          transaction,
        });
      }
      await transaction.commit();
      return {
        id,
      };
    } catch (error) {
      this.logger.error(error);
      await transaction.rollback();
      if (error instanceof ApiException) {
        throw error;
      }
      throw new ApiException({
        code: CommonCodes.UPLOAD_FAIL,
        message: '更新失败',
      });
    }
  }

  /**
   * 删除项目，支持批量
   * @param ids
   * @returns
   */
  async deleteProjects(ids: number[]): Promise<Deleted> {
    const transaction = await this.sequelize.transaction();
    try {
      await this.repository.update(
        {
          isDelete: true,
        },
        {
          where: {
            id: {
              [Op.in]: ids,
            },
          },
          transaction,
        },
      );
      await this.ownerService.deleteOwners(
        MODULE_TYPE.PROJECT,
        ids,
        transaction,
      );
      await transaction.commit();
      return {
        ids,
      };
    } catch (error) {
      this.logger.error(error);
      await transaction.rollback();
      if (error instanceof ApiException) {
        throw error;
      }
      throw new ApiException({
        code: CommonCodes.DELETED_FAIL,
        message: '删除失败',
      });
    }
  }

  /**
   * 查找项目成员（树结构）
   * @param id
   * @returns
   */
  async findMembersByProjectId(id: number): Promise<{ roles: any[]; users: any[] }> {
    const roles = await this.rolesRepository.findAll({
      where: {
        isDelete: false,
        projectId: id,
      },
      attributes: { exclude: ['settingsProjectRoleId', 'isDelete', 'version'] },
      include: [
        {
          model: SettingsRolesModel,
          required: false,
          attributes: ['id', 'name', 'description'],
        },
        {
          model: ProjectsMembersModel,
          required: false,
          where: {
            isDelete: false,
          },
          attributes: { exclude: ['isDelete'] },
        },
      ],
    });
    // 取到所有member的uid,并记录，可能有重复的uid
    const memberIds = roles.reduce((userIds, role: any) => {
      const { members } = role;
      userIds.push(...members.map(member => member.userId));
      return userIds;
    }, []);
    // 去重
    const uniqueUserIds = Array.from(new Set(memberIds));
    const users = await this.userService.fetchUsersByUserIds(uniqueUserIds);
    return {
      roles,
      users,
    };
  }

  /**
   * 更新组内成员
   * @param projectId
   * @param postData
   * @returns
   */
  async updateMembers(projectId: number, postData: MembersDto): Promise<any> {
    const { projectRoleId, members } = postData;
    const transaction = await this.sequelize.transaction();
    try {
      await this.membersRepository.destroy({
        where: {
          projectId,
          projectRoleId,
        },
        transaction,
      });
      const memberModels = Array.from(new Set(members)).map(item => ({
        userId: item,
        projectRoleId,
        projectId,
      }));
      await this.membersRepository.bulkCreate(memberModels, {
        transaction,
      });
      await transaction.commit();
      return members;
    } catch (error) {
      this.logger.error(error);
      await transaction.rollback();
      if (error instanceof ApiException) {
        throw error;
      }
      throw new ApiException({
        code: CommonCodes.CREATED_FAIL,
        message: '创建失败',
      });
    }
  }

  /**
   * 移除项目组内成员
   * @param projectId
   * @param deleteIds
   */
  async deleteMembers(
    projectId: number,
    roleId: number,
    deleteIds: number[],
  ): Promise<Deleted> {
    await this.membersRepository.destroy({
      where: {
        projectId,
        projectRoleId: roleId,
        userId: {
          [Op.in]: deleteIds,
        },
      },
    });
    return {
      ids: deleteIds,
    };
  }

  /**
   * 校验名称唯一性
   * @param name
   * @param id
   * @returns
   */
  async checkNameUsable(name: string, id?: number) {
    const where: PlainObject = {
      name,
      isDelete: false,
    };
    if (isNumeric(id) && id > 0) {
      where.id = {
        [Op.not]: id,
      };
    }
    const project = await this.repository.findOne({
      where,
    });
    if (project) {
      throw new ApiException({
        code: CommonCodes.DATA_EXISTED,
        message: `项目名称[${name}]已存在`,
      });
    }
    return {
      usable: true,
    };
  }

  /**
   * 查找项目角色
   * @param projectId
   * @param projectRoleId
   * @returns
   */
  private async findRoleById(projectId: number, projectRoleId: number) {
    const projectRole = await this.rolesRepository.findOne({
      where: {
        projectId,
        id: projectRoleId,
        isDelete: false,
      },
    });
    if (!projectRole) {
      throw new ApiException(
        {
          code: CommonCodes.NOT_FOUND,
          message: '项目角色不存在',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return projectRole;
  }

  /**
   * 获取项目缩略图的URL
   * @param rows
   * @returns
   */
  private async getProjectRowsAfterFileKeyToUrl(rows: any) {
    const promises = rows.map(item => (item.thumbnail
      ? this.fileService.getObjectUrl(item.thumbnail)
      : Promise.resolve('')));
    const urls = await Promise.all(promises);
    return rows.map((item, index) => ({
      ...item.get({ plain: true }),
      thumbnail: urls[index],
    }));
  }
}
