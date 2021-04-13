/**
 * 负责人实体表
 */
import { Table, Column, DataType } from 'sequelize-typescript';
import { BaseModel } from '../base.entity';
import { MODULE_TYPE } from './config';

@Table({
  timestamps: false,
  tableName: 'owner',
})
export class OwnersModel extends BaseModel {
  // 关联模块类型
  @Column({
    type: DataType.INTEGER,
    defaultValue: MODULE_TYPE.SERVICE,
    allowNull: false,
    comment: `关联模块类型${Object.entries(MODULE_TYPE)}`,
  })
  moduleType: MODULE_TYPE;

  // 关联模块Id
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    comment: '关联模块ID，如服务ID，项目ID',
  })
  moduleId: number;

  // 用户ID
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    comment: '关联用户ID',
  })
  userId: number;

  // 租户ID
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    comment: '关联租户ID',
  })
  tenantId: number;
}

