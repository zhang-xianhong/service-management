/**
 * 项目角色配置表
 */
import { Table, Column, DataType, HasMany  } from 'sequelize-typescript';
import { BaseModel } from '../base.entity';
import { MenuPermissionModel } from '../menus/menu-permission.model';

@Table({
  timestamps: false,
  tableName: 'settings_role',
})

// settings/role
export class SettingsRolesModel extends BaseModel {
  // 角色名称
  @Column({
    type: DataType.STRING,
  })
  name: string;

  // 角色描述
  @Column({
    type: DataType.STRING,
  })
  description: string;

  // 是否是负责人角色
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isOwner: boolean;

  // 是否用户定义
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isUserDefine: boolean;

  @HasMany(() => MenuPermissionModel, 'roleId')
  menus: MenuPermissionModel[];
}
