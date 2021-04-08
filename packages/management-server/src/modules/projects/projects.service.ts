import {  HttpStatus,  Inject,  Injectable, Logger, LoggerService } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize } from 'sequelize';
import { CommonCodes } from 'src/shared/constants/code';
import { PlainObject } from 'src/shared/pipes/query.pipe';
import { Created, Deleted, Updated } from 'src/shared/types/response';
import { ApiException } from 'src/shared/utils/api.exception';
import { escapeLike } from 'src/shared/utils/sql';
import { FilesService } from '../files/files.service';
import { SettingsService } from '../settings/settings.service';
import { SettingsProjectRolesModel } from '../settings/settings_project_roles.model';
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
    conditions.raw = true;
    if (!getTotal) {
      const rows = await this.repository.findAll({ where });
      return await this.getProjectRowsAfterFileKeyToUrl(rows);
    }
    const { rows, count } = (await this.repository.findAndCountAll(conditions));
    return {
      rows: await this.getProjectRowsAfterFileKeyToUrl(rows),
      count,
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
    });
    if (!project) {
      throw new ApiException({
        code: CommonCodes.NOT_FOUND,
        message: '项目不存在',
      }, HttpStatus.NOT_FOUND);
    }
    const res: PlainObject = project.toJSON();
    try {
      res.template = await this.settingsService.findTemplateById(project.templateId);
    } catch (error) {
      res.template = {};
    }
    return res;
  }

  /**
   * 创建项目
   * @param postData
   * @returns
   */
  async createProject(postData: ProjectDto): Promise<Created> {
    const project = await this.repository.findOne({
      where: {
        name: postData.name,
        isDelete: false,
      },
    });
    if (project) {
      throw new ApiException({
        code: CommonCodes.DATA_EXISTED,
        message: `项目名称${postData.name}已存在`,
      });
    }
    const transaction = await this.sequelize.transaction();
    try {
      const res = await this.repository.create(postData);
      const settingsRoles = await this.settingsService.findAllProjectRoles(transaction);
      const projectRolesEntities: Array<PlainObject> = settingsRoles.map(role => ({
        settingsProjectRoleId: role.id,
        projectId: res.id,
      }));
      // 同步为项目创建初始角色
      await this.rolesRepository.bulkCreate(projectRolesEntities);
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
        message: '创建失败',
      });
    }
  }

  /**
   * 更新项目
   * @param postData
   * @returns
   */
  async updateProject(id: number, postData: ProjectUpdateDto): Promise<Updated> {
    const { name } = postData;
    if (name) {
      const project = await this.repository.findOne({
        where: {
          name,
          isDelete: false,
          id: {
            [Op.not]: id,
          },
        },
      });
      if (project) {
        throw new ApiException({
          code: CommonCodes.DATA_EXISTED,
          message: `项目名称${postData.name}已存在`,
        });
      }
    }
    await this.repository.update({
      ...postData,
      updateTime: new Date(),
    }, {
      where: {
        id,
      },
    });
    return {
      id,
    };
  }


  /**
   * 删除项目，支持批量
   * @param ids
   * @returns
   */
  async deleteProjects(ids: number[]): Promise<Deleted> {
    const [deleted] = await this.repository.update({
      isDelete: true,
    }, {
      where: {
        id: {
          [Op.in]: ids,
        },
      },
    });
    if (deleted === ids.length) {
      return {
        ids,
      };
    }
    throw new ApiException({
      code: CommonCodes.DELETED_FAIL,
      message: '删除失败',
    });
  }

  /**
   * 查找项目成员（树结构）
   * @param id
   * @returns
   */
  async findMembersByProjectId(id: number): Promise<{roles: any[], users: any[]}> {
    const roles = await this.rolesRepository.findAll({
      where: {
        isDelete: false,
        projectId: id,
      },
      attributes: { exclude: ['settingsProjectRoleId', 'isDelete', 'version'] },
      include: [
        {
          model: SettingsProjectRolesModel,
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
  async deleteMembers(projectId: number, roleId: number, deleteIds: number[]): Promise<Deleted> {
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
      throw new ApiException({
        code: CommonCodes.NOT_FOUND,
        message: '项目角色不存在',
      }, HttpStatus.NOT_FOUND);
    }
    return projectRole;
  }


  private async getProjectRowsAfterFileKeyToUrl(rows: any[]) {
    const promises = rows.map(item => (item.thumbnail ? this.fileService.getObjectUrl(item.thumbnail) : Promise.resolve('')));
    const urls = await Promise.all(promises);
    return rows.map((item, index) => ({
      ...item,
      thumbnail: urls[index],
    }));
  }
}
