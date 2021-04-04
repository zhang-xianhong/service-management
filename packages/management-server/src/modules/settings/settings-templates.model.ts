/**
 * 数据类型表
 */
import { Table, Column, DataType  } from 'sequelize-typescript';
import { BaseModel } from '../base.entity';

@Table({
  timestamps: false,
  tableName: 'settings_templates',
})

// settings/templates
export class SettingsTemplatesModel extends BaseModel {
  // 名称
  @Column({
    type: DataType.STRING,
  })
  name: string;

  // 描述
  @Column({
    type: DataType.STRING,
  })
  description: string;

  // 模板地址
  @Column({
    type: DataType.STRING,
  })
  url: string;

  // 是否是系统内置
  @Column({
    type: DataType.BOOLEAN,
    field: 'is_system',
    defaultValue: false,
  })
  isSystem: boolean;
}
