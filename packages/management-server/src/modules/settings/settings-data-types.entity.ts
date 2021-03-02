/**
 * 数据类型表
 */
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../base.entity';

// settings/data-types
@Entity({ name: 'settings_data_types' })
export class DataTypesEntity extends BaseEntity {
  // 值
  @Column({
    type: 'varchar',
    unique: true,
  })
  value: string;

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
