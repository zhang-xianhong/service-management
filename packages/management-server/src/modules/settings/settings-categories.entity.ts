/**
 * 分类表
 */
import { Table, Column, DataType, Model } from 'sequelize-typescript';
import { BaseEntity } from '../base.entity';

@Table({
  timestamps: false,
  tableName: 'settings_category',
})

// settings/tags/
export class SettingsCategoriesEntity extends Model<BaseEntity> {
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
