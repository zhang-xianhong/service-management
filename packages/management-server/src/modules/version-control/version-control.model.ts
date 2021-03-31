/**
 * 服务信息实体
 */
import { Table, Column, DataType } from 'sequelize-typescript';
import { BaseModel } from '../base.entity';
import { MODULE_TYPE } from './config';

@Table({
  timestamps: false,
  tableName: 'version_control',
})
export class VersionControlModel extends BaseModel {
  // 关联模块类型
  @Column({
    type: DataType.INTEGER,
    defaultValue: MODULE_TYPE.MODEL_FIELD,
    comment: '关联模块类型',
  })
  moduleType: MODULE_TYPE;

  // 关联模块Id
  @Column({
    type: DataType.BIGINT,
  })
  moduleId: number;

  // 关联服务Id
  @Column({
    type: DataType.BIGINT,
  })
  serviceId: number;

  // 开发版本号
  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  devVersion: number;

  // 生成版本号
  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  prodVersion: number;

  // 即时版本
  @Column({
    type: DataType.INTEGER,
  })
  ghostVersion: number;
}
