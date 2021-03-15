/**
 * 数据字典表
 */
import { Table, Column, DataType  } from 'sequelize-typescript';
import { BaseModel } from '../base.entity';

@Table({
  timestamps: false,
  tableName: 'settings_dictionary',
})

// settings/dictionaries/:typeCode
export class DictionariesEntity extends BaseModel<DictionariesEntity> {
  // 父级，为空则表示一级类型
  @Column({
    type: DataType.STRING,
    defaultValue: '',
  })
  parent: string;

  // 值
  @Column({
    type: DataType.STRING,
  })
  code: string;

  // 名称
  @Column({
    type: DataType.STRING,
  })
  name: string;

  @Column({
    type: DataType.TEXT,
  })
  description: string;
}
