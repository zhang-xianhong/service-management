import { Table, Column, DataType, HasMany  } from 'sequelize-typescript';
import { BaseModel } from '../base.entity';
import { SettingsDictionaryModel } from './settings-dictionary.model';

@Table({
  timestamps: false,
  tableName: 'settings_dictionary_type',
})
// 数据字典类型表
export class SettingsDictionaryTypeModel extends BaseModel {
  // 字典类型key
  @Column({
    type: DataType.STRING,
    field: 'type_key',
  })
  typeKey: string;

  // 字典类型值
  @Column({
    type: DataType.STRING,
    defaultValue: '',
  })
  value: string;

  // 字典类型描述
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

  @HasMany(() => SettingsDictionaryModel)
  dictionaries: SettingsDictionaryModel[];
}
