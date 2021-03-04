/**
 * 数据类型表
 */
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../base.entity';

// settings/data-types
@Entity({ name: 'settings_data_type' })
export class DataTypesEntity extends BaseEntity {
  // 值
  @Column({
    type: 'varchar',
  })
  type: string;

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

  // 是否主键
  @Column({
    name: 'is_key',
    type: 'bool',
    width: 1,
    default: false,
  })
  isKey: boolean;

  // 扩展信息
  @Column({
    type: 'varchar',
    default: '',
  })
  extra: string;
}
