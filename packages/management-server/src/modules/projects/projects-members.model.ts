/**
 * 项目成员表
 */
import { Table, Column, DataType, BelongsTo } from 'sequelize-typescript';
import { BaseModel } from '../base.entity';
import { ProjectsRolesModel } from './projects-roles.model';

@Table({
  timestamps: false,
  tableName: 'project_member',
})
export class ProjectsMembersModel extends BaseModel {
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
    comment: '成员角色Id',
  })
  projectRoleId: number;

  @Column({
    type: DataType.BIGINT,
    defaultValue: null,
    comment: '成员人员Id',
  })
  userId: number;

  @BelongsTo(() => ProjectsRolesModel, {
    foreignKey: 'projectRoleId',
    constraints: false,
    foreignKeyConstraint: false,
  })
  role: ProjectsRolesModel;
}
