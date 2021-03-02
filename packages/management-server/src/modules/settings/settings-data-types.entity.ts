/**
 * 数据类型表
 */
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// settings/data-types
@Entity({ name: 'settings-data-types' })
export class DataTypesEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: number;

  // 值
  @Column({
    type: 'varchar',
    unique: true,
  })
  value: string;

  // 字段长度
  @Column({
    type: 'bigint',
    nullable: true,
  })
  length: string;

  // 名称
  @Column({
    type: 'varchar',
  })
  name: string;

  // 描述
  @Column({
    type: 'tinytext',
    nullable: true,
  })
  description: string;

  // 创建时间
  @Column({
    type: 'datetime',
    name: 'create_time',
    default: () => 'NOW()',
  })
  createTime: Date;
}
