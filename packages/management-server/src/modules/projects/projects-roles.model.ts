/**
 * 项目实体
 */
import { Table, Column, DataType, BelongsTo, HasMany } from 'sequelize-typescript';
import { BaseModel } from '../base.entity';
import { SettingsRolesModel } from '../settings/settings_roles.model';
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
      model: SettingsRolesModel,
      key: 'id',
    },
  })
  settingsRoleId: number;

  // 冗余字段，是否是owner类型
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
    comment: '冗余字段，是否是owner类型',
  })
  isOwnerRole: boolean;

  @BelongsTo(() => SettingsRolesModel, {
    foreignKey: 'settingsRoleId',
    constraints: false,
    foreignKeyConstraint: false,
  })
  role: SettingsRolesModel;

  @HasMany(() => ProjectsMembersModel, {
    foreignKey: 'projectRoleId',
    constraints: false,
    foreignKeyConstraint: false,
  })
  members: ProjectsMembersModel;
}
