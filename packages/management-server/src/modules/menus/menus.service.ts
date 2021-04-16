import { HttpStatus, Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
import { ApiException } from 'src/shared/utils/api.exception';
import { CommonCodes, SettingCodes } from 'src/shared/constants/code';
import { InjectModel } from '@nestjs/sequelize';
import { Created, Deleted, Rows, Updated } from 'src/shared/types/response';
import { Tree } from 'src/shared/types/tree';

import { MenusModel } from './menus.model';
import { assemblyRoleTree, getTreeArr } from 'src/shared/utils/util';
import { MenuPermissionModel } from './menu-permission.model';
import { SettingsRolesModel } from '../settings/settings_roles.model';

@Injectable()
export class MenusService {
  constructor(
    @Inject(Logger)
    private readonly logger: LoggerService,
    @InjectModel(MenusModel)
    private readonly menuRepository: typeof MenusModel,
    @InjectModel(MenuPermissionModel)
    private readonly menuPermissionRepository: typeof MenuPermissionModel,
    @InjectModel(SettingsRolesModel)
    private readonly roleRepository: typeof SettingsRolesModel,
  ) { }

  /**
   * 获取所有菜单
   * @param query
   * @param getTotal
   */
  async findAllMenus(): Promise<Rows<MenusModel>> {
    return await this.menuRepository.findAll({
      where: { isDelete: false },
    });
  }
  /**
   * 获取角色菜单
   * @param query
   * @param getTotal
   */
  async getRoleMenus(id) {
    const data: SettingsRolesModel = await this.roleRepository.findOne({
      where: {
        id,
        isDelete: false,
      },
      include: [{
        model: MenuPermissionModel,
        required: false,
        attributes: ['menuId', 'authorization', 'description'],
        include: [{
          model: MenusModel,
          required: false,
          attributes: ['id', 'parentId', 'name', 'description'],
        }],
      }],
    });
    if (!data) {
      throw new ApiException({
        code: CommonCodes.NOT_FOUND,
        message: '数据不存在',
      }, HttpStatus.NOT_FOUND);
    }

    const rawData = data.get({ plain: true });
    const list = assemblyRoleTree(rawData.menus);
    return getTreeArr({ key: 'id', pKey: 'parentId', data: list });;
  }

  /**
   * 获取菜单树
   * @param query
   * @param getTotal
   */
  async findMenusTree(): Promise<Tree[]> {
    const categories: MenusModel[] = await this.menuRepository.findAll({
      raw: true,
    });
    return getTreeArr({ key: 'id', pKey: 'parentId', data: categories });
  }


  /**
   * 新增菜单
   * @param data
   */
  async createMenu(data: any): Promise<Created> {
    try {
      const { parentId, ...menu } = data;
      if (parentId) {
        const parent: MenusModel = await this.menuRepository.findOne({ where: { id: parentId } });
        if (!parent) {
          throw new ApiException({
            code: CommonCodes.NOT_FOUND,
            message: '父级分类不存在',
          }, HttpStatus.NOT_FOUND);
        }
        menu.parentId = parentId;
      }
      const result: MenusModel = await this.menuRepository.create(menu);
      return {
        id: result.id,
      };
    } catch (error) {
      this.logger.error(error);
      throw new ApiException({
        code: CommonCodes.CREATED_FAIL,
        message: '新增菜单失败',
      });
    }
  }

  /**
   * 更新菜单
   * @param data
   */
  async updateMenu(id: number, data: any): Promise<Updated> {
    try {
      const menu: MenusModel = await this.menuRepository.findOne({
        where: {
          isDelete: false,
          id,
        },
      });
      if (!menu) {
        throw new ApiException({
          code: CommonCodes.NOT_FOUND,
          message: '菜单不存在',
        }, HttpStatus.NOT_FOUND);
      }
      await this.menuRepository.update(data, {
        where: { id },
      });
      return {
        id,
      };
    } catch (error) {
      this.logger.error(error);
      throw new ApiException({
        code: CommonCodes.UPDATED_FAIL,
        message: '更新菜单失败！',
      });
    }
  }

  /**
   * 删除分类
   * @param data
   */
  async deleteMenu(id: number): Promise<Deleted> {
    try {
      const menu: MenusModel = await this.menuRepository.findOne({
        where: {
          isDelete: false,
          id,
        },
      });
      if (!menu) {
        throw new ApiException({
          code: CommonCodes.NOT_FOUND,
          message: '菜单不存在',
        });
      }
      const data: MenusModel[] = await this.menuRepository.findAll({
        where: {
          parentId: id,
          isDelete: false,
        },
        raw: true,
      });
      if (data.length) {
        throw new ApiException({
          code: SettingCodes.EXIST_CHILD_NODES,
          message: '菜单存在子菜单，请先删除子菜单',
        });
      }
      await this.menuRepository.update({
        isDelete: true,
      }, {
        where: { id },
      });
      return {
        ids: [id],
      };
    } catch (error) {
      this.logger.error(error);
      throw new ApiException({
        code: CommonCodes.DELETED_FAIL,
        message: '删除菜单失败!',
      });
    }
  }

  /**
   * 新增菜单权限
   * @param data
   */
  async createMenuPermission(data: any): Promise<Created> {
    try {
      const result: MenuPermissionModel = await this.menuPermissionRepository.create(data);
      return {
        id: result.id,
      };
    } catch (error) {
      this.logger.error(error);
      throw new ApiException({
        code: CommonCodes.CREATED_FAIL,
        message: '新增菜单权限失败',
      });
    }
  }
}
