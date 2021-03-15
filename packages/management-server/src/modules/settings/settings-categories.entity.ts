/**
 * 分类表
 */
import { Table, Column, DataType, Model  } from 'sequelize-typescript';
import { BaseModel } from '../base.entity';

@Table({
  timestamps: false,
  tableName: 'settings_category',
})

// settings/tags/
export class SettingsCategoriesModel extends Model implements BaseModel {
  id: number;
  createTime: Date;
  updateTime: Date;
  createUser: number;
  updateUser: number;
  isDelete: boolean;
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
