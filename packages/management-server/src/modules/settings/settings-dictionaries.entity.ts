/**
 * 数据字典表
 */
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// settings/dictionaries/:typeCode
@Entity({ name: 'settings-dictionaries' })
export class DictionariesEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: number;

  // 父级，为空则表示一级类型
  @Column({
    type: 'varchar',
    nullable: true,
  })
  parent: string;

  // 值
  @Column({
    type: 'varchar',
  })
  code: string;

  // 名称
  @Column({
    type: 'varchar',
  })
  name: string;

  @Column({
    type: 'tinytext',
    nullable: true,
  })
  description: string;

  @Column({
    type: 'datetime',
    name: 'create_time',
    default: () => 'NOW()',
  })
  createTime: Date;
}
