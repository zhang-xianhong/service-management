/**
 * 数据字典数据
 */
import { Table, Column, DataType, ForeignKey  } from 'sequelize-typescript';
import { BaseModel } from '../base.entity';
import { SettingsDictionaryTypeModel } from './settings-dictionary-type.model';

@Table({
  timestamps: false,
  tableName: 'settings_dictionary',
})

export class SettingsDictionaryModel extends BaseModel {
  // 字典类型id
  @ForeignKey(() => SettingsDictionaryTypeModel)
  @Column({
    type: DataType.BIGINT,
  })
  typeId: number;

  // 字典key
  @Column({
    type: DataType.STRING,
  })
  key: string;

  // 字典值
  @Column({
    type: DataType.STRING,
    defaultValue: '',
  })
  value: string;

  // 字典描述
  @Column({
    type: DataType.STRING,
    defaultValue: '',
  })
  description: string;

  @Column({
    type: DataType.TINYINT,
    field: 'is_lock',
    defaultValue: 0,
    comment: '是否内置：0:内置，1:非内置',
  })
  isLock: number;

  @Column({
    type: DataType.TINYINT,
    defaultValue: 0,
    comment: '0:正常，1:停用',
  })
  status: number;
}
