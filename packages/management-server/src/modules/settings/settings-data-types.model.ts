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
export class DataTypesModel extends BaseModel {
  // 值
  @Column({
    type: DataType.STRING,
  })
  type: FIELD_TYPES;

  // 字段长度
  @Column({
    type: DataType.BIGINT,
    defaultValue: null,
  })
  length: number;

  // 数据精度，只有在double和float时有效
  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
    comment: '数据精度，只有在double和float时有效',
  })
  precision: number;

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

  // 是否是系统内置
  @Column({
    type: DataType.BOOLEAN,
    field: 'is_system',
    defaultValue: false,
  })
  isSystem: boolean;
}
