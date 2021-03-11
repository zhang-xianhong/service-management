/**
 * 数据类型表
 */
import { FIELD_TYPES } from 'src/shared/constants/field-types';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../base.entity';

// settings/data-types
@Entity({ name: 'settings_data_type' })
export class DataTypesEntity extends BaseEntity {
  // 值
  @Column({
    type: 'varchar',
  })
  type: FIELD_TYPES;

  // 字段长度
  @Column({
    type: 'bigint',
    default: 0,
  })
  length: number;

  // 名称
  @Column({
    type: 'varchar',
  })
  name: string;

  // 描述
  @Column({
    type: 'tinytext',
  })
  description: string;
}
