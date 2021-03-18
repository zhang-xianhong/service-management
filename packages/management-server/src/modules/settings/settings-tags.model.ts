/**
 * 标签表
 */
import { Table, Column, DataType  } from 'sequelize-typescript';
import { BaseModel } from '../base.entity';

@Table({
  timestamps: false,
  tableName: 'settings_tag',
})

// settings/tags/
export class SettingsTagsModel extends BaseModel {
  // 名称
  @Column({
    type: DataType.STRING,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    defaultValue: '',
  })
  description: string;

  // 克隆源
  @Column({
    type: DataType.STRING,
    field: 'clone_by',
    defaultValue: '',
    comment: '克隆来源',
  })
  cloneBy: string;
}
