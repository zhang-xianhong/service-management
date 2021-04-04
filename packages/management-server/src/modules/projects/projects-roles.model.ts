/**
 * 项目实体
 */
import { Table, Column, DataType, BelongsTo, HasMany } from 'sequelize-typescript';
import { BaseModel } from '../base.entity';
import { SettingsProjectRolesModel } from '../settings/settings_project_roles.model';
import { ProjectsMembersModel } from './projects-members.model';

@Table({
  timestamps: false,
  tableName: 'project_role',
})
export class ProjectsRolesModel extends BaseModel {
  @Column({
    type: DataType.BIGINT,
    defaultValue: null,
    comment: '租户ID',
  })
  tenantId?: number;

  @Column({
    type: DataType.BIGINT,
    defaultValue: null,
    comment: '项目ID',
  })
  projectId: number;

  @Column({
    type: DataType.BIGINT,
    defaultValue: null,
    comment: '关联配置表角色ID',
    references: {
      model: SettingsProjectRolesModel,
      key: 'id',
    },
  })
  settingsProjectRoleId: number;

  @BelongsTo(() => SettingsProjectRolesModel, {
    foreignKey: 'settingsProjectRoleId',
    constraints: false,
    foreignKeyConstraint: false,
  })
  role: SettingsProjectRolesModel;


  @HasMany(() => ProjectsMembersModel, {
    foreignKey: 'projectRoleId',
    constraints: false,
    foreignKeyConstraint: false,
  })
  members: ProjectsMembersModel;
}
