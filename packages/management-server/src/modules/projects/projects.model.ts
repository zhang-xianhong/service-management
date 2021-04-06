/**
 * 项目实体
 */
import { Table, Column, DataType } from 'sequelize-typescript';
import { BaseModel } from '../base.entity';
import { PROJECT_LEVEL, PROJECT_LICENSE, PROJECT_STATUS } from './config';

@Table({
  timestamps: false,
  tableName: 'project_info',
})
export class ProjectsModel extends BaseModel {
  // 名称
  @Column({
    type: DataType.STRING,
    defaultValue: '',
  })
  name: string;

  // 描述
  @Column({
    type: DataType.STRING,
    defaultValue: '',
  })
  description: string;

  // 项目简介
  @Column({
    type: DataType.STRING,
    defaultValue: '',
  })
  remark: string;

  // 缩略图
  @Column({
    type: DataType.STRING,
    defaultValue: '',
    comment: '缩略图',
  })
  thumbnail: string;

  @Column({
    type: DataType.BIGINT,
    defaultValue: null,
    comment: '代码模板ID',
  })
  templateId: number;

  // 项目状态
  @Column({
    type: DataType.TINYINT,
    defaultValue: PROJECT_STATUS.ENABLED,
    comment: JSON.stringify(PROJECT_STATUS),
  })
  status: PROJECT_STATUS;

  // 负责人
  @Column({
    type: DataType.STRING,
    defaultValue: '',
  })
  owner: string;

  // 项目级别
  @Column({
    type: DataType.TINYINT,
    defaultValue: PROJECT_LEVEL.COMMON,
    comment: JSON.stringify(PROJECT_LEVEL),
  })
  level: PROJECT_LEVEL;

  // 许可类型
  @Column({
    type: DataType.TINYINT,
    defaultValue: PROJECT_LICENSE.LEASE,
    comment: `许可类型： ${JSON.stringify(PROJECT_LICENSE)}`,
  })
  license: PROJECT_LICENSE;
}
