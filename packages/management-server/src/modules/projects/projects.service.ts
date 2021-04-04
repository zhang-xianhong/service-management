import {  HttpStatus,  Inject,  Injectable, Logger, LoggerService } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize } from 'sequelize';
import { CommonCodes } from 'src/shared/constants/code';
import { PlainObject } from 'src/shared/pipes/query.pipe';
import { Created, Deleted, Rows, RowsAndCount, Updated } from 'src/shared/types/response';
import { ApiException } from 'src/shared/utils/api.exception';
import { escapeLike } from 'src/shared/utils/sql';
import { SettingsService } from '../settings/settings.service';
import { SettingsProjectRolesModel } from '../settings/settings_project_roles.model';
import { UsersService } from '../users/users.service';
import { MemberDto } from './dto/member.dto';
import { ProjectDto } from './dto/project.dto';
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
  ) {}

  /**
   * 获取项目列表
   * @param query
   */
  async findAll(query: any, getTotal = true): Promise<RowsAndCount<ProjectsModel> | Rows<ProjectsModel>> {
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
      return await this.repository.findAll({ where });
    }
    return await this.repository.findAndCountAll(conditions);
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
    const res: PlainObject = project.toJSON();
    try {
      res.template = await this.settingsService.findTemplateById(project.templateId);
    } catch (error) {
      res.template = {};
    }
    if (!project) {
      throw new ApiException({
        code: CommonCodes.NOT_FOUND,
        message: '项目不存在',
      }, HttpStatus.NOT_FOUND);
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
  async updateProject(id: number, postData: ProjectDto): Promise<Updated> {
    const project = await this.repository.findOne({
      where: {
        name: postData.name,
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
   * 项项目组内添加成员
   * @param projectId
   * @param postData
   * @returns
   */
  async addMember(projectId: number, { userId, projectRoleId }: MemberDto): Promise<Created> {
    await this.findRoleById(projectId, projectRoleId);
    const member = await this.membersRepository.findOne({
      where: {
        projectRoleId,
        userId,
        projectId,
        isDelete: false,
      },
    });
    if (member) {
      throw new ApiException({
        code: CommonCodes.DATA_EXISTED,
        message: '该用户已在当前组内',
      });
    }
    const res = await this.membersRepository.create({
      projectId,
      projectRoleId,
      userId,
    });
    return {
      id: res.id,
    };
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
}
