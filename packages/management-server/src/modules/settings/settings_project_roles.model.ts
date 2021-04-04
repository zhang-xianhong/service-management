/**
 * 项目角色配置表
 */
import { Table, Column, DataType  } from 'sequelize-typescript';
import { BaseModel } from '../base.entity';

@Table({
  timestamps: false,
  tableName: 'settings_project_role',
})

// settings/project-role
export class SettingsProjectRolesModel extends BaseModel {
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
}
