/**
 * 数据类型表
 */
import { Table, Column, DataType  } from 'sequelize-typescript';
import { FIELD_TYPES } from 'src/shared/constants/field-types';
import { BaseModel } from '../base.entity';

@Table({
  timestamps: false,
  tableName: 'settings_data_type',
})

// settings/data-types
export class DataTypesEntity extends BaseModel<DataTypesEntity> {
  // 值
  @Column({
    type: DataType.STRING,
  })
  type: FIELD_TYPES;

  // 字段长度
  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  length: number;

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
}
