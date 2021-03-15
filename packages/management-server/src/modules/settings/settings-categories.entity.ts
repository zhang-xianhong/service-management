/**
 * 分类表
 */
import { Table, Column, DataType  } from 'sequelize-typescript';
import { BaseModel } from '../base.entity';

@Table({
  timestamps: false,
  tableName: 'settings_category',
})

// settings/tags/
export class SettingsCategoriesEntity extends  BaseModel<SettingsCategoriesEntity> {
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
}
